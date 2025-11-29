export interface Pago {
  id?: string;
  socioDni: string;
  monto: number;
  fecha: string;
  mes: string; // Formato: "2024-01" (año-mes)
  concepto?: string;
  metodoPago?: 'efectivo' | 'transferencia' | 'tarjeta';
  createdAt?: string;
}

export interface CreatePagoDto {
  socioDni: string;
  monto: number;
  fecha?: string;
  mes: string; // Formato: "2024-01"
  concepto?: string;
  metodoPago?: 'efectivo' | 'transferencia' | 'tarjeta';
}

