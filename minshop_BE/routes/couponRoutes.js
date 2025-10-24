const express = require("express");
const router = express.Router();
const CouponController = require("../controllers/couponController");

router.post("/", CouponController.create);
router.get("/", CouponController.getAll);
router.post("/apply", CouponController.apply);

module.exports = router;
