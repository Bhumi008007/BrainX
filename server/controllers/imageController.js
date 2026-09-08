import Image from "../models/imageModel.js";

// ==========================================
// SAVE GENERATED IMAGE
// ==========================================

export const saveImage = async (req, res) => {
  try {
    const { prompt, imageUrl } = req.body;

    if (!prompt || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Prompt and image URL are required.",
      });
    }

    const image = await Image.create({
      user: req.user._id,
      prompt,
      imageUrl,
      isPublic: true,
    });

    return res.json({
      success: true,
      message: "Image saved successfully.",
      image,
    });
  } catch (error) {
    console.error("Save Image Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save image.",
    });
  }
};

// ==========================================
// GET COMMUNITY IMAGES
// ==========================================

export const getCommunityImages = async (req, res) => {
  try {
    const images = await Image.find({
      isPublic: true,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      images,
    });
  } catch (error) {
    console.error("Community Images Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load community images.",
    });
  }
};