import { IUser } from "../../src/interfaces/IUser";
import { IUserRepository } from "../../src/interfaces/IUserRepository";

export class UserMock implements IUserRepository {
  value: IUser[];

  constructor(v: IUser[]) {
    this.value = v;
  }

  async get(id: string): Promise<IUser | null> {
    const v = this.value.find(x => x.id === id);

    return v === undefined ? null : v;
  }

  async getByLogin(login: string): Promise<IUser | null> {
    const v = this.value.find(x => x.login === login);

    return v === undefined ? null : v;
  }

  async getAll(): Promise<IUser[]> {
    return this.value;
  }

  async update(newUsr: IUser): Promise<void> {
    const i = this.value.findIndex(x => x.id === newUsr.id);

    if (i !== -1) {
      this.value[i] = newUsr;
    }
  }

  async delete(id: string): Promise<void> {
    const i = this.value.findIndex(x => x.id === id);

    if (i !== -1) {
      this.value.splice(i, 1);
    }
  }

  async create(data: IUser): Promise<void> {
    if (this.value.find((x) => x.login === data.login) !== undefined) {
      throw new Error("this login is already taken");
    }
    this.value.push(data);
  }

  async updateLogin(id: string, newLogin: string): Promise<void> {
    const i = this.value.findIndex(x => x.id === id);

    if (i !== -1) {
      this.value[i].login = newLogin;
    }
  }

  async updatePassword(id: string, newPsw: string): Promise<void> {
    const i = this.value.findIndex(x => x.id === id);

    if (i !== -1) {
      this.value[i].password = newPsw;
    }
  }

  async updateScore(id: string, newScore: number): Promise<void> {
    const i = this.value.findIndex(x => x.id === id);

    if (i !== -1) {
      this.value[i].score = newScore;
    }
  }
}
