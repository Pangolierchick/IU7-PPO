import { IRent } from "./IRent";
import { IRepository } from "./IRepository";

export interface IRentRepository extends IRepository<IRent> {
  getInDate(adId: string, from: Date, to: Date): Promise<IRent[]>;
}
