import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Camera } from "../../Model/Camera";
import { Service } from "../../Service/Service";
import { Prenotazione } from "../../Model/Prenotazione";
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestione_camere',
  templateUrl: './gestione_camere.component.html',
  styleUrls: ['./gestione_camere.component.css']
})
export class Gestione_camereComponent implements OnInit {
  gestioneForm!: FormGroup;
  camere: Camera[] = [];
  prezziGiornalieri: { data: string, prezzo: number }[] = [];
  numeroNotti: number = 0;
  tipoOperazione: 'prezzo' | 'occupazione' = 'prezzo';
  popupMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private service: Service,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeForms();

    this.service.getCamere().subscribe({
      next: camere => {
        this.camere = camere;
        this.setupDateChangeListeners();
      },
      error: err => {
        this.popupMessage = 'Errore nel caricamento delle camere';
      }
    });

    this.setupFormChangeListener();
  }

  private initializeForms() {
    this.gestioneForm = this.fb.group({
      camera: ['', Validators.required],
      dataInizio: ['', [Validators.required, this.validatoreData]],
      dataFine: ['', [Validators.required, this.validatoreData]],
      tipoOperazione: ['prezzo', Validators.required],
      nuovoPrezzo: [0, [Validators.min(0)]],
    });

    const oggi = new Date().toISOString().split('T')[0];
    this.gestioneForm.get('dataInizio')?.setValue(oggi);

    // Setup validator dinamico per dataFine
    this.gestioneForm.get('dataFine')?.setValidators([
      Validators.required,
      this.validatoreData,
      this.validatoreDataFineDopoInizio.bind(this)
    ]);
  }

  dateValide(): boolean {
    const dataInizio = this.gestioneForm.get('dataInizio')?.value;
    const dataFine = this.gestioneForm.get('dataFine')?.value;
    const dataInizioValida = !!this.gestioneForm.get('dataInizio')?.valid;
    const dataFineValida = !!this.gestioneForm.get('dataFine')?.valid;

    return !!dataInizio && !!dataFine && dataInizioValida && dataFineValida;
  }


  private setupDateChangeListeners() {
    this.gestioneForm.get('dataInizio')?.valueChanges.subscribe(() => this.onDateChange());
    this.gestioneForm.get('dataFine')?.valueChanges.subscribe(() => this.onDateChange());
  }

  private setupFormChangeListener() {
    this.gestioneForm.valueChanges.subscribe(() => {
      const camera = this.gestioneForm.get('camera')?.value;
      const dataInizio = this.gestioneForm.get('dataInizio')?.value;
      const dataFine = this.gestioneForm.get('dataFine')?.value;
      const tipoOp = this.gestioneForm.get('tipoOperazione')?.value;

      this.tipoOperazione = tipoOp;

      if (camera && dataInizio && dataFine &&
        this.gestioneForm.get('dataInizio')?.valid &&
        this.gestioneForm.get('dataFine')?.valid) {
        this.caricaPrezziPeriodo();
      }
    });
  }

  onDateChange() {
    const dataInizio = this.gestioneForm.get('dataInizio')?.value;
    const dataFine = this.gestioneForm.get('dataFine')?.value;

    if (
      dataInizio && dataFine &&
      this.gestioneForm.get('dataInizio')?.valid &&
      this.gestioneForm.get('dataFine')?.valid
    ) {
      this.filtraCamereDisponibili(dataInizio, dataFine);
    } else {
      this.camere = [];
      this.gestioneForm.get('camera')?.setValue(null);
      this.prezziGiornalieri = [];
      this.numeroNotti = 0;
    }
  }

  caricaPrezziPeriodo() {
    const dataInizio = new Date(this.gestioneForm.get('dataInizio')?.value);
    const dataFine = new Date(this.gestioneForm.get('dataFine')?.value);
    const cameraId = this.gestioneForm.get('camera')?.value;

    if (!cameraId || isNaN(dataInizio.getTime()) || isNaN(dataFine.getTime()) || dataFine <= dataInizio) {
      this.numeroNotti = 0;
      this.prezziGiornalieri = [];
      return;
    }

    const startStr = dataInizio.toISOString().split('T')[0];
    const endStr = dataFine.toISOString().split('T')[0];

    this.service.getPrezziCamera(cameraId, startStr, endStr).subscribe(prezzi => {
      const dateMap = new Map(prezzi.map(p => [p.data, p.prezzo]));

      let current = new Date(dataInizio);
      const end = new Date(dataFine);
      let notti = 0;
      this.prezziGiornalieri = [];

      // Se tipoOperazione è occupazione, consideriamo la dataFine esclusa
      // se è prezzo, la consideriamo inclusa
      const isOccupazione = this.tipoOperazione === 'occupazione';

      while (true) {
        // Condizione di uscita:
        if (isOccupazione) {
          if (current >= end) break; // dataFine esclusa
        } else {
          if (current > end) break; // dataFine inclusa
        }

        const key = current.toISOString().split('T')[0];
        let prezzoGiornaliero = dateMap.get(key);

        if (prezzoGiornaliero === undefined) {
          const camera = this.camere.find(c => c.id === Number(cameraId));
          prezzoGiornaliero = camera?.prezzoBase ?? 0;
        }

        this.prezziGiornalieri.push({ data: key, prezzo: prezzoGiornaliero });
        notti++;

        current.setDate(current.getDate() + 1);
      }

      this.numeroNotti = notti;
    });
  }

  getCameraSelezionata(): Camera | undefined {
    const cameraIdStr = this.gestioneForm.get('camera')?.value;
    const cameraId = Number(cameraIdStr);
    return this.camere.find(camera => camera.id === cameraId);
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

  private validatoreDataFineDopoInizio(controllo: AbstractControl): {[chiave: string]: any} | null {
    if (controllo.value && this.gestioneForm) {
      const dataInizio = new Date(this.gestioneForm.get('dataInizio')?.value);
      const dataFine = new Date(controllo.value);

      if (dataFine <= dataInizio) {
        return {'dataFinePrimaInizio': true};
      }
    }
    return null;
  }

  controlloCampoInvalido(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  errori(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (!field || !field.errors) return '';

    const errors = field.errors;

    if (errors['required']) return 'Questo campo è obbligatorio';
    if (errors['min']) return 'Il valore deve essere maggiore di 0';

    switch (fieldName) {
      case 'dataInizio':
      case 'dataFine':
        if (errors['dataPassata']) return 'La data non può essere nel passato';
        if (errors['dataFinePrimaInizio']) return 'La data fine deve essere dopo la data inizio';
        break;
    }

    return 'Campo non valido';
  }

  onSubmit() {
    if (this.gestioneForm.invalid) {
      this.segnaFormGroupToccato(this.gestioneForm);
      return;
    }

    const formVal = this.gestioneForm.value;

    if (this.tipoOperazione === 'prezzo') {
      this.aggiornaPrezzo(formVal);
    } else {
      this.creaOccupazione(formVal);
    }
  }

  private aggiornaPrezzo(formVal: any) {
    const camera = this.getCameraSelezionata();
    if (!camera || camera.id === undefined) {
      this.popupMessage = 'Seleziona una camera valida.';
      return;
    }

    const dataInizio = new Date(formVal.dataInizio);
    const dataFine = new Date(formVal.dataFine);
    const nuovoPrezzo = formVal.nuovoPrezzo;

    this.service.addPrezzoCamera(camera.id, nuovoPrezzo, dataInizio.toISOString(), dataFine.toISOString())
      .subscribe({
        next: (message: string) => {
          this.popupMessage = message;
        },
        error: (err) => {
          this.popupMessage = err.error;
        }
      });
  }

  private creaOccupazione(formVal: any) {
    const utenteJson = localStorage.getItem('utente');
    if (!utenteJson) {
      this.popupMessage = 'Utente non trovato. Effettua il login.';
      this.router.navigate(['/login']);
      return;
    }

    const utente = JSON.parse(utenteJson);
    const camera = this.getCameraSelezionata();
    if (!camera || camera.id === undefined) {
      this.popupMessage = 'Seleziona una camera valida.';
      return;
    }

    const totaleBase = this.prezziGiornalieri.reduce((acc, giorno) => acc + giorno.prezzo, 0);
    const totaleConSovrapprezzo = totaleBase * 1.1; // +10%

    // Crea una prenotazione fittizia per occupare la camera
    const prenotazioneFittizia: Prenotazione = {
      utenteId: utente.id,
      dataCheckIn: new Date(formVal.dataInizio),
      dataCheckOut: new Date(formVal.dataFine),
      cameraId: camera.id,
      totale: Number(totaleConSovrapprezzo.toFixed(2)),
    };

    this.service.createPrenotazione(prenotazioneFittizia).subscribe({
      next: (message) => {
        this.popupMessage = `Camera ${camera.nome} occupata dal ${formVal.dataInizio} al ${formVal.dataFine}!`;
        this.gestioneForm.reset();
        this.initializeForms();
      },
      error: (err) => {
        this.popupMessage = err.error;
      }
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

  getTotalePrezzi(): number {
    const totale = this.prezziGiornalieri.reduce((acc, giorno) => acc + giorno.prezzo, 0);
    return totale;
  }

  filtraCamereDisponibili(dataInizio: string, dataFine: string) {
    this.service.getCamereDisponibili(dataInizio, dataFine).subscribe({
      next: (camereDisponibili) => {
        this.camere = camereDisponibili;
        this.gestioneForm.get('camera')?.setValue(null);
        this.caricaPrezziPeriodo();
      },
      error: (err) => {
        this.popupMessage = 'Errore nel caricamento delle camere disponibili';
        this.camere = [];
        this.gestioneForm.get('camera')?.setValue(null);
      }
    });
  }


  chiudiPopup() {
    this.popupMessage = '';
    this.router.navigate(['/home']);
  }

}
