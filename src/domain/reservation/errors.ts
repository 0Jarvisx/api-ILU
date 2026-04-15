export class RoomNotAvailableError extends Error {
  readonly statusCode = 409;
  constructor(message = 'La habitación no está disponible para las fechas seleccionadas') {
    super(message);
    this.name = 'RoomNotAvailableError';
  }
}

export class ReservationNotFoundError extends Error {
  readonly statusCode = 404;
  constructor(id: number) {
    super(`Reservación no encontrada: ${id}`);
    this.name = 'ReservationNotFoundError';
  }
}

export class RoomNotFoundError extends Error {
  readonly statusCode = 404;
  constructor(id: number) {
    super(`Habitación no encontrada: ${id}`);
    this.name = 'RoomNotFoundError';
  }
}
