import { IAdvertisement } from '../../src/interfaces/IAdvertisement';
import {IAdvertisementRepository} from '../../src/interfaces/IAdvertisementRepository';

export class AdMock implements IAdvertisementRepository {
  value: IAdvertisement[];

  constructor(v: IAdvertisement[]) {
    this.value = v;
  }

  async get(id: string): Promise<IAdvertisement | null> {
    const v = this.value.find(x => x.id === id);

    return v === undefined ? null : v;
  }

  async getAll(): Promise<IAdvertisement[]> {
    return this.value;
  }

  async approve(id: string): Promise<void> {
    const v = await this.get(id);

    if (v) {
      v.isApproved = true;
    }
  }

  async create(data: IAdvertisement): Promise<void> {
    this.value.push(data);
  }

  async update(newUsr: IAdvertisement): Promise<void> {
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

  async updateScore(id: string, score: number): Promise<void> {
    const i = this.value.findIndex(x => x.id === id);

    if (i !== -1) {
      this.value[i].score = score;
    }
  }

  async updateDescription(id: string, descr: string): Promise<void> {
    const i = this.value.findIndex(x => x.id === id);

    if (i !== -1) {
      this.value[i].description = descr;
    }
  }

  async updatePrice(id: string, price: number): Promise<void> {
    const i = this.value.findIndex(x => x.id === id);

    if (i !== -1) {
      this.value[i].cost = price;
    }
  }
}
