import viteLogo from './vite.svg';

export const assets = {
  logo: viteLogo,
  logo_full: viteLogo,
  search_icon: viteLogo,
  user_icon: viteLogo,
  plus_icon: viteLogo,
  gallery_icon: viteLogo,
  diamond_icon: viteLogo,
  theme_icon: viteLogo,
  logout_icon: viteLogo,
  send_icon: viteLogo,
};

export const dummyUserData = {
  _id: 'brainx-demo-user',
  name: 'BrainX User',
  email: 'user@brainx.local',
  credits: 200,
};

export const dummyPlans = [
  { id: 'basic', name: 'Basic', price: 10, credits: 100, features: ['100 Credits', 'Text Generation', 'Community Access'] },
  { id: 'pro', name: 'Pro', price: 20, credits: 500, features: ['500 Credits', 'Fast AI Processing', 'Image Generation', 'Priority Support'] },
  { id: 'premium', name: 'Premium', price: 30, credits: 1000, features: ['1000 Credits', 'Higher Limits', 'Image Generation', 'All Features'] },
];

export const dummyChats = [
  {
    _id: 'chat_01',
    name: 'a boy running on water',
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    messages: [
      { role: 'user', content: 'a boy running on water', timestamp: Date.now() - 86400000 },
      { role: 'assistant', content: 'This demo chat represents a previous BrainX conversation.', timestamp: Date.now() - 86400000 },
    ],
  },
  {
    _id: 'chat_02',
    name: 'hello',
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    messages: [
      { role: 'user', content: 'hello', timestamp: Date.now() - 86400000 },
      { role: 'assistant', content: 'Hello! How can I help you today?', timestamp: Date.now() - 86400000 },
    ],
  },
  {
    _id: 'chat_03',
    name: 'New Chat',
    updatedAt: new Date().toISOString(),
    messages: [],
  },
];

export const dummyPublishedImages = [
  {
    image_url: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?w=900',
    username: 'BrainX User',
  },
  {
    image_url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=900',
    username: 'BrainX Community',
  },
];
