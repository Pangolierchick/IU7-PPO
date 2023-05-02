import { IAdvertisementRepository } from '../interfaces/IAdvertisementRepository';
import { IAdvertisement } from '../interfaces/IAdvertisement';
import { IRent } from '../interfaces/IRent';
import { IRentRepository } from '../interfaces/IRentRepository';
import { INITIAL_SCORE, UserRole } from '../interfaces/IUser';
import { IUserRepository } from '../interfaces/IUserRepository';
import {v4 as uuidv4} from 'uuid';

type AdvertisimentToBeApproved = {
  description: string;
  cost: number;
  address: string;
  ownerId: string;
};

export class AdvertisementManager {
  private _advertisimentRepository: IAdvertisementRepository;
  private _userRepository: IUserRepository;
  private _rentRepository: IRentRepository;

  constructor(adRepo: IAdvertisementRepository, userRepo: IUserRepository, rentRepo: IRentRepository) {
    this._advertisimentRepository = adRepo;
    this._userRepository = userRepo;
    this._rentRepository = rentRepo;
  }

  public async newRent(adId: string, userId: string, from: Date, to: Date) {
    const user = await this._userRepository.get(userId);
    const ad = await this._advertisimentRepository.get(adId);

    if (from > to) {
      [from, to] = [to, from];
    }

    if (user === null) {
      throw new Error(`User ${userId} doesn't exist`);
    }

    if (ad === null) {
      throw new Error(`Ad ${adId} doesn't exist`);
    }

    if (!ad.isApproved) {
      throw new Error(`Ad ${adId} is not approved`);
    }

    const rents = await (this._rentRepository.getInDate(adId, from, to));

    if (rents.length !== 0) {
      throw new Error(`Ad ${adId} already occupied in this dates`);
    }

    const rent = RentBuilder.buildRent(adId, userId, from, to);
    await this._rentRepository.create(rent);

    return rent.id;
  }

  public async addAdvertisiment(ad: AdvertisimentToBeApproved) {
    const user = await this._userRepository.get(ad.ownerId);

    if (user === null) {
      throw new Error(`User ${ad.ownerId} doesn't exist`);
    }

    const _ad = AdvertisimentBuilder.buildAdvertisiment(ad);
    await this._advertisimentRepository.create(_ad);
    return _ad.id;
  }

  public async approveAd(adId: string, adminId: string) {
    const user = await this._userRepository.get(adminId);

    if (user === null) {
      throw new Error(`User ${adminId} doesn't exist`);
    }

    if (user.role !== UserRole.Admin) {
      throw new Error(`User ${adminId} not an admin`);
    }

    const ad = await this._advertisimentRepository.get(adId);

    if (ad === null) {
      throw new Error(`Advertisement ${adId} doesn't exist`);
    }

    await this._advertisimentRepository.approve(adId);

    return user.id;
  }

  public async deleteAd(adId: string, adminId: string) {
    const user = await this._userRepository.get(adminId);

    if (user === null) {
      throw new Error(`User ${adminId} doesn't exist`);
    }

    if (user.role !== UserRole.Admin) {
      throw new Error(`User ${adminId} not an admin`);
    }

    await this._advertisimentRepository.delete(adId);
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

class AdvertisimentBuilder {
  public static buildAdvertisiment(ad: AdvertisimentToBeApproved): IAdvertisement {
    return {
      id: uuidv4(),
      description: ad.description,
      ownerId: ad.ownerId,
      cost: ad.cost,
      address: ad.address,
      score: INITIAL_SCORE,
      isApproved: false,
    };
  }
}
