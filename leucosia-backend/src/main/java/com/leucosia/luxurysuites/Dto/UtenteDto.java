package com.leucosia.luxurysuites.Dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UtenteDto {
    private Long id;
    private String email;
    private String password;
    private String nome;
    private String cognome;
    private String tipologia;
    public UtenteDto(String email, String password, String nome, String cognome, String tipologia) {
        this.email = email;
        this.password = password;
        this.nome = nome;
        this.cognome = cognome;
        this.tipologia = tipologia;
    }

}
