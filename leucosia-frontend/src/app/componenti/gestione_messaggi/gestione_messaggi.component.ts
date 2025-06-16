import { Component, OnInit } from '@angular/core';
import { Service } from '../../Service/Service';
import { Messaggio } from '../../Model/Messaggio';

@Component({
  selector: 'app-news',
  templateUrl: './gestione_messaggi.component.html',
  styleUrls: ['./gestione_messaggi.component.css']
})
export class Gestione_messaggiComponent implements OnInit {

  messaggi: Messaggio[] = [];
  errorMessage: string = '';

  constructor(private service: Service) { }

  ngOnInit(): void {
    this.loadMessaggi();
  }
  loadMessaggi(): void {
    this.errorMessage = '';
    this.service.getMessaggi().subscribe({
      next: (data) => {
        this.messaggi = data;
      },
      error: (err) => {
        this.errorMessage = 'Errore nel caricamento dei messaggi.';
      }
    });
  }

  eliminaMessaggio(id: number): void {
    if (confirm('Sei sicuro di voler eliminare questo messaggio?')) {
      this.service.deleteMessaggio(id).subscribe({
        next: () => {
          this.messaggi = this.messaggi.filter(m => m.id !== id);
        },
        error: () => {
          this.errorMessage = 'Errore durante l\'eliminazione del messaggio.';
        }
      });
    }
  }


}
