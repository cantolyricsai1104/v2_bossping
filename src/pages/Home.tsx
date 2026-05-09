import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Info, Pin } from 'lucide-react';
import { useChat } from '../context/ChatContext';

function lastMessagePreview(text: string) {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  return cleaned.length > 38 ? `${cleaned.slice(0, 38)}…` : cleaned;
}

export default function Home() {
  const { state, simTimeText } = useChat();
  const [search, setSearch] = useState('');
  const location = useLocation();
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const list = useMemo(() => {
    const items = state.conversationOrder
      .map((id) => state.conversations[id])
      .filter(Boolean);
    if (!search.trim()) return items;
    return items.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));
  }, [search, state.conversationOrder, state.conversations]);

  return (
    <div className="flex flex-col h-full bg-[#f7f7f7]">
      <div className="bg-white text-slate-900 px-4 h-14 flex items-center justify-center font-medium shrink-0 border-b border-black/5">
        <div className="relative flex items-center justify-center w-full">
          <span className="text-[15px]">微信</span>
          <div className="absolute left-0 text-[11px] text-gray-500">{simTimeText}</div>
          <button
            type="button"
            className="absolute right-0 p-1 text-gray-500 hover:text-gray-700"
            onClick={() => setIsInfoOpen(true)}
            aria-label="Info"
          >
            <Info size={18} />
          </button>
        </div>
      </div>

      {/* 搜索框 */}
      <div className="p-3 shrink-0">
        <div className="bg-[#efefef] rounded-md flex items-center px-3 py-1.5 space-x-2">
          <Search size={16} className="text-gray-500" />
          <input 
            type="text" 
            placeholder="搜索" 
            className="flex-1 bg-transparent outline-none text-sm text-black placeholder-gray-500"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 联系人列表 */}
      <div className="flex-1 overflow-y-auto">
        {list.length > 0 ? (
          list.map((c) => {
            const last = c.messages[c.messages.length - 1];
            const isActive = location.pathname === `/chat/${c.id}`;
            const preview = !last
              ? c.kind === 'group'
                ? '置顶工作群 · 今日任务会在这里发布'
                : '开始对话'
              : last.type === 'text'
                ? lastMessagePreview(String(last.content))
                : 'Daily evaluation'
            ;

            return (
              <Link
                to={`/chat/${c.id}`}
                key={c.id}
                className={`flex items-center px-4 py-3 border-b border-black/5 ${c.pinned ? 'bg-[#f3f3f3]' : 'bg-white'} hover:bg-black/5 active:bg-black/10 transition-colors ${isActive ? 'bg-black/5 lg:opacity-100' : 'lg:opacity-95'}`}
              >
                <div className="w-12 h-12 rounded-[10px] bg-[#d8d8d8] flex items-center justify-center text-slate-800 text-lg font-semibold shadow-inner shrink-0">
                  {c.kind === 'group' ? '群' : c.title.slice(0, 1)}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-slate-900 truncate flex items-center gap-2">
                      {c.title}
                      {c.pinned && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-gray-500">
                          <Pin size={12} />
                          Pinned
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-gray-500 shrink-0 ml-2">{simTimeText.replace('🕘 ', '')}</span>
                  </div>
                  <div className="text-xs text-gray-500 truncate">{preview}</div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="text-center text-gray-400 mt-10">暂无会话</div>
        )}
      </div>

      {isInfoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6 lg:hidden" onClick={() => setIsInfoOpen(false)}>
          <div className="w-full max-w-sm rounded-xl bg-white p-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-sm font-semibold text-slate-800 mb-2">说明</div>
            <div className="text-[13px] leading-relaxed text-slate-600 whitespace-pre-wrap">
              {`这是一个“职场一日沉浸式体验”原型。
时间会自动推进，事件会按时间触发。
你可以在聊天里处理打断、查看待办并提交任务。`}
            </div>
            <button
              type="button"
              className="mt-4 w-full rounded-md bg-[#07c160] py-2 text-sm font-medium text-white"
              onClick={() => setIsInfoOpen(false)}
            >
              我知道了
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
