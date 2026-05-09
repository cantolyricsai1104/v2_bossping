import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, MoreHorizontal, X } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { MessageBubble } from '../components/MessageBubble';

function formatCountdown(deadlineMinute: number, currentMinute: number) {
  const diff = deadlineMinute - currentMinute;
  const abs = Math.abs(diff);
  const hh = Math.floor(abs / 60);
  const mm = abs % 60;
  const core = hh > 0 ? `${hh}h ${mm}m` : `${mm}m`;
  return diff >= 0 ? core : `-${core}`;
}

function statusLabel(status: string) {
  if (status === 'todo') return '待开始';
  if (status === 'in_progress') return '进行中';
  if (status === 'submitted') return '已提交';
  if (status === 'needs_revision') return '需返工';
  if (status === 'overdue') return '已超时';
  return '已完成';
}

export default function Chat() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const { state, dispatch, simTimeText } = useChat();

  const conv = conversationId ? state.conversations[conversationId] : undefined;

  const [inputText, setInputText] = useState('');
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [submitTaskId, setSubmitTaskId] = useState<string | null>(null);
  const [submitText, setSubmitText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conv?.messages.length]);

  const tasks = useMemo(() => Object.values(state.tasks), [state.tasks]);
  const openTasks = tasks.filter((t) => t.status !== 'done');
  const nearest = openTasks.slice().sort((a, b) => a.deadlineMinute - b.deadlineMinute)[0];

  if (!conv || !conversationId) return null;

  const handleAnimationComplete = (messageId: string) => {
    dispatch({ type: 'MARK_ANIMATED', payload: { conversationId, messageId } });
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    dispatch({ type: 'SEND_TEXT', payload: { conversationId, text: inputText.trim() } });
    setInputText('');
  };

  const openSubmit = (taskId: string) => {
    setSubmitTaskId(taskId);
    setSubmitText('');
    setIsTasksOpen(false);
  };

  const submitTask = () => {
    if (!submitTaskId || !submitText.trim()) return;
    dispatch({ type: 'SUBMIT_TASK', payload: { taskId: submitTaskId, text: submitText.trim() } });
    setSubmitTaskId(null);
    setSubmitText('');
  };

  return (
    <div className="flex flex-col h-full bg-[#ededed] overflow-hidden">
      <header className="h-14 bg-white border-b border-[#d6d6d6] flex items-center justify-between px-3 shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-2 min-w-0">
          <button className="p-2 -ml-2 lg:hidden text-gray-600" onClick={() => navigate('/')}
            aria-label="Back"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="min-w-0">
            <div className="text-[15px] font-semibold text-slate-900 truncate">{conv.title}</div>
            <div className="text-[11px] text-gray-500">{simTimeText}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-gray-400">
          {state.dayResult && (
            <button
              type="button"
              className="text-[12px] text-[#07c160] font-medium"
              onClick={() => navigate('/review')}
            >
              评估
            </button>
          )}
          <MoreHorizontal size={22} />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-3 lg:p-5 bg-[#ededed]">
        {conv.messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            conversationKind={conv.kind}
            onAnimationComplete={() => handleAnimationComplete(msg.id)}
          />
        ))}
        <div ref={bottomRef} className="h-4" />
      </div>

      <div className="bg-[#f6f6f6] border-t border-[#d6d6d6] flex flex-col shrink-0 pb-safe sticky bottom-0 z-20">
        <button
          type="button"
          className="px-4 py-2 text-left text-[12px] text-gray-600 flex items-center justify-between active:bg-black/5"
          onClick={() => setIsTasksOpen(true)}
        >
          <span className="truncate">📋 待办任务（{openTasks.length}）{nearest ? ` · 最近：${nearest.title}` : ''}</span>
          <span className="shrink-0 text-[11px] text-gray-500">
            {nearest ? formatCountdown(nearest.deadlineMinute, state.sim.currentMinute) : ''}
          </span>
        </button>

        <div className="flex items-end gap-2 p-2 px-3">
          <div className="flex-1 bg-white rounded-md border border-[#d6d6d6] px-3 py-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full max-h-28 min-h-[36px] resize-none focus:outline-none bg-transparent rounded text-sm text-slate-900"
              placeholder={conv.kind === 'group' ? '发送消息' : '发送消息'}
              rows={1}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="px-4 h-[38px] bg-[#07c160] disabled:bg-[#07c160]/50 text-white rounded-md cursor-pointer transition-colors text-sm font-medium"
          >
            发送
          </button>
        </div>
      </div>

      {isTasksOpen && (
        <div className="fixed inset-0 z-50 bg-black/35 flex items-end" onClick={() => setIsTasksOpen(false)}>
          <div
            className="w-full max-w-2xl mx-auto bg-[#f6f6f6] rounded-t-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 h-12 flex items-center justify-between border-b border-black/5">
              <div className="text-sm font-semibold text-slate-900">待办任务</div>
              <button type="button" className="p-2 text-gray-500" onClick={() => setIsTasksOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-3">
              {tasks
                .slice()
                .sort((a, b) => a.deadlineMinute - b.deadlineMinute)
                .map((t) => (
                  <div key={t.id} className="bg-white rounded-xl border border-black/5 p-3 mb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-slate-900 truncate">{t.title}</div>
                        <div className="text-[12px] text-gray-600 mt-0.5">{t.detail}</div>
                        <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-500">
                          <span className="px-2 py-0.5 rounded bg-black/5">{t.priority}</span>
                          <span className={`px-2 py-0.5 rounded ${t.status === 'overdue' ? 'bg-red-50 text-red-600' : 'bg-black/5'}`}>
                            {statusLabel(t.status)}
                          </span>
                          {t.revision > 0 && (
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700">返工 {t.revision}</span>
                          )}
                          <span className={`${t.deadlineMinute - state.sim.currentMinute < 0 ? 'text-red-600' : ''}`}>
                            {formatCountdown(t.deadlineMinute, state.sim.currentMinute)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        {t.status === 'todo' && (
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-md bg-black/5 text-[12px] font-medium"
                            onClick={() => dispatch({ type: 'SET_TASK_STATUS', payload: { taskId: t.id, status: 'in_progress' } })}
                          >
                            开始
                          </button>
                        )}
                        {(t.status === 'in_progress' || t.status === 'todo' || t.status === 'needs_revision' || t.status === 'overdue') && (
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-md bg-[#07c160] text-white text-[12px] font-medium"
                            onClick={() => openSubmit(t.id)}
                          >
                            提交
                          </button>
                        )}
                        {t.status === 'submitted' && (
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-md bg-black/5 text-[12px] font-medium"
                            onClick={() => dispatch({ type: 'SET_TASK_STATUS', payload: { taskId: t.id, status: 'done' } })}
                          >
                            标记完成
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {submitTaskId && (
        <div className="fixed inset-0 z-50 bg-black/35 flex items-center justify-center p-5" onClick={() => setSubmitTaskId(null)}>
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 h-12 flex items-center justify-between border-b border-black/5">
              <div className="text-sm font-semibold text-slate-900">提交任务</div>
              <button type="button" className="p-2 text-gray-500" onClick={() => setSubmitTaskId(null)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="p-4">
              <textarea
                value={submitText}
                onChange={(e) => setSubmitText(e.target.value)}
                className="w-full min-h-[140px] rounded-xl border border-black/10 bg-[#fafafa] p-3 text-sm focus:outline-none"
                placeholder="把你的内容粘贴到这里…"
              />
              <div className="flex justify-end gap-2 mt-3">
                <button type="button" className="px-4 py-2 rounded-md bg-black/5 text-sm font-medium" onClick={() => setSubmitTaskId(null)}>
                  取消
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-md bg-[#07c160] text-white text-sm font-medium disabled:bg-[#07c160]/50"
                  disabled={!submitText.trim()}
                  onClick={submitTask}
                >
                  提交
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
