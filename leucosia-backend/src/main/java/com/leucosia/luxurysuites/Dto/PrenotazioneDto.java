package com.leucosia.luxurysuites.Dto;

import com.leucosia.luxurysuites.Data.Entities.Camera;
import com.leucosia.luxurysuites.Data.Entities.Prenotazione;
import com.leucosia.luxurysuites.Data.Entities.Utente;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
public class PrenotazioneDto {

    private Long id;
    private Long utenteId;
    private LocalDate dataCheckIn;
    private LocalDate dataCheckOut;
    private Long cameraId;
    private BigDecimal totale;

    public PrenotazioneDto(Long id, Long utenteId, LocalDate dataCheckIn, LocalDate dataCheckOut, Long cameraId, BigDecimal totale) {
        this.id = id;
        this.utenteId = utenteId;
        this.dataCheckIn = dataCheckIn;
        this.dataCheckOut = dataCheckOut;
        this.cameraId = cameraId;
        this.totale = totale;
    }

    public Prenotazione toEntity() {
        Prenotazione prenotazione = new Prenotazione();
        prenotazione.setId(this.id);

        Utente utente = new Utente();
        utente.setId(this.utenteId);
        prenotazione.setUtente(utente);

        prenotazione.setDataCheckIn(this.dataCheckIn);
        prenotazione.setDataCheckOut(this.dataCheckOut);

        Camera camera = new Camera();
        camera.setId(this.cameraId);
        prenotazione.setCamera(camera);

        prenotazione.setTotale(this.totale);

        return prenotazione;
    }

}
