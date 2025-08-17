import express from 'express';
import Cart from '../models/Cart.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// 🛒 Add or Update Product in Cart
router.post('/', verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      // If cart doesn't exist, create new
      cart = new Cart({
        userId: req.user.id,
        products: [{ productId, quantity }],
      });
    } else {
      // Check if product exists in cart
      const productIndex = cart.products.findIndex(
        (p) => p.productId.toString() === productId
      );

      if (productIndex > -1) {
        // Update quantity
        cart.products[productIndex].quantity += quantity;
      } else {
        // Add new product
        cart.products.push({ productId, quantity });
      }
    }

    const saved = await cart.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🧾 Get User's Cart
router.get('/', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ Remove Product from Cart
router.delete('/:productId', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.products = cart.products.filter(
      (item) => item.productId.toString() !== req.params.productId
    );

    await cart.save();
    res.json({ message: 'Product removed from cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Update Quantity of a Product
router.patch('/:productId', verifyToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const productIndex = cart.products.findIndex(
      item => item.productId.toString() === req.params.productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not in cart' });
    }

    cart.products[productIndex].quantity = quantity;
    await cart.save();

    // Return updated cart with populated product details
    const updatedCart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');
    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
