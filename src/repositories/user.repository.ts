import { Repository } from "typeorm";
import { User } from "../entity/User.entity";
import { AppDataSource } from "../data-source";
import { IUserRepository } from "./Iuser.repository";
import UserDTO from "../dto/user.dto";

export class UserRepository implements IUserRepository {
    
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }
    getUserByEmail(email: string): Promise<any> {
        return this.userRepository.findOne({ where: { email } });
    }
    
    find(): Promise<any[]> {
        return this.userRepository.find();
    }

    public getUserRepository(): Repository<User> {
        return this.userRepository;
    }

    exists(where: any): Promise<boolean> {
        return this.userRepository.exists(where);
    }

    save(user: UserDTO): Promise<User> {
        return this.userRepository.save(user);
    }

    remove(user: User): void {
        this.userRepository.remove(user);
    }

    findOne(where: any): Promise<User> {
        return this.userRepository.findOne(where);
    }

    update(user: User): Promise<User> {
        return this.userRepository.save(user);
    }
}