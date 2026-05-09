import { create } from 'zustand';
import { GameStatus, ScoreStats, JobProfile, Contact, Message, ChatSession, ChoiceOption } from '../types/game';

interface GameState {
  status: GameStatus;
  timeRemaining: number;
  score: ScoreStats;
  currentJob: JobProfile | null;
  contacts: Record<string, Contact>;
  chats: Record<string, ChatSession>;
  activeChatId: string | null;
  
  // Actions
  startGame: (job: JobProfile) => void;
  endGame: () => void;
  tickTimer: () => void;
  setActiveChat: (contactId: string) => void;
  receiveMessage: (contactId: string, message: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => void;
  sendMessage: (contactId: string, content: string, optionsSelected?: ChoiceOption) => void;
  markAsRead: (contactId: string) => void;
  setTyping: (contactId: string, isTyping: boolean) => void;
}

const INITIAL_TIME = 180; // 3 minutes
const SYSTEM_ID = 'system';
const USER_ID = 'me';

export const useGameStore = create<GameState>((set, get) => ({
  status: 'idle',
  timeRemaining: INITIAL_TIME,
  score: {
    attentionToDetail: 0,
    dataAnalysis: 0,
    eq: 0,
  },
  currentJob: null,
  contacts: {},
  chats: {},
  activeChatId: null,

  startGame: (job) => {
    // Setup initial contacts for the demo
    const boss: Contact = { id: 'boss', name: 'David (Director)', role: 'Marketing Director', avatarUrl: 'https://ui-avatars.com/api/?name=D&background=0D8ABC&color=fff', isOnline: true };
    const colleague1: Contact = { id: 'colleague1', name: 'Kevin', role: 'Designer', avatarUrl: 'https://ui-avatars.com/api/?name=K&background=FF9800&color=fff', isOnline: true };
    const colleague2: Contact = { id: 'colleague2', name: 'Sarah', role: 'Media Buyer', avatarUrl: 'https://ui-avatars.com/api/?name=S&background=E91E63&color=fff', isOnline: true };

    const initialContacts = {
      [boss.id]: boss,
      [colleague1.id]: colleague1,
      [colleague2.id]: colleague2,
    };

    const initialChats = {
      [boss.id]: { contactId: boss.id, messages: [], unreadCount: 0 },
      [colleague1.id]: { contactId: colleague1.id, messages: [], unreadCount: 0 },
      [colleague2.id]: { contactId: colleague2.id, messages: [], unreadCount: 0 },
    };

    set({
      status: 'playing',
      timeRemaining: INITIAL_TIME,
      currentJob: job,
      contacts: initialContacts,
      chats: initialChats,
      score: { attentionToDetail: 0, dataAnalysis: 0, eq: 0 },
      activeChatId: boss.id, // default active chat
    });
  },

  endGame: () => {
    set({ status: 'finished' });
  },

  tickTimer: () => {
    set((state) => {
      if (state.status !== 'playing') return state;
      const newTime = state.timeRemaining - 1;
      if (newTime <= 0) {
        return { timeRemaining: 0, status: 'finished' };
      }
      return { timeRemaining: newTime };
    });
  },

  setActiveChat: (contactId) => {
    set((state) => {
      const chat = state.chats[contactId];
      if (!chat) return state;
      
      // Clear unread count when switching to this chat
      return {
        activeChatId: contactId,
        chats: {
          ...state.chats,
          [contactId]: { ...chat, unreadCount: 0 }
        }
      };
    });
  },

  markAsRead: (contactId) => {
    set((state) => {
      const chat = state.chats[contactId];
      if (!chat || chat.unreadCount === 0) return state;
      
      return {
        chats: {
          ...state.chats,
          [contactId]: { ...chat, unreadCount: 0 }
        }
      };
    });
  },

  receiveMessage: (contactId, msgData) => {
    set((state) => {
      const chat = state.chats[contactId];
      if (!chat) return state;

      const newMessage: Message = {
        ...msgData,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        isRead: state.activeChatId === contactId,
      };

      return {
        chats: {
          ...state.chats,
          [contactId]: {
            ...chat,
            messages: [...chat.messages, newMessage],
            unreadCount: state.activeChatId === contactId ? 0 : chat.unreadCount + 1,
            isTyping: false // stop typing when message arrives
          }
        }
      };
    });
  },

  sendMessage: (contactId, content, optionsSelected) => {
    set((state) => {
      const chat = state.chats[contactId];
      if (!chat) return state;

      const newMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        senderId: USER_ID,
        receiverId: contactId,
        content,
        timestamp: Date.now(),
        type: 'text',
        isRead: true,
      };

      // Handle score impact if any
      let newScore = { ...state.score };
      if (optionsSelected?.scoreImpact) {
        newScore = {
          attentionToDetail: newScore.attentionToDetail + (optionsSelected.scoreImpact.attentionToDetail || 0),
          dataAnalysis: newScore.dataAnalysis + (optionsSelected.scoreImpact.dataAnalysis || 0),
          eq: newScore.eq + (optionsSelected.scoreImpact.eq || 0),
        };
      }

      return {
        score: newScore,
        chats: {
          ...state.chats,
          [contactId]: {
            ...chat,
            messages: [...chat.messages, newMessage],
          }
        }
      };
    });
  },

  setTyping: (contactId, isTyping) => {
    set((state) => {
      const chat = state.chats[contactId];
      if (!chat) return state;
      return {
        chats: {
          ...state.chats,
          [contactId]: { ...chat, isTyping }
        }
      };
    });
  },
}));
