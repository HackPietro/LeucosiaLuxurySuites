package com.leucosia.luxurysuites.Controller;

import com.leucosia.luxurysuites.Dto.UtenteDto;
import com.leucosia.luxurysuites.Data.Service.UtenteService;
import com.leucosia.luxurysuites.Config.Security.TokenStore;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequestMapping("/utente-api")
@RequiredArgsConstructor
public class UtenteController {

    private final UtenteService utenteService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/validateToken")
    public ResponseEntity<?> validateToken() {
        return ResponseEntity.ok(Map.of("valid", true));
    }

    @PostMapping("/doRegistration")
    public ResponseEntity<?> doRegistration(@RequestBody UtenteDto utenteDto, HttpServletResponse response) throws JOSEException {
        if (utenteService.emailExists(utenteDto.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Email già registrata"));
        }

        String encodedPassword = passwordEncoder.encode(utenteDto.getPassword());
        utenteDto.setPassword(encodedPassword);

        utenteService.save(utenteDto.toEntity());

        utenteDto.setPassword(null);

        return ResponseEntity.ok(Map.of(
                "message", "Registrazione effettuata con successo",
                "utente", utenteDto
        ));
    }

    @PostMapping("/doLogin")
    public ResponseEntity<?> doLogin(@RequestBody UtenteDto utenteDto, HttpServletResponse response) throws JOSEException {
        try {
            UtenteDto utente = utenteService.getByEmail(utenteDto.getEmail());

            if (!passwordEncoder.matches(utenteDto.getPassword(), utente.getPassword())) {
                return ResponseEntity.status(401).body(Map.of("error", "Password errata"));
            }

            String accessToken = TokenStore.getInstance().createAccessToken(Map.of("email", utenteDto.getEmail()));
            String refreshToken = TokenStore.getInstance().createRefreshToken(Map.of("email", utenteDto.getEmail()));

            Cookie accessCookie = new Cookie("access_token", accessToken);
            accessCookie.setHttpOnly(false);
            accessCookie.setSecure(false);
            accessCookie.setPath("/");
            accessCookie.setMaxAge(900);
            accessCookie.setDomain("localhost");

            Cookie refreshCookie = new Cookie("refresh_token", refreshToken);
            refreshCookie.setHttpOnly(true);
            refreshCookie.setSecure(false);
            refreshCookie.setPath("/");
            refreshCookie.setMaxAge(60 * 60 * 24 * 7); // 7 giorni
            refreshCookie.setDomain("localhost");

            response.addCookie(accessCookie);
            response.addCookie(refreshCookie);

            utente.setPassword(null);

            return ResponseEntity.ok(Map.of(
                    "message", "Login effettuato con successo",
                    "utente", utente
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Email o password errati"));
        }
    }

    @PostMapping("/doLogout")
    public ResponseEntity<?> doLogout(HttpServletResponse response) {

        Cookie accessCookie = new Cookie("access_token", null);
        accessCookie.setHttpOnly(false);
        accessCookie.setSecure(false);
        accessCookie.setPath("/");
        accessCookie.setMaxAge(0);
        accessCookie.setDomain("localhost");

        Cookie refreshCookie = new Cookie("refresh_token", null);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(false);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(0);
        refreshCookie.setDomain("localhost");

        response.addCookie(accessCookie);
        response.addCookie(refreshCookie);


        return ResponseEntity.ok(Map.of("message", "Logout effettuato con successo"));
    }

    @PutMapping("/doUpdate/{email}")
    public ResponseEntity<?> aggiornaUtente(@PathVariable String email, @RequestBody UtenteDto nuovoUtenteDto) {
        System.out.println("Aggiornamento utente con email: " + email);
        try {
            // Recupera l'entità originale
            var utenteOriginale = utenteService.getByEmail(email);  // Metodo che restituisce entità, non DTO

            // Aggiorna solo i campi modificabili
            utenteOriginale.setNome(nuovoUtenteDto.getNome());
            utenteOriginale.setCognome(nuovoUtenteDto.getCognome());
            utenteOriginale.setTelefono(nuovoUtenteDto.getTelefono());

            if (!passwordEncoder.matches(nuovoUtenteDto.getPassword(), utenteOriginale.getPassword())) {
                utenteOriginale.setPassword(passwordEncoder.encode(nuovoUtenteDto.getPassword()));
            }

            utenteService.save(utenteOriginale.toEntity()); // ora è un update, non insert

            return ResponseEntity.ok(Map.of("message", "Utente aggiornato con successo"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Utente non trovato"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<UtenteDto> getUtenteById(@PathVariable Long id) {
        try {
            UtenteDto utente = utenteService.getById(id);
            return ResponseEntity.ok(utente);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }


}
