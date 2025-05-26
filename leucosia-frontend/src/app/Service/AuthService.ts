// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // Recupera il token dal localStorage
  getToken(): string | null {
    // Estrai il token dal cookie
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('jwt_token=')) {
        return cookie.substring('jwt_token='.length, cookie.length);
      }
    }
    return null; // Se non esiste il cookie
  }

  // Restituisce true se il token esiste nel localStorage
  isAuthenticated(): boolean {
    return !!this.getToken();  // Se il token esiste, ritorna true
  }

  // Aggiungi un metodo per effettuare il logout
  logout(): void {
    document.cookie = 'jwt_token=; Max-Age=0; path=/'; // Elimina il cookie
  }
}
