let io;

function initSocket(server) {
    const { Server } = require("socket.io");
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("🟢 Admin connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("🔴 Admin disconnected:", socket.id);
        });
    });
}

function notifyNewOrder(order) {
    if (io) {
        console.log("📢 Gửi realtime order:", order.order_id);
        io.emit("newOrder", order);
    } else {
        console.warn("⚠️ Socket.io chưa được khởi tạo");
    }
}

module.exports = { initSocket, notifyNewOrder };
