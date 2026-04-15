import { Request, Response } from 'express';
import { ListRooms } from '@/application/rooms/ListRooms';
import { GetRoom } from '@/application/rooms/GetRoom';
import { CreateRoom } from '@/application/rooms/CreateRoom';
import { UpdateRoom } from '@/application/rooms/UpdateRoom';
import { DeleteRoom } from '@/application/rooms/DeleteRoom';
import { ListRoomTypes } from '@/application/rooms/ListRoomTypes';
import { GetRoomType } from '@/application/rooms/GetRoomType';
import { CreateRoomType } from '@/application/rooms/CreateRoomType';
import { UpdateRoomType } from '@/application/rooms/UpdateRoomType';
import { DeleteRoomType } from '@/application/rooms/DeleteRoomType';
import { UploadRoomImage } from '@/application/rooms/UploadRoomImage';
import { DeleteRoomImage } from '@/application/rooms/DeleteRoomImage';
import { SetRoomTypeAmenities } from '@/application/rooms/SetRoomTypeAmenities';
import { IRoomRepository } from '@/domain/room/ports/IRoomRepository';
import { IStoragePort } from '@/domain/room/ports/IStoragePort';

interface RoomControllerDeps {
  roomRepository: IRoomRepository;
  storagePort: IStoragePort;
}

export class RoomController {
  private listRooms: ListRooms;
  private getRoom: GetRoom;
  private createRoom: CreateRoom;
  private updateRoom: UpdateRoom;
  private deleteRoom: DeleteRoom;
  private listRoomTypes: ListRoomTypes;
  private getRoomType: GetRoomType;
  private createRoomType: CreateRoomType;
  private updateRoomType: UpdateRoomType;
  private deleteRoomType: DeleteRoomType;
  private uploadRoomImageUseCase: UploadRoomImage;
  private deleteRoomImageUseCase: DeleteRoomImage;
  private setRoomTypeAmenitiesUseCase: SetRoomTypeAmenities;
  private roomRepository: IRoomRepository;

  constructor({ roomRepository, storagePort }: RoomControllerDeps) {
    this.roomRepository = roomRepository;
    this.listRooms = new ListRooms(roomRepository);
    this.getRoom = new GetRoom(roomRepository);
    this.createRoom = new CreateRoom(roomRepository);
    this.updateRoom = new UpdateRoom(roomRepository);
    this.deleteRoom = new DeleteRoom(roomRepository);
    this.listRoomTypes = new ListRoomTypes(roomRepository);
    this.getRoomType = new GetRoomType(roomRepository);
    this.createRoomType = new CreateRoomType(roomRepository);
    this.updateRoomType = new UpdateRoomType(roomRepository);
    this.deleteRoomType = new DeleteRoomType(roomRepository);
    this.uploadRoomImageUseCase = new UploadRoomImage(roomRepository, storagePort);
    this.deleteRoomImageUseCase = new DeleteRoomImage(roomRepository, storagePort);
    this.setRoomTypeAmenitiesUseCase = new SetRoomTypeAmenities(roomRepository);
  }

  // ─── Rooms ────────────────────────────────────────────────────────────────

  async getAllRooms(req: Request, res: Response): Promise<void> {
    try {
      res.json(await this.listRooms.execute(req.pagination!));
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }

  async getRoomById(req: Request, res: Response): Promise<void> {
    try {
      res.json(await this.getRoom.execute(Number(req.params.id)));
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  }

  async createRoomHandler(req: Request, res: Response): Promise<void> {
    try {
      const { roomNumber, roomTypeId, floor, isActive, notes } = req.body;
      if (!roomNumber || !roomTypeId || floor === undefined) {
        res.status(400).json({ error: 'roomNumber, roomTypeId y floor son requeridos' });
        return;
      }
      res.status(201).json(await this.createRoom.execute({ roomNumber, roomTypeId, floor, isActive, notes }));
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async updateRoomHandler(req: Request, res: Response): Promise<void> {
    try {
      res.json(await this.updateRoom.execute(Number(req.params.id), req.body));
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  }

  async deleteRoomHandler(req: Request, res: Response): Promise<void> {
    try {
      await this.deleteRoom.execute(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  }

  // ─── Room Images ──────────────────────────────────────────────────────────

  async getImages(req: Request, res: Response): Promise<void> {
    try {
      await this.getRoom.execute(Number(req.params.id)); // valida que la habitación exista
      const images = await this.roomRepository.findImagesByRoomId(Number(req.params.id));
      res.json(images);
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  }

  async uploadImage(req: Request, res: Response): Promise<void> {
    try {
      const roomId = Number(req.params.id);
      const file = req.file;
      if (!file) {
        res.status(400).json({ error: 'Se requiere un archivo de imagen (campo: image)' });
        return;
      }
      const isPrimary = req.body.isPrimary === 'true' || req.body.isPrimary === true;
      const sortOrder = req.body.sortOrder !== undefined ? Number(req.body.sortOrder) : undefined;
      res.status(201).json(await this.uploadRoomImageUseCase.execute(roomId, file, { isPrimary, sortOrder }));
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async deleteImage(req: Request, res: Response): Promise<void> {
    try {
      await this.deleteRoomImageUseCase.execute(Number(req.params.id), Number(req.params.imageId));
      res.status(204).send();
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  }

  // ─── Room Types ───────────────────────────────────────────────────────────

  async getAllRoomTypes(req: Request, res: Response): Promise<void> {
    try {
      res.json(await this.listRoomTypes.execute(req.pagination!));
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }

  async getRoomTypeById(req: Request, res: Response): Promise<void> {
    try {
      res.json(await this.getRoomType.execute(Number(req.params.id)));
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  }

  async createRoomTypeHandler(req: Request, res: Response): Promise<void> {
    try {
      const { name, basePricePerNight, maxCapacity, maxAdults, maxChildren, description } = req.body;
      if (!name || basePricePerNight === undefined || maxCapacity === undefined || maxAdults === undefined) {
        res.status(400).json({ error: 'name, basePricePerNight, maxCapacity y maxAdults son requeridos' });
        return;
      }
      res.status(201).json(await this.createRoomType.execute({ name, basePricePerNight, maxCapacity, maxAdults, maxChildren, description }));
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async setAmenitiesHandler(req: Request, res: Response): Promise<void> {
    try {
      const { amenityIds } = req.body as { amenityIds: number[] };
      if (!Array.isArray(amenityIds)) {
        res.status(400).json({ error: 'amenityIds debe ser un array' });
        return;
      }
      res.json(await this.setRoomTypeAmenitiesUseCase.execute(Number(req.params.id), amenityIds));
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async updateRoomTypeHandler(req: Request, res: Response): Promise<void> {
    try {
      res.json(await this.updateRoomType.execute(Number(req.params.id), req.body));
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  }

  async deleteRoomTypeHandler(req: Request, res: Response): Promise<void> {
    try {
      await this.deleteRoomType.execute(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  }
}
