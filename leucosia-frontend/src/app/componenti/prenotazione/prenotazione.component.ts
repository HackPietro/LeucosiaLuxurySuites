import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {Camera} from "../../Model/Camera";
import {Service} from "../../Service/Service";
import {Prenotazione} from "../../Model/Prenotazione";
import { Router } from '@angular/router';
import { AuthService } from '../../Service/AuthService';

@Component({
  selector: 'app-prenotazione',
  templateUrl: './prenotazione.component.html',
  styleUrls: ['./prenotazione.component.css']
})
export class PrenotazioneComponent implements OnInit {
  prenotazioneForm!: FormGroup;

  camere: Camera[] = [];

  prezziGiornalieri: { data: string, prezzo: number }[] = [];

  prezzoTotale: number = 0;
  prezzoBase: number = 0;
  sovrapprezzoSpese: number = 0;
  numeroNotti: number = 0;

  constructor(private fb: FormBuilder, private service: Service, private authService: AuthService,
              private router: Router) {}

  ngOnInit() {
    this.initializeForms();

    this.service.getCamere().subscribe({
      next: camere => {
        this.camere = camere; // Corretto: non lasciarlo vuoto
        this.setupDateChangeListeners();
      },
      error: err => {
        console.error('Errore caricamento camere', err);
      }
    });

    this.setupFormChangeListener();
  }

  private setupDateChangeListeners() {
    this.prenotazioneForm.get('checkIn')?.valueChanges.subscribe(() => this.onDateChange());
    this.prenotazioneForm.get('checkOut')?.valueChanges.subscribe(() => this.onDateChange());
  }

  private setupFormChangeListener() {
    this.prenotazioneForm.valueChanges.subscribe(() => {
      const camera = this.prenotazioneForm.get('camera')?.value;
      const checkIn = this.prenotazioneForm.get('checkIn')?.value;
      const checkOut = this.prenotazioneForm.get('checkOut')?.value;

      if (
        camera &&
        checkIn &&
        checkOut &&
        this.prenotazioneForm.get('checkIn')?.valid &&
        this.prenotazioneForm.get('checkOut')?.valid
      ) {
        this.calcolaPrezzoTotale();

        alert(
          `Camera: ${this.getCameraSelezionata()?.nome || 'N/A'}\n` +
          `Prezzo base: €${this.prezzoBase}\n` +
          `Sovrapprezzo spese: €${this.sovrapprezzoSpese}\n` +
          `Prezzo totale: €${this.prezzoTotale}\n` +
          `Notti: ${this.numeroNotti}`
        );
      }
    });
  }

  private initializeForms() {
    // Form principale prenotazione
    this.prenotazioneForm = this.fb.group({
      email: [''],
      telefono: [''],
      camera: ['', Validators.required],
      checkIn: ['', [Validators.required, this.validatoreData]],
      checkOut: ['', [Validators.required, this.validatoreData]],
      richieste: [''],
      metodoPagamento: ['contanti']
    });

    // Imposta data minima per check-in (oggi)
    const oggi = new Date().toISOString().split('T')[0];
    const checkInControllo = this.prenotazioneForm.get('checkIn');
    if (checkInControllo) {
      checkInControllo.setValue(oggi);
    }
  }

  filtraCamereDisponibili(checkIn: string, checkOut: string) {
    this.service.getCamereDisponibili(checkIn, checkOut).subscribe({
      next: (camereDisponibili) => {
        this.camere = camereDisponibili;

        // Se vuoi, imposta la prima camera disponibile di default
        if (this.camere.length > 0) {
          this.prenotazioneForm.get('camera')?.setValue(this.camere[0].id);
        } else {
          this.prenotazioneForm.get('camera')?.setValue(null);
        }

        this.calcolaPrezzoTotale();
      },
      error: (err) => {
        console.error('Errore caricamento camere disponibili', err);
        this.camere = [];
        this.prenotazioneForm.get('camera')?.setValue(null);
      }
    });
  }


  onDateChange() {
    const checkIn = this.prenotazioneForm.get('checkIn')?.value;
    const checkOut = this.prenotazioneForm.get('checkOut')?.value;

    if (
      checkIn && checkOut &&
      this.prenotazioneForm.get('checkIn')?.valid &&
      this.prenotazioneForm.get('checkOut')?.valid
    ) {
      this.filtraCamereDisponibili(checkIn, checkOut);
    } else {
      // Se date non valide resetta camere e selezione
      this.camere = [];
      this.prenotazioneForm.get('camera')?.setValue(null);
    }
  }

  private validatoreData(controllo: AbstractControl): {[chiave: string]: any} | null {
    if (controllo.value) {
      const selezioneData = new Date(controllo.value);
      const oggi = new Date();
      oggi.setHours(0, 0, 0, 0);

      if (selezioneData < oggi) {
        return { 'dataPassata': true };
      }
    }
    return null;
  }

