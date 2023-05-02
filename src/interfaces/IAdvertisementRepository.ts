import { IRepository } from './IRepository';
import { IAdvertisement } from './IAdvertisement';

export interface IAdvertisementRepository extends IRepository<IAdvertisement> {
  updateScore(id: string, score: number): Promise<void>;
  updateDescription(id: string, descr: string): Promise<void>;
  updatePrice(id: string, price: number): Promise<void>;
  approve(id: string): Promise<void>;
}
