package com.leucosia.luxurysuites.Data.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
public class Prenotazione {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "utente_id", referencedColumnName = "id", nullable = false)
    @JsonBackReference
    private Utente utente;


    @Column(name = "data_check_in", nullable = false)
    private LocalDate dataCheckIn;

    @Column(name = "data_check_out", nullable = false)
    private LocalDate dataCheckOut;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "camera_id", referencedColumnName = "id", nullable = false)
    @JsonBackReference
    private Camera camera;


    @Column(name = "totale", nullable = false)
    private BigDecimal totale;
}
