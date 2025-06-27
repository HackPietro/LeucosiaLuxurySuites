import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule, provideHttpClient, withFetch} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';

import { AppComponent } from './app.component';
import {HomeComponent} from "./componenti/home/home.component";
import {ProfiloComponent} from "./componenti/profilo/profilo.component";
import {LoginComponent} from "./componenti/login/login.component";
import {RegistrationComponent} from "./componenti/registration/registration.component";

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NewsComponent} from "./componenti/news/news.component";
import {Richiedi_interventoComponent} from "./componenti/richiedi_intervento/richiedi_intervento.component";
import {Gestione_messaggiComponent} from "./componenti/gestione_messaggi/gestione_messaggi.component";
import {PrenotazioneComponent} from "./componenti/prenotazione/prenotazione.component";
import {FooterComponent} from "./componenti/footer/footer.component";
import {Gestione_prenotazioniComponent} from "./componenti/gestione_prenotazioni/gestione_prenotazioni.component";
import {Gestione_camereComponent} from "./componenti/gestione_camere/gestione_camere.component";
import {RecensioneComponent} from "./componenti/recensione/recensione.component";
import {Recupera_passwordComponent} from "./componenti/recupera_password/recupera_password.component";


registerLocaleData(localeIt);
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfiloComponent,
    LoginComponent,
    RegistrationComponent,
    NewsComponent,
    Richiedi_interventoComponent,
    Gestione_messaggiComponent,
    PrenotazioneComponent,
    FooterComponent,
    Gestione_prenotazioniComponent,
    Gestione_camereComponent,
    RecensioneComponent,
    Recupera_passwordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    FormsModule,
    ReactiveFormsModule,

    // Angular Material Modules
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatInputModule,
    MatMenuModule,
    MatGridListModule,
    MatSelectModule,
    MatDialogModule,
    FontAwesomeModule,

  ],
  providers: [provideHttpClient(withFetch()), { provide: LOCALE_ID, useValue: 'it-IT' }],
  bootstrap: [AppComponent]
})
export class AppModule { }

