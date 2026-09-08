import React, { useState } from "react";
import toast from "react-hot-toast";

import { useAppContext } from "../context/AppContext";
import brainxLogo from "../assets/brainx-logo.png";

const Login = () => {
  const {
    setUser,
  } = useAppContext();

  const [isLogin, setIsLogin] =
    useState(true);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const serverURL =
    import.meta.env.VITE_SERVER_URL ||
    "http://localhost:5000";

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      if (
        !email.trim() ||
        !password.trim()
      ) {
        toast.error(
          "Please fill all required fields."
        );
        return;
      }

      if (
        !isLogin &&
        !name.trim()
      ) {
        toast.error(
          "Please enter your name."
        );
        return;
      }

      try {
        setLoading(true);

        const endpoint =
          isLogin
            ? "/api/user/login"
            : "/api/user/register";

        const body =
          isLogin
            ? {
                email,
                password,
              }
            : {
                name,
                email,
                password,
              };

        const response =
          await fetch(
            `${serverURL}${endpoint}`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  body
                ),
            }
          );

        const data =
          await response.json();

        if (
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Authentication failed."
          );
        }

        // ======================================
        // SAVE TOKEN
        // ======================================

        localStorage.setItem(
          "brainx_token",
          data.token
        );

        localStorage.setItem(
          "brainx_user",
          JSON.stringify(
            data.user
          )
        );

        setUser(
          data.user
        );

        toast.success(
          isLogin
            ? "Welcome back to BrainX!"
            : "BrainX account created!"
        );
      } catch (error) {
        console.error(
          "Authentication Error:",
          error
        );

        toast.error(
          error.message ||
            "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div
      className="
        relative

        w-full
        min-h-screen

        overflow-hidden

        bg-[#f7f8fc]
        dark:bg-[#111019]

        flex
        items-center
        justify-center

        px-4
        py-8
      "
    >

      {/* =====================================
          BACKGROUND GLOWS
      ====================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
        "
      >

        <div
          className="
            absolute

            -top-32
            -left-32

            w-96
            h-96

            rounded-full

            bg-violet-400/20
            dark:bg-violet-500/10

            blur-3xl
          "
        />

        <div
          className="
            absolute

            -bottom-32
            -right-24

            w-96
            h-96

            rounded-full

            bg-cyan-400/20
            dark:bg-cyan-500/10

            blur-3xl
          "
        />

      </div>

      {/* =====================================
          MAIN CARD
      ====================================== */}

      <div
        className="
          relative
          z-10

          w-full
          max-w-5xl

          grid
          md:grid-cols-2

          overflow-hidden

          rounded-[32px]

          border
          border-gray-200/80
          dark:border-white/10

          bg-white/90
          dark:bg-[#191720]/95

          backdrop-blur-xl

          shadow-[0_24px_80px_rgba(15,23,42,0.12)]
          dark:shadow-[0_24px_80px_rgba(0,0,0,0.35)]
        "
      >

        {/* =====================================
            LEFT BRAND PANEL
        ====================================== */}

        <div
          className="
            relative

            hidden
            md:flex

            flex-col

            justify-between

            min-h-[650px]

            p-10

            overflow-hidden

            bg-gradient-to-br
            from-violet-600
            via-indigo-600
            to-cyan-600

            text-white
          "
        >

          <div
            className="
              absolute

              -top-20
              -right-20

              w-64
              h-64

              rounded-full

              bg-white/10

              blur-2xl
            "
          />

          <div
            className="
              absolute

              bottom-10
              -left-24

              w-72
              h-72

              rounded-full

              bg-cyan-300/20

              blur-3xl
            "
          />

          {/* LOGO */}

          <div
            className="
              relative

              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                w-14
                h-14

                rounded-2xl

                bg-white/15

                border
                border-white/20

                backdrop-blur-md

                flex
                items-center
                justify-center
              "
            >

              <img
                src={brainxLogo}
                alt="BrainX"
                className="
                  w-11
                  h-11
                  object-contain
                "
              />

            </div>

            <div>

              <h1
                className="
                  text-2xl
                  font-semibold
                "
              >
                BrainX
              </h1>

              <p
                className="
                  text-xs
                  text-white/70
                "
              >
                Intelligent AI Assistant
              </p>

            </div>

          </div>

          {/* HERO TEXT */}

          <div className="relative">

            <span
              className="
                inline-flex

                px-3
                py-1

                rounded-full

                bg-white/10

                border
                border-white/15

                text-[10px]
                font-semibold

                tracking-[0.15em]
              "
            >
              AI POWERED WORKSPACE
            </span>

            <h2
              className="
                mt-5

                text-4xl
                lg:text-5xl

                font-semibold

                leading-tight
                tracking-tight
              "
            >
              Think.
              <br />
              Create.
              <br />
              Explore with AI.
            </h2>

            <p
              className="
                mt-5

                max-w-md

                text-sm
                leading-7

                text-white/75
              "
            >
              BrainX helps you ask questions, generate ideas, create AI images and manage conversations in one intelligent workspace.
            </p>

          </div>

          {/* FEATURES */}

          <div
            className="
              relative

              grid
              grid-cols-2

              gap-3
            "
          >

            <div
              className="
                rounded-2xl

                bg-white/10

                border
                border-white/10

                backdrop-blur-md

                p-4
              "
            >

              <p className="text-xl">
                💬
              </p>

              <p
                className="
                  text-sm
                  font-medium
                  mt-2
                "
              >
                AI Chat
              </p>

              <p
                className="
                  text-[11px]
                  text-white/65
                  mt-1
                "
              >
                Smart conversations
              </p>

            </div>

            <div
              className="
                rounded-2xl

                bg-white/10

                border
                border-white/10

                backdrop-blur-md

                p-4
              "
            >

              <p className="text-xl">
                🎨
              </p>

              <p
                className="
                  text-sm
                  font-medium
                  mt-2
                "
              >
                AI Images
              </p>

              <p
                className="
                  text-[11px]
                  text-white/65
                  mt-1
                "
              >
                Create visuals
              </p>

            </div>

          </div>

        </div>

        {/* =====================================
            FORM PANEL
        ====================================== */}

        <div
          className="
            p-6
            sm:p-9
            md:p-10

            flex
            flex-col

            justify-center
          "
        >

          {/* MOBILE LOGO */}

          <div
            className="
              md:hidden

              flex
              items-center
              justify-center

              gap-3

              mb-8
            "
          >

            <img
              src={brainxLogo}
              alt="BrainX"
              className="
                w-12
                h-12
                object-contain
              "
            />

            <div>

              <h1
                className="
                  text-xl
                  font-semibold
                "
              >
                BrainX
              </h1>

              <p
                className="
                  text-[10px]
                  text-gray-400
                "
              >
                Intelligent AI Assistant
              </p>

            </div>

          </div>

          {/* TITLE */}

          <div>

            <span
              className="
                text-[10px]
                font-semibold

                tracking-[0.14em]

                text-primary
                uppercase
              "
            >
              {isLogin
                ? "Welcome Back"
                : "Create Account"}
            </span>

            <h2
              className="
                text-3xl
                font-semibold

                tracking-tight

                mt-2
              "
            >
              {isLogin
                ? "Sign in to BrainX"
                : "Join BrainX"}
            </h2>

            <p
              className="
                text-sm

                text-gray-500
                dark:text-gray-400

                mt-2
              "
            >
              {isLogin
                ? "Continue your conversations and AI creations."
                : "Create your account and start exploring AI."}
            </p>

          </div>

          {/* =====================================
              TOGGLE
          ====================================== */}

          <div
            className="
              grid
              grid-cols-2

              gap-1

              mt-7

              p-1

              rounded-xl

              bg-gray-100
              dark:bg-white/5
            "
          >

            <button
              type="button"
              onClick={() =>
                setIsLogin(true)
              }
              className={`
                py-2.5

                rounded-lg

                text-sm
                font-medium

                transition

                ${
                  isLogin
                    ? `
                      bg-white
                      dark:bg-[#282430]

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
              Login
            </button>

            <button
              type="button"
              onClick={() =>
                setIsLogin(false)
              }
              className={`
                py-2.5

                rounded-lg

                text-sm
                font-medium

                transition

                ${
                  !isLogin
                    ? `
                      bg-white
                      dark:bg-[#282430]

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
              Register
            </button>

          </div>

          {/* =====================================
              FORM
          ====================================== */}

          <form
            onSubmit={
              handleSubmit
            }
            className="
              mt-6
              space-y-4
            "
          >

            {!isLogin && (
              <div>

                <label
                  className="
                    text-xs
                    font-medium

                    text-gray-600
                    dark:text-gray-300
                  "
                >
                  Full Name
                </label>

                <div
                  className="
                    mt-2

                    rounded-xl

                    border
                    border-gray-200
                    dark:border-white/10

                    bg-gray-50
                    dark:bg-white/5

                    px-4

                    flex
                    items-center
                    gap-3

                    focus-within:border-violet-300
                    dark:focus-within:border-violet-500/30
                  "
                >

                  <span className="text-gray-400">
                    👤
                  </span>

                  <input
                    type="text"
                    value={name}
                    onChange={(
                      event
                    ) =>
                      setName(
                        event.target
                          .value
                      )
                    }
                    placeholder="Enter your name"
                    className="
                      w-full

                      py-3.5

                      bg-transparent

                      outline-none

                      text-sm
                    "
                  />

                </div>

              </div>
            )}

            {/* EMAIL */}

            <div>

              <label
                className="
                  text-xs
                  font-medium

                  text-gray-600
                  dark:text-gray-300
                "
              >
                Email Address
              </label>

              <div
                className="
                  mt-2

                  rounded-xl

                  border
                  border-gray-200
                  dark:border-white/10

                  bg-gray-50
                  dark:bg-white/5

                  px-4

                  flex
                  items-center
                  gap-3

                  focus-within:border-violet-300
                  dark:focus-within:border-violet-500/30
                "
              >

                <span className="text-gray-400">
                  ✉
                </span>

                <input
                  type="email"
                  value={email}
                  onChange={(
                    event
                  ) =>
                    setEmail(
                      event.target
                        .value
                    )
                  }
                  placeholder="Enter your email"
                  className="
                    w-full

                    py-3.5

                    bg-transparent

                    outline-none

                    text-sm
                  "
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div>

              <label
                className="
                  text-xs
                  font-medium

                  text-gray-600
                  dark:text-gray-300
                "
              >
                Password
              </label>

              <div
                className="
                  mt-2

                  rounded-xl

                  border
                  border-gray-200
                  dark:border-white/10

                  bg-gray-50
                  dark:bg-white/5

                  px-4

                  flex
                  items-center
                  gap-3

                  focus-within:border-violet-300
                  dark:focus-within:border-violet-500/30
                "
              >

                <span className="text-gray-400">
                  🔒
                </span>

                <input
                  type="password"
                  value={password}
                  onChange={(
                    event
                  ) =>
                    setPassword(
                      event.target
                        .value
                    )
                  }
                  placeholder="Enter your password"
                  className="
                    w-full

                    py-3.5

                    bg-transparent

                    outline-none

                    text-sm
                  "
                />

              </div>

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full

                mt-2

                py-3.5

                rounded-xl

                bg-gradient-to-r
                from-violet-600
                to-indigo-600

                hover:from-violet-500
                hover:to-indigo-500

                text-white

                text-sm
                font-medium

                shadow-md

                transition

                disabled:opacity-60
              "
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Sign In to BrainX"
                : "Create BrainX Account"}
            </button>

          </form>

          {/* =====================================
              SWITCH TEXT
          ====================================== */}

          <p
            className="
              text-center

              text-xs
              text-gray-500
              dark:text-gray-400

              mt-6
            "
          >
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              type="button"
              onClick={() =>
                setIsLogin(
                  !isLogin
                )
              }
              className="
                ml-1.5

                text-primary
                font-medium

                hover:underline
              "
            >
              {isLogin
                ? "Create one"
                : "Sign in"}
            </button>
          </p>

          {/* =====================================
              FOOTER
          ====================================== */}

          <p
            className="
              text-center

              text-[10px]
              text-gray-400

              mt-8
            "
          >
            By continuing, you agree to use BrainX responsibly.
          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;