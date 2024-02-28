import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User.entity";
import { encrypt } from "../helpers/helpers";

export class AuthService {

    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

  async login(email: string, password: string): Promise<string | null> {
    try {
      if (!email || !password) {
        return null;
    }

      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        return null;
    }

      const isPasswordValid = encrypt.comparepassword(user.password, password);

      if (!isPasswordValid) {
        return null;
      }

      const token = encrypt.generateToken({ id: user.id });
      return token;
    } catch (error) {
      console.error(error);
      throw new Error("Internal server error");
    }
  }

  async getProfile(userId: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      return user;
    } catch (error) {
      console.error(error);
      throw new Error("Internal server error");
    }
  }
}
