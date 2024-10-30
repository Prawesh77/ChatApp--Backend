import express, { Request, Response } from "express";
import "reflect-metadata";
import { AppDataSource } from "./config/db.config";
import { PORT_SERVER } from "./config/env.config";
import cors from "cors";
import { createServer } from "http";


const PORT = PORT_SERVER || 4000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req: Request, res: Response) => {
  console.log(req.body);
  res.send("Hello From Express");
});

function listen() {
  const httpServer = createServer(app)
  httpServer.listen(PORT)
  console.log(`Server is running on port ${PORT}`);
}

AppDataSource.initialize()
  .then(() => {
    console.log("Database Connection successfull");
    listen();
  })
  .catch((err) => {
    console.log("Database Connection failed", err);
  });

   
