import {Component, HostListener, OnInit} from '@angular/core';
import { AuthService } from '../../Service/AuthService';
import { Service } from '../../Service/Service';
import { ActivatedRoute, Router } from '@angular/router';
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
  camere: any[] = [];
  ordine: { [key: number]: number } = { 2: 0, 3: 1, 4: 2 };

  currentSection: string = 'home';

  popupMessage: string = '';

  loadingCamere = false;
  loadingRecensioni = false;
  loadingSubmit = false;

  nomeUtente = '';


  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService, private service: Service) {}

  ngOnInit(): void {
    this.route.fragment.subscribe(fragment => {
      if (fragment !== null) {
        const element = document.getElementById(fragment);
        if (element) {
          setTimeout(() => element.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        }
      }
    });
    const utente = localStorage.getItem('utente');
    this.nomeUtente = utente ? JSON.parse(utente).nome : '';
    this.showMenu = !!utente;

    this.loadingCamere = true;
    this.service.getCamere().subscribe({
      next: (data) => {
        this.camere = data.sort((a, b) => this.ordine[a.postiLetto] - this.ordine[b.postiLetto]);
        this.loadingCamere = false;
      },
      error: () => {
        this.popupMessage = 'Errore nel caricamento delle camere';
        this.loadingCamere = false;
      }
    });

    this.loadingRecensioni = true;

    this.service.getRecensioni().subscribe({
      next: (data) => {
        const recensioniConUtente = data.map((recensione: any) => {
          return this.service.getUtenteById(recensione.utenteId).pipe(
            map((utente: any) => ({
              ...recensione,
              nome: utente.nome,
              cognome: utente.cognome
            }))
          );
        });

        forkJoin(recensioniConUtente).subscribe({
          next: (result) => {
            this.recensioni = result;
            this.loadingRecensioni = false;
          },
          error: () => {
            this.popupMessage = 'Errore durante il recupero delle recensioni';
            this.loadingRecensioni = false;
          }
        });
      },
      error: () => {
        this.popupMessage = 'Errore nel caricamento delle recensioni';
        this.loadingRecensioni = false;
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const sections = ['home', 'servizi', 'camere', 'recensioni', 'contatti'];
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) {
        const top = el.offsetTop - 120; // margin di sicurezza
        const bottom = top + el.offsetHeight;
        const scroll = window.scrollY;
        if (scroll >= top && scroll < bottom) {
          this.currentSection = id;
          break;
        }
      }
    }
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
    this.loadingSubmit = true;

    this.service.addRecensione(stelle, commento, utenteId).subscribe({
      next: (message) => {
        this.popupMessage = message;
        this.loadingSubmit = false;
        this.closeRecensionePopup();
        this.ngOnInit()
      },
      error: (err) => {
        this.popupMessage = err.error;
        this.loadingSubmit = false;
      }
    });
  }

  chiudiPopup(): void {
    this.popupMessage = '';
  }
}
