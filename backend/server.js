// server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");

dotenv.config();
const app = express();

const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  }
});

// خريطة لتخزين المستخدمين (username => socket.id)
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("✔ User connected:", socket.id);

  // استقبال تسجيل الدخول مع اسم المستخدم
  socket.on("login", (username) => {
    onlineUsers.set(username, socket.id);
    // إرسال قائمة المستخدمين المتصلين للجميع
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });

  // استقبال الرسائل الخاصة
  socket.on("privateMessage", ({ to, sender, text }) => {
    const targetSocketId = onlineUsers.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit("receiveMessage", { sender, text });
    }
    // إرسال للمرسل نفسه عشان تظهر الرسالة عنده أيضًا
    socket.emit("receiveMessage", { sender, text });
  });

  socket.on("disconnect", () => {
    // إزالة المستخدم من الخريطة عند الانفصال
    for (const [username, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(username);
        break;
      }
    }
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    console.log("✖ User disconnected");
  });
});

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// ربط المونغو دي بي والراوترز زي ما عندك
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/relife", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

app.use("/api/register", require("./routes/register"));
app.use("/api/login", require("./routes/login"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server + Socket.io running on port ${PORT}`));
