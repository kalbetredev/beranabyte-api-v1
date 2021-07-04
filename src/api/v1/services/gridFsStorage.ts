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

export const deleteImageById = (id: any, res: Response) => {
  if (!isValidObjectId(id))
    return res.status(400).json({
      success: false,
      msg: "Invalid Image File Id",
    });

  const _id = new Types.ObjectId(id);
  gridFsBucket.delete(_id, (err: any) => {
    if (err)
      return res.status(500).send({
        success: true,
        msg: "Image Deletion Error",
      });
    else
      return res.status(200).send({
        success: true,
        msg: "Image Deleted",
      });
  });
};

export const findAndStreamImage = (_id: Types._ObjectId, res: Response) => {
  gridFsBucket.find({ _id }).toArray((err, files) => {
    if (!files || files.length === 0)
      return res.status(404).json({
        success: false,
        msg: "No Image Found",
      });
    gridFsBucket.openDownloadStream(files[0]._id).pipe(res);
  });
};

export default gridFsStorage;
