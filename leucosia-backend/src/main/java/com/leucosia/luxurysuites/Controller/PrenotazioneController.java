package com.leucosia.luxurysuites.Controller;

import com.leucosia.luxurysuites.Data.Service.PrenotazioneService;
import com.leucosia.luxurysuites.Dto.NewsDto;
import com.leucosia.luxurysuites.Dto.PrenotazioneDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
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
    public PrenotazioneDto createPrenotazione(@RequestBody PrenotazioneDto prenotazioneDto) {
        System.out.println("Ricevuto PrenotazioneDto: " + prenotazioneDto);
        try {
            return prenotazioneService.createPrenotazione(prenotazioneDto);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
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
    public void eliminaPrenotazione(@PathVariable Long id) {
        System.out.println("Eliminazione prenotazione con ID: " + id);
        prenotazioneService.eliminaPrenotazione(id);
    }
}
