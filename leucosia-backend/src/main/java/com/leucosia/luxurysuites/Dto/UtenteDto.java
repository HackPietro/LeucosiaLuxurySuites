package com.leucosia.luxurysuites.Dto;

import com.leucosia.luxurysuites.Data.Entities.Credenziali;
import com.leucosia.luxurysuites.Data.Entities.Utente;
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
    private String telefono;

    public UtenteDto(String email, String password, String nome, String cognome, String tipologia, String telefono) {
        this.nome = nome;
        this.cognome = cognome;
        this.email = email;
        this.password = password;
        this.tipologia = tipologia;
        this.telefono = telefono;
    }

    public Utente toEntity() {
        Utente utente = new Utente();
        utente.setId(this.id);
        utente.setNome(this.nome);
        utente.setCognome(this.cognome);
        Credenziali credenziali = new Credenziali();
        credenziali.setEmail(this.email);
        credenziali.setPassword(this.password);
        utente.setCredenziali(credenziali);
        utente.setTipologia(this.tipologia);
        utente.setTelefono(this.telefono);

        return utente;
    }

}
