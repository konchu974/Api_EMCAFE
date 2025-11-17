import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';

export class ProductController {
  private productService = new ProductService();

  createProduct = async (req: Request, res: Response) => {
    try {
      const product = await this.productService.create(req.body);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  updateProduct = async (req: Request, res: Response) =>{
    
  }

  getAllProduct = async (req: Request, res: Response) => {
    try {
      const products = await this.productService.findAll();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  getByProductId = async (req: Request, res: Response) => {
    try {
      const product = await this.productService.findById(req.params.id);
      res.json(product);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const result = await this.productService.delete(req.params.id);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  };
}
