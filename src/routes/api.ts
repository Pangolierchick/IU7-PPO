import { Router } from "express";
import listingRouter from "./listing";
import loginRouter from "./login";

const apiRouter = Router();

apiRouter.use("/user", loginRouter);
apiRouter.use("/listing", listingRouter);

export default apiRouter;
