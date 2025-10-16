const express = require("express");
const {
    addProfile,
    getProfiles,
    getProfile,
    updateProfile,
    removeProfile,
} = require("../controllers/userProfileController");
const router = express.Router();

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Yêu cầu access token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Token không hợp lệ' });
    }
};

router.post("/userProfile/", addProfile);
router.get("/userProfile/", getProfiles);
router.get("/userProfile/:user_id", getProfile);
router.put("/userProfile/:user_id", updateProfile);
router.delete("/userProfile/:user_id", removeProfile);

module.exports = router;
