package com.leucosia.luxurysuites.Controller;

import com.leucosia.luxurysuites.Config.ApiResponse;
import com.leucosia.luxurysuites.Config.Security.TokenStore;
import com.leucosia.luxurysuites.Data.Entities.Utente;
import com.leucosia.luxurysuites.Data.Service.UtenteService;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RequiredArgsConstructor
@RequestMapping(path = "/utente-api")
@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UtenteController {

    @Autowired
    private UtenteService utenteService;

    @PostMapping("/login")
    public String doLogin(@RequestParam("email") String email,
                          @RequestParam("password") String password,
                          HttpServletResponse response) throws IOException, JOSEException {
        // Verifica le credenziali dell'utente
        // Esempio: se email e password sono corretti
        //if (email.equals("test@example.com") && password.equals("password123")) {
            // Crea il token JWT
            String token = TokenStore.getInstance().createToken(Map.of("email", email));

            // Crea un cookie con il token
            Cookie cookie = new Cookie("jwt_token", token);
            cookie.setHttpOnly(true);  // Protegge il cookie da accesso tramite JavaScript
            cookie.setSecure(false);    // Usa il cookie solo su HTTPS
            cookie.setPath("/");       // Il cookie è valido per tutte le richieste
            cookie.setMaxAge(60 * 60 * 24); // Il cookie scade dopo 24 ore
            cookie.setDomain("localhost"); // Imposta il dominio del cookie (modifica se necessario)

            System.out.println(cookie.hashCode());
            // Aggiungi il cookie alla risposta
            response.addCookie(cookie);


            response.sendRedirect("http://localhost:4200");

            return null; // Reindirizza alla home o alla pagina protetta
        //} else {
            //return "login"; // Torna alla pagina di login se le credenziali sono errate
        //}
    }
}