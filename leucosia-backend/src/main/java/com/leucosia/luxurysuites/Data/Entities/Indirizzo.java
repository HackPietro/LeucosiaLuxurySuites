package com.leucosia.luxurysuites.Data.Entities;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Indirizzo {
    private String via;
    private Integer numeroCivico;
    private String citta;
}
