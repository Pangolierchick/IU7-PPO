import { IAdvertisement } from '../../src/interfaces/IAdvertisement';
import {IAdvertisementRepository} from '../../src/interfaces/IAdvertisementRepository';

export class AdMock implements IAdvertisementRepository {
  value: IAdvertisement[];

  constructor(v: IAdvertisement[]) {
    this.value = v;
  }

  get(id: string): IAdvertisement | undefined {
    return this.value.find(x => x.id === id);
  }

  getAll(): IAdvertisement[] {
    return this.value;
  }

  approve(id: string): void {
    const v = this.get(id);

    if (v) {
      v.isApproved = true;
    }
  }

  create(data: IAdvertisement): void {
    this.value.push(data);
  }

  update(newUsr: IAdvertisement): void {
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

  updateScore(id: string, score: number): void {
    const i = this.value.findIndex(x => x.id === id);

    if (i !== -1) {
      this.value[i].score = score;
    }
  }

  updateDescription(id: string, descr: string): void {
    const i = this.value.findIndex(x => x.id === id);

    if (i !== -1) {
      this.value[i].description = descr;
    }
  }

  updatePrice(id: string, price: number): void {
    const i = this.value.findIndex(x => x.id === id);

    if (i !== -1) {
      this.value[i].cost = price;
    }
  }
}
