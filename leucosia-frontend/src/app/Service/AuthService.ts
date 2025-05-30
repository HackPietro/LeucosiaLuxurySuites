import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, map, Observable, of, switchMap, tap} from 'rxjs';
import { Utente } from '../Model/Utente';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/utente-api';

  constructor(private http: HttpClient) {}

  isLoggedIn = false;

  doRegistration(utente: Utente): Observable<any> {
    return this.http.post(`${this.baseUrl}/doRegistration`, utente, {
      withCredentials: true,
      headers: {'Content-Type': 'application/json'}
    }).pipe(
      tap((response: any) => {
        localStorage.setItem('utente', JSON.stringify(response.utente));
      })
    );
  }

  doLogin(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/doLogin`, {email, password}, {
      withCredentials: true
    }).pipe(
      tap((response: any) => {
        localStorage.setItem('utente', JSON.stringify(response.utente));
        this.isLoggedIn = true;
      })
    );
  }
  validateToken(): Observable<boolean> {
    return this.http.post<{ valid: boolean }>(`${this.baseUrl}/validateToken`, {}, {
      withCredentials: true
    }).pipe(
      tap(response => {
        this.isLoggedIn = response.valid;
      }),
      map(response => response.valid),
      catchError(() => {
        this.isLoggedIn = false;
        return of(false);
      })
    );
  }

  logout(): void {
    this.http.post(`${this.baseUrl}/doLogout`, {}, { withCredentials: true }).subscribe(() => {
      this.isLoggedIn = false;
      document.cookie = 'access_token=; Max-Age=0; path=/;';
      document.cookie = 'refresh_token=; Max-Age=0; path=/;';
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('utente');
    });
  }


}
