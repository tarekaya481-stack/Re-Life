import React from "react";
import "../styles/chats.css";

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
}

const dummyChats: Chat[] = [
  { id: 1, name: "مستخدم 1", lastMessage: "مرحبا!" },
  { id: 2, name: "مستخدم 2", lastMessage: "كيف الحال؟" },
];

const ChatsList: React.FC = () => {
  return (
    <div className="chats-list">
      {dummyChats.map((chat) => (
        <div key={chat.id} className="chat-item">
          <h4>{chat.name}</h4>
          <p>{chat.lastMessage}</p>
        </div>
      ))}
    </div>
  );
};

export default ChatsList;
