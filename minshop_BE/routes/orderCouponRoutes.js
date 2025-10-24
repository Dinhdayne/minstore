const express = require("express");
const router = express.Router();
const OrderCouponController = require("../controllers/orderCouponController");

router.post("/", OrderCouponController.link);
router.get("/:order_id", OrderCouponController.getByOrder);

module.exports = router;
