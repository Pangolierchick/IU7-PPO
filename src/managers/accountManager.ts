import * as jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { Hash } from "../hash";
import { INITIAL_SCORE, IUser, UserRole } from "../interfaces/IUser";
import { IUserRepository } from "../interfaces/IUserRepository";

interface IUserTokenPayload {
  userId: string;
}

class UserBuilder {
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

export class AccountManager {
  private _userRepository: IUserRepository;

  constructor(userRepo: IUserRepository) {
    this._userRepository = userRepo;
  }

  private getSecret() {
    const secretKey = process.env.SECRET_KEY;

    if (secretKey === undefined) {
      throw new Error("Secret key was not found");
    }

    return secretKey;
  }

  public async checkUser(id: string) {
    const user = await this._userRepository.get(id);

    return !!user;
  }

  public async getByLoginAndPassword(login: string, password: string) {
    const user = await this._userRepository.getByLogin(login);

    if (user) {
      if (!(await Hash.compare(password, user.password))) {
        throw new Error("Incorrect password");
      }

      return true;
    }

    throw new Error("Incorrect login");
  }

  public async getByLogin(login: string) {
    const user = await this._userRepository.getByLogin(login);

    if (user) {
      return user;
    }

    throw new Error(`User with login ${login} was not found.`);
  }

  public async getUser(id: string) {
    const user = await this._userRepository.get(id);

    if (user) {
      return user;
    }

    throw new Error(`User with id ${id} was not found.`);
  }

  public async loginUser(login: string, password: string) {
    const user = await this._userRepository.getByLogin(login);

    if (user === null) {
      throw new Error(`User ${login} was not found`);
    }

    if (!(await Hash.compare(password, user.password))) {
      throw new Error("Wrong password");
    }

    const secretKey = this.getSecret();

    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });

    return token;
  }

  public async authenticateUser(token: string) {
    const secretKey = this.getSecret();

    try {
      const { userId } = jwt.verify(token, secretKey) as IUserTokenPayload;

      if ((await this.checkUser(userId)) === false) {
        throw new Error("Invalid JWT token (User was not found)");
      }

      return userId;
    } catch (e) {
      throw new Error("Invalid JWT token");
    }
  }

  public async addUser(login: string, password: string) {
    const user = UserBuilder.buildUser(login, password);
    await this._userRepository.create(user);

    return user.id;
  }

  public async addAdmin(login: string, password: string) {
    const admin = UserBuilder.buildAdmin(login, password);
    await this._userRepository.create(admin);

    return admin.id;
  }

  public async updateUser(newUser: IUser) {
    const user = await this._userRepository.get(newUser.id);

    if (user === null) {
      throw new Error(`User with id = ${newUser.id} doesn't exist`);
    }

    await this._userRepository.update(newUser);
  }
}
