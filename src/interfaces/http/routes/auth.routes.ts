import { Router } from 'express';
import { AuthController } from '@/interfaces/http/controllers/AuthController';
import { UserRepository } from '@/infrastructure/db/UserRepository';
import { JwtAdapter } from '@/infrastructure/auth/JwtAdapter';
import { authenticate } from '@/interfaces/http/middlewares/authenticate';

const userRepository = new UserRepository();
const tokenPort = new JwtAdapter();
const controller = new AuthController({ userRepository, tokenPort });

const router = Router();

router.post('/login', controller.handleLogin.bind(controller));
router.post('/register', controller.handleRegister.bind(controller));
router.post('/logout', controller.handleLogout.bind(controller));
router.get('/me', authenticate, controller.handleMe.bind(controller));

export default router;
