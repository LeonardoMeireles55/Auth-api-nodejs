export interface IUserRepository {
    exists(where: any): Promise<boolean>
    save(user: any): Promise<any>
    find(): Promise<any[]>
    remove(user: any): void
    findOne(where: any): Promise<any>
    update(user: any): Promise<any>
  }