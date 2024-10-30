import dotenv from "dotenv";
dotenv.config();

//for server port
export const PORT_SERVER = +process.env.PORT_SERVER!;

export const JWT_SECRET = process.env.JWT_SECRET;

//for database
export class dB_Env {
  static HOST = process.env.HOST;
  static PORT_DB = process.env.PORT_DB;
  static USERNAME = process.env.USERNAME_DB;
  static PASSWORD = process.env.PASSWORD;
  static DATABASE = process.env.DATABASE;
}