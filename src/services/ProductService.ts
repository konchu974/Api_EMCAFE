import { AppDataSource } from '../config/database';
import { UserAccount } from '../entities/UserAccount';
import { RegisterDto } from '../dtos/user/RegisterDto';
import { LoginDto } from '../dtos/user/LoginDto';
import { hashPassword, comparePassword } from '../utils/hashPassword';
import { generateToken } from '../utils/jwt';

export class UserService {
  private userRepository = AppDataSource.getRepository(UserAccount);

  async register(RegisterDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: RegisterDto.email },
    });

    if (existingUser) {
      throw new Error('Email déjà utilisé');
    }

    const hashedPassword = await hashPassword(RegisterDto.password);

    const user = this.userRepository.create({
      ...RegisterDto,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(LoginDto: LoginDto) {
    const user = await this.userRepository.findOne({ where: { email: LoginDto.email } });

    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const isValidPassword = await comparePassword(LoginDto.password, user.password);

    if (!isValidPassword) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const token = generateToken({
      id: user.id_user_account,
      email: user.email,
      role: user.role,
    });

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async findAll() {
    return await this.userRepository.find({
      select: ['id_user_account', 'first_name', 'last_name', 'email', 'role'],
    });
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id_user_account: id },
      select: ['id_user_account', 'first_name', 'last_name', 'email', 'role'],
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return user;
  }

  async delete(id: string) {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new Error('Utilisateur non trouvé');
    }

    return { message: 'Utilisateur supprimé' };
  }
}
