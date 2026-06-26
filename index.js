const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);

const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });

const mongoose = require("mongoose");

const initSocket = require("./socket/socket");

const userRoutes = require("./routes/user.route");
const documentRoutes = require("./routes/document.route");
const messageRoutes = require("./routes/message.route");
const notificationRoutes = require("./routes/notification.route");

const handleError = require("./middleware/handleError.middleware");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
    .connect(process.env.mongo_atlas)
    .then(() => console.log("Database connected..."))
    .catch((err) => console.log(err));

// Initialize Socket.IO
const io = initSocket(server);

// Make io available in controllers
app.set("io", io);

// Routes
app.use("/users", userRoutes);
app.use("/documents", documentRoutes);
app.use("/messages", messageRoutes);
app.use("/notifications", notificationRoutes);

// Error handler
app.use(handleError);

// Start server
server.listen(8000, () => {
    console.log("Server running on port 8000");
});