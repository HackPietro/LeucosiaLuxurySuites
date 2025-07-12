package com.leucosia.luxurysuites.Data.Service;

import com.leucosia.luxurysuites.Config.EmailService;
import com.leucosia.luxurysuites.Data.Dao.RecensioneDao;
import com.leucosia.luxurysuites.Data.Dao.UtenteDao;
import com.leucosia.luxurysuites.Data.Entities.Recensione;
import com.leucosia.luxurysuites.Data.Entities.Utente;
import com.leucosia.luxurysuites.Dto.RecensioneDto;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RecensioneServiceImpl implements RecensioneService {

    @Autowired
    private RecensioneDao recensioneDao;

    @Autowired
    private UtenteDao utenteDao;

    @Autowired
    private EmailService emailService;

    @Override
    @Transactional
    public void addRecensione(RecensioneDto dto) {
        Utente utente = utenteDao.findById(dto.getUtenteId())
                .orElseThrow(() -> new EntityNotFoundException("Utente non trovato"));

        Optional<Recensione> recensioneEsistente = recensioneDao.findByUtenteId(dto.getUtenteId());

        recensioneEsistente.ifPresent(recensioneDao::delete);

        Recensione nuovaRecensione = new Recensione();
        nuovaRecensione.setUtente(utente);
        nuovaRecensione.setStelle(dto.getStelle());
        nuovaRecensione.setCommento(dto.getCommento());

        recensioneDao.save(nuovaRecensione);

        String messaggio = "Ciao " + utente.getNome() + ",\n\n" +
                "Grazie per aver lasciato una recensione!\n\n" +
                "Dettagli:\n" +
                "- Stelle: " + dto.getStelle() + "\n" +
                "- Commento: " + dto.getCommento() + "\n\n" +
                "Apprezziamo il tuo feedback e ci aiuta a migliorare continuamente.\n\n" +
                "Saluti,\nIl team di Leucosia Luxury Suites";

        emailService.inviaEmail(
                utente.getCredenziali().getEmail(),
                "Conferma Recensione",
                messaggio
        );
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
