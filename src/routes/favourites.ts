import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { query } from "express-validator";
import FavouritesController from "../controllers/favouritesController";
import { AuthenticateMiddleware } from "../middlewares/authenticateMiddleware";

const favouritesRouter = Router();
const prisma = new PrismaClient();
const favController = new FavouritesController(prisma);
const authMiddleware = new AuthenticateMiddleware(prisma);

favouritesRouter.get(
  "/userFavs",
  authMiddleware.authenticateMiddleware.bind(authMiddleware),
  favController.getUsersFavourites.bind(favController)
);

favouritesRouter.post(
  "/addFav",
  query("adId").isUUID(),
  authMiddleware.authenticateMiddleware.bind(authMiddleware),
  favController.addFavourite.bind(favController)
);

favouritesRouter.delete(
  "/delFav",
  query("id").isUUID(),
  authMiddleware.authenticateMiddleware.bind(authMiddleware),
  favController.deleteFavourite.bind(favController)
);

export default favouritesRouter;
