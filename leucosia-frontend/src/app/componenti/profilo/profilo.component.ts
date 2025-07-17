import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";
import { AuthService } from '../../Service/AuthService';
import { Router } from '@angular/router';



@Component({
  selector: 'app-profilo',
  templateUrl: './profilo.component.html',
  styleUrl: './profilo.component.css'
})
export class ProfiloComponent implements OnInit{
  isEditing: boolean = false;
  showPassword: boolean = false;
  utente: any = localStorage.getItem("email");

  nomeValue: string = '';
  cognomeValue: string = '';
  telefonoValue: string = '';
  emailValue: string = '';
  passwordValue: string = '';
  tipologiaValue: string = '';

  loading = false;
  smallDevice: boolean = false;


  constructor(
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) {
    this.breakpointObserver.observe(["(max-width: 600px)"]).subscribe((result: BreakpointState) => {
      this.smallDevice = result.matches;
    });
  }

  ngOnInit(): void {

    const utenteStr = localStorage.getItem("utente");
    if (utenteStr){
      const utente = JSON.parse(utenteStr);
      this.nomeValue = utente.nome || '';
      this.cognomeValue = utente.cognome || '';
      this.telefonoValue = utente.telefono || '';
      this.emailValue = utente.email || '';
      this.tipologiaValue = utente.tipologia || '';
    }
  }


  toggleEditing(): void {
    this.isEditing = !this.isEditing;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  sendToServer(): void {
    this.loading = true;

    // Controllo se la password è stata modificata
    const passwordModificata = this.passwordValue && this.passwordValue.trim() !== '';

    // Costruzione oggetto aggiornamento
    const updatedData: any = {
      nome: this.nomeValue,
      cognome: this.cognomeValue,
      telefono: this.telefonoValue,
      email: this.emailValue,
      tipologia: this.tipologiaValue,
    };

    if (passwordModificata) {
      updatedData.password = this.passwordValue;
    }

    this.authService.updateUtente(this.emailValue, updatedData).subscribe({
      next: () => {
        this.loading = false;

        if (passwordModificata) {
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.isEditing = false; // Esce dalla modalità modifica
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Errore durante aggiornamento utente:', err);
      }
    });
  }

}

