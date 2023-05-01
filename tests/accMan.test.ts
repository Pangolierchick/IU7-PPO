import { assert, beforeEach, describe, expect, it } from 'vitest';
import {DataMock} from './mocks/dataMock';
import {UserMock} from './mocks/userMock';
import { AccountManager } from '../src/managers/accountManager';

let userRepo: UserMock;
let accountManager: AccountManager;

describe('Unit tests of accountManager', () => {
  beforeEach(() => {
    userRepo = new UserMock(DataMock.users());
    accountManager = new AccountManager(userRepo);
  });

  it('check existing user', () => {
    expect(accountManager.checkUser('1')).toBe(true);
  });

  it('add regular user', () => {
    const id = accountManager.addUser('newL', 'newP');
    const user = userRepo.get(id);
    expect(user).toBeDefined();
    expect(user?.role).toBe(1);
  });

  it('add admin', () => {
    const id = accountManager.addAdmin('newL', 'newP');
    const user = userRepo.get(id);
    expect(user).toBeDefined();
    expect(user?.role).toBe(0);
  });

  it('[NEGATIVE] check unexisting user', () => {
    expect(accountManager.checkUser('1000')).toBe(false);
  });
});
