import express, { Application } from "express";
import cors from "cors";
import { config } from "dotenv";
config();

import { MONGO_URI, PORT } from "./config/Constants";
import invalidRoute from "./api/v1/middlewares/invalidRoute";
import UserRouter from "./api/v1/routes/UserRouter";
import AuthRouter from "./api/v1/routes/AuthRouter";
import connectDb from "./config/database";
import BlogsRouter from "./api/v1/routes/BlogsRouter";
import CommentsRouter from "./api/v1/routes/CommentsRouter";
import RepliesRouter from "./api/v1/routes/RepliesRouter";
import BioRouter from "./api/v1/routes/BioRouter";
import ProjectsRouter from "./api/v1/routes/ProjectsRouter";

// App Initialization
const app: Application = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/blogs/:blogId/comments", CommentsRouter);
app.use("/api/v1/blogs", BlogsRouter);
app.use("/api/v1/comments/:commentId/replies", RepliesRouter);
app.use("/api/v1/bio", BioRouter);
app.use("/api/v1/projects", ProjectsRouter);

app.use(invalidRoute);

connectDb(MONGO_URI);

app.listen(PORT, () => console.log(`Server listening at port : ${PORT}`));
