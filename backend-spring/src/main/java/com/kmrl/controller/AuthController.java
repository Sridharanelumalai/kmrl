package com.kmrl.controller;

import com.kmrl.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, Object>> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String name = request.get("name");
        
        Map<String, Object> response = new HashMap<>();
        
        if (email == null || !email.contains("@gmail.com")) {
            response.put("success", false);
            response.put("message", "Valid Gmail address required");
            return ResponseEntity.badRequest().body(response);
        }
        
        String result = authService.sendOtp(email, name);
        
        if (result.startsWith("OTP sent")) {
            response.put("success", true);
            response.put("message", result);
            response.put("isRegistered", authService.isUserRegistered(email));
        } else {
            response.put("success", false);
            response.put("message", result);
        }
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String name = request.get("name");
        String otp = request.get("otp");
        
        Map<String, Object> response = new HashMap<>();
        
        String result = authService.registerUser(email, name, otp);
        
        if (result.equals("Registration successful")) {
            response.put("success", true);
            response.put("message", result);
        } else {
            response.put("success", false);
            response.put("message", result);
        }
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        
        Map<String, Object> response = new HashMap<>();
        
        String result = authService.loginUser(email, otp);
        
        if (result.equals("Login successful")) {
            response.put("success", true);
            response.put("message", result);
            response.put("user", Map.of("email", email));
        } else {
            response.put("success", false);
            response.put("message", result);
        }
        
        return ResponseEntity.ok(response);
    }
}