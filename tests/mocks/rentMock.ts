import { IRent } from "../../src/interfaces/IRent";
import { IRentRepository } from "../../src/interfaces/IRentRepository";

export class RentMock implements IRentRepository {
  value: IRent[];

  constructor(v: IRent[]) {
    this.value = v;
  }

  async get(id: string): Promise<IRent | null> {
    const v = this.value.find(x => x.id === id);

    return v === undefined ? null : v;
  }

  async getAll(): Promise<IRent[]> {
    return this.value;
  }

  async update(newUsr: IRent): Promise<void> {
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

  async create(data: IRent): Promise<void> {
    this.value.push(data);
  }

  async getInDate(adId: string, from: Date, to: Date): Promise<IRent[]> {
    const r = this.value.filter(x => adId === x.adId && x.dateFrom >= from && to >= x.dateUntil);

    return r;
  }
}
