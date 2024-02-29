import "reflect-metadata";
import { DataSource, Tree } from "typeorm";

import * as dotenv from "dotenv";
import { User } from "../../../entity/User.entity";

dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, NODE_ENV } =
  process.env;

export const AppDataSource = new DataSource({
  type: "mariadb",
  host: DB_HOST,
  port: parseInt(DB_PORT || "3306" || "3307"),
  username: DB_USERNAME || "root",
  password: DB_PASSWORD || "root",
  database: DB_DATABASE || "user_node",

  synchronize: NODE_ENV === "dev" ? true : false,
  logging: NODE_ENV === "dev" ? true : false,
  entities: [User],
  migrations: ["../migrations/*{.ts,.js}"],
  subscribers: [],
});