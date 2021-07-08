import { Response } from "express";
import { Types } from "mongoose";
import ApiError from "../models/ApiError";
import BlogImageModel, { BlogImage } from "../models/BlogImage";
import { deleteImageById, findAndStreamImage } from "../services/gridFsStorage";

export const getBlogImage = async (req: any, res: Response) => {
  try {
    let { blogId, imageFileName } = req.params;
    const image = await getImage(blogId, imageFileName);
    findAndStreamImage(new Types.ObjectId(image.imageId), res);
  } catch (error) {
    if (error instanceof ApiError)
      return res.status(error.status).json({
        success: false,
        msg: error.message,
      });

    return res.status(500).json({
      success: false,
      msg: "Error Occurred Getting the Requested Image",
    });
  }
};

export const deleteBlogImage = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    let { blogId, imageFileName } = req.params;
    const image = await getImage(blogId, imageFileName);

    if (image.userId !== userId)
      throw new ApiError(401, "Your Request is Denied");

    deleteImageById(image.imageId, (err) => {
      if (err) return new ApiError(500, "Image Deletion Error");
      else {
        BlogImageModel.deleteOne({ imageId: image.imageId }, (err) => {
          if (err) return new ApiError(500, "Image Deletion Error");
          else
            return res.status(200).json({
              success: true,
              msg: "Image Deleted",
            });
        });
      }
    });
  } catch (error) {
    if (error instanceof ApiError)
      return res.status(error.status).json({
        success: false,
        msg: error.message,
      });

    return res.status(500).json({
      success: false,
      msg: "Error Occurred Deleting the Requested Image",
    });
  }
};

export const getBlogImages = async (req: any, res: Response) => {
  try {
    let { blogId } = req.params;
    const images: BlogImage[] = await getImages(blogId);

    return res.status(200).json({
      success: true,
      images: images.map((image) => image.fileName),
    });
  } catch (error: any) {
    if (error instanceof ApiError)
      return res.status(error.status).json({
        success: false,
        msg: error.message,
      });

    return res.status(500).json({
      success: false,
      msg: "Error Occurred Getting the Requested Images",
    });
  }
};

export const uploadBlogImage = async (req: any, res: Response) => {
  try {
    const { file, userId } = req;
    let { blogId } = req.params;
    const { id } = file as any;

    if (file && file.size > 50000000) {
      deleteImageById(id, (err) => {
        if (err) throw new ApiError(500, "Failed to remove huge image");
        throw new ApiError(400, "File may not exceed 5mb");
      });
    }

    const blogImage = new BlogImageModel({
      imageId: file.id,
      fileName: file.filename,
      userId: userId,
      blogId: blogId,
    });

    const savedImage = await blogImage.save();
    return res.status(200).json({
      success: true,
      image: savedImage,
    });
  } catch (error: any) {
    if (error instanceof ApiError)
      return res.status(error.status).json({
        success: false,
        msg: error.message,
      });

    return res.status(500).json({
      success: false,
      msg: "Error Occurred Uploading the Blog Image",
    });
  }
};

const getImage = async (
  blogId: string,
  imageFileName: string
): Promise<BlogImage> => {
  try {
    if (!imageFileName || !blogId) throw new ApiError(400, "Invalid Request");

    const blogImages = await BlogImageModel.find({
      blogId: blogId,
      fileName: imageFileName,
    });

    if (blogImages.length === 0) throw new ApiError(404, "No Image Found");

    return blogImages[0];
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Error Occurred Getting the Image");
  }
};

const getImages = async (blogId: string): Promise<BlogImage[]> => {
  try {
    if (!blogId) throw new ApiError(400, "Invalid Request");

    const blogImages: BlogImage[] = await BlogImageModel.find({
      blogId: blogId,
    });

    return blogImages;
  } catch (error) {
    throw new ApiError(500, "Error Occurred Getting the Blog Images");
  }
};
