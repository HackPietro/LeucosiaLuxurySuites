import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Service/AuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  showMenu: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.validateToken().subscribe(isAuth => {
      this.showMenu = isAuth;
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
}
