import { type Server as HttpServer } from "http";
import { Server, type Socket } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "./config/env.config";

class SocketServer {
  private static instance: SocketServer;
  private io: Server;
  private readonly connectedUsers = new Map();

  private constructor() {}

  public static getInstance(): SocketServer {
    if (!SocketServer.instance) SocketServer.instance = new SocketServer();
    return SocketServer.instance;
  }

  public get(): Server {
    return this.io;
  }

  public initialize(HttpServer: HttpServer): Server {
   
    this.io = new Server(HttpServer, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
      },
    });
    this.initializeAuthentication();
    this.listen();
    console.log("Socket Server Initialized")
    return this.io;
}
  private initializeAuthentication() {
    this.io.use((socket: Socket, next) => {
        try{

            console.log("Socket middleware");
            const token = socket.handshake.query.token as string;
            if (!token) return next(new Error("Authentication error"));
            
            const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;
            console.log(decoded);
            
            if (!decoded) return next(new Error("Authentication error"));
            if(!this.connectedUsers.has(decoded.user)){
                this.connectedUsers.set(decoded.user,socket.id,);
                console.log(this.connectedUsers);
                next();
            }
            next();
            
        }catch(err){
            next(new Error("Authentication error"));
        }
    });
  }
  private listen() {
    this.io.on("connection", (socket: Socket) => {
      console.log(`Connected to ${socket.id}`);
      socket.on("send-message", (data) => {
        console.log(data);
        socket.broadcast.emit("receive-message", data);
      });
    });
  }
}
export default SocketServer.getInstance();
