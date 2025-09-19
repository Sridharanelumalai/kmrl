package com.kmrl.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.*;

@RestController
@RequestMapping("/api/induction")
@CrossOrigin(origins = "http://localhost:3000")
public class InductionController {

    @GetMapping("/plan")
    public ResponseEntity<Map<String, Object>> generatePlan() {
        List<Map<String, Object>> mockPlan = Arrays.asList(
            createTrainPlan(1, "KMRL-001", 85.5, "High priority due to maintenance requirements; Approaching mileage limit (45000 km)", 1),
            createTrainPlan(2, "KMRL-002", 72.3, "Sensor anomalies detected; Scheduled at Pettah depot", 2),
            createTrainPlan(3, "KMRL-003", 58.1, "Regular maintenance due; Scheduled at Aluva depot", 1)
        );
        
        Map<String, Object> response = new HashMap<>();
        response.put("data", mockPlan);
        response.put("status", "success");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        Map<String, Object> fleetMetrics = new HashMap<>();
        fleetMetrics.put("total_trains", 20);
        fleetMetrics.put("available_trains", 16);
        fleetMetrics.put("maintenance_due", 4);
        fleetMetrics.put("availability_percentage", 80);

        Map<String, Object> anomalyMetrics = new HashMap<>();
        anomalyMetrics.put("total_anomalies", 3);
        anomalyMetrics.put("trains_with_anomalies", 2);

        List<Map<String, Object>> depotUtilization = Arrays.asList(
            createDepot("Aluva Depot", 80, 3),
            createDepot("Pettah Depot", 80, 2),
            createDepot("Kalamassery Depot", 75, 3)
        );

        Map<String, Object> response = new HashMap<>();
        response.put("fleet_metrics", fleetMetrics);
        response.put("anomaly_metrics", anomalyMetrics);
        response.put("depot_utilization", depotUtilization);
        response.put("status", "success");

        return ResponseEntity.ok(response);
    }

    private Map<String, Object> createTrainPlan(int trainId, String trainNumber, double priorityScore, String reasoning, int depotId) {
        Map<String, Object> plan = new HashMap<>();
        plan.put("train_id", trainId);
        plan.put("train_number", trainNumber);
        plan.put("priority_score", priorityScore);
        plan.put("scheduled_date", new Date(System.currentTimeMillis() + (trainId * 24 * 60 * 60 * 1000L)));
        plan.put("depot_id", depotId);
        plan.put("reasoning", reasoning);
        return plan;
    }

    private Map<String, Object> createDepot(String name, int utilization, int availableSlots) {
        Map<String, Object> depot = new HashMap<>();
        depot.put("name", name);
        depot.put("utilization", utilization);
        depot.put("available_slots", availableSlots);
        return depot;
    }
}