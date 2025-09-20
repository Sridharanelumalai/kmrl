# KMRL Email Service Setup

## Quick Setup Instructions

### 1. Install Dependencies
```bash
cd email-service
npm install
```

### 2. Configure Gmail
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Security → App passwords
   - Select "Mail" as the app
   - Copy the 16-character password

### 3. Update .env File
```
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

### 4. Start Email Service
```bash
npm start
```

### 5. Test the Service
The service will run on http://localhost:3001

## Alternative Email Providers

### Using Outlook/Hotmail
```javascript
service: 'hotmail',
auth: {
  user: 'your-email@outlook.com',
  pass: 'your-password'
}
```

### Using Yahoo
```javascript
service: 'yahoo',
auth: {
  user: 'your-email@yahoo.com',
  pass: 'your-app-password'
}
```

## Email Template Features
- Professional KMRL branding
- Large, clear OTP display
- Security warnings
- Mobile-friendly design
- Expiration notice

## Security Notes
- OTP expires in 5 minutes
- Uses secure SMTP connection
- No OTP stored on server
- Rate limiting recommended for production