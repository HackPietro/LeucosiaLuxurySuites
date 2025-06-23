package com.leucosia.luxurysuites.Data.Service;

import com.leucosia.luxurysuites.Data.Entities.Prenotazione;
import com.leucosia.luxurysuites.Dto.NewsDto;
import com.leucosia.luxurysuites.Dto.PrenotazioneDto;

import java.util.List;

public interface PrenotazioneService {

    PrenotazioneDto createPrenotazione(PrenotazioneDto prenotazioneDto);
    List<PrenotazioneDto> getPrenotazioni();
    List<PrenotazioneDto> getPrenotazioniByUtenteId(Long id);
    void eliminaPrenotazione(Long id);

}
