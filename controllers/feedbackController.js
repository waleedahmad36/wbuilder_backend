import Feedback from "../models/feedbackModel.js";
import { User } from "../models/userModel.js"; 

export const createFeedback = async (req, res) => {
  const { userId, message } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const newFeedback = new Feedback({
      user: userId,
      message,
    });

    await newFeedback.save();
    res
      .status(201)
      .json({
        message: "Feedback submitted successfully",
        feedback: newFeedback,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate(
      "user",
      "username email gender"
    ); 
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
