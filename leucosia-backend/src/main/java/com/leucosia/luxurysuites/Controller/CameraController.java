package com.leucosia.luxurysuites.Controller;

import com.leucosia.luxurysuites.Data.Entities.Camera;
import com.leucosia.luxurysuites.Data.Entities.PrezzoCamera;
import com.leucosia.luxurysuites.Data.Service.CameraService;
import com.leucosia.luxurysuites.Dto.CameraDto;
import com.leucosia.luxurysuites.Dto.PrezzoCameraDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequestMapping("/camera-api")
@RequiredArgsConstructor
public class CameraController {

    @Autowired
    private CameraService cameraService;

    @GetMapping
    public List<CameraDto> getCamere() {
        return cameraService.getCamere();
    }

    @GetMapping("/disponibili")
    public ResponseEntity<List<CameraDto>> getCamereDisponibili(
            @RequestParam("checkIn") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam("checkOut") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        System.out.println("Richiesta camere disponibili tra " + checkIn + " e " + checkOut);
        return ResponseEntity.ok(cameraService.getCamereDisponibili(checkIn, checkOut));
    }

    @GetMapping("/prezzi")
    public ResponseEntity<List<PrezzoCamera>> getPrezziPerCameraEPeriodo(
            @RequestParam("cameraId") Long cameraId,
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {

        List<PrezzoCamera> prezzi = cameraService.getPrezziPerPeriodo(cameraId, start, end);
        return ResponseEntity.ok(prezzi);
    }

    @PostMapping("/modificaPrezzi")
    public ResponseEntity<String> aggiungiPrezzoCamera(@RequestBody PrezzoCameraDto dto) {
        cameraService.aggiungiPrezzoCamera(dto);
        return ResponseEntity.ok("Prezzi aggiunti con successo.");
    }



}
