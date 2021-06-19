import express, { Application } from "express";
import { config } from "dotenv";
import { LOCAL_PORT } from "./config/Constants";
import invalidRoute from "./api/v1/middlewares/invalidRoute";

// App Initialization
config();
const PORT = process.env.PORT || LOCAL_PORT;
const app: Application = express();

// Middleware
app.use(express.json());

// Routes
app.use(invalidRoute);

// App Main
const main = async () => {
  try {
    app.listen(PORT, () => console.log(`Server listening at port : ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

main();
