package com.leucosia.luxurysuites.Data.Service;

import com.leucosia.luxurysuites.Config.EmailService;
import com.leucosia.luxurysuites.Data.Dao.CameraDao;
import com.leucosia.luxurysuites.Data.Dao.PrenotazioneDao;
import com.leucosia.luxurysuites.Data.Dao.UtenteDao;
import com.leucosia.luxurysuites.Data.Entities.Camera;
import com.leucosia.luxurysuites.Data.Entities.News;
import com.leucosia.luxurysuites.Data.Entities.Prenotazione;
import com.leucosia.luxurysuites.Data.Entities.Utente;
import com.leucosia.luxurysuites.Dto.PrenotazioneDto;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
public class PrenotazioneServiceImpl implements PrenotazioneService {

    private final PrenotazioneDao prenotazioneDao;
    private final CameraDao cameraDao;
    private final UtenteDao utenteDao;
    private final ModelMapper modelMapper;

    @Autowired
    private  EmailService emailService;

    public PrenotazioneServiceImpl(PrenotazioneDao prenotazioneDao, ModelMapper modelMapper,
                                   CameraDao cameraDao, UtenteDao utenteDao) {
        this.prenotazioneDao = prenotazioneDao;
        this.modelMapper = modelMapper;
        this.cameraDao = cameraDao;
        this.utenteDao = utenteDao;
    }

    @Override
    @Transactional
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

        Utente utente = utenteDao.findById(dto.getUtenteId())
                .orElseThrow(() -> new RuntimeException("Utente non trovato con id: " + dto.getUtenteId()));

        Camera camera = cameraDao.findById(dto.getCameraId())
                .orElseThrow(() -> new RuntimeException("Camera non trovata con id: " + dto.getCameraId()));

        Prenotazione prenotazione = new Prenotazione();

        prenotazione.setId(null);

        prenotazione.setUtente(utente);
        prenotazione.setCamera(camera);
        prenotazione.setDataCheckIn(dto.getDataCheckIn());
        prenotazione.setDataCheckOut(dto.getDataCheckOut());
        prenotazione.setTotale(dto.getTotale());

        Prenotazione salvata = prenotazioneDao.save(prenotazione);

        if (salvata != null) {
            String messaggio = "Ciao " + utente.getNome() + ",\n\n" +
                    "La tua prenotazione è stata confermata con successo.\n" +
                    "Di seguito i dettagli:\n" +
                    "- Data: " + salvata.getDataCheckIn() + "\n" +
                    "- Data: " + salvata.getDataCheckOut() + "\n" +
                    "- Camera: " + salvata.getCamera() + "\n\n" +
                    "- Totale da pagare al check-in: " + salvata.getTotale() + "\n\n" +
                    "Grazie per aver scelto il nostro servizio!\n\n" +
                    "Saluti,\nIl team";

            emailService.inviaEmail(
                    utente.getCredenziali().getEmail(),
                    "Conferma Prenotazione",
                    messaggio
            );
        }

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

    @Override
    public List<PrenotazioneDto> getPrenotazioni() {
        System.out.println("Recupero tutte le prenotazioni");
        return prenotazioneDao.findAll()
                .stream()
                .map(prenotazione -> modelMapper.map(prenotazione, PrenotazioneDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<PrenotazioneDto> getPrenotazioniByUtenteId(Long id) {
        System.out.println("Recupero prenotazioni per utente con ID: " + id);
        if (id == null) {
            throw new IllegalArgumentException("L'id dell'utente non può essere null");
        }

        return prenotazioneDao.findByUtenteId(id)
                .stream()
                .map(prenotazione -> modelMapper.map(prenotazione, PrenotazioneDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public void eliminaPrenotazione(Long id) {
        System.out.println("Eliminazione prenotazione con ID: " + id);
        if (id == null) {
            throw new IllegalArgumentException("L'id della prenotazione non può essere null");
        }
        prenotazioneDao.deleteById(id);
    }

}
