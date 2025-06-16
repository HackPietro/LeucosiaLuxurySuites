import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { News } from '../Model/News';
import { Observable } from 'rxjs';
import {Messaggio} from "../Model/Messaggio";

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


}
