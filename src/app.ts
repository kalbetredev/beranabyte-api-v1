import express, { Application } from "express";
import cors from "cors";
import { config } from "dotenv";
config();

import { MONGO_URI, PORT } from "./config/constants";
import invalidRoute from "./api/v1/middlewares/invalidRoute";
import UserRouter from "./api/v1/routes/UserRouter";
import AuthRouter from "./api/v1/routes/AuthRouter";
import connectDb from "./config/database";
import auth from "./api/v1/middlewares/auth";

// App Initialization
const app: Application = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/users", auth, UserRouter);
app.use(invalidRoute);

connectDb(MONGO_URI);

app.listen(PORT, () => console.log(`Server listening at port : ${PORT}`));
