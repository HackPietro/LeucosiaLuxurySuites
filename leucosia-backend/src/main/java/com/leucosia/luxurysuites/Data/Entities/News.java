package com.leucosia.luxurysuites.Data.Entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@Table(name="news")
public class News {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="titolo")
    private String titolo;

    @Column(name="contenuto", columnDefinition = "TEXT")
    private String contenuto;

    @Column(name="data")
    private LocalDate data;

    @Column(name="autore")
    private String autore;

}

