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

  constructor(private service: Service){}
  ngOnInit() {
    this.utente = JSON.parse(localStorage.getItem('utente') || 'null');
    this.caricaPrenotazioni();
  }

  caricaPrenotazioni() {
    if (this.utente?.tipologia === 'admin') {
      this.service.getPrenotazioni().subscribe((res: Prenotazione[]) => {
        this.prenotazioni = this.ordinaPrenotazioni(res);
      });
    } else {
      this.service.getPrenotazioniUtente(this.utente?.id!).subscribe((res: Prenotazione[]) => {
        this.prenotazioni = this.ordinaPrenotazioni(res);
      });
    }
  }

  eliminaPrenotazione(id: number) {
    if (confirm('Sei sicuro di voler eliminare questa prenotazione?')) {
      this.service.eliminaPrenotazione(id).subscribe({
        next: () => {
          alert('Prenotazione eliminata con successo');
          this.caricaPrenotazioni();
        },
        error: (err) => {
          console.error('Errore durante l\'eliminazione della prenotazione:', err);
          alert('Si è verificato un errore durante l\'eliminazione della prenotazione');
        }
      });
    }
  }

  private ordinaPrenotazioni(prenotazioni: Prenotazione[]): Prenotazione[] {
    return prenotazioni.sort((a, b) =>
      new Date(a.dataCheckIn).getTime() - new Date(b.dataCheckIn).getTime()
    );
  }

}
