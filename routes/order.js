const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const verifyToken = require("../middleware/verifyToken");

// 🛍️ Place Order (inside Cart)
router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Calculate total //

    const total = cart.products.reduce((sum, item) => {
      return sum + (item.quantity * 1000); //
    }, 0);

    const order = new Order({
      userId,
      products: cart.products,
      totalAmount: total,
    });

    await order.save();

    // Clear cart after ordering
    cart.products = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🧾 Get User’s Orders
router.get("/", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 }).populate("products.productId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
