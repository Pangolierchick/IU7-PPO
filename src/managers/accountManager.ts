import { Hash } from '../hash';
import { INITIAL_SCORE, IUser, UserRole } from '../interfaces/IUser';
import { IUserRepository } from '../interfaces/IUserRepository';
import {v4 as uuidv4} from 'uuid';

export class AccountManager {
  private _userRepository: IUserRepository;

  constructor(userRepo: IUserRepository) {
    this._userRepository = userRepo;
  }

  public checkUser(id: string): boolean {
    const user = this._userRepository.get(id);

    return !!user;
  }

  public addUser(login: string, password: string) {
    const user = userBuilder.buildUser(login, password);
    this._userRepository.create(user);

    return user.id;
  }

  public addAdmin(login: string, password: string) {
    const admin = userBuilder.buildAdmin(login, password);
    this._userRepository.create(admin);

    return admin.id;
  }

  public updateUser(newUser: IUser) {
    const user = this._userRepository.get(newUser.id);

    if (user === undefined) {
      throw new Error(`User with id = ${newUser.id} doesn't exist`);
    }

    this._userRepository.update(newUser);
  }
}

class userBuilder {
  public static buildUser(login: string, password: string): IUser {
    return {
      id: uuidv4(),
      login: login,
      password: Hash.hash(password),
      score: INITIAL_SCORE,
      role: UserRole.User,
    };
  }

  public static buildAdmin(login: string, password: string): IUser {
    return {
      id: uuidv4(),
      login: login,
      password: Hash.hash(password),
      score: INITIAL_SCORE,
      role: UserRole.Admin,
    };
  }
}
