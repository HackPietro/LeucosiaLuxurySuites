package com.leucosia.luxurysuites.Dto;

import com.leucosia.luxurysuites.Data.Entities.Recensione;
import com.leucosia.luxurysuites.Data.Entities.Utente;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RecensioneDto {
    Long id;
    Long utenteId;
    Long stelle;
    String commento;

    public RecensioneDto(Long id, Long utenteId, Long stelle, String commento) {
        this.id = id;
        this.utenteId = utenteId;
        this.stelle = stelle;
        this.commento = commento;
    }

    public Recensione toEntity() {
        Recensione recensione = new Recensione();
        recensione.setId(this.id);

        Utente utente = new Utente();
        utente.setId(this.utenteId);
        recensione.setUtente(utente);

        recensione.setStelle(this.stelle);
        recensione.setCommento(this.commento);

        return recensione;
    }
}
