import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/order.js";

dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["https://genzwear.vercel.app", "http://localhost:5173"],
    credentials: true,
  })
);

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.get("/api/test", (req, res) => {
  res.send("✅ Test route working from server.js");
});
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// ✅ MongoDB
const PORT = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;

mongoose
  .connect(uri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("API Running");
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});


app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
