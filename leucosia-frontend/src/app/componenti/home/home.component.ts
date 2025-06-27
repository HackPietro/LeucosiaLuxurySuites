import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Service/AuthService';
import { Service } from '../../Service/Service';
import { Router } from '@angular/router';
import {Recensione} from "../../Model/Recensione";
import {forkJoin, map} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  showMenu: boolean = false;
  showRecensionePopup: boolean = false;

  recensioni: any[] = [];

  constructor(private router: Router, private authService: AuthService, private service: Service) {}

  ngOnInit(): void {
    this.authService.validateToken().subscribe(isAuth => {
      this.showMenu = isAuth;
    });

    this.service.getRecensioni().subscribe({
      next: (data) => {
        const recensioniConUtente = data.map((recensione: any) => {
          return this.service.getUtenteById(recensione.utenteId).pipe(
            // Combinare i dati utente con la recensione
            map((utente: any) => ({
              ...recensione,
              nome: utente.nome,
              cognome: utente.cognome
            }))
          );
        });

        // Attendere che tutte le richieste siano completate
        forkJoin(recensioniConUtente).subscribe({
          next: (result) => {
            this.recensioni = result;
          },
          error: () => {
            console.error("Errore nel recupero delle recensioni o degli utenti");
          }
        });
      },
      error: () => {
        console.error("Errore durante il recupero delle recensioni");
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.showMenu = false;
    this.router.navigate(['/']);
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

  openRecensionePopup(): void {
    this.showRecensionePopup = true;
  }

  closeRecensionePopup(): void {
    this.showRecensionePopup = false;
  }

  onSubmitReview(event: { stelle: number, commento: string, utenteId: number}): void {
    const { stelle, commento, utenteId } = event;
    this.service.addRecensione(stelle, commento, utenteId).subscribe({
      next: () => {
        alert('Grazie per la tua recensione!');
      },
      error: (err) => {
        alert('Si è verificato un errore. Riprova più tardi.');
      }
    });
  }
}
