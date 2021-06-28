import { Request, Response } from "express";
import BioModel, { Bio } from "../models/Bio";
import ConfigModel, { Config } from "../models/Config";
import myBio from "../../../shared/mybio.json";
import { MY_BIO_KEY } from "../../../config/Constants";

export const getMyBio = async (req: Request, res: Response) => {
  ConfigModel.findOne({ key: MY_BIO_KEY }).then(async (config: any) => {
    if (config) {
      BioModel.findById(config.value).then(async (bio: Bio | null) => {
        if (!bio) saveAndReturnMyBio(req, res);
        else {
          return res.status(200).json({
            success: true,
            msg: "Bio retrieved successfully",
            bio: bio,
          });
        }
      });
    } else saveAndReturnMyBio(req, res);
  });
};

const saveAndReturnMyBio = async (req: Request, res: Response) => {
  const bio = new BioModel(myBio);
  bio
    .save()
    .then(async (savedBio: Bio) => {
      const config = new ConfigModel({ key: MY_BIO_KEY, value: savedBio._id });
      await config
        .save()
        .then(() => {
          return res.status(200).json({
            success: true,
            msg: "Bio retrieved successfully",
            bio: savedBio,
          });
        })
        .catch((error: any) => {
          return res.status(200).json({
            success: false,
            msg: "Error Getting Bio",
          });
        });
    })
    .catch((error: any) => {
      return res.status(500).json({
        success: false,
        msg: "Error Getting Bio",
      });
    });
};
