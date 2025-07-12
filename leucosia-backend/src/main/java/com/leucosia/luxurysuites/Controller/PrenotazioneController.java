package com.leucosia.luxurysuites.Controller;

import com.leucosia.luxurysuites.Data.Service.PrenotazioneService;
import com.leucosia.luxurysuites.Dto.PrenotazioneDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequestMapping("/prenotazione-api")
@RequiredArgsConstructor
public class PrenotazioneController {

    @Autowired
    private PrenotazioneService prenotazioneService;

    @PostMapping
    public ResponseEntity<String> createPrenotazione(@RequestBody PrenotazioneDto prenotazioneDto) {
        try {
            prenotazioneService.createPrenotazione(prenotazioneDto);
            return ResponseEntity.ok("Prenotazione creata con successo.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Errore durante la creazione della prenotazione.");
        }
    }

    @GetMapping
    public List<PrenotazioneDto> getPrenotazioni() {
        return prenotazioneService.getPrenotazioni();
    }

    @GetMapping("/utente/{utenteId}")
    public List<PrenotazioneDto> getPrenotazioniByUtente(@PathVariable Long utenteId) {
        return prenotazioneService.getPrenotazioniByUtenteId(utenteId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminaPrenotazione(@PathVariable Long id) {
        try {
            prenotazioneService.eliminaPrenotazione(id);
            return ResponseEntity.ok("Prenotazione eliminata con successo.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Errore durante l'eliminazione della prenotazione.");
        }
    }
}
