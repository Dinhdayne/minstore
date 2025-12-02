const {
    createUserProfile,
    getAllProfiles,
    getProfileByUserId,
    updateUserProfile,
    deleteUserProfile,
} = require("../models/userProfile");

// Tạo hồ sơ mới
const addProfile = async (req, res) => {
    try {
        const id = await createUserProfile(req.body);
        res.status(201).json({ message: "Thêm hồ sơ thành công", profile_id: id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server khi thêm hồ sơ" });
    }
};

//  Lấy tất cả hồ sơ
const getProfiles = async (req, res) => {
    try {
        const profiles = await getAllProfiles();
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi lấy danh sách hồ sơ" });
    }
};

//  Lấy hồ sơ theo user_id
const getProfile = async (req, res) => {
    try {
        const profile = await getProfileByUserId(req.params.user_id);
        if (!profile) return res.status(404).json({ message: "Không tìm thấy hồ sơ" });
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi lấy hồ sơ" });
    }
};

//  Cập nhật hồ sơ
const updateProfile = async (req, res) => {
    try {
        const result = await updateUserProfile(req.params.user_id, req.body);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy hồ sơ" });
        res.json({ message: "Cập nhật hồ sơ thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi cập nhật hồ sơ" });
    }
};

//  Xóa hồ sơ
const removeProfile = async (req, res) => {
    try {
        const result = await deleteUserProfile(req.params.user_id);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy hồ sơ" });
        res.json({ message: "Xóa hồ sơ thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi xóa hồ sơ" });
    }
};

module.exports = {
    addProfile,
    getProfiles,
    getProfile,
    updateProfile,
    removeProfile,
};
