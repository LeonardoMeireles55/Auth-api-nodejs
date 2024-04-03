import "reflect-metadata";
import { DataSource, Tree } from "typeorm";

import * as dotenv from "dotenv";
import { User } from "./entity/User.entity";

dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, NODE_ENV } =
  process.env;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: parseInt(DB_PORT),
  username: DB_USERNAME || "postgres",
  password: DB_PASSWORD || "root",
  database: DB_DATABASE || "type_orm_api",

  synchronize: NODE_ENV === "dev" ? true : false,
  logging: NODE_ENV === "dev" ? true : false,
  entities: [User],
  migrationsTableName: "history",
  migrations: ["./src/migrations/*{.ts,.js}"],
  subscribers: [],
});
