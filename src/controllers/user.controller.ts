import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { HTTPStatusCode } from "../constants/enums/http-status-code.enum";
import { ErrorMessages } from "../constants/enums/error-messages.enum";
import { HTTPMessages } from "../constants/http-messages.constants";
import { validate } from "class-validator";
import UserDTO from "../dto/user.dto";
import { plainToClass } from "class-transformer";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async signup(req: Request, res: Response) {
    try {

      const userDTO = plainToClass(UserDTO, req.body);
      const errors = await validate(userDTO);

      if(errors.length > 0) {
        return res.status(HTTPStatusCode.BadRequest).json(errors.map((error => error.property + " is invalid"))).send();
      }
      
      
      if (await this.userService.existsUserByEmail(userDTO.email)) {
        return res.status(HTTPStatusCode.Conflict).json(HTTPMessages.CONFLICT + ErrorMessages.DuplicateEntryFail).send();
      }

      await this.userService.createUser(userDTO);
      return res.status(201).json({ message: "User created successfully" }).send();

    } catch (error) {
      return res.status(500).json( error.message ).send();
    }
  }

  async getUsers(res: Response) {
    try {

      const data = await this.userService.getUsersFromCacheOrDb();

      if (data.length === 0) {
        return res.status(HTTPStatusCode.NotFound).json(ErrorMessages.NotFound).send();
      }

      return res.status(200).json({ data });

    } catch (error) {
      return res.status(500).json( error.message );
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      if (!await this.userService.existsUserById(id)) {
        return res.status(HTTPStatusCode.NotFound).json(ErrorMessages.NotFound).send();
      }

      const updatedUser = await this.userService.updateUserById(id, name, email);
      return res.status(200).json({ message: "Update successful", user: updatedUser });

    } catch (error) {
      return res.status(500).json( error.message );
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!await this.userService.existsUserById(id)) {
        return res.status(HTTPStatusCode.NotFound).json(ErrorMessages.NotFound).send();
      }

      await this.userService.deleteUserById(id);
      return res.status(204).json({ message: "User deleted successfully" });

    } catch (error) {
      return res.status(500).json( error.message );
    }
  }
}
