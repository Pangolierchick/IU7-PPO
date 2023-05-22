import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { HomeController } from "../controllers/homeController";

const homeRouter = Router();
const prisma = new PrismaClient();
const homeController = new HomeController(prisma);

homeRouter.get("/", homeController.getHomePage.bind(homeController));
homeRouter.get("/login", homeController.getLoginPage.bind(homeController));
homeRouter.post("/login", homeController.postLogin.bind(homeController));
homeRouter.get("/signup", homeController.getSignupPage.bind(homeController));
homeRouter.post("/signup", homeController.postSignup.bind(homeController));
homeRouter.get("/search", homeController.getSearchPage.bind(homeController));
homeRouter.get(
  "/advertisiment",
  homeController.getAdvertisiment.bind(homeController)
);
homeRouter.get(
  "/addAdvertisiment",
  homeController.getAddAdvertisiment.bind(homeController)
);
homeRouter.post(
  "/addAdvertisiment",
  homeController.addAdvertisiment.bind(homeController)
);
homeRouter.get("/getProfile", homeController.getProfile.bind(homeController));

export default homeRouter;
