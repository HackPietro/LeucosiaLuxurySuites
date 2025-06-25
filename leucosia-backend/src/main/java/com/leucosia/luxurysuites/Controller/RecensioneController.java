package com.leucosia.luxurysuites.Controller;

import com.leucosia.luxurysuites.Data.Service.RecensioneService;
import com.leucosia.luxurysuites.Dto.RecensioneDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequestMapping("/recensione-api")
@RequiredArgsConstructor
public class RecensioneController {

    @Autowired
    private RecensioneService recensioneService;

    @PostMapping
    public ResponseEntity<String> addRecensione(@RequestBody RecensioneDto dto) {
        System.out.println("ciao");
        recensioneService.aggiungiRecensione(dto);
        return ResponseEntity.ok("Recensione aggiunta con successo.");
    }
}
