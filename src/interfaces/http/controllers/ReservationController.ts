import { Request, Response } from 'express';
import { SearchAvailableRooms } from '@/application/reservation/SearchAvailableRooms';
import { CreateReservation } from '@/application/reservation/CreateReservation';
import { GetReservation } from '@/application/reservation/GetReservation';
import { ListReservations } from '@/application/reservation/ListReservations';
import { CancelReservation } from '@/application/reservation/CancelReservation';
import { IRoomRepository } from '@/domain/room/ports/IRoomRepository';
import { IReservationRepository } from '@/domain/reservation/ports/IReservationRepository';
import { IGuestRepository } from '@/domain/guest/ports/IGuestRepository';
import { IUserRepository } from '@/domain/auth/ports/IUserRepository';
import { RoomNotAvailableError, ReservationNotFoundError, RoomNotFoundError } from '@/domain/reservation/errors';

interface ReservationControllerDeps {
  roomRepository: IRoomRepository;
  reservationRepository: IReservationRepository;
  guestRepository: IGuestRepository;
  userRepository: IUserRepository;
}

export class ReservationController {
  private searchAvailableRoomsUseCase: SearchAvailableRooms;
  private createReservationUseCase: CreateReservation;
  private getReservationUseCase: GetReservation;
  private listReservationsUseCase: ListReservations;
  private cancelReservationUseCase: CancelReservation;
  private userRepository: IUserRepository;

  constructor({ roomRepository, reservationRepository, guestRepository, userRepository }: ReservationControllerDeps) {
    this.searchAvailableRoomsUseCase = new SearchAvailableRooms(roomRepository);
    this.createReservationUseCase = new CreateReservation(roomRepository, reservationRepository, guestRepository);
    this.getReservationUseCase = new GetReservation(reservationRepository);
    this.listReservationsUseCase = new ListReservations(reservationRepository);
    this.cancelReservationUseCase = new CancelReservation(reservationRepository);
    this.userRepository = userRepository;
  }

  async searchAvailableRooms(req: Request, res: Response): Promise<void> {
    try {
      const { checkIn, checkOut, guestCount } = req.query as Record<string, string>;
      if (!checkIn || !checkOut || !guestCount) {
        res.status(400).json({ error: 'checkIn, checkOut y guestCount son requeridos' });
        return;
      }
      const rooms = await this.searchAvailableRoomsUseCase.execute({
        checkIn,
        checkOut,
        guestCount: Number(guestCount),
      });
      res.json(rooms);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async createReservation(req: Request, res: Response): Promise<void> {
    try {
      const { roomId, checkIn, checkOut, guestCount, notes } = req.body;

      if (!roomId || !checkIn || !checkOut || !guestCount) {
        res.status(400).json({ error: 'roomId, checkIn, checkOut y guestCount son requeridos' });
        return;
      }

      let guestFirstName: string;
      let guestLastName: string;
      let guestEmail: string;
      let guestPhone: string | null = null;

      if (req.user) {
        // Caso autenticado: tomamos los datos del perfil del usuario
        const user = await this.userRepository.findById(req.user.id);
        if (!user) {
          res.status(404).json({ error: 'Usuario no encontrado' });
          return;
        }
        if (!user.firstName || !user.lastName) {
          res.status(400).json({ error: 'Tu perfil debe tener nombre y apellido antes de hacer una reserva' });
          return;
        }
        guestFirstName = user.firstName;
        guestLastName = user.lastName;
        guestEmail = user.email;
        guestPhone = user.phone;
      } else {
        // Caso no autenticado: el frontend envía los datos del huésped
        const { guestFirstName: fn, guestLastName: ln, guestEmail: em, guestPhone: ph } = req.body;
        if (!fn || !ln || !em) {
          res.status(400).json({ error: 'guestFirstName, guestLastName y guestEmail son requeridos para usuarios no registrados' });
          return;
        }
        guestFirstName = fn;
        guestLastName = ln;
        guestEmail = em;
        guestPhone = ph ?? null;
      }

      const reservation = await this.createReservationUseCase.execute({
        roomId: Number(roomId),
        guestFirstName,
        guestLastName,
        guestEmail,
        guestPhone,
        checkIn,
        checkOut,
        guestCount: Number(guestCount),
        notes: notes ?? null,
        userId: req.user?.id ?? null,
      });

      res.status(201).json(reservation);
    } catch (err) {
      if (err instanceof RoomNotAvailableError) {
        res.status(409).json({ error: err.message });
        return;
      }
      if (err instanceof RoomNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async getReservation(req: Request, res: Response): Promise<void> {
    try {
      const reservation = await this.getReservationUseCase.execute(Number(req.params.id));
      res.json(reservation);
    } catch (err) {
      if (err instanceof ReservationNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      res.status(500).json({ error: (err as Error).message });
    }
  }

  async listReservations(req: Request, res: Response): Promise<void> {
    try {
      const filters: Record<string, any> = {};
      if (req.query.guestId) filters.guestId = Number(req.query.guestId);
      if (req.query.roomId) filters.roomId = Number(req.query.roomId);
      if (req.query.status) filters.status = req.query.status;

      const result = await this.listReservationsUseCase.execute(req.pagination!, filters);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }

  async cancelReservation(req: Request, res: Response): Promise<void> {
    try {
      const reservation = await this.cancelReservationUseCase.execute(Number(req.params.id));
      res.json(reservation);
    } catch (err) {
      if (err instanceof ReservationNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      res.status(400).json({ error: (err as Error).message });
    }
  }
}
