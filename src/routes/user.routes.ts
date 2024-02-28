import * as express from "express";
import { authentification } from "../infra/middleware/auth.middleware";
import { UserController } from "../controllers/user.controller";
import { authorization } from "../infra/middleware/auth.middleware";
import { AuthController } from "../controllers/auth.controller";
import UserDTO from "../dto/user.dto";
const Router = express.Router();

const userController = new UserController();
const authController = new AuthController();

Router.get(
  "/users",
  authentification,
  authorization(["admin"]),
  (req, res) => userController.getUsers(res)
);
Router.get(
  "/profile",
  authentification,
  authorization(["user", "admin"]),
  (req, res) => authController.getProfile(req, res)
);
Router.post('/signup', (req, res) => userController.signup(req, res));
Router.post("/login", (req, res) => authController.login(req, res));

Router.put(
  "/update/:id",
  authentification,
  authorization(["user", "admin"]), (req, res) => userController.updateUser(req, res)
);
Router.delete(
  "/delete/:id",
  authentification,
  authorization(["admin"]),
  (req, res) => userController.deleteUser(req, res)
);
export { Router as userRouter };