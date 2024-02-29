import { Repository } from "typeorm";
import { AppDataSource } from "../infra/config/database/data-source";
import { User } from "../entity/User.entity";
import { encrypt } from "../infra/config/security/security.config";

export class AuthService {

    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

  async login(email: string, password: string): Promise<string | null> {
      
      const user = await this.userRepository.findOne({ where: { email } });
      
      const isPasswordValid = encrypt.comparepassword(user.password, password);

      if (!isPasswordValid) {
        return null;
      }

      const token = encrypt.generateToken({ id: user.id });
      return token;

  }

  async getProfile(userId: string): Promise<User | null> {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      return user;
  }
}
