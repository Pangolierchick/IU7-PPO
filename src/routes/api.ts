import { Router } from "express";
import favouritesRouter from "./favourites";
import listingRouter from "./listing";
import loginRouter from "./login";

const apiRouter = Router();

apiRouter.use("/user", loginRouter);
apiRouter.use("/listing", listingRouter);
apiRouter.use("/favourites", favouritesRouter);

export default apiRouter;
