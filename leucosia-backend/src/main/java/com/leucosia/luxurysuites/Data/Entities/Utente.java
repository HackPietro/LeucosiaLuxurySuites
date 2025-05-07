package com.leucosia.luxurysuites.Data.Entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name="utente")
@Data
@NoArgsConstructor
public class Utente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="nome")
    private String nome;

    @Column(name="cognome")
    private String cognome;

    @Column(name = "admin")
    private Boolean isAdmin;

    @Column(name = "bannato")
    private Boolean bannato;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "via", column = @Column(name = "via_utente")),
            @AttributeOverride(name = "numero_civico", column = @Column(name = "numeroCivico_utente")),
            @AttributeOverride(name = "citta", column = @Column(name = "citta_utente"))
    })
    private Indirizzo indirizzo;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "email", column = @Column(name = "email", unique = true)),
            @AttributeOverride(name = "password", column = @Column(name = "password"))
    })
    private Credenziali credenziali;

    @Override
    public String toString() {
        return "Utente{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                ", cognome='" + cognome + '\'' +
                ", isAdmin=" + isAdmin +
                ", bannato=" + bannato +
                ", indirizzo=" + indirizzo +
                ", credenziali=" + credenziali +
                '}';
    }


    public Utente(String email, String password, String firstName, String lastName) {
        this.credenziali = new Credenziali();
        this.credenziali.setEmail(email);
        this.credenziali.setPassword(password);
        this.nome = firstName;
        this.cognome = lastName;
    }
}
