package com.leucosia.luxurysuites.Data.Service;

import com.leucosia.luxurysuites.Data.Entities.Utente;
import com.leucosia.luxurysuites.Dto.UtenteDto;
import com.nimbusds.jose.JOSEException;

import java.text.ParseException;

public interface UtenteService {
    void save(Utente utente);

    UtenteDto getById(Long id);

    UtenteDto getByEmail(String email);

    boolean emailExists(String email);

    void recuperoPassword(String email) throws Exception;

    String generaPasswordEInviaEmailDiRegistrazione(String nome, String email) throws Exception;

    void inviaEmailDiLogin(String nome, String email) throws Exception;



}
