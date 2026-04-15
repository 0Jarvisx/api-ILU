import { Router } from 'express';
import { UserController } from '@/interfaces/http/controllers/UserController';
import { UserRepository } from '@/infrastructure/db/UserRepository';
import { authenticate } from '@/interfaces/http/middlewares/authenticate';
import { can } from '@/interfaces/http/middlewares/can';
import { paginate } from '@/interfaces/http/middlewares/paginate';

const userRepository = new UserRepository();
const controller = new UserController({ userRepository });

const router = Router();

router.get('/',    authenticate, can('user:manage'), paginate, controller.getAll.bind(controller));
router.get('/:id', authenticate, can('user:manage'), controller.getById.bind(controller));
router.post('/',   authenticate, can('user:manage'), controller.create.bind(controller));
router.patch('/:id', authenticate, can('user:manage'), controller.update.bind(controller));
router.delete('/:id', authenticate, can('user:manage'), controller.delete.bind(controller));

export default router;
