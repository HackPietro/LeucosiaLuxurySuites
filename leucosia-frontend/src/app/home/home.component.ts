import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  constructor() { }

  ngOnInit(): void {
    this.activateLinkOnClick();
  }

  activateLinkOnClick(): void {
    const menuLinks = document.querySelectorAll('nav ul li a');

    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuLinks.forEach(item => item.classList.remove('active'));

        link.classList.add('active');
      });
    });
  }

}
