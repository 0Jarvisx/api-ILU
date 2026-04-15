import { Request, Response } from 'express';
import { ListRoles } from '@/application/roles/ListRoles';
import { GetRole } from '@/application/roles/GetRole';
import { CreateRole } from '@/application/roles/CreateRole';
import { UpdateRole } from '@/application/roles/UpdateRole';
import { DeleteRole } from '@/application/roles/DeleteRole';
import { AssignRolePermissions } from '@/application/roles/AssignRolePermissions';
import { IRoleRepository } from '@/domain/auth/ports/IRoleRepository';
import { IPermissionRepository } from '@/domain/auth/ports/IPermissionRepository';

interface RoleControllerDeps {
  roleRepository: IRoleRepository;
  permissionRepository: IPermissionRepository;
}

export class RoleController {
  private listRoles: ListRoles;
  private getRole: GetRole;
  private createRole: CreateRole;
  private updateRole: UpdateRole;
  private deleteRole: DeleteRole;
  private assignRolePermissions: AssignRolePermissions;

  constructor({ roleRepository, permissionRepository }: RoleControllerDeps) {
    this.listRoles = new ListRoles({ roleRepository });
    this.getRole = new GetRole({ roleRepository });
    this.createRole = new CreateRole({ roleRepository });
    this.updateRole = new UpdateRole({ roleRepository });
    this.deleteRole = new DeleteRole({ roleRepository });
    this.assignRolePermissions = new AssignRolePermissions({ roleRepository, permissionRepository });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      res.json(await this.listRoles.execute(req.pagination!));
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      res.json(await this.getRole.execute(Number(req.params.id)));
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, description } = req.body as { name: string; description?: string };
      if (!name) { res.status(400).json({ error: 'name es requerido' }); return; }
      res.status(201).json(await this.createRole.execute({ name, description }));
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      res.json(await this.updateRole.execute(Number(req.params.id), req.body));
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await this.deleteRole.execute(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  }

  async assignPermissions(req: Request, res: Response): Promise<void> {
    try {
      const { permissionIds } = req.body as { permissionIds: number[] };
      if (!Array.isArray(permissionIds)) { res.status(400).json({ error: 'permissionIds debe ser un array' }); return; }
      await this.assignRolePermissions.execute(Number(req.params.id), permissionIds);
      res.json({ message: 'Permisos asignados correctamente' });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }
}
