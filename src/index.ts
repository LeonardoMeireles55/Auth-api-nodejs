import { AppDataSource } from "./infra/config/database/data-source";
import * as express from "express";
import * as dotenv from "dotenv";
import { Request, Response } from "express";
import { userRouter } from "./routes/user.routes";
import "reflect-metadata";
import { exceptionHandler } from "./infra/middleware/error.middleware";
dotenv.config();

const app = express();
const { PORT = 3000 } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", userRouter);
app.use("/user", userRouter);
app.use(exceptionHandler);
app.get("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});

AppDataSource.initialize()
  .then(async () => {
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));