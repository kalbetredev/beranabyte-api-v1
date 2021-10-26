import { Response } from "express";
import ApiError from "../models/ApiError";
import SubscriberModel from "../models/Subscriber";
import { validateSubscriber } from "../validation/SubscriberValidation";

export const addSubscriber = async (req: any, res: Response) => {
  try {
    const { email } = req.body;
    const subscriber = {
      email,
      date: new Date(),
    };

    const isValid = validateSubscriber(subscriber);
    if (isValid.error) throw new ApiError(400, "Invalid Inputs");

    const newSubscriber = new SubscriberModel(subscriber);
    const savedSubscriber = await newSubscriber.save();

    return res.status(200).json({
      success: true,
      email: savedSubscriber.email,
    });
  } catch {
    return res.status(500).json({
      success: false,
      msg: "Error Occurred Subscribing you to BeranaByte",
    });
  }
};
