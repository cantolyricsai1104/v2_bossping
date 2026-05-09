import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UIComponentData } from '../components/generative-ui/DynamicComponentRenderer';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  ui?: UIComponentData;
}

interface ChatState {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      setMessages: (messages) => set({ messages }),
      clearChat: () => set({ messages: [] }),
    }),
    {
      name: 'chat-storage',
    }
  )
);
