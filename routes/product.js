
console.log("✅ product.js route file loaded");

const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const verifyToken = require("../middleware/verifyToken"); // Auth middleware
const verifyAdmin = require("../middleware/verifyAdmin"); // Admin-only access



router.get("/test", (req, res) => {
  res.send("✅ Product test route working!");
});



//  Create Product for (Admin only)
router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  Get All Products (Public)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  Get Single Product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  Update Product (Admin only)
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

//  Delete Product (Admin only)
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
