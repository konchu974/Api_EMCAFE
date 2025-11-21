import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware, adminMiddleware } from "../middlewares/authMiddleware";
import { validationMiddleware } from "../middlewares/validationMiddleware";
import { RegisterDto } from "../dtos/user/RegisterDto";
import { LoginDto } from "../dtos/user/LoginDto";
import { ProductController } from "../controllers/ProductController";
import { CreateProductDto } from "../dtos/product/CreateProductDto";
import { UpdateProductDto } from "../dtos/product/UpdateProductDto";
import { CreateOrderDto } from "../dtos/order/CreateOrderDto";
import { OrderController } from "../controllers/OrderController";
import { UpdateOrderStatusDto } from "../dtos/order/UpdateOrderStatusDto";
import { UpdateStockDto } from "../dtos/product/UpdateStockDto";
import { VariantController } from "../controllers/VariantController";

const router = Router();

// Controllers
const userController = new UserController();
const productController = new ProductController();
const orderController = new OrderController();
const variantController = new VariantController();

// ==================== USER ROUTES ====================
router.post(
  "/auth/register",
  validationMiddleware(RegisterDto),
  userController.register,
);
router.post(
  "/auth/login",
  validationMiddleware(LoginDto),
  userController.login,
);

router.get("/users", authMiddleware, userController.getAll);
router.get("/users/profile", authMiddleware, userController.getProfile);
router.get("/users/:id", authMiddleware, userController.getById);
router.put(
  "/users/:id",
  authMiddleware,
  validationMiddleware(RegisterDto),
  userController.updateUser,
);
router.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  userController.delete,
);

// ==================== PRODUCT ROUTES ====================

router.get('/products/full', productController.getAllProductsWithVariants); 

router.get('/products/:id/full', productController.getProductWithVariants); 

router.get("/products", productController.getAllProducts);

router.get("/products/featured", productController.getFeaturedProducts);

router.get('/size/:size', productController.getProductsBySize);


router.get(
  "/products/low-stock",
  authMiddleware,
  adminMiddleware,
  productController.getLowStockProducts,
);

router.get("/products/by-intensity", productController.getProductsByIntensity);

router.get("/products/:id", productController.getProductById);

// Routes protégées (nécessitent admin)
router.post(
  "/products",
  authMiddleware,
  adminMiddleware,
  validationMiddleware(CreateProductDto),
  productController.createProduct,
);

router.put(
  "/products/:id",
  authMiddleware,
  adminMiddleware,
  validationMiddleware(UpdateProductDto),
  productController.updateProduct,
);

router.delete(
  "/products/:id",
  authMiddleware,
  adminMiddleware,
  productController.deleteProduct,
);

router.patch(
  "/products/:id/stock",
  authMiddleware,
  adminMiddleware,
  validationMiddleware(UpdateStockDto),
  productController.updateStock,
);

// ==================== ORDER ROUTES ====================
router.post(
  "/orders",
  authMiddleware,
  validationMiddleware(CreateOrderDto),
  orderController.createOrder,
);
router.get(
  "/orders",
  authMiddleware,
  adminMiddleware,
  orderController.getAllOrders,
);
router.get("/orders/my-orders", authMiddleware, orderController.getMyOrders);
router.get("/orders/:id", authMiddleware, orderController.getOrderById);
router.patch(
  "/orders/:id/status",
  authMiddleware,
  adminMiddleware,
  validationMiddleware(UpdateOrderStatusDto),
  orderController.updateOrderStatus,
);
router.delete(
  "/orders/:id",
  authMiddleware,
  adminMiddleware,
  orderController.deleteOrder,
);

// Routes publiques
router.get('/products/:productId/variants', variantController.getVariantsByProduct);
router.get('/variants/:id', variantController.getVariantById);

// Routes protégées (admin uniquement)
router.post('/variants', authMiddleware, variantController.createVariant);
router.patch('/variants/:id', authMiddleware, variantController.updateVariant);
router.delete('/variants/:id', authMiddleware, variantController.deleteVariant);
router.patch('/variants/:id/stock', authMiddleware, variantController.updateStock);

export default router;
