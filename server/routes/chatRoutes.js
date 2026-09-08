import express from "express";

import {
  createChat,
  getChats,
  getSingleChat,
  addMessage,
  updateChat,
  deleteChat,
} from "../controllers/chatController.js";

import { protect } from "../middlewares/auth.js";

const chatRouter = express.Router();


// ==========================================
// PROTECT ALL CHAT ROUTES
// ==========================================

chatRouter.use(protect);


// ==========================================
// CHAT ROUTES
// ==========================================

// Create new chat
chatRouter.post("/", createChat);

// Get all chats of logged-in user
chatRouter.get("/", getChats);

// Get one chat
chatRouter.get("/:id", getSingleChat);

// Add message
chatRouter.post("/:id/message", addMessage);

// Update chat title
chatRouter.put("/:id", updateChat);

// Delete chat
chatRouter.delete("/:id", deleteChat);


export default chatRouter;