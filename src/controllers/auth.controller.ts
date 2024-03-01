import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import loginDTO from "../dto/login.dto";
import { plainToClass } from "class-transformer";
import { UserRepository } from "../repositories/user.repository";

export class AuthController {

  private authService: AuthService;

  constructor(userRepository: UserRepository) {
    this.authService = new AuthService(userRepository.getUserRepository());
  }

  async login(req: Request, res: Response) {
    try {

      const requestDTO = plainToClass(loginDTO, req.body);

      const token = await this.authService.login(requestDTO.email, requestDTO.password);

      if (!token) {
        return res.status(404).json({ message: "Invalid credentials" });
      }
      
      return res.status(200).json({ token });

    } catch (error) {
      return res.status(500).json( error.message );
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      if (!req["currentUser"]) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = req["currentUser"].id;
      const user = await this.authService.getProfile(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
      
    } catch (error) {
      return res.status(500).json( error.message );
    }
  }
}
