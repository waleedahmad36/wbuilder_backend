import mongoose from "mongoose";

const feedbackSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    message: {
        type: String,
        required: true,
    },
}, { timestamps: true });


const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;