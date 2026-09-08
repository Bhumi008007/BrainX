import React, {
  useState,
} from "react";

import toast
  from "react-hot-toast";

import {
  useAppContext,
} from "../context/AppContext";

// ==========================================
// CREDIT PLANS
// ==========================================

const plans = [
  {
    id: "starter",

    name: "Starter",

    credits: 100,

    price: "₹99",

    description:
      "For light BrainX usage.",

    badge:
      "ESSENTIAL",

    features: [
      "100 BrainX credits",
      "AI chat access",
      "AI image generation",
      "Community gallery",
    ],
  },

  {
    id: "pro",

    name: "Pro",

    credits: 500,

    price: "₹299",

    description:
      "Best value for regular users.",

    badge:
      "MOST POPULAR",

    features: [
      "500 BrainX credits",
      "AI chat access",
      "AI image generation",
      "Community gallery",
      "Higher usage capacity",
    ],
  },

  {
    id: "ultimate",

    name: "Ultimate",

    credits: 1000,

    price: "₹499",

    description:
      "For power users and creators.",

    badge:
      "POWER",

    features: [
      "1000 BrainX credits",
      "AI chat access",
      "AI image generation",
      "Community gallery",
      "Maximum usage capacity",
    ],
  },
];

// ==========================================
// CREDITS PAGE
// ==========================================

