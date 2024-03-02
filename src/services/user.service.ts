import { User } from "../entity/User.entity";
import { encrypt } from "../infra/config/security/security.config";
import * as cache from "memory-cache";
import userDTO from "../dto/user.dto";
import { plainToClass } from "class-transformer";
import UserDTO from "../dto/user.dto";
import { Repository } from "typeorm";
import { EmailService } from "./email.service";
import { UUID } from "typeorm/driver/mongodb/bson.typings";

export class UserService {

    private EmailService = new EmailService();

    private TokenHashMap = new Map();

    constructor(private userRepository: Repository<User>) {
        this.userRepository = userRepository;
    }

    async generateRecoveryToken(email: string): Promise<string> {
        const user = await this.userRepository.findOne({ where: { email } });

        if (!user) {
            throw new Error("User not found");
        }

        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        this.TokenHashMap.set(user.id, token);

        await this.sendEmail(user.email, "Password Recovery", `Your recovery token is: ${token}`);

        return "Verify your email to recover your password.";
    }

    async updatePassword(email: string, password: string, token: string): Promise<void> {
        const user = await this.userRepository.findOne({ where: { email } });

        if (!user) {
            throw new Error("User not found");
        }

        if (this.TokenHashMap.get(user.id) !== token) {
            throw new Error("Invalid token");
        }

        const encryptedPassword = await encrypt.encryptpass(password);

        user.password = encryptedPassword;

        await this.userRepository.save(user);
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
