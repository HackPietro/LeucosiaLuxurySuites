import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-recensione',
  templateUrl: './recensione.component.html',
  styleUrls: ['./recensione.component.css']
})
export class RecensioneComponent {
  @Input() isVisible: boolean = false;
  @Output() closePopup = new EventEmitter<void>();
  @Output() submitReview = new EventEmitter<{stelle: number, commento: string, utenteId: number}>();

  stelle: number = 0;
  commento: string = '';


  setStelle(stelle: number): void {
    this.stelle = stelle;
  }

  onSubmit(): void {
    const utente = JSON.parse(localStorage.getItem('utente') || 'null');
    const utenteId = utente.id;

    if (this.stelle > 0 && utenteId) {
      this.submitReview.emit({
        stelle: this.stelle,
        commento: this.commento,
        utenteId: utenteId

      });
      this.resetForm();
      this.closePopup.emit();
    }
  }

  onClose(): void {
    this.resetForm();
    this.closePopup.emit();
  }

  private resetForm(): void {
    this.stelle = 0;
    this.commento = '';
  }
}
