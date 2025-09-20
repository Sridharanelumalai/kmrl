const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Create transporter using Gmail (you can use other services)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Send OTP endpoint
app.post('/send-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@kmrl.co.in',
    to: email,
    subject: 'KMRL System - Login OTP Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1890ff, #096dd9); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🚊 KMRL System</h1>
          <p style="color: white; margin: 5px 0;">Kochi Metro Rail Limited</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Login Verification Code</h2>
          <p style="color: #666; font-size: 16px;">
            Your One-Time Password (OTP) for KMRL Train Induction Planning System is:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: #1890ff; color: white; font-size: 32px; font-weight: bold; 
                        padding: 15px 30px; border-radius: 8px; display: inline-block; 
                        letter-spacing: 5px;">${otp}</div>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            ⏰ This OTP is valid for <strong>5 minutes</strong> only.<br>
            🔒 Please do not share this code with anyone.<br>
            ❌ If you did not request this OTP, please ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This is an automated message from KMRL Train Induction Planning System.<br>
            Please do not reply to this email.
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(PORT, () => {
  console.log(`Email service running on port ${PORT}`);
});