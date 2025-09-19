package com.kmrl.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/trains")
@CrossOrigin(origins = "http://localhost:3000")
public class TrainController {

    @GetMapping("/all")
    public Map<String, Object> getAllTrains() {
        List<Map<String, Object>> trains = Arrays.asList(
            createTrain(1, "KMRL-001", "Available", "Aluva Depot", 45000, 85.5, "2024-01-10", "Normal"),
            createTrain(2, "KMRL-002", "In Service", "Pettah Depot", 32000, 92.3, "2024-01-08", "Normal"),
            createTrain(3, "KMRL-003", "Maintenance", "Kalamassery Depot", 48000, 78.2, "2024-01-12", "Warning"),
            createTrain(4, "KMRL-004", "Available", "Aluva Depot", 28000, 95.1, "2024-01-09", "Normal"),
            createTrain(5, "KMRL-005", "Maintenance", "Pettah Depot", 49500, 65.8, "2024-01-15", "Critical"),
            createTrain(6, "KMRL-006", "In Service", "Kalamassery Depot", 35000, 88.7, "2024-01-07", "Normal"),
            createTrain(7, "KMRL-007", "Available", "Aluva Depot", 41000, 82.4, "2024-01-11", "Normal"),
            createTrain(8, "KMRL-008", "Maintenance", "Pettah Depot", 47000, 72.1, "2024-01-14", "Warning"),
            createTrain(9, "KMRL-009", "In Service", "Kalamassery Depot", 30000, 91.6, "2024-01-06", "Normal"),
            createTrain(10, "KMRL-010", "Available", "Aluva Depot", 38000, 86.9, "2024-01-13", "Normal"),
            createTrain(11, "KMRL-011", "In Service", "Pettah Depot", 33000, 89.2, "2024-01-05", "Normal"),
            createTrain(12, "KMRL-012", "Available", "Kalamassery Depot", 44000, 79.8, "2024-01-16", "Normal"),
            createTrain(13, "KMRL-013", "Maintenance", "Aluva Depot", 49800, 68.3, "2024-01-17", "Critical"),
            createTrain(14, "KMRL-014", "In Service", "Pettah Depot", 36000, 87.5, "2024-01-04", "Normal"),
            createTrain(15, "KMRL-015", "Available", "Kalamassery Depot", 29000, 93.7, "2024-01-18", "Normal"),
            createTrain(16, "KMRL-016", "Available", "Aluva Depot", 42000, 81.2, "2024-01-03", "Normal"),
            createTrain(17, "KMRL-017", "In Service", "Pettah Depot", 37000, 85.9, "2024-01-19", "Normal"),
            createTrain(18, "KMRL-018", "Available", "Kalamassery Depot", 31000, 90.4, "2024-01-02", "Normal"),
            createTrain(19, "KMRL-019", "Maintenance", "Aluva Depot", 46000, 75.6, "2024-01-20", "Warning"),
            createTrain(20, "KMRL-020", "Available", "Pettah Depot", 34000, 88.1, "2024-01-01", "Normal")
        );

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", trains);
        response.put("total", trains.size());
        return response;
    }

    @GetMapping("/available")
    public Map<String, Object> getAvailableTrains() {
        List<Map<String, Object>> allTrains = (List<Map<String, Object>>) getAllTrains().get("data");
        List<Map<String, Object>> availableTrains = allTrains.stream()
            .filter(train -> "Available".equals(train.get("status")))
            .collect(java.util.stream.Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", availableTrains);
        response.put("total", availableTrains.size());
        return response;
    }

    @GetMapping("/maintenance")
    public Map<String, Object> getMaintenanceTrains() {
        List<Map<String, Object>> allTrains = (List<Map<String, Object>>) getAllTrains().get("data");
        List<Map<String, Object>> maintenanceTrains = allTrains.stream()
            .filter(train -> "Maintenance".equals(train.get("status")))
            .collect(java.util.stream.Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", maintenanceTrains);
        response.put("total", maintenanceTrains.size());
        return response;
    }

    private Map<String, Object> createTrain(int id, String trainNumber, String status, String depot, 
                                          int mileage, double healthScore, String lastMaintenance, String priority) {
        Map<String, Object> train = new HashMap<>();
        train.put("id", id);
        train.put("train_number", trainNumber);
        train.put("status", status);
        train.put("current_depot", depot);
        train.put("mileage", mileage);
        train.put("health_score", healthScore);
        train.put("last_maintenance", lastMaintenance);
        train.put("priority", priority);
        train.put("next_maintenance_due", calculateNextMaintenance(mileage));
        train.put("service_hours", (int)(Math.random() * 100) + 50);
        return train;
    }

    private String calculateNextMaintenance(int mileage) {
        int nextMaintenance = ((mileage / 5000) + 1) * 5000;
        return nextMaintenance + " km";
    }
}