import { assert, beforeEach, describe, expect, it } from 'vitest';
import {DataMock} from './mocks/dataMock';
import {UserMock} from './mocks/userMock';
import {AdMock} from './mocks/adMock';
import {RentMock} from './mocks/rentMock';
import { AccountManager } from '../src/managers/accountManager';
import { AdvertisementManager } from '../src/managers/advertisementManager';

let adManager: AdvertisementManager;
let adRepo: AdMock;
let userRepo: UserMock;
let rentRepo: RentMock;

describe('AdvertisementManager unit tests', () => {
  beforeEach(() => {
    adRepo = new AdMock(DataMock.ads());
    userRepo = new UserMock(DataMock.users());
    rentRepo = new RentMock(DataMock.rents());
    adManager = new AdvertisementManager(adRepo, userRepo, rentRepo);
  });

  it('creating new rent', () => {
    const id = adManager.newRent('2', '1', new Date(2001, 2), new Date(2001, 3));
    const rent = rentRepo.get(id);

    expect(rent).toBeDefined;
    expect(rent?.id).toBe(id);
  });

  it('approve ad', () => {
    adManager.approveAd('1', '2');
    const ad = adRepo.get('1');
    expect(ad).toBeDefined;
    expect(ad?.isApproved).toBe(true);
  });

  it('delete ad', () => {
    adManager.deleteAd('1', '2');

    const ad = adRepo.get('1');
    expect(ad).toBeUndefined;
  });

  it('[NEGATIVE] trying to create new rent in existing dates', () => {
    adManager.newRent('2', '1', new Date(2001, 2), new Date(2001, 3));
    expect(() => adManager.newRent('2', '1', new Date(2001, 2), new Date(2001, 3))).toThrowError('already occupied in this dates');
  });

  it('[NEGATIVE] approve by regular user', () => {
    expect(() => adManager.approveAd('1', '1')).toThrowError('not an admin');
  });

  it('[NEGATIVE] delete by regular user', () => {
    expect(() => adManager.deleteAd('1', '1')).toThrowError('not an admin');
  });
});
