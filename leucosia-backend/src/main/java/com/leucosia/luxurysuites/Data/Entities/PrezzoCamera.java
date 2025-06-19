package com.leucosia.luxurysuites.Data.Entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@Table(name="prezzo_camera")
public class PrezzoCamera {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "camera_id", nullable = false)
    private Camera camera;

    @Column(name = "data", nullable = false)
    private LocalDate data;

    @Column(name = "prezzo", nullable = false)
    private BigDecimal prezzo;
}
