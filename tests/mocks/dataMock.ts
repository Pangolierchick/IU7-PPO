import { UserRole } from '../../src/interfaces/IUser';
import {Rent, User, Advertisement} from './typesMock';

export class DataMock {
  public static ads(): Advertisement[] {
    return [
      { id: '1', description: 'd1', isApproved: false, cost: 100, score: 0, address: 'a1', ownerId: 'o1' },
      { id: '2', description: 'd1', isApproved: true, cost: 100, score: 0, address: 'a2', ownerId: 'o2' },
      { id: '3', description: 'd1', isApproved: true, cost: 150, score: 10, address: 'a3', ownerId: 'o3' },
    ];
  }

  public static rents(): Rent[] {
    const today = new Date();
    return [
      { id: '1', adId: '1',  userId: 'u1', dateFrom: today, dateUntil: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5)},
      { id: '2', adId: '1',  userId: 'u1', dateFrom: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 8), dateUntil: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2)},
    ];
  }

  public static users(): User[] {
    return [
      {id: '1', login: 'l1', password: 'p1', score: 0, role: UserRole.User},
      {id: '2', login: 'l2', password: 'p2', score: 0, role: UserRole.Admin}
    ];
  }
}
