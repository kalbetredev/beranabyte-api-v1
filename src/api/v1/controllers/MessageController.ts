import { Response } from "express";
import ApiError from "../models/ApiError";
import MessageModel from "../models/Message";
import { validateMessage } from "../validation/MessageValidation";

export const addMessage = async (req: any, res: Response) => {
  try {
    const { email, content } = req.body;

    const message = {
      email,
      content,
      date: new Date(),
    };

    const isValid = validateMessage(message);
    if (isValid.error) throw new ApiError(400, "Invalid Inputs");

    const newMessage = new MessageModel(message);
    const savedMessage = await newMessage.save();

    return res.status(200).json({
      success: true,
      message: savedMessage,
    });
  } catch {
    return res.status(500).json({
      success: false,
      msg: "Error Occurred Sending Your Message",
    });
  }
};
