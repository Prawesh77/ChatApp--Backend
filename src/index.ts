import "reflect-metadata";
import { AppDataSource } from "./config/db.config";
import { PORT_SERVER } from "./config/env.config";
import SocketServer from "./config/socketServer.config";
import { createServer } from "http";
import app from "./config/app.config";

const PORT = PORT_SERVER || 4000;

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

   
