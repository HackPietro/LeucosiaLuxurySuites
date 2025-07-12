package com.leucosia.luxurysuites.Controller;

import com.leucosia.luxurysuites.Data.Service.RecensioneService;
import com.leucosia.luxurysuites.Dto.RecensioneDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequestMapping("/recensione-api")
@RequiredArgsConstructor
public class RecensioneController {

    @Autowired
    private RecensioneService recensioneService;

    @PostMapping
    public ResponseEntity<String> addRecensione(@RequestBody RecensioneDto dto) {
        try {
            recensioneService.addRecensione(dto);
            return ResponseEntity.ok("Recensione aggiunta con successo.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Errore durante l'aggiunta della recensione.");
        }
    }

    @GetMapping("/recensioni")
    public List<RecensioneDto> getRecensioni() {
        return recensioneService.getRecensioni();
    }
}
