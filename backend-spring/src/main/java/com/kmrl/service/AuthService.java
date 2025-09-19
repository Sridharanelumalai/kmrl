package com.kmrl.service;

import com.kmrl.entity.User;
import com.kmrl.entity.OtpCode;
import com.kmrl.repository.UserRepository;
import com.kmrl.repository.OtpCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OtpCodeRepository otpCodeRepository;
    
    @Autowired
    private JavaMailSender mailSender;
    
    public String sendOtp(String email, String name) {
        String otp = generateOtp();
        
        // Save OTP to database
        OtpCode otpCode = new OtpCode(email, otp);
        otpCodeRepository.save(otpCode);
        
        // Send email
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("KMRL System - Login OTP");
            message.setText("Your OTP for KMRL Train Induction Planning System is: " + otp + 
                          "\n\nThis OTP is valid for 5 minutes only.\nDo not share this code with anyone.");
            
            mailSender.send(message);
            return "OTP sent successfully";
        } catch (Exception e) {
            return "Failed to send OTP: " + e.getMessage();
        }
    }
    
    public String registerUser(String email, String name, String otp) {
        // Check if user already exists
        if (userRepository.existsByEmail(email)) {
            return "User already registered. Please login.";
        }
        
        // Verify OTP
        if (!verifyOtp(email, otp)) {
            return "Invalid or expired OTP";
        }
        
        // Create new user
        User user = new User(email, name);
        userRepository.save(user);
        
        return "Registration successful";
    }
    
    public String loginUser(String email, String otp) {
        // Check if user exists
        if (!userRepository.existsByEmail(email)) {
            return "User not registered. Please register first.";
        }
        
        // Verify OTP
        if (!verifyOtp(email, otp)) {
            return "Invalid or expired OTP";
        }
        
        // Update last login
        User user = userRepository.findByEmail(email).get();
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        
        return "Login successful";
    }
    
    private boolean verifyOtp(String email, String otp) {
        var otpCode = otpCodeRepository.findByEmailAndOtpCodeAndIsUsedFalseAndExpiresAtAfter(
            email, otp, LocalDateTime.now());
        
        if (otpCode.isPresent()) {
            // Mark OTP as used
            OtpCode code = otpCode.get();
            code.setIsUsed(true);
            otpCodeRepository.save(code);
            return true;
        }
        return false;
    }
    
    private String generateOtp() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }
    
    public boolean isUserRegistered(String email) {
        return userRepository.existsByEmail(email);
    }
}