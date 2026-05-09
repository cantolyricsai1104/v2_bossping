import React, { createContext, useContext, useEffect, useMemo, useReducer, ReactNode } from 'react';
import { ChatMessage, Conversation, DayResult, SenderId, SimEvent, TaskItem } from '../types';
import {
  SIM_END_MINUTE,
  SIM_START_HOUR,
  conversationOrder,
  createInitialConversations,
  createInitialEvents,
  createInitialTasks,
} from '../data/dayScenario';

const REAL_MS_PER_SIM_MIN = 10_000;

interface SimState {
  running: boolean;
  realStartMs: number;
  simStartMinute: number;
  currentMinute: number;
}

interface AppState {
  sim: SimState;
  conversations: Record<string, Conversation>;
  conversationOrder: string[];
  tasks: Record<string, TaskItem>;
  events: SimEvent[];
  fired: Record<string, true>;
  dayResult?: DayResult;
  needGroupReply: boolean;
  groupReplied: boolean;
  coworkerHelped: boolean;
}

type AppAction =
  | { type: 'TICK'; payload: { nowMs: number } }
  | { type: 'ADD_MESSAGE'; payload: { conversationId: string; message: ChatMessage } }
  | { type: 'MARK_ANIMATED'; payload: { conversationId: string; messageId: string } }
  | { type: 'SEND_TEXT'; payload: { conversationId: string; text: string } }
  | { type: 'SET_TASK_STATUS'; payload: { taskId: string; status: TaskItem['status'] } }
  | { type: 'SUBMIT_TASK'; payload: { taskId: string; text: string } }
  | { type: 'RESET_DAY' };

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatSimTime(minute: number) {
  const h = SIM_START_HOUR + Math.floor(minute / 60);
  const m = Math.max(0, minute % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function createInitialState(nowMs: number): AppState {
  const conversations = createInitialConversations();
  const tasks = createInitialTasks();
  return {
    sim: {
      running: true,
      realStartMs: nowMs,
      simStartMinute: 0,
      currentMinute: 0,
    },
    conversations,
    conversationOrder: conversationOrder(conversations),
    tasks,
    events: createInitialEvents(),
    fired: {},
    dayResult: undefined,
    needGroupReply: false,
    groupReplied: false,
    coworkerHelped: false,
  };
}

function pushMessage(state: AppState, conversationId: string, msg: Omit<ChatMessage, 'id'> & { id?: string }) {
  const conv = state.conversations[conversationId];
  if (!conv) return state;
  const message: ChatMessage = {
    ...msg,
    id: msg.id ?? makeId('msg'),
  };
  return {
    ...state,
    conversations: {
      ...state.conversations,
      [conversationId]: {
        ...conv,
        messages: [...conv.messages, message],
      },
    },
  };
}

function taskCountdownText(task: TaskItem, currentMinute: number) {
  const diff = task.deadlineMinute - currentMinute;
  const abs = Math.abs(diff);
  const hh = Math.floor(abs / 60);
  const mm = abs % 60;
  const core = hh > 0 ? `${hh}h ${mm}m` : `${mm}m`;
  if (diff >= 0) return `Due in ${core}`;
  return `Overdue ${core}`;
}

function computeDayResult(state: AppState): DayResult {
  const t1 = state.tasks.task1;
  const t2 = state.tasks.task2;
  const t3 = state.tasks.task3;
  const t4 = state.tasks.task4;

  const onTime = (t?: TaskItem) => {
    if (!t?.lastSubmittedMinute) return false;
    return t.lastSubmittedMinute <= t.deadlineMinute;
  };

  let score = 60;
  if (onTime(t1)) score += 12;
  if (onTime(t2)) score += 12;
  if (t1?.status === 'needs_revision' || (t1?.revision ?? 0) > 0) score -= 6;
  if (state.coworkerHelped) score += 6;
  if (state.groupReplied) score += 6;
  if (t4 && onTime(t4)) score += 8;
  if (t1?.status === 'overdue') score -= 10;
  if (t2?.status === 'overdue') score -= 10;
  if (t4?.status === 'overdue') score -= 8;

  score = Math.max(0, Math.min(100, score));
  const breakdown = [
    { dimension: '交付', score: Math.round(score * 0.4), text: '截止时间与完成情况' },
    { dimension: '响应', score: state.coworkerHelped || state.groupReplied ? 24 : 16, text: '处理打断与群内互动' },
    { dimension: '专注', score: 18, text: '优先级判断与上下文切换' },
    { dimension: '迭代', score: t1?.status === 'needs_revision' ? 12 : 18, text: '反馈与返工处理' },
  ];

  const timeline: { minute: number; text: string }[] = [];
  for (const convId of state.conversationOrder) {
    const conv = state.conversations[convId];
    for (const m of conv.messages) {
      if (m.sender === 'user') {
        timeline.push({ minute: m.simMinute, text: `你在「${conv.title}」发了消息` });
      }
    }
  }
  timeline.sort((a, b) => a.minute - b.minute);

  const title = score >= 85 ? '表现优秀' : score >= 70 ? '表现尚可' : '压力山大';
  const summary = `结束时间：${formatSimTime(state.sim.currentMinute)}。评分基于交付、打断处理与返工情况。`;

  return { score, title, summary, breakdown, timeline };
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'RESET_DAY': {
      return createInitialState(Date.now());
    }
    case 'TICK': {
      if (!state.sim.running) return state;
      const elapsed = action.payload.nowMs - state.sim.realStartMs;
      const nextMinute = Math.min(
        SIM_END_MINUTE,
        Math.floor(state.sim.simStartMinute + elapsed / REAL_MS_PER_SIM_MIN)
      );
      let next: AppState = {
        ...state,
        sim: {
          ...state.sim,
          currentMinute: nextMinute,
        },
      };

      for (const evt of next.events) {
        if (next.fired[evt.id]) continue;
        if (evt.atMinute > nextMinute) continue;
        next = { ...next, fired: { ...next.fired, [evt.id]: true } };

        if (evt.kind === 'message' && evt.conversationId && evt.text && evt.sender) {
          next = pushMessage(next, evt.conversationId, {
            sender: evt.sender,
            senderName: evt.senderName,
            type: 'text',
            content: evt.text,
            simMinute: evt.atMinute,
            shouldAnimate: true,
          });
        }

        if (evt.kind === 'addTasks' && evt.tasks) {
          const merged: Record<string, TaskItem> = { ...next.tasks };
          for (const t of evt.tasks) {
            merged[t.id] = {
              ...t,
              prompts: { m30: false, m15: false, overdue5: false },
            };
          }
          next = { ...next, tasks: merged };
          next = pushMessage(next, 'dept_product', {
            sender: 'boss',
            senderName: '老板',
            type: 'text',
            content: '临时加一个紧急任务，15:00前给我一个调整方案。',
            simMinute: evt.atMinute,
            shouldAnimate: true,
          });
        }

        if (evt.kind === 'bossFeedbackTask1') {
          const t1 = next.tasks.task1;
          if (t1?.status === 'submitted' || t1?.status === 'done') {
            next = pushMessage(next, 'dm_boss', {
              sender: 'boss',
              senderName: '老板',
              type: 'text',
              content: '还行，但第2点改一下，下午3点前给我新版。',
              simMinute: evt.atMinute,
              shouldAnimate: true,
            });
            next = {
              ...next,
              tasks: {
                ...next.tasks,
                task1: {
                  ...t1,
                  status: 'needs_revision',
                  revision: t1.revision + 1,
                  deadlineMinute: 360,
                  prompts: { m30: false, m15: false, overdue5: false },
                },
              },
            };
          } else {
            next = pushMessage(next, 'dm_boss', {
              sender: 'boss',
              senderName: '老板',
              type: 'text',
              content: '中午前要的那个还没看到，先把第一个交了再说。',
              simMinute: evt.atMinute,
              shouldAnimate: true,
            });
          }
        }

        if (evt.kind === 'groupNeedReply') {
          next = pushMessage(next, 'dept_product', {
            sender: 'coworker',
            senderName: '同事A',
            type: 'text',
            content: '这个方案我觉得有风险，大家怎么看？@你',
            simMinute: evt.atMinute,
            shouldAnimate: true,
          });
          next = { ...next, needGroupReply: true };
        }

        if (evt.kind === 'endDay') {
          const result = computeDayResult(next);
          next = {
            ...next,
            dayResult: result,
          };
          next = pushMessage(next, 'dm_boss', {
            sender: 'boss',
            senderName: '老板',
            type: 'text',
            content: '今天先到这，明天继续。整体还行，送你一份今日评估。',
            simMinute: evt.atMinute,
            shouldAnimate: true,
          });
          next = pushMessage(next, 'dm_boss', {
            sender: 'boss',
            senderName: '老板',
            type: 'scoreCard',
            content: {
              score: result.score,
              overall: result.title,
              comments: result.breakdown.map((b) => ({ dimension: b.dimension, text: `${b.score} / 40 · ${b.text}` })),
            },
            simMinute: evt.atMinute,
            shouldAnimate: true,
          });
        }
      }

      const tasksNext: Record<string, TaskItem> = { ...next.tasks };
      let changed = false;
      const bossTone = (t: TaskItem, d: number) => {
        if (d <= 30 && d > 15) return '不急，但别忘了哈。';
        if (d <= 15 && d >= 0) return '快好了吗？我这边等着呢。';
        return '？？？人呢？这个事情我说了中午前要的。';
      };
      const shouldPrompt = (t: TaskItem) => t.status !== 'done' && t.status !== 'submitted';

      for (const t of Object.values(next.tasks)) {
        if (!shouldPrompt(t)) continue;
        const diff = t.deadlineMinute - nextMinute;
        if (diff <= 30 && diff > 15 && !t.prompts.m30) {
          tasksNext[t.id] = { ...t, prompts: { ...t.prompts, m30: true } };
          next = pushMessage(next, 'dm_boss', {
            sender: 'boss',
            senderName: '老板',
            type: 'text',
            content: `${t.title}: ${bossTone(t, diff)} (${taskCountdownText(t, nextMinute)})`,
            simMinute: nextMinute,
            shouldAnimate: true,
          });
          changed = true;
        }
        if (diff <= 15 && diff >= 0 && !t.prompts.m15) {
          tasksNext[t.id] = { ...t, prompts: { ...t.prompts, m15: true } };
          next = pushMessage(next, 'dm_boss', {
            sender: 'boss',
            senderName: '老板',
            type: 'text',
            content: `${t.title}: ${bossTone(t, diff)} (${taskCountdownText(t, nextMinute)})`,
            simMinute: nextMinute,
            shouldAnimate: true,
          });
          changed = true;
        }
        if (nextMinute - t.deadlineMinute >= 5 && !t.prompts.overdue5) {
          tasksNext[t.id] = { ...t, prompts: { ...t.prompts, overdue5: true }, status: 'overdue' };
          next = pushMessage(next, 'dm_boss', {
            sender: 'boss',
            senderName: '老板',
            type: 'text',
            content: `${t.title}: ${bossTone(t, -1)} (${taskCountdownText(t, nextMinute)})`,
            simMinute: nextMinute,
            shouldAnimate: true,
          });
          changed = true;
        }
      }

      if (changed) {
        next = { ...next, tasks: tasksNext };
      }

      return next;
    }
    case 'ADD_MESSAGE': {
      const { conversationId, message } = action.payload;
      return pushMessage(state, conversationId, message);
    }
    case 'MARK_ANIMATED': {
      const { conversationId, messageId } = action.payload;
      const conv = state.conversations[conversationId];
      if (!conv) return state;
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [conversationId]: {
            ...conv,
            messages: conv.messages.map((msg) => (msg.id === messageId ? { ...msg, shouldAnimate: false } : msg)),
          },
        },
      };
    }
    case 'SEND_TEXT': {
      const { conversationId, text } = action.payload;
      const nextMinute = state.sim.currentMinute;
      let next = pushMessage(state, conversationId, {
        sender: 'user',
        senderName: 'You',
        type: 'text',
        content: text,
        simMinute: nextMinute,
      });
      if (conversationId === 'dm_zhou') {
        next = { ...next, coworkerHelped: true };
      }
      if (conversationId === 'dept_product' && next.needGroupReply) {
        next = { ...next, groupReplied: true, needGroupReply: false };
        const t3 = next.tasks.task3;
        if (t3 && t3.status !== 'done') {
          next = {
            ...next,
            tasks: {
              ...next.tasks,
              task3: { ...t3, status: 'done', lastSubmittedMinute: nextMinute },
            },
          };
        }
      }
      return next;
    }
    case 'SET_TASK_STATUS': {
      const { taskId, status } = action.payload;
      const t = state.tasks[taskId];
      if (!t) return state;
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: { ...t, status },
        },
      };
    }
    case 'SUBMIT_TASK': {
      const { taskId, text } = action.payload;
      const t = state.tasks[taskId];
      if (!t) return state;
      const nowMinute = state.sim.currentMinute;
      let next: AppState = {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...t,
            status: 'submitted',
            lastSubmittedMinute: nowMinute,
          },
        },
      };
      next = pushMessage(next, 'dm_boss', {
        sender: 'user',
        senderName: 'You',
        type: 'text',
        content: `[Submit] ${t.title}${t.revision > 0 ? ` (rev ${t.revision})` : ''}\n${text}`,
        simMinute: nowMinute,
      });
      next = pushMessage(next, 'dm_boss', {
        sender: 'system',
        senderName: 'System',
        type: 'text',
        content: 'Submitted. Boss is reviewing…',
        simMinute: nowMinute,
      });
      return next;
    }
    default:
      return state;
  }
}

interface ChatContextProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  simTimeText: string;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, () => createInitialState(Date.now()));

  useEffect(() => {
    const id = window.setInterval(() => {
      dispatch({ type: 'TICK', payload: { nowMs: Date.now() } });
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const simTimeText = useMemo(() => `🕘 ${formatSimTime(state.sim.currentMinute)}`, [state.sim.currentMinute]);

  return (
    <ChatContext.Provider value={{ state, dispatch, simTimeText }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
