import { AppDataSource } from '../config/database';
import { CreateVariantDto } from '../dtos/product/CreateVariant';
import { UpdateVariantDto } from '../dtos/product/UpdateVariant';
import { ProductVariant } from '../entities/ProductVariant';


export class VariantService {
  private variantRepository = AppDataSource.getRepository(ProductVariant);

  /**
   * Récupérer tous les variants d'un produit
   */
  async getVariantsByProductId(productId: string): Promise<ProductVariant[]> {
    return this.variantRepository.find({
      where: { 
        productId,
        isActive: true 
      },
      order: { price: 'ASC' },
    });
  }

  /**
   * Récupérer un variant par ID
   */
  async getVariantById(variantId: string): Promise<ProductVariant | null> {
    return this.variantRepository.findOne({
      where: { idVariant: variantId },
    });
  }

  /**
   * Créer un nouveau variant
   */
  async createVariant(data: CreateVariantDto): Promise<ProductVariant> {
    const variant = this.variantRepository.create({
      productId: data.productId,
      format: data.format,
      price: data.price,
      stock: data.stock,
      sku: data.sku || null,
      isActive: data.isActive ?? true,
    });

    return this.variantRepository.save(variant);
  }

  /**
   * Mettre à jour un variant
   */
  async updateVariant(
    variantId: string,
    data: UpdateVariantDto
  ): Promise<ProductVariant | null> {
    const variant = await this.getVariantById(variantId);
    if (!variant) return null;

    Object.assign(variant, data);
    return this.variantRepository.save(variant);
  }

  /**
   * Supprimer un variant (soft delete)
   */
  async deleteVariant(variantId: string): Promise<boolean> {
    const result = await this.variantRepository.update(variantId, {
      isActive: false,
    });

    return result.affected === 1;
  }

  /**
   * Supprimer définitivement un variant
   */
  async hardDeleteVariant(variantId: string): Promise<boolean> {
    const result = await this.variantRepository.delete(variantId);
    return result.affected === 1;
  }

  /**
   * Mettre à jour le stock d'un variant
   */
  async updateStock(variantId: string, quantity: number): Promise<ProductVariant | null> {
    const variant = await this.getVariantById(variantId);
    if (!variant) return null;

    variant.stock = Math.max(0, variant.stock + quantity);
    return this.variantRepository.save(variant);
  }
}
