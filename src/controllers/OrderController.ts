import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import { AuthRequest } from '../middlewares/authMiddleware';

export class OrderController {
  private orderService = new OrderService();

  createOrder = async (req: Request, res: Response) => {
    try {
      const order = await this.orderService.createOrder(req.body);
      res.status(201).json({
        success: true,
        data: order,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  getAllOrders = async (req: Request, res: Response) => {
    try {
      const orders = await this.orderService.getAllOrders();
      res.json({
        success: true,
        data: orders,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  getOrderById = async (req: Request, res: Response) => {
    try {
      const order = await this.orderService.getOrderById(req.params.id);
      res.json({
        success: true,
        data: order,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  };

  getMyOrders = async (req: AuthRequest, res: Response) => {
    try {
      const orders = await this.orderService.getOrdersByUserId(req.user!.id);
      res.json({
        success: true,
        data: orders,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  updateOrderStatus = async (req: Request, res: Response) => {
    try {
      const order = await this.orderService.updateOrderStatus(req.params.id, req.body);
      res.json({
        success: true,
        data: order,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  deleteOrder = async (req: Request, res: Response) => {
    try {
      const result = await this.orderService.deleteOrder(req.params.id);
      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  };
}
