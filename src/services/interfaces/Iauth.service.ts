import { User } from "../../entity/User.entity";

export default interface IAuthService {
    login(email: string, password: string): Promise<string | null>;
    changePassword(email: string, password: string, newPassword: string): Promise<void>;
    getProfile(userId: string): Promise<User | null>;
 }