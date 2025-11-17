import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware';
import { validationMiddleware } from '../middlewares/validationMiddleware';
import { RegisterDto } from '../dtos/user/RegisterDto';
import { LoginDto } from '../dtos/user/LoginDto';


const router = Router();

// Controllers
const userController = new UserController();

// ============ AUTH ROUTES ============
router.post('/auth/register', validationMiddleware(RegisterDto), userController.register);
router.post('/auth/login', validationMiddleware(LoginDto), userController.login);
router.get('/auth/profile', authMiddleware, userController.getProfile);

// ============ USER ROUTES ============
router.get('/users', authMiddleware, adminMiddleware, userController.getAll);
router.get('/users/:id', authMiddleware, userController.getById);
router.delete('/users/:id', authMiddleware, adminMiddleware, userController.delete);


export default router;
