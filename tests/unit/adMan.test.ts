import { beforeEach, describe, expect, it } from "vitest";
import { AdvertisementManager } from "../../src/managers/advertisementManager";
import { AdMock } from "../mocks/adMock";
import { DataMock } from "../mocks/dataMock";
import { RentMock } from "../mocks/rentMock";
import { UserMock } from "../mocks/userMock";

let adManager: AdvertisementManager;
let adRepo: AdMock;
let userRepo: UserMock;
let rentRepo: RentMock;

describe("AdvertisementManager unit tests", () => {
  beforeEach(() => {
    adRepo = new AdMock(DataMock.ads());
    userRepo = new UserMock(DataMock.users());
    rentRepo = new RentMock(DataMock.rents());
    adManager = new AdvertisementManager(adRepo, userRepo, rentRepo);
  });

  it("creating new rent", async () => {
    const id = await adManager.newRent(
      "2",
      "1",
      new Date(2024, 2),
      new Date(2024, 3)
    );
    const rent = await rentRepo.get(id);

    expect(rent).toBeDefined;
    expect(rent?.id).toBe(id);
  });

  it("approve ad", async () => {
    await adManager.approveAd("1", "2");
    const ad = await adRepo.get("1");
    expect(ad).toBeDefined;
    expect(ad?.isApproved).toBe(true);
  });

  it("delete ad", async () => {
    await adManager.deleteAd("1", "2");

    const ad = await adRepo.get("1");
    expect(ad).toBeUndefined;
  });

  it("[NEGATIVE] trying to create new rent in existing dates", async () => {
    await adManager.newRent("2", "1", new Date(2024, 2), new Date(2024, 3));
    await expect(
      adManager.newRent("2", "1", new Date(2024, 2), new Date(2024, 3))
    ).rejects.toMatch(/already occupied in this dates/);
  });

  it("[NEGATIVE] approve by regular user", async () => {
    await expect(adManager.approveAd("1", "1")).rejects.toMatch(
      /User \d not an admin/
    );
  });

  it("[NEGATIVE] delete by regular user", async () => {
    await expect(adManager.deleteAd("1", "1")).rejects.toMatch(
      /User neither admin nor owner/
    );
  });
});
