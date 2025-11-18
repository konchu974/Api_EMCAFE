import { AppDataSource } from '../config/database';
import { Order } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';
import { Product } from '../entities/Product';
import { CreateOrderDto } from '../dtos/order/CreateOrderDto';
import { UpdateOrderStatusDto } from '../dtos/order/UpdateOrderStatusDto';

export class OrderService {
  private orderRepository = AppDataSource.getRepository(Order);
  private orderItemRepository = AppDataSource.getRepository(OrderItem);
  private productRepository = AppDataSource.getRepository(Product);

  async createOrder(createOrderDto: CreateOrderDto) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Créer la commande
      const order = queryRunner.manager.create(Order, {
        id_user_account: createOrderDto.id_user_account,
        status: 'PENDING',
        total: 0,
      });
      await queryRunner.manager.save(order);

      let total = 0;

      // Créer les items de commande
      for (const item of createOrderDto.items) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id_product: item.id_product },
        });

        if (!product) {
          throw new Error(`Produit ${item.id_product} non trouvé`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Stock insuffisant pour le produit ${product.name}`);
        }

        const subtotal = product.price * item.quantity;
        total += subtotal;

        // Créer l'order item
        const orderItem = queryRunner.manager.create(OrderItem, {
          id_order: order.id_order,
          quantity: item.quantity,
          subtotal,
        });
        await queryRunner.manager.save(orderItem);

    
        // Mettre à jour le stock
        product.stock -= item.quantity;
        await queryRunner.manager.save(product);
      }

      // Mettre à jour le total de la commande
      order.total = total;
      await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();

      return await this.getOrderById(order.id_order);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllOrders() {
    return await this.orderRepository.find({
      relations: ['user', 'orderItems', 'orderItems.orderItemProducts', 'orderItems.orderItemProducts.product'],
    });
  }

  async getOrderById(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id_order: id },
      relations: ['user', 'orderItems', 'orderItems.orderItemProducts', 'orderItems.orderItemProducts.product'],
    });

    if (!order) {
      throw new Error('Commande non trouvée');
    }

    return order;
  }

  async getOrdersByUserId(userId: string) {
    return await this.orderRepository.find({
      where: { id_user_account: userId },
      relations: ['orderItems', 'orderItems.orderItemProducts', 'orderItems.orderItemProducts.product'],
      order: { order_date: 'DESC' },
    });
  }

  async updateOrderStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    const order = await this.orderRepository.findOne({
      where: { id_order: id },
    });

    if (!order) {
      throw new Error('Commande non trouvée');
    }

    order.status = updateOrderStatusDto.status;
    return await this.orderRepository.save(order);
  }

  async deleteOrder(id: string) {
    const result = await this.orderRepository.delete(id);

    if (result.affected === 0) {
      throw new Error('Commande non trouvée');
    }

    return { message: 'Commande supprimée avec succès' };
  }
}
