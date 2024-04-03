import { Request, Response } from "express";
import { HTTPStatusCode } from "../constants/http-status-code.enum";
import { ErrorMessages } from "../constants/error-messages.enum";
import { HTTPMessages } from "../constants/http-messages.constants";
import { validate } from "class-validator";
import UserDTO from "../dto/user.dto";
import { plainToClass } from "class-transformer";
import createEmailDTO from "../dto/email.dto";
import IUserService from "../services/interfaces/Iuser.service";
import IEmailService from "../services/interfaces/Iemail.service";

export class UserController {
  constructor(
    private userService: IUserService,
    private emailService: IEmailService
  ) {
    this.userService = userService;
    this.emailService = emailService;
  }

  async generateRecoveryToken(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const token = await this.userService.generateRecoveryToken(email);

      await this.emailService.sendEmail(
        email,
        "Password recovery",
        `Your token is: ${token}`
      );

      return res.status(200).json(`Verify your email: ${email}`).send();
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  async updatePassword(req: Request, res: Response) {
    try {
      const { email, password, token } = req.body;

      await this.userService.updatePassword(email, password, token);
      return res
        .status(200)
        .json({ message: "Password updated successfully" })
        .send();
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  async sendEmail(req: Request, res: Response) {
    try {
      const emailToSend = plainToClass(createEmailDTO, req.body);
      const errors = await validate(emailToSend);

      if (errors.length > 0) {
        return res
          .status(HTTPStatusCode.BadRequest)
          .json(errors.map((error) => error.property + ": is invalid"))
          .send();
      }

      await this.emailService.sendEmail(
        emailToSend.to,
        emailToSend.subject,
        emailToSend.body
      );
      return res.status(200).json().send();
    } catch {
      return res.status(500).json().send();
    }
  }

  async signup(req: Request, res: Response) {
    try {
      const userDTO = plainToClass(UserDTO, req.body);
      const errors = await validate(userDTO);

      if (errors.length > 0) {
        return res
          .status(HTTPStatusCode.BadRequest)
          .json(errors.map((error) => error.property + " is invalid"))
          .send();
      }

      if (await this.userService.existsUserByEmail(userDTO.email)) {
        return res
          .status(HTTPStatusCode.Conflict)
          .json(HTTPMessages.CONFLICT + ErrorMessages.DuplicateEntryFail)
          .send();
      }

      await this.userService.createUser(userDTO);
      return res
        .status(201)
        .json({ message: "User created successfully" })
        .send();
    } catch (error) {
      return res.status(500).json(error.message).send();
    }
  }

  async getUsers(res: Response) {
    try {
      const data = await this.userService.getUsersFromCacheOrDb();

      if (data.length === 0) {
        return res
          .status(HTTPStatusCode.NotFound)
          .json(ErrorMessages.NotFound)
          .send();
      }

      return res.status(200).json({ data });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      if (!(await this.userService.existsUserById(id))) {
        return res
          .status(HTTPStatusCode.NotFound)
          .json(ErrorMessages.NotFound)
          .send();
      }

      const updatedUser = await this.userService.updateUserById(
        id,
        name,
        email
      );
      return res
        .status(200)
        .json({ message: "Update successful", user: updatedUser });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!(await this.userService.existsUserById(id))) {
        return res
          .status(HTTPStatusCode.NotFound)
          .json(ErrorMessages.NotFound)
          .send();
      }

      await this.userService.deleteUserById(id);
      return res.status(204).json({ message: "User deleted successfully" });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
}
