import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { body, query } from "express-validator";
import ListingController from "../controllers/listingController";
import { AuthenticateMiddleware } from "../middlewares/authenticateMiddleware";

const listingRouter = Router();
const prisma = new PrismaClient();
const listingController = new ListingController(prisma);
const authMiddleware = new AuthenticateMiddleware(prisma);

listingRouter.post(
  "/createAdvertisiment",
  authMiddleware.authenticateMiddleware.bind(authMiddleware),
  body(["description", "address"]).notEmpty().trim().escape(),
  body("cost").isNumeric(),
  listingController.createAdvertisiment.bind(listingController)
);

listingRouter.get(
  "/getAdvertisiment",
  query("adId").notEmpty().escape(),
  listingController.getAdvertisiment.bind(listingController)
);
listingRouter.get(
  "/getUsersAdvertisiments",
  query("ownerId").isUUID(),
  listingController.getUsersAdvertisiments.bind(listingController)
);

listingRouter.post(
  "/createRent",
  authMiddleware.authenticateMiddleware.bind(authMiddleware),
  body(["from", "to"]).isDate(),
  query(["adId"]).isUUID(),
  listingController.newRent.bind(listingController)
);

listingRouter.put(
  "/approveAd",
  authMiddleware.authenticateMiddleware.bind(authMiddleware),
  query("adId").isUUID(),
  listingController.approveAdvertisiment.bind(listingController)
);

listingRouter.delete(
  "/deleteAd",
  authMiddleware.authenticateMiddleware.bind(authMiddleware),
  query("adId").isUUID(),
  listingController.deleteAddvertisiment.bind(listingController)
);

export default listingRouter;
