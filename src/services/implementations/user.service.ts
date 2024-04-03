import { User } from "../../entity/User.entity";
import { encrypt } from "../../infra/config/security.config";
import * as cache from "memory-cache";
import { plainToClass } from "class-transformer";
import UserDTO from "../../dto/user.dto";
import { IUserRepository } from "../../repositories/Iuser.repository";
import IUserService from "../interfaces/Iuser.service";

export class UserService implements IUserService {
  constructor(
    private userRepository: IUserRepository,
    private tokenCache: any
  ) {
    this.userRepository = userRepository;
  }

  mapUserToDTO(user: User): UserDTO {
    const userDTO = plainToClass(UserDTO, user);
    return userDTO;
  }

  async generateRecoveryToken(email: string): Promise<string> {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    const token =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    this.tokenCache.set(user.id, token);

    return token;
  }

  async updatePassword(
    email: string,
    password: string,
    token: string
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error("User not found");
    }

    if (this.tokenCache.get(user.id) !== token) {
      throw new Error("Invalid token");
    }

    const encryptedPassword = await encrypt.encryptpass(password);

    user.password = encryptedPassword;

    await this.userRepository.save(user);
  }

  async existsUserByEmail(email: string): Promise<boolean> {
    return await this.userRepository.exists({ where: { email } });
  }

  async existsUserById(id: string): Promise<boolean> {
    return await this.userRepository.exists({ where: { id } });
  }

  async createUser(userDTO: UserDTO): Promise<UserDTO> {
    const encryptedPassword = await encrypt.encryptpass(userDTO.password);
    userDTO.password = encryptedPassword;

    return await this.userRepository.save(userDTO);
  }

  async getUsersFromCacheOrDb(): Promise<UserDTO[]> {
    const data = cache.get("data");

    if (data) {
      console.log("Serving from cache");
      return data;
    } else {
      console.log("Serving from db");
      const users = await this.userRepository.find();
      const response = users.map((user) => this.mapUserToDTO(user));

      cache.put("data", response, 6000);
      return response;
    }
  }

  async updateUserById(id: string, name: string, email: string): Promise<void> {
    const user = await this.getUserById(id);

    user.username = name;
    user.email = email;

    return await this.userRepository.save(user);
  }

  async deleteUserById(id: string): Promise<void> {
    const user = await this.getUserById(id);
    await this.userRepository.remove(user);
  }

  async getUserById(id: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }
}
