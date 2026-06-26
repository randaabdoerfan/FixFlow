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

// Routes
const userRoutes = require("./routes/user.route");
const documentRoutes = require("./routes/document.route");
const teamRoutes = require("./routes/team.route");
const ticketRoutes = require("./routes/ticket.route");
const messageRoutes = require("./routes/message.route");
const notificationRoutes = require("./routes/notification.routes");

const handleError = require("./middleware/handleError.middleware");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use(cookieParser());

// Database
mongoose
    .connect(process.env.mongo_atlas)
    .then(() => console.log("Database connected successfully..."))
    .catch((err) => console.log(err));

// Socket.IO
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PATCH", "DELETE"],
    },
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Make io available in controllers
app.set("io", io);

// Routes
app.use("/users", userRoutes);
app.use("/documents", documentRoutes);
app.use("/teams", teamRoutes);
app.use("/tickets", ticketRoutes);
app.use("/messages", messageRoutes);
app.use("/notifications", notificationRoutes);

// Error handler
app.use(handleError);

// Start server
const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});