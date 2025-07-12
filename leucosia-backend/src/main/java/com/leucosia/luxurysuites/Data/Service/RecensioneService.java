package com.leucosia.luxurysuites.Data.Service;

import com.leucosia.luxurysuites.Dto.RecensioneDto;

import java.util.List;

public interface RecensioneService {
    void addRecensione(RecensioneDto dto);
    List<RecensioneDto> getRecensioni();
}
