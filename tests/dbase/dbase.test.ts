import { describe, expect, it } from "vitest";
import { AdvertisementManager, AccountManager } from "../../src/managers/exportManagers";
import { RentRepository, UserRepository, AdvertisimentRepository } from "../../src/repositories/exportRepositories";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const rentRepo = new RentRepository(prisma);
const userRepo = new UserRepository(prisma);
const advRepo  = new AdvertisimentRepository(prisma);

const adManager = new AdvertisementManager(advRepo, userRepo, rentRepo);
const accManager = new AccountManager(userRepo);

describe("Database integration tests", () =>{
  it("test #1", async () => {
    const u1 = await accManager.addUser("l1", "p1");
    const a1 = await accManager.addAdmin("l2", "p2");

    const ad1 = await adManager.addAdvertisiment({ description: "d1", cost: 111, address: "a1", ownerId: u1 });
    await adManager.approveAd(ad1, a1);

    const ad = await advRepo.get(ad1);

    expect(ad).is.not.null;
    expect(ad?.isApproved).toBe(true);

    const u2 = await accManager.addUser("l3", "p3");

    const r1 = await adManager.newRent(ad1, u2, new Date(2023, 6), new Date(2023, 7));

    const rent = await rentRepo.get(r1);

    expect(rent).is.not.null;
    expect(rent?.userId).toBe(u2);
  });

  it("test #2", async () => {
    const u1 = await accManager.addUser("l4", "p1");
    const a1 = await accManager.addAdmin("l5", "p2");

    const ad1 = await adManager.addAdvertisiment({ description: "d1", cost: 111, address: "a1", ownerId: u1 });
    await adManager.deleteAd(ad1, a1);

    const deletedAd = await advRepo.get(ad1);
    expect(deletedAd).toBeNull;
  });

  it("test #3", async () => {
    await expect(adManager.addAdvertisiment({ description: "d1", cost: 111, address: "a1", ownerId: "1" })).rejects.toMatch(/doesn't exist/);
  });
});
