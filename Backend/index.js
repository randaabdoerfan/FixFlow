const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config({ path: "./config/.env" });


const userRoutes = require("./routes/user.route");
const documentRoutes = require("./routes/document.route");
const teamRoutes = require("./routes/team.route");
const ticketRoutes = require("./routes/ticket.route");
const messageRoutes = require("./routes/message.route");
const notificationRoutes = require("./routes/notification.routes");
const activityLogRoutes = require("./routes/activityLog.route");

const handleError = require("./middleware/handleError.middleware");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    cors({
        origin: [
            "http://localhost:3000",
        ],
        credentials: true,
    })
);


mongoose
    .connect(process.env.mongo_atlas)
    .then(() => console.log(" Database connected successfully.. "))
    .catch((err) => console.log(err));
    // console.log(process.env.mongo_atlas);


const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
});


app.set("io", io);

const onlineUsers = new Set();
app.set("onlineUsers", onlineUsers);

io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("join", (userId) => {
        socket.join(userId);
        onlineUsers.add(userId.toString());
        io.emit("userOnline", userId.toString());
        console.log(`${userId} joined room`);
    });

    socket.on("leave", (userId) => {
        socket.leave(userId);
        onlineUsers.delete(userId.toString());
        io.emit("userOffline", userId.toString());
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected:", socket.id);
    });
});


app.use("/users", userRoutes);
app.use("/documents", documentRoutes);
app.use("/teams", teamRoutes);
app.use("/tickets", ticketRoutes);
app.use("/messages", messageRoutes);
app.use("/notifications", notificationRoutes);
app.use("/activity-logs", activityLogRoutes);


app.use(handleError);


server.listen(8001, () => {
    console.log(` Server running on port ${8001}`);
});