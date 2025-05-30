package com.leucosia.luxurysuites.Data.Service;

import com.leucosia.luxurysuites.Data.Entities.Utente;
import com.leucosia.luxurysuites.Dto.UtenteDto;
import com.nimbusds.jose.JOSEException;

import java.text.ParseException;

public interface UtenteService {
    public void save(Utente utente);

    UtenteDto getById(Long id);

    UtenteDto getByEmail(String email);

    UtenteDto getUserByToken(String token) throws ParseException, JOSEException;

    void updatePassword(String token, String newPassword) throws ParseException, JOSEException;

    boolean emailExists(String email);

}
