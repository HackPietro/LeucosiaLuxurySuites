package com.leucosia.luxurysuites.Data.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "recensione")
public class Recensione {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "utente_id", referencedColumnName = "id", nullable = false)
    @JsonBackReference
    private Utente utente;

    @Column(nullable = false)
    private Long stelle;

    @Column(length = 1000)
    private String commento;
}

