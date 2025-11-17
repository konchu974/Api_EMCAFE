import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { AuthRequest } from '../middlewares/authMiddleware';

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

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this.userService.login(email, password);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
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

  delete = async (req: Request, res: Response) => {
    try {
      const result = await this.userService.delete(req.params.id);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  };
}
