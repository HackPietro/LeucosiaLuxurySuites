import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Service/AuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  token: string | null = null;
  showMenu: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Controlla se il token esiste nel cookie al caricamento della pagina
    this.token = this.getTokenFromCookie();
    if (this.token) {
      this.showMenu = true; // Mostra il menu se il token è presente
    } else {
      this.showMenu = false; // Mostra solo il bottone di login se il token non esiste
    }
  }

  // Funzione per ottenere il token dal cookie
  getTokenFromCookie(): string | null {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('jwt_token=')) {
        return cookie.substring('jwt_token='.length);
      }
    }
    return null; // Se il cookie non è presente
  }

  // Funzione per verificare se l'utente è autenticato
  isAuthenticated(): boolean {
    this.token = this.getTokenFromCookie();
    // Verifica se il token è presente nel cookie
    return !!this.token;  // Restituisce true se il token è presente
  }

  // Toggle menu, mostra o nasconde a seconda dell'autenticazione
  toggleMenu(): void {
    if (this.isAuthenticated()) {
      // Puoi gestire l'apertura del menu se l'utente è autenticato
    } else {
      // Se non è autenticato, reindirizza alla pagina di login
      this.router.navigate(['/login']);
    }
  }

  // Funzione di logout
  logout(): void {
    // Rimuove il cookie del token JWT
    document.cookie = 'jwt_token=; Max-Age=0; path=/'; // Elimina il cookie
    this.token = null; // Resetta il token
    this.showMenu = false; // Nasconde il menu
    this.router.navigate(['/login']); // Reindirizza alla pagina di login
  }
}
