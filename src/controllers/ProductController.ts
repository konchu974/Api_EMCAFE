import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { CoffeeType, RoastLevel } from '../entities/Product';
import { validationResult } from 'express-validator';
import { UpdateStockDto } from '../dtos/product/UpdateStockDto';

export class ProductController {
  private productService = new ProductService();

  createProduct = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    try {
      const product = await this.productService.createProduct(req.body);
      res.status(201).json({
        success: true,
        message: 'Produit café créé avec succès',
        data: product,
      });
    } catch (error: any) {
      res.status(error.message.includes('existe déjà') ? 409 : 400).json({
        success: false,
        message: error.message,
      });
    }
  };

  getAllProducts = async (req: Request, res: Response) => {
    try {
      const {
        search,
        minPrice,
        maxPrice,
        minIntensity,
        maxIntensity,
        coffeeTypes,
        roastLevels,
        sizes, // 🆕 Nouveau paramètre
        limit = 10,
        offset = 0
      } = req.query;

      // Conversion des types pour les énumérations
      const coffeeTypesArray = coffeeTypes ? (Array.isArray(coffeeTypes) ? coffeeTypes : [coffeeTypes]).map(String) : undefined;
      const parsedCoffeeTypes = coffeeTypesArray ?
        coffeeTypesArray.filter((t): t is CoffeeType => (Object.values(CoffeeType) as string[]).includes(t)) :
        undefined;

      const roastLevelsArray = roastLevels ? (Array.isArray(roastLevels) ? roastLevels : [roastLevels]).map(String) : undefined;
      const parsedRoastLevels = roastLevelsArray ?
        roastLevelsArray.filter((l): l is RoastLevel => (Object.values(RoastLevel) as string[]).includes(l)) :
        undefined;

      // 🆕 Conversion des tailles
      const sizesArray = sizes ? (Array.isArray(sizes) ? sizes : [sizes]).map(String) : undefined;

      const [products, total] = await this.productService.getAllProducts(
        search as string,
        minPrice ? Number(minPrice) : undefined,
        maxPrice ? Number(maxPrice) : undefined,
        minIntensity ? Number(minIntensity) : undefined,
        maxIntensity ? Number(maxIntensity) : undefined,
        parsedCoffeeTypes as CoffeeType[],
        parsedRoastLevels as RoastLevel[],
        sizesArray, // 🆕 Passage du paramètre
        Number(limit),
        Number(offset)
      );

      res.json({
        success: true,
        data: products,
        meta: {
          total,
          limit: Number(limit),
          offset: Number(offset),
          count: products.length
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des produits café',
        error: error.message
      });
    }
  };

  getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
  
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      if (!id || !uuidRegex.test(id)) {
        res.status(400).json({
          success: false,
          message: 'ID produit invalide (UUID attendu)',
        });
        return;
      }
  
      const product = await this.productService.getProductById(id);
      
      res.json({
        success: true,
        data: product,
      });
  
    } catch (error: any) {
      const statusCode = error.message?.includes('introuvable') ? 404 : 500;
      
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Erreur lors de la récupération du produit',
      });
    }
  };


  updateProduct = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    try {
      const product = await this.productService.updateProduct(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Produit café mis à jour avec succès',
        data: product,
      });
    } catch (error: any) {
      const statusCode = error.message.includes('non trouvé') ? 404 :
                        error.message.includes('existe déjà') ? 409 : 400;
      res.status(statusCode).json({
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
        message: result.message,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Produit café non trouvé',
      });
    }
  };

  updateStock = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      const updatedProduct = await this.productService.updateStock(id, quantity);

      res.json({
        success: true,
        message: `Stock mis à jour avec succès. Nouveau stock: ${updatedProduct.stock}`,
        data: {
          productId: updatedProduct.id_product,
          newStock: updatedProduct.stock,
          updatedAt: updatedProduct.updated_at
        },
      });
    } catch (error: any) {
      if (error.message.includes('insuffisant')) {
        res.status(400).json({
          success: false,
          message: error.message,
          currentStock: error.currentStock 
        });
      } else if (error.message.includes('non trouvé')) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erreur lors de la mise à jour du stock',
        });
      }
    }
  };

  getLowStockProducts = async (req: Request, res: Response) => {
    try {
      const threshold = req.query.threshold ? Number(req.query.threshold) : 5;
      const products = await this.productService.getLowStockProducts(threshold);

      res.json({
        success: true,
        message: `Produits avec stock inférieur à ${threshold}`,
        data: products,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des produits en faible stock',
      });
    }
  };

  getProductsByIntensity = async (req: Request, res: Response) => {
    try {
      const { min, max } = req.query;

      if (!min || !max) {
        return res.status(400).json({
          success: false,
          message: 'Les paramètres min et max sont requis'
        });
      }

      const products = await this.productService.getProductsByIntensityRange(
        Number(min),
        Number(max)
      );

      res.json({
        success: true,
        message: `Produits avec intensité entre ${min} et ${max}`,
        data: products,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des produits par intensité',
      });
    }
  };

  getFeaturedProducts = async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 4;
      const products = await this.productService.getFeaturedProducts(limit);

      res.json({
        success: true,
        message: 'Produits phares',
        data: products,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des produits phares',
      });
    }
  };

  getProductsBySize = async (req: Request, res: Response) => {
    try {
      const { size } = req.params;

      if (!size) {
        return res.status(400).json({
          success: false,
          message: 'Le paramètre "size" est requis'
        });
      }

      const products = await this.productService.getProductsBySize(size);

      res.json({
        success: true,
        message: `Produits de taille ${size}`,
        data: products,
        count: products.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des produits par taille',
        error: error.message
      });
    }
  };
  
  getProductWithVariants = async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const product = await this.productService.getProductWithVariants(id);
  
        if (!product) {
          return res.status(404).json({
            success: false,
            message: 'Produit non trouvé',
          });
        }
  
        return res.json({
          success: true,
          data: product,
        });
      } catch (error) {
        console.error('Error fetching product with variants:', error);
        return res.status(500).json({
          success: false,
          message: 'Erreur lors de la récupération du produit',
        });
      }
    };
  
    getAllProductsWithVariants = async (req: Request, res: Response) => {
      try {
        const products = await this.productService.getAllProductsWithVariants();
  
        return res.json({
          success: true,
          data: products,
        });
      } catch (error) {
        console.error('Error fetching products with variants:', error);
        return res.status(500).json({
          success: false,
          message: 'Erreur lors de la récupération des produits',
        });
      }
    };
}
