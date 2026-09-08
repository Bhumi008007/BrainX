import express from "express";

import {
  registerUser,
  loginUser,
  getUser,
  addCredits,
} from "../controllers/userController.js";

import {
  protect,
} from "../middlewares/auth.js";

const userRouter =
  express.Router();

userRouter.post(
  "/register",
  registerUser
);

userRouter.post(
  "/login",
  loginUser
);

userRouter.get(
  "/data",
  protect,
  getUser
);

userRouter.post(
  "/add-credits",
  protect,
  addCredits
);

export default userRouter;