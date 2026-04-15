import { Router } from 'express';
import { RoomController } from '@/interfaces/http/controllers/RoomController';
import { RoomRepository } from '@/infrastructure/db/RoomRepository';
import { authenticate } from '@/interfaces/http/middlewares/authenticate';
import { can } from '@/interfaces/http/middlewares/can';
import { paginate } from '@/interfaces/http/middlewares/paginate';
import { uploadSingle } from '@/interfaces/http/middlewares/upload';
import { storageAdapter } from '@/config/storage';

const roomRepository = new RoomRepository();
const controller = new RoomController({ roomRepository, storagePort: storageAdapter });

const router = Router();

// ─── Room Types ───────────────────────────────────────────────────────────────
router.get('/types',       paginate, controller.getAllRoomTypes.bind(controller));
router.get('/types/:id',   controller.getRoomTypeById.bind(controller));
router.post('/types',      authenticate, can('rooms:manage'), controller.createRoomTypeHandler.bind(controller));
router.patch('/types/:id', authenticate, can('rooms:manage'), controller.updateRoomTypeHandler.bind(controller));
router.delete('/types/:id',           authenticate, can('rooms:manage'), controller.deleteRoomTypeHandler.bind(controller));
router.put('/types/:id/amenities',    authenticate, can('rooms:manage'), controller.setAmenitiesHandler.bind(controller));

// ─── Room Images ──────────────────────────────────────────────────────────────
router.get('/:id/images',               authenticate, can('rooms:manage'), controller.getImages.bind(controller));
router.post('/:id/images',              authenticate, can('rooms:manage'), uploadSingle, controller.uploadImage.bind(controller));
router.delete('/:id/images/:imageId',   authenticate, can('rooms:manage'), controller.deleteImage.bind(controller));

// ─── Rooms ────────────────────────────────────────────────────────────────────
router.get('/',      paginate, controller.getAllRooms.bind(controller));
router.get('/:id',   controller.getRoomById.bind(controller));
router.post('/',     authenticate, can('rooms:manage'), controller.createRoomHandler.bind(controller));
router.patch('/:id', authenticate, can('rooms:manage'), controller.updateRoomHandler.bind(controller));
router.delete('/:id', authenticate, can('rooms:manage'), controller.deleteRoomHandler.bind(controller));

export default router;
