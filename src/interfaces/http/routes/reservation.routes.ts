import { Router } from 'express';
import { ReservationController } from '@/interfaces/http/controllers/ReservationController';
import { ReservationRepository } from '@/infrastructure/db/ReservationRepository';
import { GuestRepository } from '@/infrastructure/db/GuestRepository';
import { RoomRepository } from '@/infrastructure/db/RoomRepository';
import { UserRepository } from '@/infrastructure/db/UserRepository';
import { authenticate } from '@/interfaces/http/middlewares/authenticate';
import { optionalAuthenticate } from '@/interfaces/http/middlewares/optionalAuthenticate';
import { can } from '@/interfaces/http/middlewares/can';
import { paginate } from '@/interfaces/http/middlewares/paginate';

const roomRepository = new RoomRepository();
const reservationRepository = new ReservationRepository();
const guestRepository = new GuestRepository();
const userRepository = new UserRepository();
const controller = new ReservationController({ roomRepository, reservationRepository, guestRepository, userRepository });

const router = Router();

router.get('/available',      controller.searchAvailableRooms.bind(controller));
router.post('/',              optionalAuthenticate, controller.createReservation.bind(controller));
router.get('/',               authenticate, can('reservation:read'),   paginate, controller.listReservations.bind(controller));
router.get('/:id',            authenticate, can('reservation:read'),   controller.getReservation.bind(controller));
router.post('/:id/cancel',    authenticate, can('reservation:cancel'), controller.cancelReservation.bind(controller));

export default router;
