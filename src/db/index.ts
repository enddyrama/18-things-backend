import mariadb from "mariadb";
import { configDotenv } from "dotenv";

import { result } from "lodash";
import moment from "moment";
configDotenv({ path: "./.env" });

export const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 5,
});

