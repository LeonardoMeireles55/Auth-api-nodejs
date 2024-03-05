import { User } from "../entity/User.entity";
import { encrypt } from "../infra/config/security.config";
import { IUserRepository } from "../repositories/Iuser.repository";

export class AuthService {

  constructor(private userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async login(email: string, password: string): Promise<string | null> {

    const user = await this.userRepository.findOne({ where: { email } });

    const isPasswordValid = encrypt.comparepassword(user.password, password);

    if (!isPasswordValid) {
      return null
    }

    const token = encrypt.generateToken({ id: user.id });
    return token;

  }

  async changePassword(email: string, password: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    const isPasswordValid = encrypt.comparepassword(user.password, password);

    if (!isPasswordValid) {
      return null;
    }

    user.password = await encrypt.encryptpass(newPassword);
    await this.userRepository.save(user);

  }

  async getProfile(userId: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    return user;
  }


}
