import UserDTO from "../../dto/user.dto";
import { User } from "../../entity/User.entity";

export default interface IUserService {
    generateRecoveryToken(email: string): Promise<string>;
    updatePassword(email: string, password: string, token: string): Promise<void>;
    existsUserByEmail(email: string): Promise<boolean>;
    mapUserToDTO(user: User): UserDTO;
    createUser(user: UserDTO): Promise<UserDTO>;
    existsUserById(id: string): Promise<boolean>;
    getUsersFromCacheOrDb(): Promise<UserDTO[]>;
    getUserByEmail(email: string): Promise<any>;
    updateUserById(id: string, name:string, email: string): Promise<void>;
    deleteUserById(id: string): Promise<void>;
}