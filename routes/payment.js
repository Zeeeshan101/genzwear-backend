// routes/payment.js
const express = require("express");
const Razorpay = require("razorpay");
require("dotenv").config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post("/create-payment-link", async (req, res) => {
  try {
    const { amount, name, email, phone, referenceId } = req.body;
console.log("ENV Keys:", process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_SECRET);
console.log("Body:", req.body);

   const paymentLink = await razorpay.paymentLinks.create({
  amount: amount * 100,
  currency: "INR",
  accept_partial: false,
  description: "GenZWear Order Payment",
  customer: {
    name,
    email,
    contact: phone,
  },
  notify: {
    sms: true,
    email: true,
  },
  reference_id: referenceId,
  callback_url: `${process.env.VITE_API_URL}/payment-success`,
  callback_method: "get",
});


    res.status(200).json({
      success: true,
      paymentLink: paymentLink.short_url,
    });
  } catch (error) {
    console.error("Payment Link Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
