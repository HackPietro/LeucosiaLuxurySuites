import { Component } from '@angular/core';
import { AuthService } from '../../Service/AuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recupera_password',
  templateUrl: './recupera_password.component.html',
  styleUrls: ['./recupera_password.component.css']
})
export class Recupera_passwordComponent {

  email: string = '';
  responseMessage: string = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  submitRecoveryRequest() {
    this.responseMessage = '';
    this.loading = true;

    this.authService.recuperoPassword(this.email).subscribe({
      next: (res) => {
        this.loading = false;
        this.responseMessage = res.message || "Richiesta inviata con successo";
      },
      error: (err) => {
        this.loading = false;
        if (err.error && err.error.error) {
          this.responseMessage = err.error.error;
        } else {
          this.responseMessage = "Si è verificato un errore. Riprova.";
        }
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
