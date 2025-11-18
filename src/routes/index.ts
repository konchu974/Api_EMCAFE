import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware';
import { validationMiddleware } from '../middlewares/validationMiddleware';
import { RegisterDto } from '../dtos/user/RegisterDto';
import { LoginDto } from '../dtos/user/LoginDto';
import { ProductController } from '../controllers/ProductController';
import { CreateProductDto } from '../dtos/product/CreateProductDto';
import { UpdateProductDto } from '../dtos/product/UpdateProductDto';
import { CreateOrderDto } from '../dtos/order/CreateOrderDto';
import { OrderController } from '../controllers/OrderController';
import { UpdateOrderStatusDto } from '../dtos/order/UpdateOrderStatusDto';


const router = Router();

// Controllers
const userController = new UserController();
const productController = new ProductController();
const orderController = new OrderController();

// ==================== USER ROUTES ====================
router.post('/auth/register', validationMiddleware(RegisterDto), userController.register);
router.post('/auth/login', validationMiddleware(LoginDto), userController.login);

router.get('/users', authMiddleware, adminMiddleware, userController.getAll);
router.get('/users/profile', authMiddleware, userController.getProfile);
router.get('/users/:id', authMiddleware, userController.getById);
router.put('/users/:id', authMiddleware, validationMiddleware(RegisterDto), userController.updateUser);
router.delete('/users/:id', authMiddleware, adminMiddleware, userController.delete);

// ==================== PRODUCT ROUTES ====================
router.post('/products', authMiddleware, adminMiddleware, validationMiddleware(CreateProductDto), productController.createProduct);
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.put('/products/:id', authMiddleware, adminMiddleware, validationMiddleware(UpdateProductDto), productController.updateProduct);
router.delete('/products/:id', authMiddleware, adminMiddleware, productController.deleteProduct);

// ==================== ORDER ROUTES ====================
router.post('/orders', authMiddleware, validationMiddleware(CreateOrderDto), orderController.createOrder);
router.get('/orders', authMiddleware, adminMiddleware, orderController.getAllOrders);
router.get('/orders/my-orders', authMiddleware, orderController.getMyOrders);
router.get('/orders/:id', authMiddleware, orderController.getOrderById);
router.patch('/orders/:id/status', authMiddleware, adminMiddleware, validationMiddleware(UpdateOrderStatusDto), orderController.updateOrderStatus);
router.delete('/orders/:id', authMiddleware, adminMiddleware, orderController.deleteOrder);


export default router;