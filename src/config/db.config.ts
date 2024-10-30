import { DataSource } from "typeorm";
import { dB_Env } from "./env.config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: dB_Env.HOST,
  port: +dB_Env.PORT_DB!,
  username: dB_Env.USERNAME,
  password: dB_Env.PASSWORD,
  database: dB_Env.DATABASE,
  synchronize: true,
  logging: false,
  entities: [__dirname + "/../entities/**/*.entity{.ts,.js}"],
  subscribers: [],
  migrations: [],
});
