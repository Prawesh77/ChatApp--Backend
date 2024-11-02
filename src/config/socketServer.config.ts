import { type Server as HttpServer } from "http";
import { Server, type Socket } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "./env.config";

export class SocketServer {
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
    console.log("Socket Server Initialized");
    return this.io;
  }
  private initializeAuthentication() {
    this.io.use((socket: Socket, next) => {
      try {
        console.log("Socket middleware");
        const token = socket.handshake.query.token as string;
        if (!token) return next(new Error("Authentication error"));

        const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;
        console.log(decoded);

        if (!decoded || !decoded.id) return next(new Error("Authentication error"));
        if (!this.connectedUsers.has(decoded.user)) {
          this.connectedUsers.set(Number(decoded.id), socket.id);
          console.log(this.connectedUsers);
          console.log('tori');
          next();
        }
        console.log(this.connectedUsers);
        next();
      } catch (err) {
        console.log('error');
        next(new Error("Authentication error"));
      }
    });
  }
  public getSocketIdForConnectedUser(userId: number): string | undefined {
    return this.connectedUsers.get(userId);
  }

  private listen() {
    this.io.on("connection", (socket: Socket) => {
      console.log(`Connected to ${socket.id}`);
    });
  }
}
export default SocketServer.getInstance();
