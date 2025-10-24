const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { initSocket } = require('./socket');


//require routes
const accountRoutes = require('./routes/accountRoutes');
const userRoutes = require('./routes/userRoutes');
const customerRoutes = require('./routes/customerRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderDetailRoutes = require('./routes/orderDetailRoutes');
const clientOrderRoutes = require('./routes/clientOrderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');
const brandRoutes = require('./routes/brandRoutes');
const addressRoutes = require('./routes/addressRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const couponRoutes = require('./routes/couponRoutes');
const orderCouponRoutes = require('./routes/orderCouponRoutes');
const { OAuth2Client } = require("google-auth-library");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(cors(
    {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
    }
));
app.use(express.json());
// Tạo server HTTP để Socket.io có thể attach vào
const server = http.createServer(app);
// Khởi tạo Socket.io
initSocket(server);

// Routes
app.use('/api', accountRoutes);
app.use('/api', userRoutes);
app.use('/api', customerRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', orderDetailRoutes);
app.use('/api', clientOrderRoutes);
app.use('/api', cartRoutes);
app.use('/api', userProfileRoutes);
app.use('/api', brandRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api', orderRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/order-coupons', orderCouponRoutes);
const client = new OAuth2Client("YOUR_GOOGLE_CLIENT_ID"); // lấy từ Google Console

// Route xác thực Google
app.post("/auth/google", async (req, res) => {
    const { token } = req.body;

    try {
        // Xác minh token với Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: "YOUR_GOOGLE_CLIENT_ID",
        });

        const payload = ticket.getPayload();

        // payload chứa thông tin user
        // { email, name, picture, sub (id), ... }
        console.log("Google User:", payload);

        // TODO: lưu thông tin user vào DB nếu cần
        res.json({
            message: "Login success",
            user: payload,
        });
    } catch (error) {
        res.status(401).json({
            message: "Invalid token",
            error: error.message,
        });
    }
});



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`✅ Server + Socket.IO đang chạy trên port ${PORT}`);
});
