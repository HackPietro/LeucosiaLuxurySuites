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
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    // Controllo campi compilati
    if (!this.nome || !this.cognome || !this.email || !this.password) {
      this.errorMessage = 'Tutti i campi sono obbligatori';
      return;
    }

    // Validazione email
    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Formato email non valido';
      return;
    }

    const utente: Utente = {
      nome: this.nome,
      cognome: this.cognome,
      email: this.email,
      password: this.password
    };

    this.authService.doRegistration(utente).subscribe({
      next: (res) => {
        this.successMessage = 'Registrazione avvenuta con successo!';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        // Gestione errore specifico se email già presente
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
