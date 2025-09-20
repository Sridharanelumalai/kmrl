package com.kmrl.service;

import com.kmrl.entity.User;
import com.kmrl.entity.OtpCode;
import com.kmrl.repository.UserRepository;
import com.kmrl.repository.OtpCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OtpCodeRepository otpCodeRepository;
    

    

    
    public String registerUser(String email, String name, String password) {
        // Check if user already exists
        if (userRepository.existsByEmail(email)) {
            return "User already registered. Please login.";
        }
        
        // Validate password
        String passwordValidation = validatePassword(password);
        if (!passwordValidation.equals("valid")) {
            return passwordValidation;
        }
        
        // Create new user
        User user = new User(email, name, password);
        userRepository.save(user);
        
        return "Registration successful";
    }
    
    public String loginUser(String email, String password) {
        // Check if user exists with correct password
        var user = userRepository.findByEmailAndPassword(email, password);
        
        if (user.isEmpty()) {
            return "Invalid email or password";
        }
        
        // Update last login
        User foundUser = user.get();
        foundUser.setLastLogin(LocalDateTime.now());
        userRepository.save(foundUser);
        
        return "Login successful";
    }
    

    
    public boolean isUserRegistered(String email) {
        return userRepository.existsByEmail(email);
    }
    
    private String validatePassword(String password) {
        if (password == null || password.length() < 6) {
            return "Password must be at least 6 characters long";
        }
        
        if (!password.matches(".*[A-Z].*")) {
            return "Password must contain at least one uppercase letter";
        }
        
        if (!password.matches(".*[a-z].*")) {
            return "Password must contain at least one lowercase letter";
        }
        
        if (!password.matches(".*[0-9].*")) {
            return "Password must contain at least one number";
        }
        
        return "valid";
    }
}