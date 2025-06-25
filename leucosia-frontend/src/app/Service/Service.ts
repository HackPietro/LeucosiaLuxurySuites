import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { News } from '../Model/News';
import { Observable } from 'rxjs';
import {Messaggio} from "../Model/Messaggio";
import {Camera} from "../Model/Camera";
import {Prenotazione} from "../Model/Prenotazione";

@Injectable({
  providedIn: 'root'
})
export class Service {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  createNews(news: Partial<News>): Observable<News> {
    return this.http.post<News>(`${this.baseUrl}/news-api`, news, { withCredentials: true });
  }

  deleteNews(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/news-api/${id}`, { withCredentials: true });
  }

  getAllNews(): Observable<News[]> {
    return this.http.get<News[]>(`${this.baseUrl}/news-api`, { withCredentials: true });
  }

  inviaMessaggio(messaggio: Messaggio): Observable<any> {
    return this.http.post<Messaggio>(`${this.baseUrl}/messaggi-api`, messaggio, { withCredentials: true });
  }

  getMessaggi(): Observable<Messaggio[]> {
    return this.http.get<Messaggio[]>(`${this.baseUrl}/messaggi-api`, { withCredentials: true });
  }

  deleteMessaggio(id: number): Observable<void> {
    alert(`Eliminazione del messaggio con ID: ${id}`);
    return this.http.delete<void>(`${this.baseUrl}/messaggi-api/${id}`, { withCredentials: true });
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

  createPrenotazione(prenotazione: Partial<Prenotazione>): Observable<Prenotazione> {
    alert(`Creazione prenotazione: ${JSON.stringify(prenotazione)}`);
    return this.http.post<Prenotazione>(`${this.baseUrl}/prenotazione-api`, prenotazione, { withCredentials: true });
  }

  getPrenotazioni(): Observable<Prenotazione[]> {
    return this.http.get<Prenotazione[]>(`${this.baseUrl}/prenotazione-api`, { withCredentials: true });
  }

  getPrenotazioniUtente(utenteId: number): Observable<Prenotazione[]> {
    return this.http.get<Prenotazione[]>(`${this.baseUrl}/prenotazione-api/utente/${utenteId}`, { withCredentials: true });
  }

  eliminaPrenotazione(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/prenotazione-api/${id}`, { withCredentials: true });
  }

  getUtenteById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/utente-api/${id}`, { withCredentials: true });
  }

  //ho aggiunto any dopo post, vedere se restituisce ancora errore e cambia lo stesso i prezzi
  addPrezzoCamera(cameraId: number, prezzo: number, dataInizio: string, dataFine: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/camera-api/modificaPrezzi`, {
      cameraId,
      prezzo,
      dataInizio,
      dataFine
    }, {
      withCredentials: true
    });
  }

  addRecensione(stelle: number, commento: string, utenteId: number): Observable<any> {
    alert("ciao");
    return this.http.post<any>(`${this.baseUrl}/recensione-api`, {stelle, commento, utenteId}, { withCredentials: true });
  }

}
