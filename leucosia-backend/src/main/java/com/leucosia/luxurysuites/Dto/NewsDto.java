package com.leucosia.luxurysuites.Dto;


import com.leucosia.luxurysuites.Data.Entities.Credenziali;
import com.leucosia.luxurysuites.Data.Entities.News;
import com.leucosia.luxurysuites.Data.Entities.Utente;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class NewsDto {
    private Long id;
    private String titolo;
    private String contenuto;
    private LocalDate data;
    private String autore;

    public NewsDto(String titolo, String contenuto, LocalDate data, String autore) {
        this.titolo = titolo;
        this.contenuto = contenuto;
        this.data = data;
        this.autore = autore;
    }

    public News toEntity() {
        News news = new News();
        news.setId(this.id);
        news.setTitolo(this.titolo);
        news.setContenuto(this.contenuto);
        news.setData(this.data);
        news.setAutore(this.autore);

        return news;
    }

}

