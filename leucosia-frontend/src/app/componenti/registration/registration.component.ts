import { Component } from '@angular/core';
import { AuthService } from '../../Service/AuthService'
import { Router } from '@angular/router';
import { Utente } from '../../Model/Utente';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'

})
export class RegistrationComponent {
  nome = '';
  cognome = '';
  telefono = '';
  email = '';
  password = '';
  tipologia = 'utente';
  errorMessage = '';
  successMessage = '';
  loading = false;


  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    if (!this.nome || !this.cognome || !this.telefono || !this.email) {
      this.errorMessage = 'Tutti i campi sono obbligatori';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Formato email non valido';
      return;
    }

    const utente: Utente = {
      nome: this.nome,
      cognome: this.cognome,
      telefono: this.telefono,
      email: this.email,
      tipologia: this.tipologia,
    };

    this.authService.doRegistration(utente).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = 'Registrazione avvenuta con successo. Abbiamo inviato una email contenente la password. Ti consigliamo di cambiarla al primo accesso.';
        setTimeout(() => this.router.navigate(['/login']), 3500);
      },
      error: (err) => {
        this.loading = false;
        if (err.error?.error === 'Email già registrata') {
          this.errorMessage = 'Email già registrata, accedi o usa un\'altra email';
        } else {
          this.errorMessage = 'Errore nella registrazione. Riprova.';
        }
      }
    });
  }


  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  clearError() {
    this.errorMessage = '';
  }


}
