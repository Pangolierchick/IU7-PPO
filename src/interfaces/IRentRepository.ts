import { IRepository } from './IRepository';
import { IRent } from './IRent';

export interface IRentRepository extends IRepository<IRent> {
  getInDate(adId: string, from: Date, to: Date): IRent[];
}
