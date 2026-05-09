import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, RefreshCcw } from 'lucide-react';
import { useChat } from '../context/ChatContext';

export default function Review() {
  const { state, dispatch, simTimeText } = useChat();
  const navigate = useNavigate();

  const r = state.dayResult;
  if (!r) {
    return (
      <div className="flex flex-col h-full bg-[#ededed]">
        <div className="h-14 bg-white border-b border-[#d6d6d6] flex items-center px-3 justify-between">
          <button className="p-2 -ml-2 text-gray-600" onClick={() => navigate('/')} aria-label="Back">
            <ChevronLeft size={22} />
          </button>
          <div className="text-[15px] font-semibold">今日评估</div>
          <div className="text-[11px] text-gray-500">{simTimeText}</div>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500">还没有评估</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#ededed]">
      <div className="h-14 bg-white border-b border-[#d6d6d6] flex items-center px-3 justify-between shrink-0">
        <button className="p-2 -ml-2 text-gray-600" onClick={() => navigate('/')} aria-label="Back">
          <ChevronLeft size={22} />
        </button>
        <div className="text-[15px] font-semibold">今日评估</div>
        <div className="text-[11px] text-gray-500">{simTimeText}</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-white rounded-2xl border border-black/5 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[13px] text-gray-500">{r.title}</div>
              <div className="text-[12px] text-gray-600 mt-1">{r.summary}</div>
            </div>
            <div className="text-4xl font-black text-[#07c160] leading-none">{r.score}</div>
          </div>
        </div>

        <div className="mt-4 bg-white rounded-2xl border border-black/5 p-4 shadow-sm">
          <div className="text-[13px] font-semibold text-slate-900 mb-3">评分拆解</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {r.breakdown.map((b) => (
              <div key={b.dimension} className="rounded-xl bg-[#fafafa] border border-black/5 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-[12px] font-semibold text-slate-900">{b.dimension}</div>
                  <div className="text-[12px] font-semibold text-gray-700">{b.score}</div>
                </div>
                <div className="text-[11px] text-gray-500 mt-1">{b.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 bg-white rounded-2xl border border-black/5 p-4 shadow-sm">
          <div className="text-[13px] font-semibold text-slate-900 mb-3">行为时间线</div>
          {r.timeline.length === 0 ? (
            <div className="text-[12px] text-gray-500">暂无互动记录</div>
          ) : (
            <div className="space-y-2">
              {r.timeline.slice(0, 30).map((t, idx) => (
                <div key={idx} className="text-[12px] text-gray-700 flex items-center justify-between gap-3">
                  <span className="text-gray-500">+{t.minute}m</span>
                  <span className="flex-1">{t.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border-t border-[#d6d6d6] p-3 shrink-0">
        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 rounded-md bg-black/5 py-2 text-sm font-medium text-slate-800"
            onClick={() => navigate('/chat/dm_boss')}
          >
            回到聊天
          </button>
          <button
            type="button"
            className="flex-1 rounded-md bg-[#07c160] py-2 text-sm font-medium text-white flex items-center justify-center gap-2"
            onClick={() => {
              dispatch({ type: 'RESET_DAY' });
              navigate('/chat/dept_product');
            }}
          >
            <RefreshCcw size={16} />
            新的一天
          </button>
        </div>
      </div>
    </div>
  );
}

