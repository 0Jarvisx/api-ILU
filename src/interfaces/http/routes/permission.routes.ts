import { Router } from 'express';
import { PermissionController } from '@/interfaces/http/controllers/PermissionController';
import { PermissionRepository } from '@/infrastructure/db/PermissionRepository';
import { authenticate } from '@/interfaces/http/middlewares/authenticate';
import { can } from '@/interfaces/http/middlewares/can';
import { paginate } from '@/interfaces/http/middlewares/paginate';

const permissionRepository = new PermissionRepository();
const controller = new PermissionController({ permissionRepository });

const router = Router();

router.get('/',    authenticate, can('permission:manage'), paginate, controller.getAll.bind(controller));
router.get('/:id', authenticate, can('permission:manage'), controller.getById.bind(controller));
router.post('/',   authenticate, can('permission:manage'), controller.create.bind(controller));
router.patch('/:id', authenticate, can('permission:manage'), controller.update.bind(controller));
router.delete('/:id', authenticate, can('permission:manage'), controller.delete.bind(controller));

export default router;
