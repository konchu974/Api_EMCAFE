import { AppDataSource } from '../config/database';
import { Product } from '../entities/Product';
import { CreateProductDto } from '../dtos/product/CreateProductDto';
import { UpdateProductDto } from '../dtos/product/UpdateProductDto';

export class ProductService {
  private productRepository = AppDataSource.getRepository(Product);

  async createProduct(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async getAllProducts() {
    return await this.productRepository.find();
  }

  async getProductById(id: string) {
    const product = await this.productRepository.findOne({
      where: { id_product: id },
    });

    if (!product) {
      throw new Error('Produit non trouvé');
    }

    return product;
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({
      where: { id_product: id },
    });

    if (!product) {
      throw new Error('Produit non trouvé');
    }

    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async deleteProduct(id: string) {
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new Error('Produit non trouvé');
    }

    return { message: 'Produit supprimé avec succès' };
  }

  async updateStock(id: string, quantity: number) {
    const product = await this.productRepository.findOne({
      where: { id_product: id },
    });

    if (!product) {
      throw new Error('Produit non trouvé');
    }

    if (product.stock + quantity < 0) {
      throw new Error('Stock insuffisant');
    }

    product.stock += quantity;
    return await this.productRepository.save(product);
  }
}
