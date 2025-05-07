package com.leucosia.luxurysuites.Data.Service;

import com.leucosia.luxurysuites.Data.Entities.Indirizzo;
import com.leucosia.luxurysuites.Data.Entities.Utente;
import com.leucosia.luxurysuites.Dto.UtenteDto;
import com.nimbusds.jose.JOSEException;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.text.ParseException;
import java.util.List;

public interface UtenteService {
    public void save(Utente utente);


    UtenteDto getById(Long id);

    UtenteDto getByCEmail(String email);

    UtenteDto getUserByToken(String token) throws ParseException, JOSEException;

    void updatePassword(String token, String newPassword) throws ParseException, JOSEException;

}
