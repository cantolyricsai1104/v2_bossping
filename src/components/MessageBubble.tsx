import React, { useEffect, useState } from 'react';
import { ChatMessage, ScoreCardProps, SenderId } from '../types';
import { TypewriterText } from './TypewriterText';

function senderMeta(sender: SenderId) {
  if (sender === 'boss') return { label: '老板', bg: '#4A90D9', avatar: '老' };
  if (sender === 'coworker') return { label: '同事', bg: '#F5A623', avatar: '周' };
  if (sender === 'user') return { label: '我', bg: '#4CAF50', avatar: '我' };
  return { label: '系统', bg: '#9CA3AF', avatar: '系' };
}

export const MessageBubble: React.FC<{
  message: ChatMessage;
  conversationKind: 'group' | 'dm';
  onAnimationComplete?: () => void;
}> = ({ message, conversationKind, onAnimationComplete }) => {
  const isBoss = message.sender === 'boss';
  const isCoworker = message.sender === 'coworker';
  const isSystem = message.sender === 'system';
  const isUser = message.sender === 'user';
  const [isAnimating, setIsAnimating] = useState(message.shouldAnimate);

  useEffect(() => {
     if (isAnimating) {
        const timer = setTimeout(() => {
           setIsAnimating(false);
           onAnimationComplete?.();
        }, 1000);
        return () => clearTimeout(timer);
     }
  }, [isAnimating, onAnimationComplete]);

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <span className="text-[11px] bg-gray-200/50 text-gray-500 px-2 py-0.5 rounded">
          {typeof message.content === 'string' ? message.content : ''}
        </span>
      </div>
    );
  }

  const isScoreCard = message.type === 'scoreCard';

  let bubbleClasses = `rounded-[10px] shadow-sm max-w-[82%] lg:max-w-[70%] relative `;

  if (isBoss || isCoworker) {
    bubbleClasses += isScoreCard ? 'bg-white overflow-hidden border border-black/5 ' : 'bg-white p-3 ';
  } else {
    bubbleClasses += 'bg-[#95ec69] p-3 ';
  }

  const triangleLeft = <div className="absolute -left-2 top-2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-white" />;
  const triangleRight = <div className="absolute -right-2 top-2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[8px] border-l-[#95ec69]" />;
  const meta = senderMeta(message.sender);

  return (
    <div className={`flex w-full mb-4 px-1 lg:px-3 ${isUser ? 'justify-end' : 'justify-start'} items-start`}>
      {!isUser && (
        <div
          className="w-10 h-10 rounded-[10px] flex items-center justify-center text-white mr-3 flex-shrink-0 font-semibold"
          style={{ backgroundColor: meta.bg }}
        >
          {meta.avatar}
        </div>
      )}

      <div className="flex flex-col max-w-[82%] lg:max-w-[70%]">
        {conversationKind === 'group' && !isUser && (
          <div className="text-[11px] text-gray-500 mb-1 px-1">
            {message.senderName ?? meta.label}
          </div>
        )}

        <div className={`${bubbleClasses} ${message.shouldAnimate ? 'animate-in zoom-in-95 duration-200' : ''}`} style={{ wordBreak: 'break-word' }}>
          {!isUser && !isScoreCard && triangleLeft}
          {isUser && triangleRight}

          {message.type === 'text' && typeof message.content === 'string' && (
            <div className="text-sm leading-relaxed whitespace-pre-wrap text-[#1a1a1a]">
              {(isBoss || isCoworker) && message.shouldAnimate ? (
                <TypewriterText
                  text={message.content}
                  speed={22}
                  onComplete={() => {
                    setIsAnimating(false);
                    onAnimationComplete?.();
                  }}
                />
              ) : (
                message.content
              )}
            </div>
          )}

        {message.type === 'scoreCard' && (
           <div className="p-4 w-full">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">任务综合评定</span>
              <span className="text-2xl font-black text-green-500">{(message.content as ScoreCardProps).score}</span>
            </div>
            <p className="text-[11px] text-gray-600 italic border-l-2 border-gray-200 pl-2 mb-3">
                “{(message.content as ScoreCardProps).overall}”
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-2">
               {(message.content as ScoreCardProps).comments.map((c, i) => (
                 <div key={i} className="text-[10px]">
                   <span className="text-gray-400 block mb-0.5">{c.dimension}: </span>
                   <span className="text-slate-700">{c.text}</span>
                 </div>
               ))}
            </div>
           </div>
        )}

        </div>
      </div>

      {isUser && (
        <div
          className="w-10 h-10 rounded-[10px] flex items-center justify-center text-white ml-3 flex-shrink-0 font-semibold"
          style={{ backgroundColor: meta.bg }}
        >
          {meta.avatar}
        </div>
      )}
    </div>
  );
}
