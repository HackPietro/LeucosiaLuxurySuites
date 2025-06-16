
export interface Prenotazione {
  id?: number;
  utenteId: number;
  dataCheckIn: Date;
  dataCheckOut: Date;
  cameraId: number;
  totale: number;
}
