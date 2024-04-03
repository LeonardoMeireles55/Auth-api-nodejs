import { User } from "../../entity/User.entity";
import { encrypt } from "../../infra/config/security.config";
import { IUserRepository } from "../../repositories/Iuser.repository";
import IAuthService from "../interfaces/Iauth.service";

export class AuthService implements IAuthService {
  constructor(private userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async login(email: string, password: string): Promise<string | null> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        return null;
      }

      const isPasswordValid = await encrypt.comparepassword(
        user.password,
        password
      );

      if (!isPasswordValid) {
        return null;
      }

      const token = encrypt.generateToken({ id: user.id });
      return token;
    } catch (error) {
      console.log("Error occurred during login:", error);
      return null;
    }
  }

  async changePassword(
    email: string,
    password: string,
    newPassword: string
  ): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      const isPasswordValid = encrypt.comparepassword(user.password, password);

      if (!isPasswordValid) {
        return null;
      }

      user.password = await encrypt.encryptpass(newPassword);
      await this.userRepository.save(user);
    } catch (error) {
      console.log("Error occurred during change password:", error);
      return null;
    }
  }

  async getProfile(userId: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    return user;
  }
}
