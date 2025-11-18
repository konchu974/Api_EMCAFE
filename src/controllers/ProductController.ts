import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';

export class ProductController {
  private productService = new ProductService();

  createProduct = async (req: Request, res: Response) => {
    try {
      const product = await this.productService.createProduct(req.body);
      res.status(201).json({
        success: true,
        data: product,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  getAllProducts = async (req: Request, res: Response) => {
    try {
      const products = await this.productService.getAllProducts();
      res.json({
        success: true,
        data: products,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  getProductById = async (req: Request, res: Response) => {
    try {
      const product = await this.productService.getProductById(req.params.id);
      res.json({
        success: true,
        data: product,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  };

  updateProduct = async (req: Request, res: Response) => {
    try {
      const product = await this.productService.updateProduct(req.params.id, req.body);
      res.json({
        success: true,
        data: product,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  deleteProduct = async (req: Request, res: Response) => {
    try {
      const result = await this.productService.deleteProduct(req.params.id);
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
