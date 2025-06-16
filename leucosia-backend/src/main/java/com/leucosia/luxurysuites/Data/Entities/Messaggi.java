package com.leucosia.luxurysuites.Data.Entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@Table(name="messaggi")
public class Messaggi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="tipologia")
    private String tipologia;

    @Column(name="messaggio", columnDefinition = "TEXT")
    private String messaggio;

    @Column(name="data")
    private LocalDate data;

    @Column(name="nome")
    private String nome;

    @Column(name="cognome")
    private String cognome;

    @Column(name="email")
    private String email;

}


