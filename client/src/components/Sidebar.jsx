import React, {
  useMemo,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useAppContext,
} from "../context/AppContext";

import brainxLogo from "../assets/brainx-logo.png";

const Sidebar = () => {
  const {
    chats,
    selectedChat,
    selectChat,
    createNewChat,
    theme,
    setTheme,
    user,
    logout,
    deleteChat,
  } = useAppContext();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [search, setSearch] =
    useState("");

  // ==========================================
  // FILTER CHATS
  // ==========================================

  const filteredChats =
    useMemo(() => {
      const value =
        search
          .trim()
          .toLowerCase();

      if (!value) {
        return chats;
      }

      return chats.filter(
        (chat) => {
          const title =
            chat.title ||
            chat.name ||
            "New Chat";

          return title
            .toLowerCase()
            .includes(value);
        }
      );
    }, [chats, search]);

  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime = (
    dateValue
  ) => {
    if (!dateValue) {
      return "Recently";
    }

    const difference =
      Date.now() -
      new Date(
        dateValue
      ).getTime();

    const minutes =
      Math.floor(
        difference / 60000
      );

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes}m`;
    }

    const hours =
      Math.floor(
        minutes / 60
      );

    if (hours < 24) {
      return `${hours}h`;
    }

    const days =
      Math.floor(
        hours / 24
      );

    return `${days}d`;
  };

  // ==========================================
  // DELETE CHAT
  // ==========================================

  const handleDelete =
    async (
      event,
      chatId
    ) => {
      event.stopPropagation();

      const confirmed =
        window.confirm(
          "Delete this chat?"
        );

      if (!confirmed) {
        return;
      }

      await deleteChat(
        chatId
      );
    };

  // ==========================================
  // NEW CHAT
  // ==========================================

  const handleNewChat =
    async () => {
      navigate("/");

      await createNewChat();
    };

  // ==========================================
  // OPEN CHAT
  // ==========================================

  const handleSelectChat = (
    chat
  ) => {
    selectChat(chat);

    navigate("/");
  };

  // ==========================================
  // NAV ITEM STYLE
  // ==========================================

  const navItem = (
    active
  ) => `
    w-full
    flex
    items-center
    gap-3

    px-3
    py-2.5

    rounded-xl

    text-sm

    transition

    ${
      active
        ? `
          bg-violet-50
          dark:bg-violet-500/10

          text-primary
          dark:text-violet-300
        `
        : `
          text-gray-600
          dark:text-gray-300

          hover:bg-gray-100
          dark:hover:bg-white/5
        `
    }
  `;

  return (
    <aside
      className="
        h-screen
        w-[300px]
        shrink-0

        border-r
        border-gray-200/70
        dark:border-white/5

        bg-white/90
        dark:bg-[#15131d]/95

        backdrop-blur-xl

        flex
        flex-col
      "
    >

      {/* =====================================
          LOGO
      ====================================== */}

      <div className="px-4 pt-5 pb-4">

        <button
          onClick={() =>
            navigate("/")
          }
          className="
            w-full
            flex
            items-center
            gap-3
            text-left
          "
        >

          <div
            className="
              w-12
              h-12

              rounded-2xl

              border
              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-[#211e2a]

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
                w-10
                h-10
                object-contain
              "
            />

          </div>

          <div className="min-w-0">

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <h1
                className="
                  text-xl
                  font-semibold
                  tracking-tight
                "
              >
                BrainX
              </h1>

              <span
                className="
                  text-[8px]

                  px-1.5
                  py-0.5

                  rounded-full

                  bg-violet-100
                  text-primary

                  dark:bg-violet-500/10
                "
              >
                AI
              </span>

            </div>

            <p
              className="
                text-[11px]
                text-gray-400
              "
            >
              Your intelligent workspace
            </p>

          </div>

        </button>

      </div>

      {/* =====================================
          NEW CHAT
      ====================================== */}

      <div className="px-4">

        <button
          onClick={
            handleNewChat
          }
          className="
            w-full

            rounded-2xl

            bg-gradient-to-r
            from-violet-600
            to-indigo-600

            hover:from-violet-500
            hover:to-indigo-500

            text-white

            py-3

            font-medium

            flex
            items-center
            justify-center
            gap-2

            shadow-sm
            hover:shadow-md

            transition-all
          "
        >

          <span className="text-lg leading-none">
            ＋
          </span>

          <span>
            New conversation
          </span>

        </button>

      </div>

      {/* =====================================
          SEARCH
      ====================================== */}

      <div className="px-4 mt-4">

        <div
          className="
            rounded-xl

            border
            border-gray-200
            dark:border-white/10

            bg-gray-50
            dark:bg-white/5

            flex
            items-center
            gap-2

            px-3
            py-2.5

            focus-within:border-violet-300
            dark:focus-within:border-violet-500/30

            transition
          "
        >

          <span className="text-gray-400">
            ⌕
          </span>

          <input
            value={search}
            onChange={(
              event
            ) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search conversations"
            className="
              w-full

              bg-transparent

              outline-none

              text-sm

              placeholder:text-gray-400
            "
          />

        </div>

      </div>

      {/* =====================================
          RECENT TITLE
      ====================================== */}

      <div className="px-4 mt-5">

        <p
          className="
            px-2

            text-[10px]
            font-semibold

            tracking-[0.16em]
            uppercase

            text-gray-400
          "
        >
          Recent
        </p>

      </div>

      {/* =====================================
          CHAT LIST
      ====================================== */}

      <div
        className="
          flex-1
          overflow-y-auto

          px-3
          pt-2
          pb-3
        "
      >

        {filteredChats.length ===
        0 ? (
          <div
            className="
              rounded-xl

              border
              border-dashed
              border-gray-200
              dark:border-white/10

              p-4

              text-center

              mt-2
            "
          >

            <p
              className="
                text-xs
                text-gray-400
              "
            >
              No conversations yet
            </p>

          </div>
        ) : (
          filteredChats.map(
            (chat) => {
              const title =
                chat.title ||
                chat.name ||
                "New Chat";

              const active =
                location.pathname ===
                  "/" &&
                selectedChat?._id ===
                  chat._id;

              return (
                <button
                  type="button"
                  key={chat._id}
                  onClick={() =>
                    handleSelectChat(
                      chat
                    )
                  }
                  className={`
                    group

                    w-full

                    relative

                    rounded-xl

                    px-3
                    py-3

                    mb-1.5

                    text-left

                    transition

                    ${
                      active
                        ? `
                          bg-violet-50
                          dark:bg-violet-500/10

                          border
                          border-violet-100
                          dark:border-violet-500/10
                        `
                        : `
                          border
                          border-transparent

                          hover:bg-gray-50
                          dark:hover:bg-white/5
                        `
                    }
                  `}
                >

                  <div
                    className="
                      flex
                      items-start
                      gap-3

                      pr-7
                    "
                  >

                    <span
                      className={`
                        mt-0.5

                        w-8
                        h-8

                        shrink-0

                        rounded-lg

                        flex
                        items-center
                        justify-center

                        text-xs

                        ${
                          active
                            ? `
                              bg-white
                              dark:bg-white/10

                              text-primary
                            `
                            : `
                              bg-gray-100
                              dark:bg-white/5

                              text-gray-500
                            `
                        }
                      `}
                    >
                      💬
                    </span>

                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >

                      <p
                        className={`
                          text-sm
                          truncate

                          ${
                            active
                              ? `
                                font-semibold
                                text-primary
                              `
                              : "font-medium"
                          }
                        `}
                      >
                        {title}
                      </p>

                      <p
                        className="
                          text-[10px]
                          text-gray-400
                          mt-1
                        "
                      >
                        {formatTime(
                          chat.updatedAt
                        )}
                      </p>

                    </div>

                  </div>

                  {/* DELETE BUTTON */}

                  <span
                    role="button"
                    tabIndex={0}
                    title="Delete chat"
                    onClick={(
                      event
                    ) =>
                      handleDelete(
                        event,
                        chat._id
                      )
                    }
                    onKeyDown={(
                      event
                    ) => {
                      if (
                        event.key ===
                        "Enter"
                      ) {
                        handleDelete(
                          event,
                          chat._id
                        );
                      }
                    }}
                    className="
                      absolute

                      right-3
                      top-1/2
                      -translate-y-1/2

                      opacity-0
                      group-hover:opacity-100

                      w-7
                      h-7

                      rounded-lg

                      hover:bg-red-50
                      dark:hover:bg-red-500/10

                      text-gray-400
                      hover:text-red-500

                      flex
                      items-center
                      justify-center

                      transition
                    "
                  >
                    ×
                  </span>

                </button>
              );
            }
          )
        )}

      </div>

      {/* =====================================
          BOTTOM AREA
      ====================================== */}

      <div
        className="
          border-t
          border-gray-200/70
          dark:border-white/5

          p-4

          space-y-1
        "
      >

        {/* COMMUNITY */}

        <button
          onClick={() =>
            navigate(
              "/community"
            )
          }
          className={navItem(
            location.pathname ===
              "/community"
          )}
        >

          <span
            className="
              w-8
              h-8

              rounded-lg

              bg-cyan-50
              dark:bg-cyan-500/10

              flex
              items-center
              justify-center
            "
          >
            🖼️
          </span>

          <span
            className="
              flex-1
              text-left
              font-medium
            "
          >
            Community
          </span>

          <span className="text-gray-300">
            ›
          </span>

        </button>

        {/* CREDITS */}

        <button
          onClick={() =>
            navigate(
              "/credits"
            )
          }
          className={navItem(
            location.pathname ===
              "/credits"
          )}
        >

          <span
            className="
              w-8
              h-8

              rounded-lg

              bg-amber-50
              dark:bg-amber-500/10

              flex
              items-center
              justify-center
            "
          >
            💎
          </span>

          <div
            className="
              flex-1
              text-left
            "
          >

            <p className="font-medium">
              Credits
            </p>

            <p
              className="
                text-[10px]
                text-gray-400
              "
            >
              {user?.credits ??
                0}{" "}
              available
            </p>

          </div>

          <span className="text-gray-300">
            ›
          </span>

        </button>

        {/* =====================================
            USER PROFILE
        ====================================== */}

        <div
          className="
            mt-3
            pt-3

            border-t
            border-gray-100
            dark:border-white/5

            flex
            items-center
            gap-2
          "
        >

          <div
            className="
              w-10
              h-10

              shrink-0

              rounded-xl

              bg-gradient-to-br
              from-violet-600
              to-indigo-600

              text-white

              flex
              items-center
              justify-center

              text-sm
              font-semibold
            "
          >
            {(user?.name ||
              "U")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div
            className="
              min-w-0
              flex-1
            "
          >

            <p
              className="
                text-sm
                font-medium
                truncate
              "
            >
              {user?.name ||
                "BrainX User"}
            </p>

            <p
              className="
                text-[10px]
                text-gray-400
                truncate
              "
            >
              {user?.email ||
                "Signed in"}
            </p>

          </div>

          {/* THEME */}

          <button
            onClick={() =>
              setTheme(
                theme === "dark"
                  ? "light"
                  : "dark"
              )
            }
            className="
              w-9
              h-9

              rounded-xl

              bg-gray-100
              dark:bg-white/5

              hover:bg-gray-200
              dark:hover:bg-white/10

              flex
              items-center
              justify-center

              transition
            "
            title="Toggle theme"
          >
            {theme === "dark"
              ? "☀️"
              : "🌙"}
          </button>

          {/* LOGOUT */}

          <button
            onClick={logout}
            className="
              w-9
              h-9

              rounded-xl

              bg-gray-100
              dark:bg-white/5

              hover:bg-red-50
              dark:hover:bg-red-500/10

              hover:text-red-500

              flex
              items-center
              justify-center

              transition
            "
            title="Logout"
          >
            ↗
          </button>

        </div>

      </div>

    </aside>
  );
};

export default Sidebar;