import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    prompt: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Image =
  mongoose.models.image ||
  mongoose.model("image", imageSchema);

export default Image;