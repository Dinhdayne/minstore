const pool = require("../config/db");

//  Thêm hồ sơ mới
const createUserProfile = async (profileData) => {
    const {
        user_id,
        first_name,
        last_name,
        phone,
        date_of_birth,
        gender,
        avatar_url,
        loyalty_points,
    } = profileData;

    const [result] = await pool.query(
        `INSERT INTO User_Profiles 
        (user_id, first_name, last_name, phone, date_of_birth, gender, avatar_url, loyalty_points)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            user_id,
            first_name || null,
            last_name || null,
            phone || null,
            date_of_birth || null,
            gender || null,
            avatar_url || null,
            loyalty_points || 0,
        ]
    );

    return result.insertId;
};

//  Lấy tất cả hồ sơ
const getAllProfiles = async () => {
    const [rows] = await pool.query("SELECT * FROM User_Profiles");
    return rows;
};

//  Lấy hồ sơ theo user_id
const getProfileByUserId = async (user_id) => {
    const [rows] = await pool.query("SELECT * FROM User_Profiles WHERE user_id = ?", [user_id]);
    return rows[0];
};

//  Cập nhật hồ sơ
const updateUserProfile = async (user_id, data) => {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(data)) {
        if (value !== undefined) {
            fields.push(`${key} = ?`);
            values.push(value);
        }
    }

    if (fields.length === 0) return;

    values.push(user_id);

    const [result] = await pool.query(
        `UPDATE User_Profiles SET ${fields.join(", ")} WHERE user_id = ?`,
        values
    );

    return result;
};

//  Xóa hồ sơ
const deleteUserProfile = async (user_id) => {
    const [result] = await pool.query("DELETE FROM User_Profiles WHERE user_id = ?", [user_id]);
    return result;
};

module.exports = {
    createUserProfile,
    getAllProfiles,
    getProfileByUserId,
    updateUserProfile,
    deleteUserProfile,
};
