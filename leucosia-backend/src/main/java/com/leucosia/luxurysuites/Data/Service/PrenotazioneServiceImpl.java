package com.leucosia.luxurysuites.Data.Service;

import com.leucosia.luxurysuites.Data.Dao.CameraDao;
import com.leucosia.luxurysuites.Data.Dao.PrenotazioneDao;
import com.leucosia.luxurysuites.Data.Dao.UtenteDao;
import com.leucosia.luxurysuites.Data.Entities.Camera;
import com.leucosia.luxurysuites.Data.Entities.News;
import com.leucosia.luxurysuites.Data.Entities.Prenotazione;
import com.leucosia.luxurysuites.Data.Entities.Utente;
import com.leucosia.luxurysuites.Dto.PrenotazioneDto;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;


@Service
public class PrenotazioneServiceImpl implements PrenotazioneService {

    private final PrenotazioneDao prenotazioneDao;
    private final CameraDao cameraDao;
    private final UtenteDao utenteDao;
    private final ModelMapper modelMapper;

    public PrenotazioneServiceImpl(PrenotazioneDao prenotazioneDao, ModelMapper modelMapper,
                                   CameraDao cameraDao, UtenteDao utenteDao) {
        this.prenotazioneDao = prenotazioneDao;
        this.modelMapper = modelMapper;
        this.cameraDao = cameraDao;
        this.utenteDao = utenteDao;
    }

    @Override
    public PrenotazioneDto createPrenotazione(PrenotazioneDto dto) {
        if (dto == null) {
            throw new IllegalArgumentException("PrenotazioneDto non può essere null");
        }

        if (dto.getUtenteId() == null) {
            throw new IllegalArgumentException("utenteId non può essere null");
        }

        if (dto.getCameraId() == null) {
            throw new IllegalArgumentException("cameraId non può essere null");
        }

        // Recupera Utente da DB
        Utente utente = utenteDao.findById(dto.getUtenteId())
                .orElseThrow(() -> new RuntimeException("Utente non trovato con id: " + dto.getUtenteId()));

        // Recupera Camera da DB
        Camera camera = cameraDao.findById(dto.getCameraId())
                .orElseThrow(() -> new RuntimeException("Camera non trovata con id: " + dto.getCameraId()));

        Prenotazione prenotazione = new Prenotazione();

        // Forza id a null perché è nuova prenotazione
        prenotazione.setId(null);

        prenotazione.setUtente(utente);
        prenotazione.setCamera(camera);
        prenotazione.setDataCheckIn(dto.getDataCheckIn());
        prenotazione.setDataCheckOut(dto.getDataCheckOut());
        prenotazione.setTotale(dto.getTotale());

        Prenotazione salvata = prenotazioneDao.save(prenotazione);

        // Mappa a DTO (assumendo ci sia un costruttore o metodo di conversione)
        return new PrenotazioneDto(
                salvata.getId(),
                salvata.getUtente().getId(),
                salvata.getDataCheckIn(),
                salvata.getDataCheckOut(),
                salvata.getCamera().getId(),
                salvata.getTotale()
        );
    }

}
