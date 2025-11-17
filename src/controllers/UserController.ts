import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { AuthRequest } from '../middlewares/authMiddleware';
import { LoginDto } from '../dtos/user/LoginDto';

export class UserController {
  private userService = new UserService();

  register = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.register(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const loginDto: LoginDto = req.body;

      // Validation
      if (!loginDto.email || !loginDto.password) {
        res.status(400).json({
          success: false,
          message: 'Email et mot de passe requis',
        });
        return;
      }

      const result = await this.userService.login(loginDto);

      res.status(200).json({
        success: true,
        message: 'Connexion réussie',
        data: result,
      });
    } catch (error: any) {
      console.error('❌ Erreur lors de la connexion:', error);
      
      res.status(401).json({
        success: false,
        message: error.message || 'Email ou mot de passe incorrect',
      });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const users = await this.userService.findAll();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.findById(req.params.id);
      res.json(user);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  };

  getProfile = async (req: AuthRequest, res: Response) => {
    try {
      const user = await this.userService.findById(req.user.id);
      res.json(user);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.UpdateUser(req.params.id, req.body);
      res.json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const result = await this.userService.delete(req.params.id);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  };
}
