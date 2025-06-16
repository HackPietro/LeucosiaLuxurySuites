package com.leucosia.luxurysuites.Controller;

import com.leucosia.luxurysuites.Data.Service.PrenotazioneService;
import com.leucosia.luxurysuites.Dto.NewsDto;
import com.leucosia.luxurysuites.Dto.PrenotazioneDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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


}
