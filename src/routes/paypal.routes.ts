import { Router } from 'express';
import { createOrder, captureOrder } from '../controllers/paypal.controller';

console.log("📌 PayPal routes LOADED");

const router = Router();

router.post('/create-order', createOrder);
router.post('/capture-order', captureOrder);

export default router;
