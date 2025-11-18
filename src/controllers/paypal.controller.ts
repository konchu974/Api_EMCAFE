import { Request, Response } from 'express';
import { paypalClient } from '../config/paypal';
import { AppDataSource } from '../config/database';
import { Order } from '../entities/Order';
import { Payment } from '../entities/Payment';

const paypalSdk = require('@paypal/checkout-server-sdk');

// --------------------------------------------------------
// CREATE PAYPAL ORDER
// --------------------------------------------------------
export const createOrder = async (req: Request, res: Response) => {
    try {
        const { total, userId } = req.body;

        if (!total || !userId) {
            return res.status(400).json({ message: 'Missing total or userId' });
        }

        const request = new paypalSdk.orders.OrdersCreateRequest();
        request.prefer('return=representation');
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'EUR',
                        value: Number(total).toFixed(2),
                    },
                },
            ],
        });

        const order = await paypalClient.execute(request);

        return res.status(201).json({ id: order.result.id });

    } catch (err: any) {
        console.error('🔥 PayPal createOrder error:', err?.message || err);

        return res.status(500).json({
            message: 'Error creating Paypal order',
            error: err?.message || err
        });
    }
};

// --------------------------------------------------------
// CAPTURE PAYPAL PAYMENT
// --------------------------------------------------------
export const captureOrder = async (req: Request, res: Response) => {
    try {
        const { paypalOrderId, total, userId } = req.body;

        if (!paypalOrderId || !total || !userId) {
            return res.status(400).json({ message: 'Missing parameters' });
        }

        const request = new paypalSdk.orders.OrdersCaptureRequest(paypalOrderId);
        request.requestBody({});

        const result = await paypalClient.execute(request);

        if (result.result.status !== 'COMPLETED') {
            return res.status(400).json({
                message: 'Payment not completed',
                status: result.result.status,
            });
        }

        const capture = result.result.purchase_units[0].payments.captures[0];

        // Save Order in DB
        const orderRepository = AppDataSource.getRepository(Order);
        const paymentRepository = AppDataSource.getRepository(Payment);

        const newOrder = orderRepository.create({
            id_user_account: userId,
            total,
            status: 'PAID',
        });

        await orderRepository.save(newOrder);

        // Save Payment in DB (MATCHES YOUR PAYMENT TABLE)
        const paymentRecord = paymentRepository.create({
            id_order: newOrder.id_order,
            amount: total,
            payment_method: 'PAYPAL',
            payment_status: 'COMPLETED',
            transaction_id: capture.id,
            paid_at: new Date()
        });

        await paymentRepository.save(paymentRecord);

        return res.status(200).json({
            message: 'Paypal payment successful',
            orderId: newOrder.id_order,
            paymentId: paymentRecord.id_payment,
        });

    } catch (err: any) {
        console.error('🔥 PayPal captureOrder error:', err?.message || err);

        return res.status(500).json({
            message: 'Error capturing Paypal order',
            error: err?.message || err
        });
    }
};
