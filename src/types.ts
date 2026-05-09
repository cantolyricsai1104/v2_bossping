export interface ScoreCardProps {
  score: number;
  comments: { dimension: string; text: string }[];
  overall: string;
}

export type SenderId = 'boss' | 'coworker' | 'user' | 'system';

export interface ChatMessage {
  id: string;
  sender: SenderId;
  senderName?: string;
  type: 'text' | 'scoreCard';
  content: string | ScoreCardProps;
  simMinute: number;
  shouldAnimate?: boolean;
}

export interface Conversation {
  id: string;
  kind: 'group' | 'dm';
  title: string;
  pinned?: boolean;
  messages: ChatMessage[];
}

export type TaskPriority = 'P0' | 'P1' | 'P2';
export type TaskStatus = 'todo' | 'in_progress' | 'submitted' | 'needs_revision' | 'done' | 'overdue';

export interface TaskPromptState {
  m30: boolean;
  m15: boolean;
  overdue5: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  detail: string;
  priority: TaskPriority;
  deadlineMinute: number;
  status: TaskStatus;
  revision: number;
  prompts: TaskPromptState;
  lastSubmittedMinute?: number;
}

export interface DayResult {
  score: number;
  title: string;
  summary: string;
  breakdown: { dimension: string; score: number; text: string }[];
  timeline: { minute: number; text: string }[];
}

export type SimEventKind = 'message' | 'addTasks' | 'bossFeedbackTask1' | 'endDay' | 'groupNeedReply';

export interface SimEvent {
  id: string;
  atMinute: number;
  kind: SimEventKind;
  conversationId?: string;
  sender?: SenderId;
  senderName?: string;
  text?: string;
  tasks?: Omit<TaskItem, 'prompts'>[];
}
