import "reflect-metadata";
import bodyParser from "body-parser";
import { DataSource } from "typeorm";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import router from "./routes";
dotenv.config();

const app = express();

const { HOST, PORT, DB_ID, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD } =
  process.env;
export const dbContext = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_ID,
  synchronize: true,
  logging: false,
  entities: [`${__dirname}/models/**/*{.js,.ts}`],
  ssl: false,
});
dbContext
  .initialize()
  .then(async () => {
    app.use(cors());
    app.use(express.json());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use("/user", router);
    app.listen(Number(PORT), HOST || "", () => {
      console.debug(`Server running at http://${HOST}:${PORT}/`);
    });
  })
  .catch((error) => console.debug(error));
