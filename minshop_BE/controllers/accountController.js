const Account = require('../models/Account');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const account = await Account.findByUsername(username);
        if (!account) {
            return res.status(401).json({ message: 'Thông tin đăng nhập không hợp lệ' });
        }

        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Thông tin đăng nhập không hợp lệ' });
        }

        const token = jwt.sign({ id: account.id, role: account.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, role: account.role , id : account.id});
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const getAccounts = async (req, res) => {
    try {
        const accounts = await Account.findAll();
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const createAccount = async (req, res) => {
    try {
        const id = await Account.create(req.body);
        res.status(201).json({ message: 'Tài khoản đã được tạo', id });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const updateAccount = async (req, res) => {
    try {
        await Account.update(req.params.id, req.body);
        res.json({ message: 'Tài khoản đã được cập nhật' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const deleteAccount = async (req, res) => {
    try {
        await Account.delete(req.params.id);
        res.json({ message: 'Tài khoản đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const accountId = req.user.id;
        
        // Lấy thông tin tài khoản hiện tại
        const account = await Account.findById(accountId);
        if (!account) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
        }
        
        // Kiểm tra mật khẩu hiện tại
        const isMatch = await bcrypt.compare(currentPassword, account.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng' });
        }
        
        // Mã hóa mật khẩu mới
        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
        
        // Cập nhật mật khẩu
        await Account.updatePassword(accountId, hashedNewPassword);
        
        res.json({ message: 'Đổi mật khẩu thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

module.exports = { login, getAccounts, createAccount, updateAccount, deleteAccount, changePassword };