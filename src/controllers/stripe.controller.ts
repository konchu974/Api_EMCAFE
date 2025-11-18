import { Request, Response } from "express";
import { stripe } from "../config/stripe";
import { AppDataSource } from "../config/database";
import { Order } from "../entities/Order";
import { Payment } from "../entities/Payment";

export const createStripePayment = async (req: Request, res: Response) => {
    try {
        const { total, userId } = req.body;

        if (!total || !userId) {
            return res.status(400).json({message: 'Missing total or userId'});
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100),
            currency: 'eur',
            payment_method_types: ['card'],
            metadata: {
                userId,
            },
        });

        return res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (err: any) {
        console.error(" Stripe create payment error", err);
        return res.status(500).json({messaage: 'Stripe error', error: err.message});
    }
};

export const confirmStripePayment = async (req: Request, res: Response) => {
    try {
        const { paymentIntentId, userId, total } = req.body;

        if (!paymentIntentId || !userId || !total) {
            return res.status(400).json({message: 'Missing parameters'});
        }

        const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if(intent.status !== 'succeeded') {
            return res.status(400).json({message: 'Payment not completed'});
        }

        const orderRepo = AppDataSource.getRepository(Order);
        const paymentRepo = AppDataSource.getRepository(Payment);

        const newOrder = orderRepo.create({
            id_user_account: userId,
            total,
            status: 'PAID',
        });
        await orderRepo.save(newOrder);

        const paymentRecord = paymentRepo.create({
            id_order: newOrder.id_order,
            amount: total,
            payment_method: 'CARD',
            payment_status: 'COMPLETED',
            transaction_id: paymentIntentId,
        });
        await paymentRepo.save(paymentRecord);

        return res.status(200).json({
            message: 'Card payment successful',
            orderId: newOrder.id_order,
            paymentId: paymentRecord.id_payment,
        });

    } catch (err: any) {
        console.error("Stripe confirm error:", err);
        return res.status(500).json({message: 'Stripe confirm error', error: err.message});
    }
};