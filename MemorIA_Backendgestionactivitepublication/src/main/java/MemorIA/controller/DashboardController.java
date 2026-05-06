package MemorIA.controller;

import MemorIA.dto.DashboardStatsDTO;
import MemorIA.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<DashboardStatsDTO> getDoctorStats(@PathVariable Long doctorId) {
        return ResponseEntity.ok(dashboardService.getDoctorStats(doctorId));
    }
}
