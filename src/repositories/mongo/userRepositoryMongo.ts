import { Collection, Db } from "mongodb";
import { IUser } from "../../interfaces/IUser";
import { IUserRepository } from "../../interfaces/IUserRepository";

export class UserRepositoryMongo implements IUserRepository {
  private collection: Collection<IUser>;

  constructor(db: Db) {
    this.collection = db.collection<IUser>("user");
  }

  async updatePassword(id: string, newPsw: string): Promise<void> {
    try {
      await this.collection.updateOne({ id }, { $set: { password: newPsw } });
    } catch (e) {
      throw new Error(`Failed to update password of user with id = ${id}`);
    }
  }

  async updateLogin(id: string, newLogin: string): Promise<void> {
    try {
      await this.collection.updateOne({ id }, { $set: { login: newLogin } });
    } catch (e) {
      throw new Error(`Failed to update login of user with id = ${id}`);
    }
  }

  async updateScore(id: string, newScore: number): Promise<void> {
    try {
      await this.collection.updateOne({ id }, { $set: { score: newScore } });
    } catch (e) {
      throw new Error(`Failed to update score of user with id = ${id}`);
    }
  }

  async get(id: string): Promise<IUser | null> {
    return this.collection.findOne({ id });
  }

  async getAll(): Promise<IUser[]> {
    return this.collection.find().toArray();
  }

  async create(data: IUser): Promise<void> {
    try {
      await this.collection.insertOne(data);
    } catch (e) {
      throw new Error("Failed to create new user");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.collection.deleteOne({ id });
    } catch (e) {
      throw new Error("Failed to delete user");
    }
  }

  async update(newUsr: IUser): Promise<void> {
    try {
      await this.collection.updateOne({ id: newUsr.id }, { $set: newUsr });
    } catch (e) {
      throw new Error("Failed to update user");
    }
  }

  async getByLogin(login: string): Promise<IUser | null> {
    return this.collection.findOne({ login });
  }
}
