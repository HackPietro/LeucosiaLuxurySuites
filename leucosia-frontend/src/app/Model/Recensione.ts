export interface Recensione {
  id?: number;
  utenteId: number;
  stelle: number; // da 1 a 5
  commento: string;
}
