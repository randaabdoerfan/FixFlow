module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("User Connected:", socket.id);

        socket.on("join", (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined`);
        });

        socket.on("disconnect", () => {
            console.log("User Disconnected");
        });
    });
};