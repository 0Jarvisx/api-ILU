import { Request, Response } from 'express';
import { ListUsers } from '@/application/users/ListUsers';
import { GetUser } from '@/application/users/GetUser';
import { CreateUser } from '@/application/users/CreateUser';
import { UpdateUser } from '@/application/users/UpdateUser';
import { DeleteUser } from '@/application/users/DeleteUser';
import { IUserRepository } from '@/domain/auth/ports/IUserRepository';

export class UserController {
  private listUsers: ListUsers;
  private getUser: GetUser;
  private createUser: CreateUser;
  private updateUser: UpdateUser;
  private deleteUser: DeleteUser;

  constructor({ userRepository }: { userRepository: IUserRepository }) {
    this.listUsers = new ListUsers({ userRepository });
    this.getUser = new GetUser({ userRepository });
    this.createUser = new CreateUser({ userRepository });
    this.updateUser = new UpdateUser({ userRepository });
    this.deleteUser = new DeleteUser({ userRepository });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { isActive, email, roleId } = req.query as { isActive?: string; email?: string; roleId?: string };
      res.json(await this.listUsers.execute(req.pagination!, { isActive, email, roleId }));
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      res.json(await this.getUser.execute(Number(req.params.id)));
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, roleId, firstName, lastName, phone, dpi } = req.body as {
        email: string;
        password: string;
        roleId: number;
        firstName?: string;
        lastName?: string;
        phone?: string;
        dpi?: string;
      };
      if (!email || !password || !roleId) {
        res.status(400).json({ error: 'email, password y roleId son requeridos' });
        return;
      }
      res.status(201).json(await this.createUser.execute({ email, password, roleId, firstName, lastName, phone, dpi }));
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      res.json(await this.updateUser.execute(Number(req.params.id), req.body));
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await this.deleteUser.execute(Number(req.params.id));
      res.json({ message: 'Usuario desactivado correctamente' });
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  }
}
