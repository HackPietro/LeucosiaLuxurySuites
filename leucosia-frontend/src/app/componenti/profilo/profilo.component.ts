import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {Service} from "../../Service/Service";
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
  emailValue: string = '';
  passwordValue: string = '';
  tipologiaValue: string = '';

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
    if (!this.authService.validateToken()) {
      this.router.navigate(['/login']);
      return;
    }

    const utenteStr = localStorage.getItem("utente");
    if (utenteStr){
      const utente = JSON.parse(utenteStr);
      this.nomeValue = utente.nome || '';
      this.cognomeValue = utente.cognome || '';
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
    /*
    this.service.updateUtente(this.emailValue, {
      nome: this.nomeValue,
      cognome: this.cognomeValue,
      email: this.emailValue,
      password: this.passwordValue,
      tipologia: this.tipologiaValue,
    }).subscribe({
      next: () => {
        this.setCookie("nome", this.nomeValue);
        this.setCookie("cognome", this.cognomeValue);
        this.setCookie("email", this.emailValue);
        this.setCookie("password", this.passwordValue);
        this.setCookie("tipologia", this.tipologiaValue);
      },
      complete: () => {
        this.isEditing = !this.isEditing;
      }
    });
    */
  }

}

