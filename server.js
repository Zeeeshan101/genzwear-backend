const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');


const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://genzwear.vercel.app',
    'https://genzwear-hj2l124ea-zeeshan-khans-projects-215a52a1.vercel.app'
  ],
  credentials: true,
};

app.use(cors(corsOptions));


require('dotenv').config();


app.use(express.json());  // ✅ Move this ABOVE the routes

const authRoutes = require('./routes/auth');
// ✅ Routes
app.use('/api/auth', authRoutes);


const productRoutes = require('./routes/product');
app.use('/api/products', productRoutes);


app.get("/api/test", (req, res) => {
  res.send("✅ Test route working from server.js");
});


const cartRoutes = require('./routes/cart');
app.use('/api/cart', cartRoutes);

const orderRoutes = require('./routes/order');
app.use('/api/orders', orderRoutes);



// ✅ MongoDB
const PORT = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.get('/', (req, res) => {
  res.send('API Running');
});




app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
