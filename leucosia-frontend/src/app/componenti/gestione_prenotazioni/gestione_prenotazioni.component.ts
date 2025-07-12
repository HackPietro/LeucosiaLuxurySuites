import { Component, OnInit } from '@angular/core';
import { Service } from '../../Service/Service';
import { Prenotazione } from '../../Model/Prenotazione';
import {Utente} from "../../Model/Utente";
@Component({
  selector: 'app-gestione_prenotazioni',
  templateUrl: './gestione_prenotazioni.component.html',
  styleUrls: ['./gestione_prenotazioni.component.css']
})
export class Gestione_prenotazioniComponent implements OnInit {
  prenotazioni: Prenotazione[] = [];
  utente: Utente | null = null;
  datiUtenti: { [id: number]: Utente } = {};

  popupMessage: string = '';
  activePopupId: number | null = null;



  constructor(private service: Service){}
  ngOnInit() {
    this.utente = JSON.parse(localStorage.getItem('utente') || 'null');
    this.caricaPrenotazioni();
  }

  caricaPrenotazioni() {
    if (this.utente?.tipologia === 'admin') {
      this.service.getPrenotazioni().subscribe((res: Prenotazione[]) => {
        this.prenotazioni = this.ordinaPrenotazioni(res);
        this.caricaUtentiAssociati(this.prenotazioni);
      });
    } else {
      this.service.getPrenotazioniUtente(this.utente?.id!).subscribe((res: Prenotazione[]) => {
        this.prenotazioni = this.ordinaPrenotazioni(res);
      });
    }
  }

  caricaUtentiAssociati(prenotazioni: Prenotazione[]) {
    const idsUnici = Array.from(new Set(prenotazioni.map(p => p.utenteId)));

    idsUnici.forEach(id => {
      if (!this.datiUtenti[id]) {
        this.service.getUtenteById(id).subscribe((utente: Utente) => {
          this.datiUtenti[id] = utente;
        });
      }
    });
  }


  eliminaPrenotazione(id: number) {
    this.service.eliminaPrenotazione(id).subscribe({
      next: (message) => {
        this.popupMessage = message;
      },
      error: (err) => {
        this.popupMessage = err.error;
      }
    });
  }

  private ordinaPrenotazioni(prenotazioni: Prenotazione[]): Prenotazione[] {
    return prenotazioni.sort((a, b) =>
      new Date(a.dataCheckIn).getTime() - new Date(b.dataCheckIn).getTime()
    );
  }

  public getUtenteById(id: number): Utente | null {
    return this.datiUtenti[id] || null;
  }

  toggleUserPopup(bookingId: number) {
    if (this.activePopupId === bookingId) {
      this.activePopupId = null; // chiudi se è già aperto
    } else {
      this.activePopupId = bookingId; // apri popup per quella prenotazione
    }
  }

  chiudiPopup() {
    this.popupMessage = '';
    this.caricaPrenotazioni();
  }

}