  private validatoreCheckOutDopoCheckIn(controllo: AbstractControl): {[chiave: string]: any} | null {
    if (controllo.value && this.prenotazioneForm) {
      const dataCheckIn = new Date(this.prenotazioneForm.get('checkIn')?.value);
      const dataCheckOut = new Date(controllo.value);

      if (dataCheckOut <= dataCheckIn) {
        return {'checkOutPrimaCheckIn': true};
      }
    }
    return null;
  }

  // Metodi per gestione eventi del form
  gestioneCheckInCheckOut() {
    const dataCheckIn = new Date(this.prenotazioneForm.get('checkIn')?.value);
    const prossimoGiorno = new Date(dataCheckIn);
    prossimoGiorno.setDate(prossimoGiorno.getDate() + 1);

    // Imposta la data minima per check-out
    const controlloCheckOut = this.prenotazioneForm.get('checkOut');
    if (controlloCheckOut && !controlloCheckOut.value) {
      controlloCheckOut.setValue(prossimoGiorno.toISOString().split('T')[0]);
    }

    this.calcolaPrezzoTotale();
  }
  calcolaPrezzoTotale() {
    const checkIn = new Date(this.prenotazioneForm.get('checkIn')?.value);
    const checkOut = new Date(this.prenotazioneForm.get('checkOut')?.value);
    const cameraId = this.prenotazioneForm.get('camera')?.value;

    if (!cameraId || isNaN(checkIn.getTime()) || isNaN(checkOut.getTime()) || checkOut <= checkIn) {
      this.prezzoTotale = 0;
      this.prezzoBase = 0;
      this.sovrapprezzoSpese = 0;
      this.numeroNotti = 0;
      this.prezziGiornalieri = [];
      return;
    }

    const startStr = checkIn.toISOString().split('T')[0];
    const endStr = checkOut.toISOString().split('T')[0];

    this.service.getPrezziCamera(cameraId, startStr, endStr).subscribe(prezzi => {
      const dateMap = new Map(prezzi.map(p => [p.data, p.prezzo]));

      let totale = 0;
      let current = new Date(checkIn);
      const end = new Date(checkOut);
      let notti = 0;
      this.prezziGiornalieri = [];

      while (current < end) {
        const key = current.toISOString().split('T')[0];
        let prezzoGiornaliero = dateMap.get(key);

        if (prezzoGiornaliero === undefined) {
          const camera = this.camere.find(c => c.id === Number(cameraId));
          prezzoGiornaliero = camera?.prezzoBase ?? 0; // fallback
        }

        totale += prezzoGiornaliero;
        this.prezziGiornalieri.push({ data: key, prezzo: prezzoGiornaliero });

        current.setDate(current.getDate() + 1);
        notti++;
      }

      this.numeroNotti = notti;
      this.prezzoBase = totale;
      this.sovrapprezzoSpese = totale * 0.10;
      this.prezzoTotale = totale + this.sovrapprezzoSpese;
    });
  }
  getCameraSelezionata(): Camera | undefined {
    const cameraIdStr = this.prenotazioneForm.get('camera')?.value;
    const cameraId = Number(cameraIdStr);
    return this.camere.find(camera => camera.id === cameraId);
  }

  controlloCampoInvalido(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  errori(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (!field || !field.errors) return '';

    const errors = field.errors;

    // Errori comuni
    if (errors['required']) return 'Questo campo è obbligatorio';

    // Errori specifici per campo
    switch (fieldName) {
      case 'checkIn':
      case 'checkOut':
        if (errors['dataPassata']) return 'La data non può essere nel passato';
        if (errors['checkOutPrimaCheckIn']) return 'Il check-out deve essere dopo il check-in';
        break;
    }

    return 'Campo non valido';
  }

  // Invio form
  onSubmit() {
    if (this.prenotazioneForm.invalid) {
      this.segnaFormGroupToccato(this.prenotazioneForm);
      return;
    }

    this.authService.validateToken().subscribe(isValid => {
      if (!isValid) {
        alert('Devi effettuare il login per prenotare.');
        this.router.navigate(['/login']);
        return;
      }

      const utenteJson = localStorage.getItem('utente');
      if (!utenteJson) {
        alert('Utente non trovato. Effettua il login.');
        this.router.navigate(['/login']);
        return;
      }

      const utente = JSON.parse(utenteJson);
      const camera = this.getCameraSelezionata();
      if (!camera || camera.id === undefined) {
        alert('Seleziona una camera valida.');
        return;
      }

      const formVal = this.prenotazioneForm.value;
      const prenotazione: Prenotazione = {
        utenteId: utente.id,
        dataCheckIn: new Date(formVal.checkIn),
        dataCheckOut: new Date(formVal.checkOut),
        cameraId: camera.id,
        totale: this.prezzoTotale
      };

      this.service.createPrenotazione(prenotazione).subscribe({
        next: () => {
          alert('Prenotazione inserita con successo!');
          this.prenotazioneForm.reset();
        },
        error: (err) => {
          console.error('Errore inserimento prenotazione', err);
          alert('Si è verificato un errore durante l\'invio della prenotazione.');
        }
      });
    });
  }

  private segnaFormGroupToccato(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.segnaFormGroupToccato(control);
      }
    });
  }
}
