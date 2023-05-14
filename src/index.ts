import { json, urlencoded } from "body-parser";
import express from "express";
import listingRouter from "./routes/listing";
import loginRouter from "./routes/login";

const app = express();

app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(json());

app.use("/user", loginRouter);
app.use("/listing", listingRouter);

app.listen(3000, () => {
  console.log("Running");
});
