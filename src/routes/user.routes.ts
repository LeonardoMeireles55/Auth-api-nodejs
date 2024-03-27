import * as express from "express";

import { authentification } from "../infra/middleware/auth.middleware";
import { UserController } from "../controllers/user.controller";
import { authorization } from "../infra/middleware/auth.middleware";
import { AuthController } from "../controllers/auth.controller";
import { UserRepository } from "../repositories/user.repository";
import tokenCache from "../utils/tokenCache.utils";
import EmailService from "../services/implementations/email.service";
import { UserService } from "../services/implementations/user.service";
import { AuthService } from "../services/implementations/auth.service";

const Router = express.Router();

const emailService = new EmailService();

const userRepository = new UserRepository();

const userService = new UserService(userRepository, tokenCache);
const authService = new AuthService(userRepository);

const userController = new UserController(userService, emailService);

const authController = new AuthController(authService);

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
Router.post("/forgotPassword", (req, res) => userController.generateRecoveryToken(req, res));
Router.post("/updatePassword", (req, res) => userController.updatePassword(req, res));

Router.post('/sendEmail',
  authentification,
  authorization(["admin"]),
  (req, res) => userController.sendEmail(req, res));

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