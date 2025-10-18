const User = require('../models/User');
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (user) => {
    return jwt.sign(
        { id: user.user_id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

const CustomerByAccountId = async (req, res) => {
    try {
        const user_id = req.params.id;
        const customers = await User.findUserByUserId(user_id); // Sử dụng phương thức từ model Customer
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const create = async (req, res) => {
    try {
        const id = await User.create(req.body);
        res.status(201).json({ message: 'Người dùng đã được tạo', id });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        await User.update(req.params.id, req.body);
        res.json({ message: 'Người dùng đã được cập nhật' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const result = await User.delete(req.params.id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        res.json({ message: 'Người dùng đã được xóa' });
    } catch (error) {
        console.error("🔥 Lỗi khi xóa người dùng:", error); // 👈 In lỗi chi tiết
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};


const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        console.log("Token FE gửi:", token);

        // Xác minh token với Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        console.log("Payload Google:", payload);

        const { sub, email, name, picture } = payload;
        //console.log("Payload Google:", sub);
        // Kiểm tra user theo provider_id
        let user = await User.findUserByProviderId(sub);
        //console.log("User từ DB:", user);
        //Nếu chưa có user theo provider_id thì check theo email
        if (!user) {
            user = await User.findUserByEmail(email);
        }

        // Nếu vẫn chưa có thì tạo mới
        if (!user) {
            const userId = await User.createUser({
                email,
                provider: "google",
                provider_id: sub,
                display_name: name,
                password_hash: null,
                role: "customer",
                email_verified: true,
            });

            // 👉 Tạo profile tương ứng
            const [firstName, ...lastNameParts] = name.split(" ");
            const lastName = lastNameParts.join(" ");

            await User.createUserProfile({
                user_id: userId,
                first_name: firstName,
                last_name: lastName || "",
                avatar_url: picture || null,
                gender: null,
                phone: null,
                date_of_birth: null,
                loyalty_points: 0,
            });

            user = { user_id: userId, email, display_name: name, role: "customer" };
        }

        //Tạo JWT token cho user
        const jwtToken = generateToken(user);
        console.log("res BE gửi:", user);
        return res.json({
            message: "Google login success",
            token: jwtToken,
            user
        });

    } catch (err) {
        console.error("Google verify error:", err.message);

        return res.status(401).json({
            message: "Invalid Google token",
            error: err.message
        });
    }
};


module.exports = { getUsers, create, updateUser, deleteUser, googleLogin, CustomerByAccountId };