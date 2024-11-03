import express, { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { AppDataSource } from "./config/db.config";
import { PORT_SERVER } from "./config/env.config";
import authRoute from "./routes/auth.route";
import messageRoute from "./routes/message.route";
import cors from "cors";
import SocketServer from "./config/socketServer.config";
import { createServer } from "http";
import { errorHandler } from "./middleware/errorHandler.middleware";

const PORT = PORT_SERVER || 4000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//create routes
app.use("/", authRoute);
app.use("/chat", messageRoute);

app.get("/", (req: Request, res: Response) => {
  console.log(req.body);
  res.send("Hello From Express");
});

app.use(errorHandler)

function listen() {
  const httpServer = createServer(app)
  httpServer.listen(PORT)
  console.log(`Server is running on port ${PORT}`);
  SocketServer.initialize(httpServer);
}

AppDataSource.initialize()
  .then(() => {
    console.log("Database Connection successfull");
    listen();
  })
  .catch((err) => {
    console.log("Database Connection failed", err);
  });

   
