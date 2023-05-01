import { IUser } from '../../src/interfaces/IUser';
import { IUserRepository } from '../../src/interfaces/IUserRepository';

export class UserMock implements IUserRepository {
  value: IUser[];

  constructor(v: IUser[]) {
    this.value = v;
  }

  get(id: string): IUser | undefined {
    return this.value.find(x => x.id === id);
  }

  getAll(): IUser[] {
    return this.value;
  }

  update(newUsr: IUser): void {
    const i = this.value.findIndex(x => x.id === newUsr.id);

    if (i !== -1) {
      this.value[i] = newUsr;
    }
  }

  delete(id: string): void {
    const i = this.value.findIndex(x => x.id === id);

    if (i !== -1) {
      this.value.splice(i, 1);
    }
  }

  create(data: IUser): void {
    this.value.push(data);
  }

  updateLogin(id: string, newLogin: string): void {
    const i = this.value.findIndex(x => x.id === id);

    if (i !== -1) {
      this.value[i].login = newLogin;
    }
  }

  updatePassword(id: string, newPsw: string): void {
    const i = this.value.findIndex(x => x.id === id);

    if (i !== -1) {
      this.value[i].password = newPsw;
    }
  }

  updateScore(id: string, newScore: number): void {
    const i = this.value.findIndex(x => x.id === id);

    if (i !== -1) {
      this.value[i].score = newScore;
    }
  }
}
