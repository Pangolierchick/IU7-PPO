export interface IAdvertisement {
  id: string;
  description: string;
  isApproved: boolean;
  cost: number;
  score: number;
  address: string;
  ownerId: string;
}
