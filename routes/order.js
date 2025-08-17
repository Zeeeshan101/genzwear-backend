import express from "express";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// 🛍️ Place Order (inside Cart)
router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's cart
    const cart = await Cart.findOne({ userId }).populate("products.productId");

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // ✅ Calculate total
    const total = cart.products.reduce((sum, item) => {
      return sum + item.quantity * item.productId.price;
    }, 0);

    const order = new Order({
      userId,
      products: cart.products,
      totalAmount: total,
    });

    await order.save();

    // ✅ Clear cart after ordering
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
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("products.productId");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
