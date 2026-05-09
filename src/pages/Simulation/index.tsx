import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';
import { useGameEngine } from '../../engine/useGameEngine';
import { MessageSquare, Bell, UserCircle, Phone, Video, MoreHorizontal, Send, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Simulation() {
  const navigate = useNavigate();
  const { 
    status, timeRemaining, contacts, chats, activeChatId,
    tickTimer, endGame, setActiveChat, markAsRead, sendMessage
  } = useGameStore();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useGameEngine();

  useEffect(() => {
    if (status !== 'playing') {
      navigate('/');
      return;
    }
    const timer = setInterval(() => tickTimer(), 1000);
    return () => clearInterval(timer);
  }, [status, navigate, tickTimer]);

  useEffect(() => {
    if (timeRemaining <= 0) {
      endGame();
      navigate('/report');
    }
  }, [timeRemaining, endGame, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, activeChatId]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const activeChat = activeChatId ? chats[activeChatId] : null;
  const activeContact = activeChatId ? contacts[activeChatId] : null;
  const sortedContacts = Object.values(contacts).sort((a, b) => {
    // Sort by latest message timestamp, or just unread count for demo
    const aChat = chats[a.id];
    const bChat = chats[b.id];
    if (aChat.unreadCount !== bChat.unreadCount) {
      return bChat.unreadCount - aChat.unreadCount;
    }
    return 0;
  });

  return (
    <div className="flex h-screen bg-[#EBEBEB] w-full overflow-hidden">
      {/* Sidebar (Desktop only) */}
      <div className="hidden lg:flex w-[60px] h-full bg-[#2E2E2E] flex-col items-center py-6 space-y-8 shrink-0 z-20">
        <div className="w-10 h-10 rounded bg-[#07C160] flex items-center justify-center text-white font-bold text-lg">
          我
        </div>
        <div className="space-y-6 opacity-60">
          <MessageSquare className="w-7 h-7 text-[#07C160]" />
          <UserCircle className="w-7 h-7 text-white" />
          <Bell className="w-7 h-7 text-white" />
        </div>
      </div>

      {/* Contacts List */}
      <div className="w-full lg:w-[320px] shrink-0 h-full bg-[#F7F7F7] flex-col border-r border-gray-200 z-10 flex">
        <div className="h-[60px] bg-[#F7F7F7] flex items-center px-4 justify-between border-b border-gray-200/50">
          <div className="font-medium text-lg flex items-center gap-2">
            <span className="text-gray-900">微信</span>
            <span className="bg-gray-200 text-gray-500 text-xs px-2 py-0.5 rounded-full">3</span>
          </div>
          <div className={cn(
            "font-bold px-3 py-1 rounded-full text-sm flex items-center gap-1.5 shadow-sm border",
            timeRemaining < 60 ? "bg-red-50 text-red-500 border-red-100 animate-pulse" : "bg-white text-gray-700 border-gray-200"
          )}>
            <Clock className="w-4 h-4" />
            {formatTime(timeRemaining)}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {sortedContacts.map(contact => {
            const chat = chats[contact.id];
            const lastMsg = chat.messages[chat.messages.length - 1];
            const isActive = activeChatId === contact.id;
            
            return (
              <div 
                key={contact.id}
                onClick={() => {
                  setActiveChat(contact.id);
                  markAsRead(contact.id);
                }}
                className={cn(
                  "flex items-center px-4 py-3 cursor-pointer transition-colors relative",
                  isActive ? "bg-[#C4C4C4]" : "hover:bg-[#EBEBEB]"
                )}
              >
                <div className="relative shrink-0">
                  <img src={contact.avatarUrl} alt={contact.name} className="w-12 h-12 rounded-lg" />
                  {chat.unreadCount > 0 && (
                    <div className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-[#F7F7F7]">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-medium text-[15px] truncate">{contact.name}</h3>
                    <span className="text-xs text-gray-400 shrink-0">
                      {lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                    </span>
                  </div>
                  <p className="text-[13px] text-gray-500 truncate">
                    {chat.isTyping ? <span className="text-[#07C160]">正在輸入...</span> : 
                     lastMsg ? (lastMsg.type === 'image' ? '[圖片]' : lastMsg.content) : 
                     `${contact.role}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className={cn("flex-1 h-full bg-[#F5F5F5] flex flex-col relative", !activeChatId && "hidden lg:flex")}>
        {activeContact ? (
          <>
            {/* Chat Header */}
            <div className="h-[60px] bg-[#F5F5F5] border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
              <div className="flex items-center gap-3">
                <h2 className="font-medium text-lg text-gray-900">{activeContact.name}</h2>
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-md">{activeContact.role}</span>
              </div>
              <div className="flex items-center gap-4 text-gray-500">
                <Phone className="w-5 h-5 cursor-pointer hover:text-gray-700" />
                <Video className="w-5 h-5 cursor-pointer hover:text-gray-700" />
                <MoreHorizontal className="w-5 h-5 cursor-pointer hover:text-gray-700" />
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeChat?.messages.map((msg, i) => {
                const isMe = msg.senderId === 'me';
                const showAvatar = i === 0 || activeChat.messages[i - 1].senderId !== msg.senderId;

                if (msg.type === 'system') {
                  return (
                    <div key={msg.id} className="flex justify-center my-4">
                      <div className="bg-black/10 text-black/50 text-xs px-3 py-1 rounded-md">
                        {msg.content}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className={cn("flex gap-3", isMe ? "flex-row-reverse" : "flex-row")}>
                    {showAvatar ? (
                      <img 
                        src={isMe ? "https://ui-avatars.com/api/?name=Me&background=07C160&color=fff" : activeContact.avatarUrl} 
                        className="w-10 h-10 rounded-lg shrink-0" 
                        alt="avatar"
                      />
                    ) : (
                      <div className="w-10 shrink-0" />
                    )}
                    
                    <div className={cn("flex flex-col max-w-[70%]", isMe ? "items-end" : "items-start")}>
                      {msg.type === 'text' && (
                        <div className={cn(
                          "px-4 py-2.5 rounded-xl text-[15px] leading-relaxed break-words",
                          isMe ? "bg-[#95EC69] text-black" : "bg-white text-black"
                        )}>
                          {msg.content}
                        </div>
                      )}
                      
                      {msg.type === 'image' && (
                        <div className="rounded-xl overflow-hidden border border-gray-100 bg-white p-1">
                          <img src={msg.content} alt="attachment" className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity" />
                        </div>
                      )}

                      {/* Display Options if this is the latest message from NPC and it has options */}
                      {!isMe && msg.options && i === activeChat.messages.length - 1 && (
                        <div className="mt-3 flex flex-col gap-2 w-full min-w-[240px]">
                          {msg.options.map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => sendMessage(activeContact.id, opt.text, opt)}
                              className="text-left px-4 py-3 bg-white border border-[#07C160] text-[#07C160] rounded-xl text-[14px] hover:bg-[#07C160] hover:text-white transition-colors shadow-sm"
                            >
                              {opt.text}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {activeChat?.isTyping && (
                <div className="flex gap-3 flex-row">
                  <img src={activeContact.avatarUrl} className="w-10 h-10 rounded-lg shrink-0" alt="avatar" />
                  <div className="px-4 py-3 rounded-xl bg-white flex items-center gap-1 w-16">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area (Disabled for this demo, interaction is via options) */}
            <div className="h-[160px] bg-[#F5F5F5] border-t border-gray-200 p-4 flex flex-col">
              <div className="flex gap-4 text-gray-500 mb-2 px-2">
                <Send className="w-5 h-5 opacity-50" />
                <span className="text-xs opacity-50 flex-1">
                  (模擬環境下，請點擊上方選項卡片進行回覆)
                </span>
              </div>
              <textarea 
                className="flex-1 w-full resize-none focus:outline-none text-[15px] bg-transparent text-gray-400"
                placeholder="無法手動輸入..."
                disabled
              ></textarea>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="flex flex-col items-center gap-4 opacity-30">
              <MessageSquare className="w-16 h-16" />
              <p>點擊左側對話框開始</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
