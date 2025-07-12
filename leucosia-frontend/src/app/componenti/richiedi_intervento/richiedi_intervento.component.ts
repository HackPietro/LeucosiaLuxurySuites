import { Component, OnInit } from '@angular/core';
import { Service } from '../../Service/Service';
import { Messaggio } from '../../Model/Messaggio';

@Component({
  selector: 'app-news',
  templateUrl: './richiedi_intervento.component.html',
  styleUrls: ['./richiedi_intervento.component.css']
})
export class Richiedi_interventoComponent implements OnInit {

  nome = '';
  cognome = '';
  email = '';
  tipologia = '';
  contenutoMessaggio = '';

  popupMessage: string = '';

  constructor(private service: Service) {}

  ngOnInit(): void {
    const utenteStr = localStorage.getItem("utente");
    if (utenteStr) {
      const utente = JSON.parse(utenteStr);
      this.nome = utente.nome || '';
      this.cognome = utente.cognome || '';
      this.email = utente.email || '';
    }
  }

  onSubmit(): void {
    this.popupMessage = '';

    if (!this.nome || !this.cognome || !this.email || !this.tipologia || !this.contenutoMessaggio) {
      this.popupMessage = 'Tutti i campi sono obbligatori';
      return;
    }

    const nuovoMessaggio: Messaggio = {
      nome: this.nome,
      cognome: this.cognome,
      email: this.email,
      tipologia: this.tipologia,
      messaggio: this.contenutoMessaggio,
      data: new Date()
    };

    this.service.inviaMessaggio(nuovoMessaggio).subscribe({
      next: (message: string) => {
        this.popupMessage = message;
        this.clearForm();
      },
      error: (err) => {
        this.popupMessage = err.error;
      }
    });
  }

  clearForm(): void {
    this.nome = '';
    this.cognome = '';
    this.email = '';
    this.tipologia = '';
    this.contenutoMessaggio = '';
  }

  chiudiPopup(): void {
    this.popupMessage = '';
  }

}
