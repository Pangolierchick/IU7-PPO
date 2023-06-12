import { IAdvertisement, IAdvertisementWithOwner } from "./IAdvertisement";
import { IRepository } from "./IRepository";

export interface IAdvertisementRepository extends IRepository<IAdvertisement> {
  updateScore(id: string, score: number): Promise<void>;
  updateDescription(id: string, descr: string): Promise<void>;
  updatePrice(id: string, price: number): Promise<void>;
  approve(id: string): Promise<void>;
  getUsersAdvertisiments(userId: string): Promise<IAdvertisement[]>;
  getAllWithOwner(): Promise<IAdvertisementWithOwner[]>;
  getWithOwner(id: string): Promise<IAdvertisementWithOwner | null>;
}
