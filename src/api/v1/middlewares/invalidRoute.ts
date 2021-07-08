import { Request, Response } from "express";

const invalidRoute = (req: Request, res: Response) =>
  res.status(404).send("Invalid API Request!");

export default invalidRoute;
