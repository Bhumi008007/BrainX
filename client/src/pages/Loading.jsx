import React from 'react';

const Loading = () => (
  <div className="h-full flex items-center justify-center">
    <div className="flex items-center gap-2 text-sm text-gray-400">
      <span className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" />
      <span className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce [animation-delay:120ms]" />
      <span className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce [animation-delay:240ms]" />
      Loading...
    </div>
  </div>
);
export default Loading;
