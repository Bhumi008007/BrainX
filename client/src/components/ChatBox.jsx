import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useAppContext,
} from "../context/AppContext";

import Message from "./Message";

import brainxLogo
  from "../assets/brainx-logo.png";

// ==========================================
// SUGGESTIONS
// ==========================================

const suggestions = [
  "Explain quantum computing in simple words",
  "Give me ideas for my BCA final year project",
  "Write a professional email for my college",
  "Explain JavaScript with a real-life example",
];

const imageSuggestions = [
  "A futuristic AI robot working on a laptop",
  "A beautiful cyberpunk city at night",
  "A cute astronaut walking on the moon",
  "A futuristic smart classroom with AI",
];

// ==========================================
// CHATBOX
// ==========================================

const ChatBox = () => {
  const {
    selectedChat,
    createNewChat,
    updateSelectedChat,
    saveMessage,
    setUser,
  } = useAppContext();

  const [prompt, setPrompt] =
    useState("");

  const [busy, setBusy] =
    useState(false);

  const [mode, setMode] =
    useState("text");

  const endRef =
    useRef(null);

  const messages =
    selectedChat?.messages ||
    [];

  // ==========================================
  // AUTO SCROLL
  // ==========================================

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, busy]);

  // ==========================================
  // UPDATE CREDITS
  // ==========================================

  const updateCredits = (
    creditsRemaining
  ) => {
    if (
      typeof creditsRemaining !==
      "number"
    ) {
      return;
    }

    setUser(
      (
        previousUser
      ) => {
        if (!previousUser) {
          return previousUser;
        }

        const updatedUser = {
          ...previousUser,

          credits:
            creditsRemaining,
        };

        localStorage.setItem(
          "brainx_user",
          JSON.stringify(
            updatedUser
          )
        );

        return updatedUser;
      }
    );
  };

  // ==========================================
  // SEND
  // ==========================================

  const send = async (
    text = prompt
  ) => {
    const value =
      text.trim();

    if (
      !value ||
      busy
    ) {
      return;
    }

    setPrompt("");
    setBusy(true);

    try {
      const token =
        localStorage.getItem(
          "brainx_token"
        );

      if (!token) {
        throw new Error(
          "You are not logged in."
        );
      }

      // ======================================
      // GET OR CREATE CHAT
      // ======================================

      let currentChat =
        selectedChat;

      if (!currentChat) {
        currentChat =
          await createNewChat();
      }

      if (!currentChat) {
        throw new Error(
          "Unable to create chat."
        );
      }

      // ======================================
      // USER MESSAGE
      // ======================================

      const userMessage = {
        role: "user",

        content:
          value,

        timestamp:
          new Date()
            .toISOString(),
      };

      updateSelectedChat([
        ...(
          currentChat.messages ||
          []
        ),

        userMessage,
      ]);

      // ======================================
      // SAVE USER MESSAGE
      // ======================================

      const chatAfterUserMessage =
        await saveMessage(
          currentChat._id,

          "user",

          value
        );

      if (
        !chatAfterUserMessage
      ) {
        throw new Error(
          "Unable to save user message."
        );
      }

      const serverURL =
        import.meta.env
          .VITE_SERVER_URL ||
        "http://localhost:5000";

      // ======================================
      // IMAGE MODE
      // ======================================

      if (
        mode === "image"
      ) {
        const response =
          await fetch(
            `${serverURL}/api/ai/image`,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  token,
              },

              body:
                JSON.stringify({
                  prompt:
                    value,
                }),
            }
          );

        const data =
          await response
            .json();

        if (
          !response.ok
        ) {
          if (
            data.noCredits
          ) {
            throw new Error(
              data.message ||
                "Not enough credits."
            );
          }

          throw new Error(
            data.message ||
              "Image generation failed."
          );
        }

        if (
          !data.imageUrl
        ) {
          throw new Error(
            "Image URL was not returned."
          );
        }

        // ====================================
        // UPDATE CREDITS
        // ====================================

        updateCredits(
          data.creditsRemaining
        );

        // ====================================
        // IMAGE MESSAGE
        // ====================================

        const imageMessage =
          `![BrainX Generated Image](${data.imageUrl})\n\n` +
          `**Generated Image**\n\n` +
          `Prompt: ${value}`;

        const assistantMessage = {
          role:
            "assistant",

          content:
            imageMessage,

          timestamp:
            new Date()
              .toISOString(),
        };

        updateSelectedChat([
          ...(
            chatAfterUserMessage
              .messages ||
            []
          ),

          assistantMessage,
        ]);

        await saveMessage(
          currentChat._id,

          "assistant",

          imageMessage
        );

        // ====================================
        // SAVE TO COMMUNITY
        // ====================================

        try {
          const communityResponse =
            await fetch(
              `${serverURL}/api/image/save`,
              {
                method:
                  "POST",

                headers: {
                  "Content-Type":
                    "application/json",

                  Authorization:
                    token,
                },

                body:
                  JSON.stringify({
                    prompt:
                      value,

                    imageUrl:
                      data.imageUrl,
                  }),
              }
            );

          const communityData =
            await communityResponse
              .json();

          if (
            !communityResponse.ok
          ) {
            console.error(
              "Community Image Save Error:",
              communityData.message
            );
          }
        } catch (
          communityError
        ) {
          console.error(
            "Community Image Save Error:",
            communityError
          );
        }

        return;
      }

      // ======================================
      // TEXT MODE
      // ======================================

      const response =
        await fetch(
          `${serverURL}/api/ai/chat`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                token,
            },

            body:
              JSON.stringify({
                prompt:
                  value,
              }),
          }
        );

      const data =
        await response
          .json();

      if (
        !response.ok
      ) {
        if (
          data.noCredits
        ) {
          throw new Error(
            data.message ||
              "Not enough credits."
          );
        }

        throw new Error(
          data.message ||
            "Gemini request failed."
        );
      }

      // ======================================
      // UPDATE CREDITS
      // ======================================

      updateCredits(
        data.creditsRemaining
      );

      const aiText =
        data.message ||
        "BrainX could not generate a response.";

      const assistantMessage = {
        role:
          "assistant",

        content:
          aiText,

        timestamp:
          new Date()
            .toISOString(),
      };

      updateSelectedChat([
        ...(
          chatAfterUserMessage
            .messages ||
          []
        ),

        assistantMessage,
      ]);

      await saveMessage(
        currentChat._id,

        "assistant",

        aiText
      );
    } catch (error) {
      console.error(
        "BrainX Error:",
        error
      );

      const errorMessage = {
        role:
          "assistant",

        content:
          error.message ||
          "BrainX could not complete this request.",

        timestamp:
          new Date()
            .toISOString(),
      };

      if (
        selectedChat
      ) {
        updateSelectedChat([
          ...messages,

          errorMessage,
        ]);
      }
    } finally {
      setBusy(false);
    }
  };

  // ==========================================
  // CURRENT SUGGESTIONS
  // ==========================================

  const currentSuggestions =
    mode === "image"
      ? imageSuggestions
      : suggestions;

  // ==========================================
  // UI
  // ==========================================

  return (
    <section
      className="
        relative

        h-full

        flex
        flex-col

        overflow-hidden

        bg-[#f8f9fd]
        dark:bg-[#111019]
      "
    >

      {/* =====================================
          BACKGROUND GLOW
      ====================================== */}

      <div
        className="
          pointer-events-none

          absolute
          inset-0

          overflow-hidden
        "
      >

        <div
          className="
            absolute

            -top-32
            -right-24

            w-72
            h-72

            rounded-full

            bg-violet-400/10
            dark:bg-violet-500/10

            blur-3xl
          "
        />

        <div
          className="
            absolute

            bottom-20
            left-1/4

            w-64
            h-64

            rounded-full

            bg-cyan-400/10
            dark:bg-cyan-400/5

            blur-3xl
          "
        />

      </div>

      {/* =====================================
          HEADER
      ====================================== */}

      <header
        className="
          relative
          z-10

          h-[72px]

          shrink-0

          border-b
          border-gray-200/70
          dark:border-white/5

          bg-white/80
          dark:bg-[#15131d]/80

          backdrop-blur-xl

          flex
          items-center
          justify-between

          px-5
          md:px-7
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              w-10
              h-10

              rounded-2xl

              bg-white
              dark:bg-[#211e2a]

              border
              border-gray-200
              dark:border-white/10

              shadow-sm

              flex
              items-center
              justify-center
            "
          >

            <img
              src={brainxLogo}
              alt="BrainX"
              className="
                w-8
                h-8
                object-contain
              "
            />

          </div>

          <div>

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <h2
                className="
                  font-semibold
                  text-base
                "
              >
                BrainX
              </h2>

              <span
                className="
                  text-[9px]
                  font-semibold

                  px-2
                  py-0.5

                  rounded-full

                  bg-emerald-50
                  dark:bg-emerald-500/10

                  text-emerald-600
                  dark:text-emerald-400

                  border
                  border-emerald-100
                  dark:border-emerald-500/20
                "
              >
                ONLINE
              </span>

            </div>

            <p
              className="
                text-[11px]
                text-gray-400
              "
            >
              Intelligent AI Assistant
            </p>

          </div>

        </div>

        {/* =====================================
            DESKTOP MODE SWITCH
        ====================================== */}

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          <div
            className="
              hidden
              sm:flex

              items-center
              gap-1

              p-1

              rounded-xl

              bg-gray-100/80
              dark:bg-white/5

              border
              border-gray-200/70
              dark:border-white/5
            "
          >

            <button
              type="button"
              onClick={() =>
                setMode(
                  "text"
                )
              }
              className={`
                px-3
                py-1.5

                rounded-lg

                text-xs
                font-medium

                transition

                ${
                  mode ===
                  "text"
                    ? `
                      bg-white
                      dark:bg-[#262230]

                      text-primary

                      shadow-sm
                    `
                    : `
                      text-gray-500
                      dark:text-gray-400
                    `
                }
              `}
            >
              💬 Chat
            </button>

            <button
              type="button"
              onClick={() =>
                setMode(
                  "image"
                )
              }
              className={`
                px-3
                py-1.5

                rounded-lg

                text-xs
                font-medium

                transition

                ${
                  mode ===
                  "image"
                    ? `
                      bg-white
                      dark:bg-[#262230]

                      text-primary

                      shadow-sm
                    `
                    : `
                      text-gray-500
                      dark:text-gray-400
                    `
                }
              `}
            >
              ✦ Image
            </button>

          </div>

          <button
            onClick={
              createNewChat
            }
            className="
              md:hidden

              rounded-xl

              px-3
              py-2

              text-xs
              font-medium

              bg-primary
              text-white

              shadow-sm
            "
          >
            + New
          </button>

        </div>

      </header>

      {/* =====================================
          CHAT AREA
      ====================================== */}

      <div
        className="
          relative
          z-10

          flex-1

          overflow-y-auto

          px-4
          md:px-8

          py-7
        "
      >

        {messages.length ===
        0 ? (

          // ==================================
          // WELCOME SCREEN
          // ==================================

          <div
            className="
              min-h-full

              flex
              flex-col

              items-center
              justify-center

              max-w-4xl

              mx-auto

              py-8
            "
          >

            {/* LOGO */}

            <div
              className="
                relative
                mb-6
              "
            >

              <div
                className="
                  absolute
                  inset-0

                  rounded-[32px]

                  bg-violet-500/20

                  blur-2xl

                  scale-125
                "
              />

              <div
                className="
                  relative

                  w-24
                  h-24

                  rounded-[28px]

                  bg-white
                  dark:bg-[#211e2a]

                  border
                  border-gray-200
                  dark:border-white/10

                  shadow-xl

                  flex
                  items-center
                  justify-center
                "
              >

                <img
                  src={brainxLogo}
                  alt="BrainX Logo"
                  className="
                    w-20
                    h-20
                    object-contain
                  "
                />

              </div>

            </div>

            {/* BADGE */}

            <span
              className="
                px-3
                py-1

                rounded-full

                text-[10px]
                font-semibold

                tracking-wide

                bg-violet-100/80
                dark:bg-violet-500/10

                text-primary

                border
                border-violet-200/60
                dark:border-violet-400/10
              "
            >
              {mode === "image"
                ? "AI IMAGE STUDIO"
                : "YOUR AI COPILOT"}
            </span>

            {/* TITLE */}

            <h1
              className="
                mt-4

                text-3xl
                md:text-5xl

                font-semibold

                tracking-tight

                text-center

                bg-gradient-to-r

                from-gray-900
                via-violet-700
                to-cyan-600

                dark:from-white
                dark:via-violet-300
                dark:to-cyan-300

                bg-clip-text
                text-transparent
              "
            >
              {mode === "image"
                ? "Turn your ideas into visuals."
                : "What can BrainX help you with?"}
            </h1>

            {/* DESCRIPTION */}

            <p
              className="
                mt-4

                text-center

                text-sm
                md:text-base

                text-gray-500
                dark:text-gray-400

                max-w-2xl

                leading-7
              "
            >
              {mode === "image"
                ? "Describe a scene, concept, poster or creative idea and BrainX will generate it for you."
                : "Ask questions, learn concepts, write content, brainstorm projects and get intelligent assistance in seconds."}
            </p>

            {/* MOBILE MODE SWITCH */}

            <div
              className="
                sm:hidden

                flex
                items-center
                gap-1

                mt-6

                p-1

                rounded-xl

                bg-white
                dark:bg-[#211e2a]

                border
                border-gray-200
                dark:border-white/10

                shadow-sm
              "
            >

              <button
                type="button"
                onClick={() =>
                  setMode(
                    "text"
                  )
                }
                className={`
                  px-4
                  py-2

                  rounded-lg

                  text-xs
                  font-medium

                  transition

                  ${
                    mode ===
                    "text"
                      ? `
                        bg-primary
                        text-white
                      `
                      : `
                        text-gray-500
                      `
                  }
                `}
              >
                💬 AI Chat
              </button>

              <button
                type="button"
                onClick={() =>
                  setMode(
                    "image"
                  )
                }
                className={`
                  px-4
                  py-2

                  rounded-lg

                  text-xs
                  font-medium

                  transition

                  ${
                    mode ===
                    "image"
                      ? `
                        bg-primary
                        text-white
                      `
                      : `
                        text-gray-500
                      `
                  }
                `}
              >
                ✦ Generate Image
              </button>

            </div>

            {/* =====================================
                SUGGESTION CARDS
            ====================================== */}

            <div
              className="
                grid
                sm:grid-cols-2

                gap-3

                w-full

                mt-9
              "
            >

              {currentSuggestions.map(
                (
                  suggestion,
                  index
                ) => (
                  <button
                    key={
                      suggestion
                    }
                    onClick={() =>
                      send(
                        suggestion
                      )
                    }
                    className="
                      group

                      text-left

                      p-4
                      md:p-5

                      rounded-2xl

                      border
                      border-gray-200/80
                      dark:border-white/10

                      bg-white/80
                      dark:bg-[#1b1824]/80

                      backdrop-blur-sm

                      hover:border-violet-300
                      dark:hover:border-violet-500/30

                      hover:-translate-y-0.5

                      hover:shadow-lg

                      transition-all
                    "
                  >

                    <div
                      className="
                        flex
                        items-start
                        gap-3
                      "
                    >

                      <span
                        className="
                          w-9
                          h-9

                          shrink-0

                          rounded-xl

                          bg-gradient-to-br
                          from-violet-100
                          to-cyan-100

                          dark:from-violet-500/10
                          dark:to-cyan-500/10

                          flex
                          items-center
                          justify-center

                          text-sm
                        "
                      >
                        {mode ===
                        "image"
                          ? [
                              "🎨",
                              "🌃",
                              "🚀",
                              "✨",
                            ][
                              index
                            ]
                          : [
                              "💡",
                              "🎓",
                              "✍️",
                              "💻",
                            ][
                              index
                            ]}
                      </span>

                      <div>

                        <p
                          className="
                            text-sm
                            font-medium

                            leading-6

                            group-hover:text-primary

                            transition
                          "
                        >
                          {suggestion}
                        </p>

                        <p
                          className="
                            text-[11px]
                            text-gray-400
                            mt-1
                          "
                        >
                          Tap to use this prompt
                        </p>

                      </div>

                    </div>

                  </button>
                )
              )}

            </div>

          </div>
        ) : (

          // ==================================
          // MESSAGES
          // ==================================

          <div
            className="
              max-w-4xl
              mx-auto
            "
          >

            {messages.map(
              (
                message,
                index
              ) => (
                <Message
                  key={`${message.timestamp}-${index}`}
                  message={
                    message
                  }
                />
              )
            )}

            {/* =====================================
                THINKING
            ====================================== */}

            {busy && (
              <div
                className="
                  flex
                  items-start
                  gap-3

                  my-6
                "
              >

                <div
                  className="
                    w-9
                    h-9

                    rounded-xl

                    bg-white
                    dark:bg-[#211e2a]

                    border
                    border-gray-200
                    dark:border-white/10

                    shadow-sm

                    flex
                    items-center
                    justify-center
                  "
                >

                  <img
                    src={
                      brainxLogo
                    }
                    alt="BrainX"
                    className="
                      w-7
                      h-7
                      object-contain
                    "
                  />

                </div>

                <div
                  className="
                    rounded-2xl
                    rounded-tl-md

                    border
                    border-gray-200
                    dark:border-white/10

                    bg-white
                    dark:bg-[#1c1924]

                    px-4
                    py-3

                    shadow-sm
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <span
                      className="
                        w-2
                        h-2

                        rounded-full

                        bg-primary

                        animate-bounce
                      "
                    />

                    <span
                      className="
                        w-2
                        h-2

                        rounded-full

                        bg-primary

                        animate-bounce

                        [animation-delay:120ms]
                      "
                    />

                    <span
                      className="
                        w-2
                        h-2

                        rounded-full

                        bg-primary

                        animate-bounce

                        [animation-delay:240ms]
                      "
                    />

                    <span
                      className="
                        text-xs
                        text-gray-400

                        ml-1
                      "
                    >
                      {mode ===
                      "image"
                        ? "Creating your image..."
                        : "BrainX is thinking..."}
                    </span>

                  </div>

                </div>

              </div>
            )}

            <div
              ref={
                endRef
              }
            />

          </div>
        )}

      </div>

      {/* =====================================
          INPUT AREA
      ====================================== */}

      <div
        className="
          relative
          z-20

          px-4
          md:px-8

          pb-5
          pt-2

          bg-gradient-to-t

          from-[#f8f9fd]
          via-[#f8f9fd]/95
          to-transparent

          dark:from-[#111019]
          dark:via-[#111019]/95
        "
      >

        <form
          onSubmit={(
            event
          ) => {
            event.preventDefault();

            send();
          }}
          className="
            max-w-4xl
            mx-auto
          "
        >

          {/* =====================================
              INPUT INFO
          ====================================== */}

          <div
            className="
              flex
              items-center
              justify-between

              mb-2
              px-1
            "
          >

            <span
              className="
                inline-flex
                items-center
                gap-1.5

                text-[11px]
                text-gray-400
              "
            >

              <span
                className={`
                  w-1.5
                  h-1.5

                  rounded-full

                  ${
                    mode ===
                    "image"
                      ? "bg-cyan-400"
                      : "bg-emerald-400"
                  }
                `}
              />

              {mode === "image"
                ? "Image mode · 5 credits"
                : "AI chat · 1 credit per reply"}

            </span>

            <span
              className="
                hidden
                sm:block

                text-[10px]
                text-gray-400
              "
            >
              Enter to send · Shift + Enter for new line
            </span>

          </div>

          {/* =====================================
              PROMPT BOX
          ====================================== */}

          <div
            className="
              rounded-[22px]

              border
              border-gray-200
              dark:border-white/10

              bg-white/95
              dark:bg-[#1b1823]/95

              backdrop-blur-xl

              p-2

              flex
              items-end
              gap-2

              shadow-[0_12px_40px_rgba(15,23,42,0.08)]
              dark:shadow-[0_12px_40px_rgba(0,0,0,0.25)]

              focus-within:border-violet-300
              dark:focus-within:border-violet-500/30

              transition
            "
          >

            {/* MODE SWITCH */}

            <button
              type="button"
              onClick={() =>
                setMode(
                  mode ===
                    "text"
                    ? "image"
                    : "text"
                )
              }
              title={
                mode === "text"
                  ? "Switch to image generation"
                  : "Switch to AI chat"
              }
              className="
                w-11
                h-11

                shrink-0

                rounded-2xl

                bg-gray-100
                dark:bg-white/5

                hover:bg-violet-50
                dark:hover:bg-violet-500/10

                flex
                items-center
                justify-center

                text-lg

                transition
              "
            >
              {mode ===
              "text"
                ? "✦"
                : "💬"}
            </button>

            {/* TEXTAREA */}

            <textarea
              value={
                prompt
              }
              onChange={(
                event
              ) =>
                setPrompt(
                  event.target
                    .value
                )
              }
              onKeyDown={(
                event
              ) => {
                if (
                  event.key ===
                    "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault();

                  send();
                }
              }}
              rows={1}
              placeholder={
                mode ===
                "image"
                  ? "Describe the image you want BrainX to create..."
                  : "Ask BrainX anything..."
              }
              className="
                flex-1

                resize-none

                bg-transparent

                outline-none

                py-3
                px-1

                text-sm

                max-h-36
                min-h-[44px]

                placeholder:text-gray-400
              "
            />

            {/* SEND */}

            <button
              type="submit"
              disabled={
                !prompt.trim() ||
                busy
              }
              className="
                h-11

                min-w-11

                px-4

                rounded-2xl

                bg-gradient-to-r
                from-violet-600
                to-indigo-600

                hover:from-violet-500
                hover:to-indigo-500

                disabled:from-gray-300
                disabled:to-gray-300

                dark:disabled:from-white/10
                dark:disabled:to-white/10

                text-white

                flex
                items-center
                justify-center

                text-sm
                font-medium

                shadow-sm

                transition
              "
            >
              {busy
                ? "..."
                : mode ===
                  "image"
                ? "Create"
                : "➤"}
            </button>

          </div>

          <p
            className="
              text-center

              text-[10px]
              text-gray-400

              mt-2
            "
          >
            BrainX can make mistakes. Verify important information.
          </p>

        </form>

      </div>

    </section>
  );
};

export default ChatBox;