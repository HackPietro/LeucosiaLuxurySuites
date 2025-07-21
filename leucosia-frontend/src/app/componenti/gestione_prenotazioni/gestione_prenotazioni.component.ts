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
  loading = false;


  constructor(private service: Service){}
  ngOnInit() {
    this.utente = JSON.parse(localStorage.getItem('utente') || 'null');
    this.caricaPrenotazioni();
  }

  caricaPrenotazioni() {
    this.loading = true;

    if (this.utente?.tipologia === 'admin') {
      this.service.getPrenotazioni().subscribe({
        next: (res: Prenotazione[]) => {
          this.prenotazioni = this.ordinaPrenotazioni(res);
          this.caricaUtentiAssociati(this.prenotazioni);
          this.loading = false;
        },
        error: (err) => {
          this.popupMessage = 'Errore nel caricamento delle prenotazioni';
          this.loading = false;
        }
      });
    } else {
      this.service.getPrenotazioniUtente(this.utente?.id!).subscribe({
        next: (res: Prenotazione[]) => {
          this.prenotazioni = this.ordinaPrenotazioni(res);
          this.loading = false;
        },
        error: (err) => {
          this.popupMessage = 'Errore nel caricamento delle prenotazioni';
          this.loading = false;
        }
      });
    }
  }


  caricaUtentiAssociati(prenotazioni: Prenotazione[]) {
    const idsUnici = Array.from(new Set(prenotazioni.map(p => p.utenteId)));
    this.loading = true;
    let count = 0;

    idsUnici.forEach(id => {
      if (!this.datiUtenti[id]) {
        this.service.getUtenteById(id).subscribe({
          next: (utente: Utente) => {
            this.datiUtenti[id] = utente;
            count++;
            if (count === idsUnici.length) {
              this.loading = false;
            }
          },
          error: () => {
            count++;
            if (count === idsUnici.length) {
              this.loading = false;
            }
          }
        });
      } else {
        count++;
        if (count === idsUnici.length) {
          this.loading = false;
        }
      }
    });

    if (idsUnici.length === 0) {
      this.loading = false;
    }
  }



  eliminaPrenotazione(id: number) {
    this.loading = true;

    this.service.eliminaPrenotazione(id).subscribe({
      next: (message) => {
        this.popupMessage = message;
        this.caricaPrenotazioni();
        this.loading = false;
      },
      error: (err) => {
        this.popupMessage = err.error;
        this.loading = false;
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
      this.activePopupId = null;
    } else {
      this.activePopupId = bookingId;
    }
  }

  chiudiPopup() {
    this.popupMessage = '';
    this.caricaPrenotazioni();
  }

}
