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
    

    
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String name = request.get("name");
        String password = request.get("password");
        
        Map<String, Object> response = new HashMap<>();
        
        String result = authService.registerUser(email, name, password);
        
        if (result.equals("Registration successful")) {
            response.put("success", true);
            response.put("message", result);
            response.put("user", Map.of("email", email));
        } else {
            response.put("success", false);
            response.put("message", result);
        }
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        
        Map<String, Object> response = new HashMap<>();
        
        String result = authService.loginUser(email, password);
        
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