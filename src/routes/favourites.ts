import { Router } from "express";
import { query } from "express-validator";
import FavouritesController from "../controllers/favouritesController";
import { AuthenticateMiddleware } from "../middlewares/authenticateMiddleware";

const favouritesRouter = Router();
const favController = new FavouritesController();
const authMiddleware = new AuthenticateMiddleware();

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
