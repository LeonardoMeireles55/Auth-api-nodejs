import { User } from "../entity/User.entity";
import { encrypt } from "../infra/config/security/security.config";
import * as cache from "memory-cache";
import userDTO from "../dto/user.dto";
import { plainToClass } from "class-transformer";
import UserDTO from "../dto/user.dto";
import { Repository } from "typeorm";
import { EmailService } from "./email.service";

export class UserService {

    private EmailService = new EmailService();

    constructor(private userRepository: Repository<User>) {
        this.userRepository = userRepository;
    }

    async sendEmail(to: string, subject: string, body: string) {
        await this.EmailService.sendEmail(to, subject, body);
    }

    mapUserToDTO(user: User): userDTO {
        const userDTO = plainToClass(UserDTO, user);
        return userDTO;
    }

    async existsUserByEmail(email: string): Promise<boolean> {
        return await this.userRepository.exists({ where: { email } })
    }

    async existsUserById(id: string): Promise<boolean> {
        return await this.userRepository.exists({ where: { id } })
    }

    async createUser(userDTO: userDTO): Promise<UserDTO> {

        const encryptedPassword = await encrypt.encryptpass(userDTO.password);
        userDTO.password = encryptedPassword;

        return await this.userRepository.save(userDTO);
    }

    async getUsersFromCacheOrDb(): Promise<userDTO[]> {
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

    async updateUserById(id: string, name: string, email: string): Promise<User> {
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
}
