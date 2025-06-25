package com.leucosia.luxurysuites.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
public class PrezzoCameraDto {
    private Long cameraId;
    private LocalDate dataInizio;
    private LocalDate dataFine;
    private BigDecimal prezzo;
}
