import { Router } from 'express';
import { RoleController } from '@/interfaces/http/controllers/RoleController';
import { RoleRepository } from '@/infrastructure/db/RoleRepository';
import { PermissionRepository } from '@/infrastructure/db/PermissionRepository';
import { authenticate } from '@/interfaces/http/middlewares/authenticate';
import { can } from '@/interfaces/http/middlewares/can';
import { paginate } from '@/interfaces/http/middlewares/paginate';

const roleRepository = new RoleRepository();
const permissionRepository = new PermissionRepository();
const controller = new RoleController({ roleRepository, permissionRepository });

const router = Router();

router.get('/',    authenticate, can('role:manage'), paginate, controller.getAll.bind(controller));
router.get('/:id', authenticate, can('role:manage'), controller.getById.bind(controller));
router.post('/',   authenticate, can('role:manage'), controller.create.bind(controller));
router.patch('/:id', authenticate, can('role:manage'), controller.update.bind(controller));
router.delete('/:id', authenticate, can('role:manage'), controller.delete.bind(controller));
router.put('/:id/permissions', authenticate, can('role:manage'), controller.assignPermissions.bind(controller));

export default router;
