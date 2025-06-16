import { Component, OnInit } from '@angular/core';
import { Service } from '../../Service/Service';
import { Messaggio } from '../../Model/Messaggio';

@Component({
  selector: 'app-news',
  templateUrl: './richiedi_intervento.component.html',
  styleUrls: ['./richiedi_intervento.component.css']
})
export class Richiedi_interventoComponent implements OnInit {
  errorMessage = '';
  successMessage = '';

  nome = '';
  cognome = '';
  email = '';
  tipologia = '';
  contenutoMessaggio = '';

  messaggio: Messaggio[] = [];

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
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.nome || !this.cognome || !this.email || !this.tipologia || !this.contenutoMessaggio) {
      this.errorMessage = 'Tutti i campi sono obbligatori';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Formato email non valido';
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
      next: () => {
        this.successMessage = 'Messaggio inviato con successo!';
        this.messaggio.push(nuovoMessaggio);
        this.clearForm();
      },
      error: () => {
        this.errorMessage = 'Errore durante l’invio del messaggio. Riprova più tardi.';
      }
    });
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  clearForm(): void {
    this.nome = '';
    this.cognome = '';
    this.email = '';
    this.tipologia = '';
    this.contenutoMessaggio = '';
  }
}