const Credits = () => {
  const {
    user,
    setUser,
  } = useAppContext();

  const [
    loadingPlan,
    setLoadingPlan,
  ] = useState(null);

  const serverURL =
    import.meta.env
      .VITE_SERVER_URL ||
    "http://localhost:5000";

  // ==========================================
  // ACTIVATE DEMO PLAN
  // ==========================================

  const activatePlan =
    async (plan) => {
      try {
        const token =
          localStorage.getItem(
            "brainx_token"
          );

        if (!token) {
          toast.error(
            "Please login again."
          );

          return;
        }

        setLoadingPlan(
          plan.id
        );

        const response =
          await fetch(
            `${serverURL}/api/user/add-credits`,
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
                  planId:
                    plan.id,
                }),
            }
          );

        const data =
          await response.json();

        if (
          !response.ok
        ) {
          throw new Error(
            data.message ||
              "Unable to add credits."
          );
        }

        // ======================================
        // UPDATE USER LOCALLY
        // ======================================

        setUser(
          (
            previousUser
          ) => {
            const updatedUser = {
              ...previousUser,

              credits:
                data.credits,
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

        toast.success(
          `${data.creditsAdded} demo credits added!`
        );
      } catch (error) {
        console.error(
          "Credit Plan Error:",
          error
        );

        toast.error(
          error.message ||
            "Unable to activate plan."
        );
      } finally {
        setLoadingPlan(
          null
        );
      }
    };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div
      className="
        h-full

        overflow-y-auto

        bg-[#f8f9fd]
        dark:bg-[#111019]

        p-5
        md:p-10
      "
    >

      <div
        className="
          max-w-6xl
          mx-auto
        "
      >

        {/* =====================================
            HERO
        ====================================== */}

        <div
          className="
            relative

            overflow-hidden

            rounded-[32px]

            border
            border-gray-200/80
            dark:border-white/10

            bg-gradient-to-br

            from-white
            via-violet-50/60
            to-cyan-50/40

            dark:from-[#1b1823]
            dark:via-[#21192c]
            dark:to-[#162029]

            p-7
            md:p-10
          "
        >

          <div
            className="
              absolute

              -top-24
              -right-24

              h-64
              w-64

              rounded-full

              bg-violet-400/20

              blur-3xl
            "
          />

          <div
            className="
              absolute

              -bottom-24
              left-1/3

              h-56
              w-56

              rounded-full

              bg-cyan-400/15

              blur-3xl
            "
          />

          <div
            className="
              relative

              flex
              flex-col

              md:flex-row
              md:items-end
              md:justify-between

              gap-6
            "
          >

            <div>

              <span
                className="
                  inline-flex

                  px-3
                  py-1

                  rounded-full

                  bg-white/70
                  dark:bg-white/5

                  border
                  border-violet-200/70
                  dark:border-violet-500/20

                  text-primary

                  text-[10px]
                  font-semibold

                  tracking-[0.15em]
                "
              >
                BRAINX CREDITS
              </span>

              <h1
                className="
                  text-3xl
                  md:text-5xl

                  font-semibold

                  tracking-tight

                  mt-4
                "
              >
                Power up your AI experience.
              </h1>

              <p
                className="
                  text-sm
                  md:text-base

                  text-gray-500
                  dark:text-gray-400

                  mt-3

                  max-w-2xl
                "
              >
                Choose a demo plan and continue chatting, learning and creating with BrainX.
              </p>

            </div>

            {/* CURRENT BALANCE */}

            <div
              className="
                shrink-0

                rounded-2xl

                bg-white/80
                dark:bg-white/5

                backdrop-blur

                border
                border-gray-200
                dark:border-white/10

                px-5
                py-4

                shadow-sm
              "
            >

              <p
                className="
                  text-[10px]

                  text-gray-400

                  uppercase

                  tracking-[0.15em]
                "
              >
                Current balance
              </p>

              <div
                className="
                  flex
                  items-center

                  gap-2

                  mt-1
                "
              >

                <span
                  className="
                    text-2xl
                  "
                >
                  💎
                </span>

                <span
                  className="
                    text-3xl

                    font-semibold
                  "
                >
                  {user?.credits ??
                    0}
                </span>

                <span
                  className="
                    text-sm

                    text-gray-400
                  "
                >
                  credits
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* =====================================
            CREDIT PLANS
        ====================================== */}

        <div
          className="
            grid

            md:grid-cols-3

            gap-6

            mt-8
          "
        >

          {plans.map(
            (plan) => {
              const popular =
                plan.id ===
                "pro";

              return (
                <div
                  key={
                    plan.id
                  }
                  className={`
                    relative

                    rounded-[28px]

                    border

                    p-6

                    flex
                    flex-col

                    transition-all

                    hover:-translate-y-1

                    hover:shadow-xl

                    ${
                      popular
                        ? `
                          border-violet-300
                          dark:border-violet-500/30

                          bg-gradient-to-b

                          from-violet-50
                          to-white

                          dark:from-violet-500/10
                          dark:to-[#1b1823]

                          shadow-lg
                        `
                        : `
                          border-gray-200/80
                          dark:border-white/10

                          bg-white
                          dark:bg-[#1b1823]
                        `
                    }
                  `}
                >

                  {/* PLAN BADGE */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between

                      gap-3
                    "
                  >

                    <span
                      className={`
                        text-[9px]

                        font-semibold

                        tracking-[0.12em]

                        px-2.5
                        py-1

                        rounded-full

                        ${
                          popular
                            ? `
                              bg-primary
                              text-white
                            `
                            : `
                              bg-gray-100
                              dark:bg-white/5

                              text-gray-500
                            `
                        }
                      `}
                    >
                      {plan.badge}
                    </span>

                    {popular && (
                      <span
                        className="
                          text-lg
                          text-primary
                        "
                      >
                        ✦
                      </span>
                    )}

                  </div>

                  {/* PLAN NAME */}

                  <h2
                    className="
                      text-2xl

                      font-semibold

                      mt-5
                    "
                  >
                    {plan.name}
                  </h2>

                  <p
                    className="
                      text-sm

                      text-gray-500
                      dark:text-gray-400

                      mt-1
                    "
                  >
                    {plan.description}
                  </p>

                  {/* PRICE */}

                  <div
                    className="
                      mt-6

                      flex
                      items-end

                      gap-1
                    "
                  >

                    <span
                      className="
                        text-4xl

                        font-semibold
                      "
                    >
                      {plan.price}
                    </span>

                    <span
                      className="
                        text-xs

                        text-gray-400

                        mb-1.5
                      "
                    >
                      / plan
                    </span>

                  </div>

                  {/* CREDIT NUMBER */}

                  <div
                    className="
                      mt-5

                      rounded-2xl

                      bg-gray-50
                      dark:bg-white/5

                      border
                      border-gray-100
                      dark:border-white/5

                      px-4
                      py-4
                    "
                  >

                    <p
                      className="
                        text-[10px]

                        uppercase

                        tracking-[0.14em]

                        text-gray-400
                      "
                    >
                      Includes
                    </p>

                    <p
                      className="
                        text-2xl

                        font-semibold

                        text-primary

                        mt-1
                      "
                    >
                      {plan.credits}

                      <span
                        className="
                          text-sm

                          font-normal

                          text-gray-500
                        "
                      >
                        {" "}
                        credits
                      </span>
                    </p>

                  </div>

                  {/* FEATURES */}

                  <ul
                    className="
                      space-y-3

                      mt-6

                      flex-1
                    "
                  >

                    {plan.features.map(
                      (
                        feature
                      ) => (
                        <li
                          key={
                            feature
                          }
                          className="
                            text-sm

                            flex
                            items-start

                            gap-2.5
                          "
                        >

                          <span
                            className="
                              mt-0.5

                              w-5
                              h-5

                              rounded-full

                              bg-emerald-50
                              dark:bg-emerald-500/10

                              text-emerald-600
                              dark:text-emerald-400

                              flex
                              items-center
                              justify-center

                              text-[10px]
                            "
                          >
                            ✓
                          </span>

                          <span>
                            {feature}
                          </span>

                        </li>
                      )
                    )}

                  </ul>

                  {/* ACTIVATE BUTTON */}

                  <button
                    onClick={() =>
                      activatePlan(
                        plan
                      )
                    }
                    disabled={
                      loadingPlan !==
                      null
                    }
                    className={`
                      mt-7

                      w-full

                      py-3

                      rounded-xl

                      text-sm
                      font-medium

                      transition

                      shadow-sm

                      ${
                        popular
                          ? `
                            bg-gradient-to-r

                            from-violet-600
                            to-indigo-600

                            text-white

                            hover:from-violet-500
                            hover:to-indigo-500
                          `
                          : `
                            bg-gray-900
                            dark:bg-white

                            text-white
                            dark:text-gray-900

                            hover:opacity-90
                          `
                      }

                      disabled:opacity-50
                    `}
                  >

                    {loadingPlan ===
                    plan.id
                      ? "Adding credits..."
                      : "Activate demo plan"}

                  </button>

                </div>
              );
            }
          )}

        </div>

        {/* =====================================
            CREDIT COST CARDS
        ====================================== */}

        <div
          className="
            grid

            sm:grid-cols-2

            gap-4

            mt-8
          "
        >

          {/* AI CHAT */}

          <div
            className="
              rounded-2xl

              border
              border-gray-200/80
              dark:border-white/10

              bg-white
              dark:bg-[#1b1823]

              p-5

              flex
              items-center

              gap-4
            "
          >

            <div
              className="
                w-11
                h-11

                rounded-xl

                bg-violet-50
                dark:bg-violet-500/10

                flex
                items-center
                justify-center

                text-xl
              "
            >
              💬
            </div>

            <div>

              <p
                className="
                  font-medium
                "
              >
                AI Chat
              </p>

              <p
                className="
                  text-sm

                  text-gray-500

                  mt-0.5
                "
              >
                1 credit per successful AI response
              </p>

            </div>

          </div>

          {/* IMAGE GENERATION */}

          <div
            className="
              rounded-2xl

              border
              border-gray-200/80
              dark:border-white/10

              bg-white
              dark:bg-[#1b1823]

              p-5

              flex
              items-center

              gap-4
            "
          >

            <div
              className="
                w-11
                h-11

                rounded-xl

                bg-cyan-50
                dark:bg-cyan-500/10

                flex
                items-center
                justify-center

                text-xl
              "
            >
              🎨
            </div>

            <div>

              <p
                className="
                  font-medium
                "
              >
                AI Image Generation
              </p>

              <p
                className="
                  text-sm

                  text-gray-500

                  mt-0.5
                "
              >
                5 credits per generated image
              </p>

            </div>

          </div>

        </div>

        {/* =====================================
            DEMO NOTICE
        ====================================== */}

        <p
          className="
            text-center

            text-[11px]

            text-gray-400

            mt-7
            mb-3
          "
        >
          Academic demo credit system — no real payment is processed.
        </p>

      </div>

    </div>
  );
};

export default Credits;