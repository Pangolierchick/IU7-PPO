import { IAdvertisementRepository } from '../interfaces/IAdvertisementRepository';
import { IRent } from '../interfaces/IRent';
import { IRentRepository } from '../interfaces/IRentRepository';
import { UserRole } from '../interfaces/IUser';
import { IUserRepository } from '../interfaces/IUserRepository';
import {v4 as uuidv4} from 'uuid';

export class AdvertisementManager {
  private _advertisimentRepository: IAdvertisementRepository;
  private _userRepository: IUserRepository;
  private _rentRepository: IRentRepository;

  constructor(adRepo: IAdvertisementRepository, userRepo: IUserRepository, rentRepo: IRentRepository) {
    this._advertisimentRepository = adRepo;
    this._userRepository = userRepo;
    this._rentRepository = rentRepo;
  }

  public newRent(adId: string, userId: string, from: Date, to: Date) {
    const user = this._userRepository.get(userId);
    const ad = this._advertisimentRepository.get(adId);

    if (user === undefined) {
      throw new Error(`User ${userId} doesn't exist`);
    }

    if (ad === undefined) {
      throw new Error(`Ad ${adId} doesn't exist`);
    }

    if (!ad.isApproved) {
      throw new Error(`Ad ${adId} is not approved`);
    }

    if (this._rentRepository.getInDate(adId, from, to).length !== 0) {
      throw new Error(`Ad ${adId} already occupied in this dates`);
    }

    const rent = RentBuilder.buildRent(adId, userId, from, to);
    this._rentRepository.create(rent);

    return rent.id;
  }

  public approveAd(adId: string, adminId: string) {
    const user = this._userRepository.get(adminId);

    if (user === undefined) {
      throw new Error(`User ${adminId} doesn't exist`);
    }

    if (user.role !== UserRole.Admin) {
      throw new Error(`User ${adminId} not an admin`);
    }

    this._advertisimentRepository.approve(adId);

    return user.id;
  }

  public deleteAd(adId: string, adminId: string) {
    const user = this._userRepository.get(adminId);

    if (user === undefined) {
      throw new Error(`User ${adminId} doesn't exist`);
    }

    if (user.role !== UserRole.Admin) {
      throw new Error(`User ${adminId} not an admin`);
    }

    this._advertisimentRepository.delete(adId);
  }
}

class RentBuilder {
  public static buildRent(adId: string, userId: string, from: Date, to: Date): IRent {
    return {
      id: uuidv4(),
      adId: adId,
      userId: userId,
      dateFrom: from,
      dateUntil: to,
    };
  }
}
