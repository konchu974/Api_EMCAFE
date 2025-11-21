// backend/src/controllers/variant.controller.ts

import { Request, Response } from 'express';
import { VariantService } from '../services/variant';

import { validate } from 'class-validator';
import { CreateVariantDto } from '../dtos/product/CreateVariant';
import { UpdateVariantDto } from '../dtos/product/UpdateVariant';

export class VariantController {
  private variantService = new VariantService();

  /**
   * GET /api/products/:productId/variants
   * Récupérer tous les variants d'un produit
   */
  getVariantsByProduct = async (req: Request, res: Response) => {
    try {
      const { productId } = req.params;
      const variants = await this.variantService.getVariantsByProductId(productId);

      return res.json({
        success: true,
        data: variants,
      });
    } catch (error) {
      console.error('Error fetching variants:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des variants',
      });
    }
  };

  /**
   * GET /api/variants/:id
   * Récupérer un variant par ID
   */
  getVariantById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const variant = await this.variantService.getVariantById(id);

      if (!variant) {
        return res.status(404).json({
          success: false,
          message: 'Variant non trouvé',
        });
      }

      return res.json({
        success: true,
        data: variant,
      });
    } catch (error) {
      console.error('Error fetching variant:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du variant',
      });
    }
  };

  /**
   * POST /api/variants
   * Créer un nouveau variant
   */
  createVariant = async (req: Request, res: Response) => {
    try {
      const dto = Object.assign(new CreateVariantDto(), req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors,
        });
      }

      const variant = await this.variantService.createVariant(dto);

      return res.status(201).json({
        success: true,
        data: variant,
      });
    } catch (error) {
      console.error('Error creating variant:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du variant',
      });
    }
  };

  /**
   * PATCH /api/variants/:id
   * Mettre à jour un variant
   */
  updateVariant = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const dto = Object.assign(new UpdateVariantDto(), req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Données invalides',
          errors,
        });
      }

      const variant = await this.variantService.updateVariant(id, dto);

      if (!variant) {
        return res.status(404).json({
          success: false,
          message: 'Variant non trouvé',
        });
      }

      return res.json({
        success: true,
        data: variant,
      });
    } catch (error) {
      console.error('Error updating variant:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du variant',
      });
    }
  };

  /**
   * DELETE /api/variants/:id
   * Supprimer un variant
   */
  deleteVariant = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await this.variantService.deleteVariant(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Variant non trouvé',
        });
      }

      return res.json({
        success: true,
        message: 'Variant supprimé avec succès',
      });
    } catch (error) {
      console.error('Error deleting variant:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du variant',
      });
    }
  };

  /**
   * PATCH /api/variants/:id/stock
   * Mettre à jour le stock d'un variant
   */
  updateStock = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (typeof quantity !== 'number') {
        return res.status(400).json({
          success: false,
          message: 'Quantité invalide',
        });
      }

      const variant = await this.variantService.updateStock(id, quantity);

      if (!variant) {
        return res.status(404).json({
          success: false,
          message: 'Variant non trouvé',
        });
      }

      return res.json({
        success: true,
        data: variant,
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du stock',
      });
    }
  };
}
