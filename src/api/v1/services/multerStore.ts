import multer from "multer";
import path from "path";
import gridFsStorage from "../services/gridFsStorage";
import { ALLOWED_IMAGES_TYPE_REGx } from "../services/gridFsConstants";
import { NextFunction, Request, Response } from "express";

const store = multer({
  storage: gridFsStorage,
  limits: { fileSize: 20000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

function checkFileType(
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  const extname = ALLOWED_IMAGES_TYPE_REGx.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = ALLOWED_IMAGES_TYPE_REGx.test(file.mimetype);
  if (mimetype && extname) return cb(null, true);
  cb(new Error("filetype"));
}

export const uploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const upload = store.single("image");
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).send("File too large");
    } else if (err) {
      if (err.message === "filetype")
        return res.status(400).send("Image file only");
      else res.sendStatus(500);
    }
    next();
  });
};
