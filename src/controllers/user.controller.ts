import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import userDTO from "../dto/user.dto";
import  { HTTPStatusCode }  from "../enums/http-status-code.enum";
import  { ErrorMessages }  from "../enums/error-messages.enum";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async signup(req: Request, res: Response) {
    try {
      const request = req.body as userDTO;
      if(this.userService.existsUserByEmail(request.email)) {
        return res.status(HTTPStatusCode.Conflict).json(ErrorMessages.DuplicateEntryFail).send();
      }
      await this.userService.createUser(request)
      return res.status(201).json({ message: "User created successfully" }).send();
  } catch (error) {
    console.error(`Error in signup: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
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
      console.error(`Error in getUsers: ${error.message}`);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {

      const { id } = req.params;
      const { name, email } = req.body;

      if(!this.userService.existsUserById(id)) {
        return res.status(HTTPStatusCode.NotFound).json(ErrorMessages.NotFound).send();
      }

      const updatedUser = await this.userService.updateUserById(id, name, email);
      return res.status(200).json({ message: "Update successful", user: updatedUser });
    } catch (error) {
      console.error(`Error in updateUser: ${error.message}`);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if(!this.userService.existsUserById(id)) {
        return res.status(HTTPStatusCode.NotFound).json(ErrorMessages.NotFound).send();
      }
      await this.userService.deleteUserById(id);

      return res.status(204).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error(`Error in deleteUser: ${error.message}`);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
