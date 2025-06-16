import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {Camera} from "../../Model/Camera";
import {Service} from "../../Service/Service";
import {Prenotazione} from "../../Model/Prenotazione";

@Component({
  selector: 'app-prenotazione',
  templateUrl: './prenotazione.component.html',
  styleUrls: ['./prenotazione.component.css']
})
export class PrenotazioneComponent implements OnInit {
  prenotazioneForm!: FormGroup;
  pagamentoForm!: FormGroup;

  camere: Camera[] = [];

  prezziGiornalieri: { data: string, prezzo: number }[] = [];

  metodoPagamento: 'contanti' | 'carta' = 'contanti';
  prezzoTotale: number = 0;
  prezzoBase: number = 0;
  sovrapprezzoContanti: number = 0;
  numeroNotti: number = 0;

  constructor(private fb: FormBuilder, private service: Service) {}

  ngOnInit() {
    this.initializeForms();

    // Carichiamo tutte le camere dal servizio
    this.service.getCamere().subscribe({
      next: camere => {
        // Non assegnare subito a this.camere,
        // aspettiamo che l’utente selezioni date per filtrare
        // (oppure tieni una copia interna se vuoi)

        // Setup subscription per rilevare cambiamenti su checkIn e checkOut
        this.prenotazioneForm.get('checkIn')?.valueChanges.subscribe(() => {
          this.onDateChange();
        });
        this.prenotazioneForm.get('checkOut')?.valueChanges.subscribe(() => {
          this.onDateChange();
        });

        // Se vuoi, inizialmente puoi impostare camere a [] o a tutte
        this.camere = [];
      },
      error: err => {
        console.error('Errore caricamento camere', err);
      }
    });

    // Setup subscription sul form per ricalcolare prezzo solo quando camera e date sono valide
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
          `Sovrapprezzo contanti: €${this.sovrapprezzoContanti}\n` +
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
      richieste: ['']
    });

    // Form pagamento carta
    this.pagamentoForm = this.fb.group({
      titolare: ['', [Validators.required, Validators.minLength(5)]],
      numeroCartaDisplay: ['', [Validators.required, this.validatoreNumeroCarta]],
      numeroCartaReale: [''], // Campo nascosto per il numero reale
      scadenza: ['', [Validators.required, this.validatoreScadenza]],
      cvv: ['', [Validators.required, this.validatoreCvv]]
    });

    // Imposta data minima per check-in (oggi)
    const oggi = new Date().toISOString().split('T')[0];
    const checkInControllo = this.prenotazioneForm.get('checkIn');
    if (checkInControllo) {
      checkInControllo.setValue(oggi);
    }
  }

  // Aggiungi questo metodo nel component
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



  private ricalcolo() {
    this.prenotazioneForm.valueChanges.subscribe(() => {
      this.calcolaPrezzoTotale();
    });

    // Validazione personalizzata per check-out
    this.prenotazioneForm.get('checkOut')?.setValidators([
      Validators.required,
      this.validatoreData,
      this.validatoreCheckOutDopoCheckIn.bind(this)
    ]);
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
        return { 'checkOutPrimaCheckIn': true };
      }
    }
    return null;
  }

  private validatoreNumeroCarta(controllo: AbstractControl): {[chiave: string]: any} | null {
    if (controllo.value) {
      const puliziaNumero = controllo.value.replace(/\s/g, '');
      if (!/^\d{13,19}$/.test(puliziaNumero)) {
        return { 'numeroCartaInvalido': true };
      }

      // Algoritmo di Luhn per validazione carta di credito
      if (!this.luhnCheck(puliziaNumero)) {
        return { 'numeroCartaInvalido': true };
      }
    }
    return null;
  }

  private validatoreScadenza(controllo: AbstractControl): {[chiave: string]: any} | null {
    if (controllo.value) {
      const scadenzaRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!scadenzaRegex.test(controllo.value)) {
        return { 'scadenzaInvalida': true };
      }

      // Verifica che la data non sia nel passato
      const [mese, anno] = controllo.value.split('/');
      const dataScadenza = new Date(2000 + parseInt(anno), parseInt(mese) - 1);
      const dataCorrente = new Date();

      if (dataScadenza < dataCorrente) {
        return { 'cartaScaduta': true };
      }
    }
    return null;
  }

  private validatoreCvv(controllo: AbstractControl): {[chiave: string]: any} | null {
    if (controllo.value && !/^\d{3,4}$/.test(controllo.value)) {
      return { 'cvvInvalido': true };
    }
    return null;
  }

  // Algoritmo di Luhn per validazione numero carta
  private luhnCheck(numeroCarta: string): boolean {
    let somma = 0;
    let pari = false;

    for (let i = numeroCarta.length - 1; i >= 0; i--) {
      let cifra = parseInt(numeroCarta.charAt(i));

      if (pari) {
        cifra *= 2;
        if (cifra > 9) {
          cifra -= 9;
        }
      }

      somma += cifra;
      pari = !pari;
    }

    return somma % 10 === 0;
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

  cambioMetodoPagamento(metodo: 'contanti' | 'carta') {
    this.metodoPagamento = metodo;
    this.calcolaPrezzoTotale();
  }

  // Formattazione input carta
  formattazioneNumeroCarta(event: any) {
    let valore = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    const valoreFormattato = valore.match(/.{1,4}/g)?.join(' ') || valore;

    this.pagamentoForm.get('numeroCartaDisplay')?.setValue(valoreFormattato);
    this.pagamentoForm.get('numeroCartaReale')?.setValue(valore);
  }

  formatoScandenza(event: any) {
    let valore = event.target.value.replace(/\D/g, '');
    if (valore.length >= 2) {
      valore = valore.substring(0, 2) + '/' + valore.substring(2, 4);
    }
    event.target.value = valore;
  }

  // Calcolo prezzo
  calcolaPrezzoTotale() {
    const checkIn = new Date(this.prenotazioneForm.get('checkIn')?.value);
    const checkOut = new Date(this.prenotazioneForm.get('checkOut')?.value);
    const cameraId = this.prenotazioneForm.get('camera')?.value;

    if (!cameraId || isNaN(checkIn.getTime()) || isNaN(checkOut.getTime()) || checkOut <= checkIn) {
      this.prezzoTotale = 0;
      this.prezzoBase = 0;
      this.sovrapprezzoContanti = 0;
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
      this.sovrapprezzoContanti = this.metodoPagamento === 'contanti' ? totale * 0.10 : 0;
      this.prezzoTotale = totale + this.sovrapprezzoContanti;
    });
  }

  // Metodi di utilità
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
      case 'numeroCartaDisplay':
        if (errors['numeroCartaInvalido']) return 'Numero carta non valido';
        break;
      case 'scadenza':
        if (errors['scadenzaInvalida']) return 'Formato MM/YY non valido';
        if (errors['cartaScaduta']) return 'La carta è scaduta';
        break;
      case 'cvv':
        if (errors['cvvInvalido']) return 'CVV non valido (3-4 cifre)';
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

    if (this.metodoPagamento === 'carta' && this.pagamentoForm.invalid) {
      this.segnaFormGroupToccato(this.pagamentoForm);
      return;
    }

    // Prendi utente da localStorage
    const utenteJson = localStorage.getItem('utente');
    if (!utenteJson) {
      alert('Utente non trovato. Effettua il login.');
      return;
    }
    const utente = JSON.parse(utenteJson);

    const camera = this.getCameraSelezionata();
    if (!camera || camera.id === undefined) {
      alert('Seleziona una camera valida.');
      return;
    }

    // Prepara l'oggetto Prenotazione coerente con l'interfaccia
    const formVal = this.prenotazioneForm.value;
    const prenotazione: Prenotazione = {
      utenteId: utente.id,              // usa utenteId, non utente
      dataCheckIn: new Date(formVal.checkIn),
      dataCheckOut: new Date(formVal.checkOut),
      cameraId: camera.id!,              // usa cameraId, non camera
      totale: this.prezzoTotale
    };


    // Invio al backend
    this.service.createPrenotazione(prenotazione).subscribe({
      next: () => {
        alert('Prenotazione inserita con successo!');
        this.prenotazioneForm.reset();
        this.pagamentoForm?.reset();
      },
      error: (err) => {
        console.error('Errore inserimento prenotazione', err);
        alert('Si è verificato un errore durante l\'invio della prenotazione.');
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
}
