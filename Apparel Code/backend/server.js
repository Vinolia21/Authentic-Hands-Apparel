const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Order schema
const orderSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  tracking: { type: String, index: true },
  grandTotal: Number,
  delivery: String, // "pickup" | "delivery"
  address: String,
  cart: [
    {
      productId: String,
      title: String,
      size: String,
      qty: Number,
      price: Number
    }
  ],
  total: Number,
  deliveryFee: Number,
  date: String,
  status: {
    type: String,
    default: "Order received, payment pending"
  },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);
/*
 function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL, // or SMTP_USER if you switch
      pass: process.env.SMTP_PASS
    },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000
  });
}
*/
function getTransporter() {
  return nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS
    }
  });
}


// Create order: save + send email
app.post("/send-confirmation", async (req, res) => {
  const { name, email, orderData } = req.body;
  if (!name || !email || !orderData) {
    return res.status(400).json({ success: false, message: "Missing required fields." });
  }

  try {
    const newOrder = new Order({
      name,
      email,
      phone: orderData.phone,
      tracking: orderData.tracking,
      grandTotal: orderData.grandTotal,
      delivery: orderData.delivery,
      address: orderData.address,
      cart: orderData.cart,
      total: orderData.total,
      deliveryFee: orderData.deliveryFee,
      date: orderData.date
    });

    await newOrder.save();
    console.log("✅ Order saved:", newOrder.tracking);

    const transporter = getTransporter();

    const itemsHtml = orderData.cart
      .map(item => `<li>${item.title} — Size: ${item.size} — Qty: ${item.qty} — R${item.price}</li>`)
      .join("");

    const htmlReceipt = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Thank you for your order, ${name}!</h2>
        <p>Your order has been received and is awaiting payment.</p>
        <h3>Order Details</h3>
        <p><strong>Order Number:</strong> ${orderData.tracking}</p>
        <p><strong>Total:</strong> R${orderData.grandTotal}</p>
        <p><strong>Delivery Option:</strong> ${orderData.delivery}</p>
        <p><strong>Address:</strong> ${orderData.address}</p>
        <h3>Items</h3>
        <ul>${itemsHtml}</ul>
        <h3>Payment Instructions</h3>
        <p>
          Bank: Standard Bank<br>
          Account Name: Authentic Hands Apparel<br>
          Account Number: 63 408 001 6<br>
          Branch Code: 51001<br>
          Reference: ${orderData.tracking}
        </p>
        <p>Once payment is confirmed, your order will be processed.</p>
        <br>
        <p>Warm regards,<br><strong>Authentic Hands Team</strong></p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Authentic Hands Apparel" <${process.env.SMTP_EMAIL}>`,
      to: email,
      replyTo: process.env.SMTP_EMAIL,
      subject: `Order Confirmation – ${orderData.tracking}`,
      html: htmlReceipt
    });

    console.log(`✅ Confirmation email sent to ${email}`);
    res.json({ success: true, message: "Email sent and order saved" });
  } catch (err) {
    console.error("❌ Error in order flow:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get order status (for customer tracking page)
app.post("/get-order-status", async (req, res) => {
  const { tracking } = req.body;
  if (!tracking) return res.status(400).json({ success: false, message: "Tracking is required" });

  try {
    const order = await Order.findOne({ tracking });
    if (!order) return res.json({ success: false, message: "Order not found" });

    res.json({
      success: true,
      order: {
        tracking: order.tracking,
        status: order.status,
        date: order.date,
        delivery: order.delivery,
        grandTotal: order.grandTotal
      }
    });
  } catch (err) {
    console.error("❌ Get status error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin: update order status
app.post("/update-status", async (req, res) => {
  const { tracking, status } = req.body;
  if (!tracking || !status) {
    return res.status(400).json({ success: false, message: "Missing tracking or status" });
  }

  try {
    const order = await Order.findOneAndUpdate(
      { tracking },
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // Optional: notify customer of status change
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"Authentic Hands Apparel" <${process.env.SMTP_EMAIL}>`,
      to: order.email,
      subject: `Order Update – ${order.tracking}`,
      html: `<p>Your order status has been updated to: <strong>${status}</strong></p>`
    });

    res.json({ success: true, message: "Status updated", order });
  } catch (err) {
    console.error("❌ Status update error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));







