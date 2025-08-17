// ✅ product.js route file loaded
import express from "express";
import Product from "../models/Product.js";
import verifyToken from "../middleware/verifyToken.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

// 🔹 Test Route
router.get("/test", (req, res) => {
  res.send("✅ Product test route working!");
});

// 🔹 Create Product (Admin only)
router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get All Products (Public)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get Single Product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Update Product (Admin only)
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Delete Product (Admin only)
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
