import { IRent } from '../../src/interfaces/IRent';
import { IRentRepository } from '../../src/interfaces/IRentRepository';

export class RentMock implements IRentRepository {
  value: IRent[];

  constructor(v: IRent[]) {
    this.value = v;
  }

  get(id: string): IRent | undefined {
    return this.value.find(x => x.id === id);
  }

  getAll(): IRent[] {
    return this.value;
  }

  update(newUsr: IRent): void {
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

  create(data: IRent): void {
    this.value.push(data);
  }

  getInDate(adId: string, from: Date, to: Date): IRent[] {
    const r = this.value.filter(x => adId === x.adId && x.dateFrom >= from && to >= x.dateUntil);

    return r;
  }
}
