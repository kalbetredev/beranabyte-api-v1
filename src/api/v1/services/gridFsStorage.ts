import { config } from "dotenv";
config();

import { MONGO_URI } from "../../../config/Constants";
import { GridFsStorage } from "multer-gridfs-storage";
import { gFsConnectionOption, makeConnection } from "../../../config/database";
import crypto from "crypto";
import path from "path";
import { isValidObjectId, Types } from "mongoose";
import { Response } from "express";
import { GridFSBucket } from "mongodb";
import { IMAGES_BUCKET_NAME } from "./gridFsConstants";
import ApiError from "../models/ApiError";

let gridFsBucket: GridFSBucket;

let mongooseConnection = makeConnection(gFsConnectionOption);
mongooseConnection.once("open", () => {
  gridFsBucket = new GridFSBucket(mongooseConnection.db, {
    bucketName: IMAGES_BUCKET_NAME,
  });
});

const gridFsStorage = new GridFsStorage({
  url: MONGO_URI,
  options: gFsConnectionOption,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err);
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "images",
        };
        resolve(fileInfo);
      });
    });
  },
});

export const deleteImageById = (
  id: any,
  callback: (err: any, result: any) => void
) => {
  if (!isValidObjectId(id)) return new ApiError(400, "Invalid Image File Id");
  gridFsBucket.delete(new Types.ObjectId(id), callback);
};

export const findAndStreamImage = (_id: Types._ObjectId, res: Response) => {
  gridFsBucket.find({ _id }).toArray((err, files) => {
    if (!files || files.length === 0) throw new ApiError(404, "No Image Found");
    gridFsBucket.openDownloadStream(files[0]._id).pipe(res);
  });
};

export default gridFsStorage;
