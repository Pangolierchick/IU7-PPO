import { IRepository } from "./IRepository";
import { IUser } from "./IUser";

export interface IUserRepository extends IRepository<IUser> {
  updatePassword(id: string, newPsw: string): Promise<void>;
  updateLogin(id: string, newLogin: string): Promise<void>;
  updateScore(id: string, newScore: number): Promise<void>;
  getByLogin(login: string): Promise<IUser | null>;
}
