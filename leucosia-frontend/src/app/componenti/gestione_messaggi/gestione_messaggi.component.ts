import { Component, OnInit } from '@angular/core';
import { Service } from '../../Service/Service';
import { Messaggio } from '../../Model/Messaggio';

@Component({
  selector: 'app-gestione_messaggi',
  templateUrl: './gestione_messaggi.component.html',
  styleUrls: ['./gestione_messaggi.component.css']
})
export class Gestione_messaggiComponent implements OnInit {

  messaggi: Messaggio[] = [];
  popupMessage: string = '';
  loading = false;

  constructor(private service: Service) { }

  ngOnInit(): void {
    this.loadMessaggi();
  }

  loadMessaggi(): void {
    this.loading = true;

    this.service.getMessaggi().subscribe({
      next: (data) => {
        this.messaggi = data.sort((a, b) =>
          new Date(b.data).getTime() - new Date(a.data).getTime()
        );
        this.loading = false;
      },
      error: (err) => {
        this.popupMessage = 'Errore nel recupero dei messaggi';
        this.loading = false;
      }
    });
  }

  eliminaMessaggio(id: number): void {
    this.loading = true;

    this.service.deleteMessaggio(id).subscribe({
      next: (message: string) => {
        this.messaggi = this.messaggi.filter(m => m.id !== id);
        this.popupMessage = message;
        this.loading = false;
      },
      error: (err) => {
        this.popupMessage = err.error;
        this.loading = false;
      }
    });
  }

  chiudiPopup(): void {
    this.popupMessage = '';
  }

}
