import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  const serverURL =
    import.meta.env.VITE_SERVER_URL ||
    "http://localhost:5000";

  const getToken = () =>
    localStorage.getItem("brainx_token");

  // ==========================================
  // VERIFY USER
  // ==========================================

  const loadUser = async () => {
    const token = getToken();

    if (!token) {
      setUser(null);
      setLoadingUser(false);
      return;
    }

    try {
      const response = await fetch(
        `${serverURL}/api/user/data`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message || "Authentication failed."
        );
      }

      setUser(data.user);

      localStorage.setItem(
        "brainx_user",
        JSON.stringify(data.user)
      );
    } catch (error) {
      console.error(
        "User Authentication Error:",
        error
      );

      localStorage.removeItem("brainx_token");
      localStorage.removeItem("brainx_user");

      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // ==========================================
  // THEME
  // ==========================================

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );

    localStorage.setItem("theme", theme);
  }, [theme]);

  // ==========================================
  // LOAD USER'S CHATS
  // ==========================================

  const loadChats = async () => {
    const token = getToken();

    if (!token) return;

    try {
      const response = await fetch(
        `${serverURL}/api/chat`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message || "Unable to load chats."
        );
      }

      const loadedChats = data.chats || [];

      setChats(loadedChats);

      setSelectedChat((current) => {
        if (current) {
          const refreshed = loadedChats.find(
            (chat) => chat._id === current._id
          );

          if (refreshed) return refreshed;
        }

        return loadedChats[0] || null;
      });
    } catch (error) {
      console.error(
        "Load Chats Error:",
        error
      );

      setChats([]);
      setSelectedChat(null);
    }
  };

  useEffect(() => {
    if (user) {
      loadChats();
    } else {
      setChats([]);
      setSelectedChat(null);
    }
  }, [user]);

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem("brainx_token");
    localStorage.removeItem("brainx_user");

    setUser(null);
    setChats([]);
    setSelectedChat(null);

    navigate("/");
  };

  // ==========================================
  // CREATE NEW CHAT
  // ==========================================

  const createNewChat = async () => {
    const token = getToken();

    if (!token) {
      console.error("No authentication token.");
      return null;
    }

    try {
      const response = await fetch(
        `${serverURL}/api/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },

          body: JSON.stringify({
            title: "New Chat",
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message ||
            "Unable to create chat."
        );
      }

      const newChat = data.chat;

      setChats((previousChats) => [
        newChat,
        ...previousChats,
      ]);

      setSelectedChat(newChat);

      navigate("/");

      return newChat;
    } catch (error) {
      console.error(
        "Create Chat Error:",
        error
      );

      return null;
    }
  };

  // ==========================================
  // SELECT CHAT
  // ==========================================

  const selectChat = (chat) => {
    setSelectedChat(chat);
    navigate("/");
  };

  // ==========================================
  // UPDATE CHAT LOCALLY
  // ==========================================

  const updateSelectedChat = (messages) => {
    if (!selectedChat) return;

    const updated = {
      ...selectedChat,
      messages,
      updatedAt: new Date().toISOString(),
    };

    setSelectedChat(updated);

    setChats((previousChats) =>
      previousChats.map((chat) =>
        chat._id === updated._id
          ? updated
          : chat
      )
    );
  };

  // ==========================================
  // SAVE MESSAGE
  // ==========================================

  const saveMessage = async (
    chatId,
    role,
    content
  ) => {
    const token = getToken();

    if (!token) {
      console.error("No authentication token.");
      return null;
    }

    try {
      const response = await fetch(
        `${serverURL}/api/chat/${chatId}/message`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },

          body: JSON.stringify({
            role,
            content,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message ||
            "Unable to save message."
        );
      }

      const updatedChat = data.chat;

      setSelectedChat(updatedChat);

      setChats((previousChats) => {
        const otherChats =
          previousChats.filter(
            (chat) =>
              chat._id !== updatedChat._id
          );

        return [
          updatedChat,
          ...otherChats,
        ];
      });

      return updatedChat;
    } catch (error) {
      console.error(
        "Save Message Error:",
        error
      );

      return null;
    }
  };

  // ==========================================
  // DELETE CHAT
  // ==========================================

  const deleteChat = async (chatId) => {
    const token = getToken();

    if (!token) {
      console.error("No authentication token.");
      return false;
    }

    try {
      const response = await fetch(
        `${serverURL}/api/chat/${chatId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: token,
          },
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message ||
            "Unable to delete chat."
        );
      }

      const remainingChats =
        chats.filter(
          (chat) => chat._id !== chatId
        );

      setChats(remainingChats);

      if (
        selectedChat?._id === chatId
      ) {
        setSelectedChat(
          remainingChats[0] || null
        );
      }

      return true;
    } catch (error) {
      console.error(
        "Delete Chat Error:",
        error
      );

      return false;
    }
  };

  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  const value = useMemo(
    () => ({
      navigate,

      user,
      setUser,
      loadingUser,

      loadUser,

      chats,
      setChats,

      selectedChat,
      setSelectedChat,

      selectChat,
      updateSelectedChat,

      createNewChat,
      saveMessage,
      loadChats,
      deleteChat,

      theme,
      setTheme,

      logout,
    }),
    [
      navigate,
      user,
      loadingUser,
      chats,
      selectedChat,
      theme,
    ]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () =>
  useContext(AppContext);