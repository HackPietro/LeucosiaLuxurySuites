package com.leucosia.luxurysuites.Controller;

import com.leucosia.luxurysuites.Data.Service.MessaggiService;
import com.leucosia.luxurysuites.Dto.MessaggiDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequestMapping("/messaggi-api")
@RequiredArgsConstructor
public class MessaggiController {

    @Autowired
    private MessaggiService messaggiService;

    @PostMapping
    public ResponseEntity<String> inviaMessaggio(@RequestBody MessaggiDto messaggio) {
        try {
            messaggiService.salvaMessaggio(messaggio);
            return ResponseEntity.ok("Messaggio inviato con successo.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Errore durante l'invio del messaggio.");
        }
    }

    @GetMapping
    public List<MessaggiDto> getTuttiIMessaggi() {
        return messaggiService.getTuttiIMessaggi();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminaMessaggio(@PathVariable Long id) {
        try{
            messaggiService.eliminaMessaggio(id);
            return ResponseEntity.ok("Messaggio eliminato con successo.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Errore durante l'eliminazione del messaggio.");
        }
    }

}
