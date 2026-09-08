import express from "express";

import {
  saveImage,
  getCommunityImages,
} from "../controllers/imageController.js";

import { protect } from "../middlewares/auth.js";

const imageRouter = express.Router();

// Save a generated image
// User must be logged in
imageRouter.post(
  "/save",
  protect,
  saveImage
);

// Get all public community images
imageRouter.get(
  "/community",
  getCommunityImages
);

export default imageRouter;