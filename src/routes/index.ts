import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware';
import { validationMiddleware } from '../middlewares/validationMiddleware';
import { RegisterDto } from '../dtos/user/RegisterDto';
import { LoginDto } from '../dtos/user/LoginDto';


const router = Router();

// Controllers
const userController = new UserController();
// ==================== USER ROUTES ====================
router.post('/auth/register', validationMiddleware(RegisterDto), userController.register);
router.post('/auth/login', validationMiddleware(LoginDto), userController.login);

router.get('/users', authMiddleware, adminMiddleware, userController.getAll);
router.get('/users/profile', authMiddleware, userController.getProfile);
router.get('/users/:id', authMiddleware, userController.getById);
router.put('/users/:id', authMiddleware, validationMiddleware(RegisterDto), userController.updateUser);
router.delete('/users/:id', authMiddleware, adminMiddleware, userController.delete);

export default router;
