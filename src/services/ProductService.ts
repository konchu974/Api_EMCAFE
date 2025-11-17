import { AppDataSource } from '../config/database';
import { Product } from '../entities/Product';
import { CreateProductDto } from '../dtos/product/CreateProductDto';
import { UpdateProductDto } from '../dtos/product/UpdateProductDto';

export class ProductService {
  private productRepository = AppDataSource.getRepository(Product);

  async create(createProductDto: CreateProductDto) {
    const existingProduct = await this.productRepository.findOne({
      where: { name: createProductDto.name },
    });

    if (existingProduct) {
      throw new Error('Ce produit existe déjà');
    }

    const product = this.productRepository.create({
      ...createProductDto,
    });

    await this.productRepository.save(product);

    return product;
  }

  async findAll() {
    return await this.productRepository.find({
      select: ['id_product', 'name', 'description', 'price', 'quantity', 'created_at', 'updated_at'] as (keyof Product)[],
    });
  }

  async findById(id: string) {
    const product = await this.productRepository.findOne({
      where: { id_product: id },
      select: ['id_product', 'name', 'description', 'price', 'quantity', 'created_at', 'updated_at'] as (keyof Product)[],
    });

    if (!product) {
      throw new Error('Produit non trouvé');
    }

    return product;
  }

  async delete(id: string) {
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new Error('Produit non trouvé');
    }

    return { message: 'Produit supprimé' };
  }
}
