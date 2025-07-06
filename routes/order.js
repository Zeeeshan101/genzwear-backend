const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const verifyToken = require("../middleware/verifyToken");

console.log(" Order Page hit");

// 🛍️ Place Order (inside Cart)
router.post("/", verifyToken, async (req, res) => {

  console.log("🔥 Order POST route hit");
console.log("📦 Sending order request...");

  try {
    const userId = req.user.id;

    // Get user's cart
    const cart = await Cart.findOne({ userId }).populate("products.productId");
console.log("✅ Populated cart:", JSON.stringify(cart, null, 2));

console.log("Cart Products:", cart.products);


    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }


   


    // Calculate total //
console.log("🧮 Calculating Total...");


      const total = cart.products.reduce((sum, item) => {
  const product = item.productId;
  if (!product || !product.price) {
    console.warn("❌ Product price missing for:", product);
    return sum;
  }
  return sum + product.price * item.quantity;
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
 