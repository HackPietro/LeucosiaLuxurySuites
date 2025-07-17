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
  loading = false;


  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;

    this.authService.doLogin(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.utente) {
          localStorage.setItem('utente', JSON.stringify(res.utente));
          this.errorMessage = '';
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.message || err.message || JSON.stringify(err);
        this.errorMessage = 'Email o password errate';
      }
    });
  }

  clearError() {
    this.errorMessage = '';
  }

}
