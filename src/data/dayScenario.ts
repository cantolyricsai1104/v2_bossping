import { Conversation, SimEvent, TaskItem } from '../types';

export const SIM_START_HOUR = 9;
export const SIM_END_MINUTE = 540;

export function minute(hhmm: string) {
  const [h, m] = hhmm.split(':').map((v) => Number(v));
  return (h - SIM_START_HOUR) * 60 + m;
}

export function createInitialConversations(): Record<string, Conversation> {
  return {
    dept_product: {
      id: 'dept_product',
      kind: 'group',
      title: '[部门] 产品组',
      pinned: true,
      messages: [],
    },
    dm_boss: {
      id: 'dm_boss',
      kind: 'dm',
      title: '老板',
      messages: [],
    },
    dm_zhou: {
      id: 'dm_zhou',
      kind: 'dm',
      title: '小周',
      messages: [],
    },
  };
}

export function createInitialTasks(): Record<string, TaskItem> {
  const base = (t: Omit<TaskItem, 'prompts'>): TaskItem => ({
    ...t,
    prompts: { m30: false, m15: false, overdue5: false },
  });

  return {
    task1: base({
      id: 'task1',
      title: '任务1：PRD 大纲',
      detail: '写 1 页 PRD 大纲：目标、范围、成功指标（不需要太长，但要完整）。',
      priority: 'P0',
      deadlineMinute: minute('12:00'),
      status: 'todo',
      revision: 0,
    }),
    task2: base({
      id: 'task2',
      title: '任务2：状态同步（Status Update）',
      detail: '用 5 条 bullet 写清楚：进度 / 风险 / 需要协作 / 下一步。',
      priority: 'P1',
      deadlineMinute: minute('17:00'),
      status: 'todo',
      revision: 0,
    }),
    task3: base({
      id: 'task3',
      title: '任务3：参与群讨论',
      detail: '15:00 群里讨论你需要回复：表达观点 + 给出一个可执行建议。',
      priority: 'P2',
      deadlineMinute: minute('16:00'),
      status: 'todo',
      revision: 0,
    }),
  };
}

export function createInitialEvents(): SimEvent[] {
  return [
    {
      id: 'e-0905-tasklist',
      atMinute: minute('09:05'),
      kind: 'message',
      conversationId: 'dept_product',
      sender: 'boss',
      senderName: '老板',
      text: '大家早上好，今天优先把这三件事推进：\n1）PRD 大纲（中午 12 点前）\n2）下午 Status Update（17:00 前）\n3）15:00 群里有个讨论，你参与一下。',
    },
    {
      id: 'e-0930-dm-boss',
      atMinute: minute('09:30'),
      kind: 'message',
      conversationId: 'dm_boss',
      sender: 'boss',
      senderName: '老板',
      text: '早上发的任务你看到了吗？先做第一个，中午前给我。',
    },
    {
      id: 'e-1015-dm-zhou',
      atMinute: minute('10:15'),
      kind: 'message',
      conversationId: 'dm_zhou',
      sender: 'coworker',
      senderName: '小周',
      text: '上次那个数据你还有吗？急用！',
    },
    {
      id: 'e-1015-group-ask',
      atMinute: minute('10:15'),
      kind: 'message',
      conversationId: 'dept_product',
      sender: 'boss',
      senderName: '老板',
      text: '@你 进度怎么样了？',
    },
    {
      id: 'e-1330-urgent-task',
      atMinute: minute('13:30'),
      kind: 'addTasks',
      tasks: [
        {
          id: 'task4',
          title: '紧急：临时加塞需求',
          detail: '临时来了一个紧急需求：给出一个调整方案并发给老板。',
          priority: 'P0',
          deadlineMinute: minute('15:00'),
          status: 'todo',
          revision: 0,
        },
      ],
    },
    {
      id: 'e-1400-feedback-task1',
      atMinute: minute('14:00'),
      kind: 'bossFeedbackTask1',
    },
    {
      id: 'e-1500-group-discuss',
      atMinute: minute('15:00'),
      kind: 'groupNeedReply',
    },
    {
      id: 'e-1745-end',
      atMinute: minute('17:45'),
      kind: 'endDay',
    },
  ];
}

export function conversationOrder(conversations: Record<string, Conversation>) {
  const items = Object.values(conversations);
  return items
    .slice()
    .sort((a, b) => {
      const ap = a.pinned ? 0 : 1;
      const bp = b.pinned ? 0 : 1;
      if (ap !== bp) return ap - bp;
      return a.title.localeCompare(b.title);
    })
    .map((c) => c.id);
}

