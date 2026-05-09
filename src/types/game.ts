export type GameStatus = 'idle' | 'playing' | 'finished';

export interface ScoreStats {
  attentionToDetail: number; // For task 1 (Finding mistakes)
  dataAnalysis: number;      // For task 2 (ROI decisions)
  eq: number;               // For task 3 (Boss management)
}

export interface JobProfile {
  id: string;
  title: string;
  description: string;
  requirements: string[];
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  isOnline: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
  type: 'text' | 'image' | 'system' | 'options';
  options?: ChoiceOption[];
  isRead: boolean;
}

export interface ChoiceOption {
  id: string;
  text: string;
  nextEventId?: string;
  scoreImpact?: Partial<ScoreStats>;
}

export interface ChatSession {
  contactId: string;
  messages: Message[];
  unreadCount: number;
  isTyping?: boolean;
}
