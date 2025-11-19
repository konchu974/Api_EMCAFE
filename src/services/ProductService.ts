import { AppDataSource } from '../config/database';
import { Product } from '../entities/Product';
import { CreateProductDto } from '../dtos/product/CreateProductDto';
import { UpdateProductDto } from '../dtos/product/UpdateProductDto';

import { In, Like, MoreThan, LessThan, Between, Not } from 'typeorm';
import { CoffeeType } from '../entities/enums/coffee-type.enum';
import { RoastLevel } from '../entities/enums/roast-level.enum';

export class ProductService {
  private productRepository = AppDataSource.getRepository(Product);

  async createProduct(createProductDto: CreateProductDto) {
    // Vérification de l'unicité du nom pour éviter les doublons
    const existingProduct = await this.productRepository.findOne({
      where: { name: createProductDto.name }
    });

    if (existingProduct) {
      throw new Error('Un produit avec ce nom existe déjà');
    }

    const product = this.productRepository.create({
      ...createProductDto,
      is_active: 1, // Valeur par défaut (1 = active)
      created_at: new Date(),
      updated_at: new Date()
    });

    return await this.productRepository.save(product);
  }

  async getAllProducts(
    search?: string,
    minPrice?: number,
    maxPrice?: number,
    minIntensity?: number,
    maxIntensity?: number,
    coffeeTypes?: CoffeeType[],
    roastLevels?: RoastLevel[],
    limit: number = 10,
    offset: number = 0
  ) {
    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .where('product.is_active = :isActive', { isActive: 1 });

    if (search) {
      queryBuilder.andWhere('product.name LIKE :search OR product.description LIKE :search OR product.origin LIKE :search',
        { search: `%${search}%` });
    }

    if (minPrice || maxPrice) {
      queryBuilder.andWhere('product.price BETWEEN :minPrice AND :maxPrice', {
        minPrice: minPrice || 0,
        maxPrice: maxPrice || 999999
      });
    }

    if (minIntensity || maxIntensity) {
      queryBuilder.andWhere('product.intensity BETWEEN :minIntensity AND :maxIntensity', {
        minIntensity: minIntensity || 1,
        maxIntensity: maxIntensity || 10
      });
    }

    if (coffeeTypes && coffeeTypes.length > 0) {
      queryBuilder.andWhere('product.coffee_type IN (:...coffeeTypes)', { coffeeTypes });
    }

    if (roastLevels && roastLevels.length > 0) {
      queryBuilder.andWhere('product.roast_level IN (:...roastLevels)', { roastLevels });
    }

    return await queryBuilder
      .orderBy('product.created_at', 'DESC')
      .take(limit)
      .skip(offset)
      .getManyAndCount();
  }

  async getProductById(id: string) {
    const product = await this.productRepository.findOne({
      where: { id_product: id },
      relations: ['orderItems'] // Si vous voulez charger les relations
    });

    if (!product) {
      throw new Error('Produit non trouvé');
    }

    return product;
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    // Vérification de l'unicité du nom si celui-ci est modifié
    if (updateProductDto.name) {
      const existingProduct = await this.productRepository.findOne({
        where: { name: updateProductDto.name, id_product: Not(id) }
      });

      if (existingProduct) {
        throw new Error('Un autre produit avec ce nom existe déjà');
      }
    }

    const payload: any = {
      ...updateProductDto,
      updated_at: new Date()
    };

    if (updateProductDto.is_active !== undefined) {
      // convert boolean (from DTO) to numeric value expected by the entity/database
      payload.is_active = updateProductDto.is_active ? 1 : 0;
    }

    const result = await this.productRepository.update(id, payload);

    if (result.affected === 0) {
      throw new Error('Produit non trouvé');
    }

    return this.getProductById(id);
  }

  async deleteProduct(id: string) {
    // Désactivation plutôt que suppression physique
    const result = await this.productRepository.update(id, {
      is_active: 0,
      updated_at: new Date()
    });

    if (result.affected === 0) {
      throw new Error('Produit non trouvé');
    }

    return { message: 'Produit désactivé avec succès' };
  }

  async updateStock(id: string, quantity: number) {
  const product = await this.productRepository.findOne({
    where: { id_product: id },
  });

  if (!product) {
    throw new Error('Produit non trouvé');
  }

  if (product.stock + quantity < 0) {
    const error = new Error('Stock insuffisant');
    (error as any).currentStock = product.stock; 
    throw error;
  }

  product.stock += quantity;
  product.updated_at = new Date();
  return await this.productRepository.save(product);
}

  async getLowStockProducts(threshold: number = 5) {
    return await this.productRepository.find({
      where: {
        stock: LessThan(threshold),
        is_active: 1
      },
      order: {
        stock: 'ASC'
      }
    });
  }

  async getProductsByIntensityRange(min: number, max: number) {
    return await this.productRepository.find({
      where: {
        intensity: Between(min, max),
        is_active: 1
      },
      order: {
        intensity: 'ASC'
      }
    });
  }

  async getFeaturedProducts(limit: number = 4) {
    return await this.productRepository.find({
      where: { is_active: 1 },
      order: {
        created_at: 'DESC'
      },
      take: limit
    });
  }
}
