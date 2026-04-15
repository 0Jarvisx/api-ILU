import { Request, Response } from 'express';
import { ListPermissions } from '@/application/permissions/ListPermissions';
import { GetPermission } from '@/application/permissions/GetPermission';
import { CreatePermission } from '@/application/permissions/CreatePermission';
import { UpdatePermission } from '@/application/permissions/UpdatePermission';
import { DeletePermission } from '@/application/permissions/DeletePermission';
import { IPermissionRepository } from '@/domain/auth/ports/IPermissionRepository';

export class PermissionController {
  private listPermissions: ListPermissions;
  private getPermission: GetPermission;
  private createPermission: CreatePermission;
  private updatePermission: UpdatePermission;
  private deletePermission: DeletePermission;

  constructor({ permissionRepository }: { permissionRepository: IPermissionRepository }) {
    this.listPermissions = new ListPermissions({ permissionRepository });
    this.getPermission = new GetPermission({ permissionRepository });
    this.createPermission = new CreatePermission({ permissionRepository });
    this.updatePermission = new UpdatePermission({ permissionRepository });
    this.deletePermission = new DeletePermission({ permissionRepository });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      res.json(await this.listPermissions.execute(req.pagination!));
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      res.json(await this.getPermission.execute(Number(req.params.id)));
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, description } = req.body as { name: string; description?: string };
      if (!name) { res.status(400).json({ error: 'name es requerido' }); return; }
      res.status(201).json(await this.createPermission.execute({ name, description }));
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      res.json(await this.updatePermission.execute(Number(req.params.id), req.body));
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await this.deletePermission.execute(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  }
}
