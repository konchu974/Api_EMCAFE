import { Router } from 'express';
import { createStripePayment, confirmStripePayment } from '../controllers/stripe.controller';

const router = Router();

router.post('/create-payment', createStripePayment);
router.post('/confirm-payment', confirmStripePayment);

export default router;
