package com.leucosia.luxurysuites.Data.Service;

import com.leucosia.luxurysuites.Data.Dao.RecensioneDao;
import com.leucosia.luxurysuites.Data.Dao.UtenteDao;
import com.leucosia.luxurysuites.Data.Entities.Recensione;
import com.leucosia.luxurysuites.Data.Entities.Utente;
import com.leucosia.luxurysuites.Dto.RecensioneDto;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

        // Cerca eventuale recensione esistente dell'utente
        Optional<Recensione> recensioneEsistente = recensioneDao.findByUtenteId(dto.getUtenteId());

        recensioneEsistente.ifPresent(recensioneDao::delete);

        // Crea nuova recensione
        Recensione nuovaRecensione = new Recensione();
        nuovaRecensione.setUtente(utente);
        nuovaRecensione.setStelle(dto.getStelle());
        nuovaRecensione.setCommento(dto.getCommento());

        recensioneDao.save(nuovaRecensione);
    }


    @Override
    public List<RecensioneDto> getRecensioni() {
        return recensioneDao.findAll().stream()
                .map(recensione -> {
                    RecensioneDto dto = new RecensioneDto();
                    dto.setId(recensione.getId());
                    dto.setUtenteId(recensione.getUtente().getId());
                    dto.setStelle(recensione.getStelle());
                    dto.setCommento(recensione.getCommento());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
