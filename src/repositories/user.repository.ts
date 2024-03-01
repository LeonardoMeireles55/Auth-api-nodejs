import { Repository } from "typeorm";
import { User } from "../entity/User.entity";
import { AppDataSource } from "../infra/config/database/data-source";

export class UserRepository implements IUserRepository {
    
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
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

    save(user: User): Promise<User> {
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