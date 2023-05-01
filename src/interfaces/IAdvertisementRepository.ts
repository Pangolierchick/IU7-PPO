import { IRepository } from './IRepository';
import { IAdvertisement } from './IAdvertisement';

export interface IAdvertisementRepository extends IRepository<IAdvertisement> {
  updateScore(id: string, score: number): void;
  updateDescription(id: string, descr: string): void;
  updatePrice(id: string, price: number): void;
  approve(id: string): void;
}
