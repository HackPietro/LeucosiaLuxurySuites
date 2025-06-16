package com.leucosia.luxurysuites.Controller;

import com.leucosia.luxurysuites.Data.Service.MessaggiService;
import com.leucosia.luxurysuites.Dto.MessaggiDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
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
    public void inviaMessaggio(@RequestBody MessaggiDto messaggio) {
        messaggiService.salvaMessaggio(messaggio);
    }

    @GetMapping
    public List<MessaggiDto> getTuttiIMessaggi() {
        System.out.println("Richiesta per ottenere tutti i messaggi");
        return messaggiService.getTuttiIMessaggi();
    }

    @DeleteMapping("/{id}")
    public void eliminaMessaggio(@PathVariable Long id) {
        messaggiService.eliminaMessaggio(id);
    }

}
