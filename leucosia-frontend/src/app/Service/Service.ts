import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { News } from '../Model/News';
import { Observable } from 'rxjs';
import {Messaggio} from "../Model/Messaggio";
import {Camera} from "../Model/Camera";
import {Prenotazione} from "../Model/Prenotazione";
import {Recensione} from "../Model/Recensione";

@Injectable({
  providedIn: 'root'
})
export class Service {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  createNews(news: Partial<News>): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/news-api`, news, { withCredentials: true, responseType: 'text' as 'json' });
  }

  deleteNews(id: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/news-api/${id}`, { withCredentials: true, responseType: 'text' as 'json' });
  }

  getAllNews(): Observable<News[]> {
    return this.http.get<News[]>(`${this.baseUrl}/news-api`, { withCredentials: true });
  }

  inviaMessaggio(messaggio: Messaggio): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/messaggi-api`, messaggio, { withCredentials: true, responseType: 'text' as 'json' });
  }

  getMessaggi(): Observable<Messaggio[]> {
    return this.http.get<Messaggio[]>(`${this.baseUrl}/messaggi-api`, { withCredentials: true });
  }

  deleteMessaggio(id: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/messaggi-api/${id}`, { withCredentials: true, responseType: 'text' as 'json' });
  }

  getCamere(): Observable<Camera[]> {
    return this.http.get<Camera[]>(`${this.baseUrl}/camera-api`);
  }

  getCamereDisponibili(checkIn: string, checkOut: string): Observable<Camera[]> {
    return this.http.get<Camera[]>(`${this.baseUrl}/camera-api/disponibili?checkIn=${checkIn}&checkOut=${checkOut}`);
  }

  getPrezziCamera(cameraId: number, start: string, end: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/camera-api/prezzi?cameraId=${cameraId}&start=${start}&end=${end}`);
  }

  createPrenotazione(prenotazione: Partial<Prenotazione>): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/prenotazione-api`, prenotazione, { withCredentials: true, responseType: 'text' as 'json' });
  }

  getPrenotazioni(): Observable<Prenotazione[]> {
    return this.http.get<Prenotazione[]>(`${this.baseUrl}/prenotazione-api`, { withCredentials: true });
  }

  getPrenotazioniUtente(utenteId: number): Observable<Prenotazione[]> {
    return this.http.get<Prenotazione[]>(`${this.baseUrl}/prenotazione-api/utente/${utenteId}`, { withCredentials: true });
  }

  eliminaPrenotazione(id: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/prenotazione-api/${id}`, { withCredentials: true, responseType: 'text' as 'json' });
  }

  getUtenteById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/utente-api/getUtenteById/${id}`);
  }

  addPrezzoCamera( cameraId: number, prezzo: number,  dataInizio: string, dataFine: string ): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/camera-api/modificaPrezzi`, {
      cameraId,
      prezzo,
      dataInizio,
      dataFine
    }, {
      withCredentials: true, responseType: 'text' as 'json' });
  }


  addRecensione(stelle: number, commento: string, utenteId: number): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/recensione-api`, {stelle, commento, utenteId}, { withCredentials: true, responseType: 'text' as 'json' });
  }

  getRecensioni(): Observable<Recensione[]> {
    return this.http.get<any[]>(`${this.baseUrl}/recensione-api/recensioni`);
  }

}
