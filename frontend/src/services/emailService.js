// Email service for sending OTP
export const sendOTPEmail = async (email, otp) => {
  try {
    // Using local email service backend
    const response = await fetch('http://localhost:3001/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        otp: otp
      })
    });

    const result = await response.json();
    return response.ok && result.success;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

// Alternative: Using EmailJS (requires setup at emailjs.com)
export const sendOTPEmailJS = async (email, otp) => {
  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'service_kmrl',
        template_id: 'template_otp',
        user_id: 'YOUR_EMAILJS_PUBLIC_KEY',
        template_params: {
          to_email: email,
          otp_code: otp,
          user_name: email.split('@')[0],
          system_name: 'KMRL Train Induction Planning System'
        }
      })
    });

    return response.ok;
  } catch (error) {
    console.error('EmailJS sending failed:', error);
    return false;
  }
};

// Fallback: Using mailto (opens user's email client)
export const sendOTPMailto = (email, otp) => {
  const subject = 'KMRL System - Your Login OTP';
  const body = `Your OTP for KMRL login is: ${otp}\n\nThis code expires in 5 minutes.`;
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  window.open(mailtoLink);
  return true;
};