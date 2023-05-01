import {IRepository} from './IRepository';
import { IUser } from './IUser';

export interface IUserRepository extends IRepository<IUser> {
  updatePassword(id: string, newPsw: string) : void;
  updateLogin(id: string, newLogin: string) : void;
  updateScore(id: string, newScore: number) : void;
}
