import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAppContext } from './context/AppContext';
import Sidebar from './components/Sidebar';
import ChatBox from './components/ChatBox';
import Login from './components/Login';
import Community from './pages/community';
import Credits from './pages/credits';

const App = () => {
  const { user, loadingUser } = useAppContext();

  if (loadingUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f7f7fb] dark:bg-[#17151f]">
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
          <span className="w-8 h-8 rounded-full bg-primary animate-pulse" />
          Loading BrainX...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Toaster position="top-right" />
        <div className="min-h-screen flex items-center justify-center bg-[#f7f7fb] dark:bg-[#17151f] p-4">
          <Login />
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-[#17151f] text-gray-900 dark:text-white">
        <Sidebar />
        <main className="flex-1 min-w-0 h-full">
          <Routes>
            <Route path="/" element={<ChatBox />} />
            <Route path="/community" element={<Community />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </>
  );
};

export default App;
