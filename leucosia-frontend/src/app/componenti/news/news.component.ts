import { Component, OnInit } from '@angular/core';
import {News} from "../../Model/News";
import {Service} from "../../Service/Service";

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  news: News[] = [];
  showCreateForm = false;
  nuovaNews: Partial<News> = { titolo: '', contenuto: '', autore: '' };

  constructor(private service : Service) { }

  ngOnInit(): void {
    this.service.getAllNews().subscribe({
      next: (newsList) => {
        this.news = newsList.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
      },
      error: (err) => {
        alert('Errore nel recupero delle news dal backend');
      }
    });
  }

  utenteOrAdmin(): string {
    const utenteStr = localStorage.getItem("utente");
    if (utenteStr) {
      const utente = JSON.parse(utenteStr);
      if (utente.tipologia === 'admin') {
        return 'admin';
      } else if (utente.tipologia === 'utente') {
        return 'utente';
      }
    }
    return '';
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.resetForm();
    }
  }

  creaNews(): void {
    if (this.nuovaNews.titolo && this.nuovaNews.contenuto && this.nuovaNews.autore) {
      const newNews: Partial<News> = {
        titolo: this.nuovaNews.titolo,
        contenuto: this.nuovaNews.contenuto,
        data: new Date(),
        autore: this.nuovaNews.autore
      };

      this.service.createNews(newNews).subscribe({
        next: (savedNews) => {
          this.news.unshift(savedNews); // aggiungi solo dopo conferma dal backend
          this.resetForm();
          this.showCreateForm = false;
          alert('News creata con successo');
        },
        error: () => {
          alert('Errore nel salvataggio della news');
        }
      });
    }
  }

  eliminaNews(id: number): void {
    if (confirm('Sei sicuro di voler eliminare questa news?')) {
      this.news = this.news.filter(n => n.id !== id);

      this.service.deleteNews(id).subscribe({
        next: () => {
          this.news = this.news.filter(n => n.id !== id);
        },
        error: (err) => {
          alert('Errore durante l\'eliminazione:');
        }
      });


      alert('News eliminata con ID:');
    }
  }

  private resetForm(): void {
    this.nuovaNews = {
      titolo: '',
      contenuto: '',
      autore: ''
    };
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}
