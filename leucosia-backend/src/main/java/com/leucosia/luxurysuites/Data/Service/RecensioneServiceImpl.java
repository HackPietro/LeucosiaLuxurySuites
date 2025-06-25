package com.leucosia.luxurysuites.Data.Service;

import com.leucosia.luxurysuites.Data.Dao.RecensioneDao;
import com.leucosia.luxurysuites.Data.Dao.UtenteDao;
import com.leucosia.luxurysuites.Data.Entities.Recensione;
import com.leucosia.luxurysuites.Data.Entities.Utente;
import com.leucosia.luxurysuites.Dto.RecensioneDto;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class RecensioneServiceImpl implements RecensioneService {

    private final RecensioneDao recensioneDao;
    private final UtenteDao utenteDao;

    public RecensioneServiceImpl(RecensioneDao recensioneDao, UtenteDao utenteDao) {
        this.recensioneDao = recensioneDao;
        this.utenteDao = utenteDao;
    }

    @Override
    public void aggiungiRecensione(RecensioneDto dto) {
        Utente utente = utenteDao.findById(dto.getUtenteId())
                .orElseThrow(() -> new EntityNotFoundException("Utente non trovato"));

        Recensione recensione = new Recensione();
        recensione.setUtente(utente);         // <- oggetto, non id
        recensione.setStelle(dto.getStelle());
        recensione.setCommento(dto.getCommento());

        recensioneDao.save(recensione);
    }
}
