import { User } from "../entity/User.entity";
import { encrypt } from "../infra/config/security/security.config";

export class AuthService {

    constructor(private userRepository: IUserRepository) {
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
