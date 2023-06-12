export interface IAdvertisement {
  id: string;
  description: string;
  isApproved: boolean;
  cost: number;
  score: number;
  address: string;
  ownerId: string;
}

export interface IAdvertisementWithOwner extends IAdvertisement {
  ownerId: string;
  login: string;
  ownerScore: number;
}
