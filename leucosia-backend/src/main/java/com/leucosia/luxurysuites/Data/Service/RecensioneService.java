package com.leucosia.luxurysuites.Data.Service;

import com.leucosia.luxurysuites.Dto.RecensioneDto;

import java.util.List;

public interface RecensioneService {
    void aggiungiRecensione(RecensioneDto dto);
    List<RecensioneDto> getRecensioni();
}
