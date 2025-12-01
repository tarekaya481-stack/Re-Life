import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "../styles/messages.css";

const socket = io("http://localhost:5000"); // غير الرابط لو السيرفر بتاعك على مكان تاني

interface Message {
  sender: string;
  text: string;
}

export default function Messages() {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // اسم المستخدم ثابت للتجربة، بعدين حط اسم المستخدم الحقيقي اللي داخل عليه
  const username = React.useMemo(() => "User_" + Math.floor(Math.random() * 1000), []);

  useEffect(() => {
    // تسجيل الدخول بإرسال الاسم للسيرفر
    socket.emit("login", username);

    // استقبال قائمة المستخدمين المتصلين وتحديثها
    socket.on("onlineUsers", (users: string[]) => {
      setOnlineUsers(users.filter(u => u !== username));
      // لو المستخدم الحالي مش موجود في القائمة الجديدة، نلغي المحادثة
      if (!users.includes(currentChat || "")) {
        setCurrentChat(null);
        setMessages([]);
      }
    });

    // استقبال الرسائل الخاصة الواردة
    socket.on("receiveMessage", (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off("onlineUsers");
      socket.off("receiveMessage");
    };
  }, [username, currentChat]);

  // لعمل تمرير تلقائي لأحدث رسالة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim() || !currentChat) return;

    // إرسال رسالة خاصة للسيرفر
    socket.emit("privateMessage", { to: currentChat, sender: username, text });
    setText("");
  };

  return (
    <div className="chat-container" style={{ display: "flex", height: "80vh", gap: "1rem" }}>
      <div className="user-list" style={{ width: "25%", border: "1px solid #ccc", padding: "1rem", overflowY: "auto" }}>
        <h4>المتصلون</h4>
        {onlineUsers.length === 0 ? (
          <p>لا يوجد مستخدمين متصلين</p>
        ) : (
          onlineUsers.map(user => (
            <div
              key={user}
              style={{
                padding: "0.5rem",
                cursor: "pointer",
                backgroundColor: user === currentChat ? "#007bff" : "#eee",
                color: user === currentChat ? "white" : "black",
                marginBottom: "0.3rem",
                borderRadius: "5px"
              }}
              onClick={() => {
                setCurrentChat(user);
                setMessages([]); // امسح الرسائل القديمة لما تختار مستخدم جديد
              }}
            >
              {user}
            </div>
          ))
        )}
      </div>

      <div className="chat-area" style={{ flex: 1, border: "1px solid #ccc", padding: "1rem", display: "flex", flexDirection: "column" }}>
        <h4>{currentChat ? `الدردشة مع ${currentChat}` : "اختر مستخدم للدردشة"}</h4>
        <div className="messages" style={{ flex: 1, overflowY: "auto", marginBottom: "1rem" }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              textAlign: m.sender === username ? "right" : "left",
              marginBottom: "0.5rem",
            }}>
              <strong>{m.sender}:</strong> {m.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area" style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="اكتب رسالة..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            style={{ flex: 1, padding: "0.5rem" }}
            disabled={!currentChat}
          />
          <button onClick={sendMessage} disabled={!currentChat || !text.trim()}>
            إرسال
          </button>
        </div>
      </div>
    </div>
  );
}
