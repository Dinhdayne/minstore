let io;
const userSockets = new Map(); // Lưu danh sách { user_id: socket.id }

function initSocket(server) {
    const { Server } = require("socket.io");
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        // 🔹 Lấy user_id từ query khi frontend connect

        const userId = socket.handshake.auth?.user_id;
        console.log(" Socket mới:", socket.id);
        console.log(" Query từ FE:", socket.handshake.query);
        if (userId) {
            userSockets.set(userId, socket.id);
            console.log(` User ${userId} connected (${socket.id})`);
        } else {
            console.log("⚠️ Một socket kết nối nhưng không có user_id:", socket.id);
        }

        socket.on("disconnect", () => {
            if (userId && userSockets.has(userId)) {
                userSockets.delete(userId);
                console.log(` User ${userId} disconnected (${socket.id})`);
            }
        });

        // 📥 Tin nhắn realtime chat (nếu có)
        socket.on("sendMessage", (data) => {
            console.log(" Tin nhắn mới:", data);
            io.emit("receiveMessage", data); // Cái này vẫn phát cho tất cả
        });
    });
}

function notifyNewOrder(order) {
    if (io) {
        console.log("📢 Gửi realtime order:", order.order_id);
        io.emit("newOrder", order); // Vẫn gửi chung (admin cần)
    } else {
        console.warn(" Socket.io chưa được khởi tạo");
    }
}

// 🔹 Gửi realtime giỏ hàng CHỈ CHO USER CỤ THỂ
function notifyNewCartItem(userId, cartItem) {
    if (io && userSockets.has(userId)) {
        const socketId = userSockets.get(userId);
        console.log(` Gửi realtime giỏ hàng cho user ${userId}:`, cartItem);
        io.to(socketId).emit("newCartItem", cartItem);
    } else {
        console.warn(` Không tìm thấy socket của user ${userId}`);
    }
}

function notifyMessage(message) {
    if (io) {
        console.log(" Gửi realtime message:", message.id);
        io.emit("newMessage", message);
    } else {
        console.warn(" Socket.io chưa được khởi tạo");
    }
}


module.exports = { initSocket, notifyNewOrder, notifyNewCartItem, notifyMessage };
