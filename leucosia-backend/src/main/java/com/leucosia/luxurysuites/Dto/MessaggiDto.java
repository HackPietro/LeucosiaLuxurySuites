package com.leucosia.luxurysuites.Dto;

import com.leucosia.luxurysuites.Data.Entities.Messaggi;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class MessaggiDto {
    private Long id;
    private String nome;
    private String cognome;
    private String email;
    private String tipologia;
    private String messaggio;
    private LocalDate data;

    public MessaggiDto(String nome, String cognome, String email, String tipologia, String messaggio, LocalDate data) {
        this.nome = nome;
        this.cognome = cognome;
        this.email = email;
        this.tipologia = tipologia;
        this.messaggio = messaggio;
        this.data = data;
    }

    public Messaggi toEntity() {
        Messaggi messaggi = new Messaggi();
        messaggi.setId(this.id);
        messaggi.setNome(this.nome);
        messaggi.setCognome(this.cognome);
        messaggi.setEmail(this.email);
        messaggi.setTipologia(this.tipologia);
        messaggi.setMessaggio(this.messaggio);
        messaggi.setData(this.data);

        return messaggi;
    }
}
