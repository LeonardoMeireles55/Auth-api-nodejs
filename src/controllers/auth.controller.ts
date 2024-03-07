import { Request, Response } from "express";
import loginDTO from "../dto/login.dto";
import { plainToClass } from "class-transformer";
import { HTTPStatusCode } from "../constants/http-status-code.enum";
import { HTTPMessages } from "../constants/http-messages.constants";
import IAuthService from "../services/interfaces/Iauth.service";

export class AuthController {

  constructor(private authService : IAuthService) {
    this.authService = authService;
  }

  async login(req: Request, res: Response) {
    try {

      const requestDTO = plainToClass(loginDTO, req.body);

      const token = await this.authService.login(requestDTO.email, requestDTO.password);

      if (!token) {
        return res.status(HTTPStatusCode.Unauthorized).json(HTTPMessages.UNAUTHORIZED).send();
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
