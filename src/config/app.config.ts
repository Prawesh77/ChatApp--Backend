import express from "express";
import indexRoute from "../routes/index.routes";
import { errorHandler } from "../middleware/errorHandler.middleware";
import middleware from "../middleware/index.middleware";

const app = express();

middleware(app);

app.use("/", indexRoute);

app.use(errorHandler);

export default app;
