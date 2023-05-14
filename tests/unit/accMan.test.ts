import { assert, beforeEach, describe, expect, it } from "vitest";
import { DataMock } from "../mocks/dataMock";
import { UserMock } from "../mocks/userMock";
import { AccountManager } from "../../src/managers/accountManager";
import { UserRole } from "../../src/interfaces/IUser";

let userRepo: UserMock;
let accountManager: AccountManager;

describe("Unit tests of accountManager", () => {
  beforeEach(() => {
    userRepo = new UserMock(DataMock.users());
    accountManager = new AccountManager(userRepo);
  });

  it("check existing user", async () => {
    expect(await accountManager.checkUser("1")).toBe(true);
  });

  it("add regular user", async () => {
    const id = await accountManager.addUser("newL", "newP");
    const user = await userRepo.get(id);
    expect(user).toBeDefined();
    expect(user?.role).toBe(UserRole.User);
  });

  it("add admin", async () => {
    const id = await accountManager.addAdmin("newL", "newP");
    const user = await userRepo.get(id);
    expect(user).toBeDefined();
    expect(user?.role).toBe(UserRole.Admin);
  });

  it("[NEGATIVE] check unexisting user", async () => {
    expect(await accountManager.checkUser("1000")).toBe(false);
  });
});
