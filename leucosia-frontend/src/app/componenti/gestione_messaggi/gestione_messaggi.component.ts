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


  constructor(private service: Service) { }

  ngOnInit(): void {
    this.loadMessaggi();
  }

  loadMessaggi(): void {
    this.service.getMessaggi().subscribe({
      next: (data) => {
        this.messaggi = data.sort((a, b) =>
          new Date(b.data).getTime() - new Date(a.data).getTime()
        );
      },
      error: (err) => {
        this.popupMessage = 'Errore nel recupero dei messaggi';
      }
    });
  }

  eliminaMessaggio(id: number): void {
    this.service.deleteMessaggio(id).subscribe({
      next: (message: string) => {
        this.messaggi = this.messaggi.filter(m => m.id !== id);
        this.popupMessage = message;
      },
      error: (err) => {
        this.popupMessage = err.error;
      }
    });
  }

  chiudiPopup(): void {
    this.popupMessage = '';
  }

}
