import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componenti/home/home.component';
import {ProfiloComponent} from "./componenti/profilo/profilo.component";
import {LoginComponent} from "./componenti/login/login.component";
import {RegistrationComponent} from "./componenti/registration/registration.component";
import {NewsComponent} from "./componenti/news/news.component";
import {Gestione_messaggiComponent} from "./componenti/gestione_messaggi/gestione_messaggi.component";
import {Richiedi_interventoComponent} from "./componenti/richiedi_intervento/richiedi_intervento.component";


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
    ],
  },
  { path: 'richiedi_intervento', component: Richiedi_interventoComponent },
  { path: 'gestione_messaggi', component: Gestione_messaggiComponent },
  { path: 'news', component: NewsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'profilo', component: ProfiloComponent },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
