import Chat from "../models/chatModel.js";


// ==========================================
// CREATE NEW CHAT
// ==========================================

export const createChat = async (req, res) => {
  try {
    const { title } = req.body;

    const chat = await Chat.create({
      user: req.user._id,
      title: title || "New Chat",
      messages: [],
    });

    return res.status(201).json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error("Create Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create chat.",
    });
  }
};


// ==========================================
// GET ALL CHATS FOR LOGGED-IN USER
// ==========================================

export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      user: req.user._id,
    }).sort({
      updatedAt: -1,
    });

    return res.json({
      success: true,
      chats,
    });
  } catch (error) {
    console.error("Get Chats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch chats.",
    });
  }
};


// ==========================================
// GET ONE CHAT
// ==========================================

export const getSingleChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    return res.json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error(
      "Get Single Chat Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch chat.",
    });
  }
};


// ==========================================
// ADD MESSAGE TO CHAT
// ==========================================

export const addMessage = async (req, res) => {
  try {
    const { role, content } = req.body;

    if (!role || !content) {
      return res.status(400).json({
        success: false,
        message:
          "Role and content are required.",
      });
    }

    const chat = await Chat.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    chat.messages.push({
      role,
      content,
      timestamp: new Date(),
    });

    if (
      chat.title === "New Chat" &&
      role === "user"
    ) {
      chat.title =
        content.length > 40
          ? content.substring(0, 40) + "..."
          : content;
    }

    await chat.save();

    return res.json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error(
      "Add Message Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to save message.",
    });
  }
};


// ==========================================
// UPDATE CHAT TITLE
// ==========================================

export const updateChat = async (req, res) => {
  try {
    const { title } = req.body;

    const chat = await Chat.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      {
        title,
      },
      {
        new: true,
      }
    );

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    return res.json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error(
      "Update Chat Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to update chat.",
    });
  }
};


// ==========================================
// DELETE CHAT
// ==========================================

export const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    return res.json({
      success: true,
      message: "Chat deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Chat Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to delete chat.",
    });
  }
};