import express from "express";
import cors from "cors";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

import connectDB from "./config/db.js";

import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import imageRouter from "./routes/imageRoutes.js";

import { protect } from "./middlewares/auth.js";

const app = express();

const PORT =
  process.env.PORT || 5000;


// ==========================================
// CREDIT COSTS
// ==========================================

const CHAT_CREDIT_COST = 1;
const IMAGE_CREDIT_COST = 5;


// ==========================================
// CONNECT MONGODB
// ==========================================

await connectDB();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());


// ==========================================
// GEMINI
// ==========================================

const ai =
  new GoogleGenAI({
    apiKey:
      process.env.GEMINI_API_KEY,
  });


// ==========================================
// ROUTES
// ==========================================

app.use(
  "/api/user",
  userRouter
);

app.use(
  "/api/chat",
  chatRouter
);

app.use(
  "/api/image",
  imageRouter
);


// ==========================================
// HOME
// ==========================================

app.get(
  "/",
  (req, res) => {

    res.send(
      "BrainX API Working"
    );

  }
);


// ==========================================
// TEST
// ==========================================

app.get(
  "/api/test",
  (req, res) => {

    res.json({
      success: true,

      message:
        "BrainX frontend and backend are connected!",
    });

  }
);


// ==========================================
// GEMINI AI CHAT
// COST = 1 CREDIT
// ==========================================

app.post(
  "/api/ai/chat",

  protect,

  async (req, res) => {

    try {

      const { prompt } =
        req.body;


      // --------------------------------------
      // VALIDATE PROMPT
      // --------------------------------------

      if (
        !prompt ||
        !prompt.trim()
      ) {

        return res
          .status(400)
          .json({
            success: false,

            message:
              "Please enter a message.",
          });

      }


      // --------------------------------------
      // CHECK CREDITS
      // --------------------------------------

      if (
        req.user.credits <
        CHAT_CREDIT_COST
      ) {

        return res
          .status(402)
          .json({
            success: false,

            noCredits: true,

            message:
              "You do not have enough credits. Please purchase more credits.",
          });

      }


      console.log(
        "User Prompt:",
        prompt
      );


      // --------------------------------------
      // GEMINI REQUEST
      // --------------------------------------

      const response =
        await ai.models.generateContent({

          model:
            "gemini-3.6-flash",

          contents:
            prompt,

          config: {

            systemInstruction:
              "You are BrainX, an intelligent AI assistant. " +
              "Answer the user's questions clearly and accurately. " +
              "Use simple explanations when appropriate.",

          },

        });


      const aiReply =
        response.text;


      if (!aiReply) {

        throw new Error(
          "Gemini did not return a response."
        );

      }


      // --------------------------------------
      // DEDUCT 1 CREDIT
      // --------------------------------------

      req.user.credits -=
        CHAT_CREDIT_COST;

      await req.user.save();


      console.log(
        "Gemini response generated successfully"
      );


      console.log(
        "Credits remaining:",
        req.user.credits
      );


      // --------------------------------------
      // RESPONSE
      // --------------------------------------

      return res.json({

        success: true,

        message:
          aiReply,

        creditsUsed:
          CHAT_CREDIT_COST,

        creditsRemaining:
          req.user.credits,

      });

    } catch (error) {

      console.error(
        "Gemini API Error:",
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "BrainX could not generate an AI response. Please try again.",

        });

    }

  }
);


// ==========================================
// IMAGE GENERATION
// COST = 5 CREDITS
// ==========================================

app.post(
  "/api/ai/image",

  protect,

  async (req, res) => {

    try {

      const { prompt } =
        req.body;


      // --------------------------------------
      // VALIDATE PROMPT
      // --------------------------------------

      if (
        !prompt ||
        !prompt.trim()
      ) {

        return res
          .status(400)
          .json({

            success: false,

            message:
              "Please enter an image prompt.",

          });

      }


      // --------------------------------------
      // CHECK CREDITS
      // --------------------------------------

      if (
        req.user.credits <
        IMAGE_CREDIT_COST
      ) {

        return res
          .status(402)
          .json({

            success: false,

            noCredits: true,

            message:
              "You need at least 5 credits to generate an image.",

          });

      }


      // --------------------------------------
      // IMAGEKIT ENDPOINT
      // --------------------------------------

      const imageKitEndpoint =
        process.env
          .IMAGEKIT_URL_ENDPOINT;


      if (!imageKitEndpoint) {

        return res
          .status(500)
          .json({

            success: false,

            message:
              "IMAGEKIT_URL_ENDPOINT is missing from the server .env file.",

          });

      }


      console.log(
        "Generating BrainX image for:",
        prompt
      );


      const cleanEndpoint =
        imageKitEndpoint.replace(
          /\/$/,
          ""
        );


      const encodedPrompt =
        encodeURIComponent(
          prompt.trim()
        );


      const uniqueFileName =
        `brainx-${Date.now()}.jpg`;


      const imageUrl =

        `${cleanEndpoint}` +

        `/ik-genimg-prompt-${encodedPrompt}` +

        `/brainx-generated/${uniqueFileName}`;


      // --------------------------------------
      // DEDUCT 5 CREDITS
      // --------------------------------------

      req.user.credits -=
        IMAGE_CREDIT_COST;

      await req.user.save();


      console.log(
        "BrainX image URL generated:",
        imageUrl
      );


      console.log(
        "Credits remaining:",
        req.user.credits
      );


      // --------------------------------------
      // RESPONSE
      // --------------------------------------

      return res.json({

        success: true,

        message:
          "Image generated successfully.",

        imageUrl,

        prompt:
          prompt.trim(),

        creditsUsed:
          IMAGE_CREDIT_COST,

        creditsRemaining:
          req.user.credits,

      });

    } catch (error) {

      console.error(
        "Image Generation Error:",
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "BrainX could not generate the image.",

        });

    }

  }
);


// ==========================================
// START SERVER
// ==========================================

app.listen(
  PORT,
  () => {

    console.log(
      `Server running on port ${PORT}`
    );

  }
);