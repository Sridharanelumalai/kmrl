package com.kmrl.controller;

import com.kmrl.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/check")
    public ResponseEntity<Map<String, Object>> checkUser(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        
        Map<String, Object> response = new HashMap<>();
        
        if (email == null || !email.contains("@gmail.com")) {
            response.put("success", false);
            response.put("message", "Valid Gmail address required");
            return ResponseEntity.badRequest().body(response);
        }
        
        boolean isRegistered = authService.isUserRegistered(email);
        
        response.put("success", true);
        response.put("isRegistered", isRegistered);
        response.put("message", isRegistered ? "User exists" : "New user");
        
        return ResponseEntity.ok(response);
    }
}