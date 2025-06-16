package com.leucosia.luxurysuites.Dto;

import com.leucosia.luxurysuites.Data.Entities.Camera;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class CameraDto {
    private Long id;
    private String nome;
    private String descrizione;
    private Integer postiLetto;
    private Integer metriQuadri;
    private BigDecimal prezzoBase;

    public CameraDto(String nome, String descrizione, Integer postiLetto, Integer metriQuadri, BigDecimal prezzoBase) {
        this.nome = nome;
        this.descrizione = descrizione;
        this.postiLetto = postiLetto;
        this.metriQuadri = metriQuadri;
        this.prezzoBase = prezzoBase;
    }

    public Camera toEntity() {
        Camera camera = new Camera();
        camera.setId(this.id);
        camera.setNome(this.nome);
        camera.setDescrizione(this.descrizione);
        camera.setPostiLetto(this.postiLetto);
        camera.setMetriQuadri(this.metriQuadri);
        camera.setPrezzoBase(this.prezzoBase);

        return camera;
    }
}
