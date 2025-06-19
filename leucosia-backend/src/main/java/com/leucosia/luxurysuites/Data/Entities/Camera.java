package com.leucosia.luxurysuites.Data.Entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@Table(name = "camera")
public class Camera {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "descrizione")
    private String descrizione;

    @Column(name = "posti_letto")
    private Integer postiLetto;

    @Column(name = "metri_quadri")
    private Integer metriQuadri;

    @Column(name = "prezzo_base", nullable = false)
    private BigDecimal prezzoBase;
}
