import { Component } from '@angular/core';
import { AuthService } from '../../Service/AuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.doLogin(this.email, this.password).subscribe({
      next: (res) => {
        if (res.utente) {
          localStorage.setItem('utente', JSON.stringify(res.utente));
          this.errorMessage = '';
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        const msg = err.error?.message || err.message || JSON.stringify(err);
        this.errorMessage = 'Email o password errate';
      }
    });
  }

  clearError() {
    this.errorMessage = '';
  }

}
