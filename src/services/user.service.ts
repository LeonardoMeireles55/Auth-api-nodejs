import { User } from "../entity/User.entity";
import { encrypt } from "../infra/config/security/security.config";
import { AppDataSource } from "../infra/config/database/data-source";
import { Repository } from "typeorm";
import * as cache from "memory-cache";
import userDTO from "../dto/user.dto";

export class UserService {

    private userRepository: Repository<User>;


    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    mapUserToDTO(user: User): userDTO {
        const dto = new userDTO();
        dto.id = user.id;
        dto.username = user.username;
        dto.firstname = user.firstname;
        dto.lastname = user.lastname;
        dto.dateBirth = user.dateBirth;
        dto.postalCode = user.postalCode;
        dto.state = user.state;
        dto.city = user.city;
        dto.street = user.street;
        dto.email = user.email;
        dto.enabled = user.enabled;
        dto.createdAt = user.createdAt;
        dto.updatedAt = user.updatedAt;
        return dto;
    }

    async existsUserByEmail(email: string): Promise<boolean> {
        return await this.userRepository.exists({ where: { email } })
    }

    async existsUserById(id: string): Promise<boolean> {
        return await this.userRepository.exists({ where: { id } })
    }

    async createUser(userDTO: userDTO): Promise<User> {
        const {
            username,
            firstname,
            lastname,
            dateBirth,
            postalCode,
            state,
            city,
            street,
            email,
            password,
        } = userDTO;

        const encryptedPassword = await encrypt.encryptpass(password);

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
