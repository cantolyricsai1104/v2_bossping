import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';

export function useGameEngine() {
  const { status, timeRemaining, setTyping, receiveMessage, score, chats } = useGameStore();
  const triggeredEvents = useRef<Set<string>>(new Set());

  const triggerEvent = (id: string, action: () => void, delayMs = 1000) => {
    if (triggeredEvents.current.has(id)) return;
    triggeredEvents.current.add(id);
    
    // Extract contactId if it's a typing action
    // We'll just do a simple setTimeout for the action
    setTimeout(() => {
      action();
    }, delayMs);
  };

  const simulateTyping = (contactId: string, duration: number, callback: () => void) => {
    setTyping(contactId, true);
    setTimeout(() => {
      callback();
    }, duration);
  };

  useEffect(() => {
    if (status !== 'playing') return;

    const timeElapsed = 180 - timeRemaining;

    // Event 1: Boss Intro (0 seconds)
    if (timeElapsed === 1) {
      triggerEvent('boss_intro', () => {
        simulateTyping('boss', 2000, () => {
          receiveMessage('boss', {
            senderId: 'boss',
            receiverId: 'me',
            type: 'text',
            content: '新人，廠商臨時把發布會提前到明天。我需要你立刻處理幾件事，隨時留意同事的訊息。給你 3 分鐘，搞砸了明天不用來了。',
          });
        });
      });
    }

    // Event 2: Kevin (Designer) Mistake (5 seconds)
    if (timeElapsed === 5) {
      triggerEvent('kevin_mistake', () => {
        simulateTyping('colleague1', 3000, () => {
          receiveMessage('colleague1', {
            senderId: 'colleague1',
            receiverId: 'me',
            type: 'image',
            content: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Fake poster
          });
          setTimeout(() => {
            receiveMessage('colleague1', {
              senderId: 'colleague1',
              receiverId: 'me',
              type: 'text',
              content: '圖改好了，老闆在催，沒問題我就直接發給廠商印了喔！你看一下。',
              options: [
                { id: 'k1', text: '沒問題，辛苦了直接發吧！', scoreImpact: { attentionToDetail: -20 } },
                { id: 'k2', text: '等等，底下的活動日期寫錯了，還是去年的！', scoreImpact: { attentionToDetail: 40 } },
              ]
            });
          }, 1000);
        });
      });
    }

    // Event 3: Sarah (Media Buyer) Data Decision (20 seconds)
    if (timeElapsed === 20) {
      triggerEvent('sarah_data', () => {
        simulateTyping('colleague2', 3000, () => {
          receiveMessage('colleague2', {
            senderId: 'colleague2',
            receiverId: 'me',
            type: 'text',
            content: '預算快燒完了！A 廣告點擊率超高，但都沒人買（轉化率 0.1%）；B 廣告點擊率低，但買的人很多（轉化率 5%）。老闆問現在剩下的 5 萬預算要全部砸在哪一個？',
            options: [
              { id: 's1', text: '砸 A！曝光跟流量最重要！', scoreImpact: { dataAnalysis: -20 } },
              { id: 's2', text: '砸 B！轉換率才是重點，能帶來實際業績！', scoreImpact: { dataAnalysis: 40 } },
            ]
          });
        });
      });
    }

    // Event 4: Boss Bad Idea (45 seconds)
    if (timeElapsed === 45) {
      triggerEvent('boss_bad_idea', () => {
        simulateTyping('boss', 4000, () => {
          receiveMessage('boss', {
            senderId: 'boss',
            receiverId: 'me',
            type: 'text',
            content: '我剛剛看了一下文案，覺得「尊榮享受」太老氣了，改成「絕絕子 YYDS」比較吸引年輕人。現在立刻打給工程師改掉。',
            options: [
              { id: 'b1', text: '好的老闆，馬上改！', scoreImpact: { eq: -20 } },
              { id: 'b2', text: '老闆，這太瞎了吧？完全不符合我們高端品牌調性。', scoreImpact: { eq: -30 } },
              { id: 'b3', text: '老闆這詞確實很潮！但考量我們主打高端客群，怕這詞會讓 VIP 覺得不夠正式，要不要改用「極致奢華」？', scoreImpact: { eq: 40 } },
            ]
          });
        });
      });
    }

    // Dynamic Responses based on options picked
    // For Kevin
    const kevinChat = chats['colleague1'];
    if (kevinChat?.messages.some(m => m.senderId === 'me' && m.content.includes('去年的'))) {
      triggerEvent('kevin_reply_good', () => {
        simulateTyping('colleague1', 2000, () => {
          receiveMessage('colleague1', {
            senderId: 'colleague1',
            receiverId: 'me',
            type: 'text',
            content: '天啊！我完全沒發現！太感謝你了，差點釀成大禍，我馬上改！🙏',
          });
        });
      });
    } else if (kevinChat?.messages.some(m => m.senderId === 'me' && m.content.includes('直接發吧'))) {
      triggerEvent('kevin_reply_bad', () => {
        simulateTyping('colleague1', 2000, () => {
          receiveMessage('colleague1', {
            senderId: 'colleague1',
            receiverId: 'me',
            type: 'text',
            content: '好咧，發出去了！',
          });
        });
      });
    }

    // For Sarah
    const sarahChat = chats['colleague2'];
    if (sarahChat?.messages.some(m => m.senderId === 'me' && m.content.includes('砸 B'))) {
      triggerEvent('sarah_reply_good', () => {
        simulateTyping('colleague2', 2000, () => {
          receiveMessage('colleague2', {
            senderId: 'colleague2',
            receiverId: 'me',
            type: 'text',
            content: '英雄所見略同！我也覺得看 ROI 比較準，我這就去調預算。',
          });
        });
      });
    }

    // For Boss
    const bossChat = chats['boss'];
    if (bossChat?.messages.some(m => m.senderId === 'me' && m.content.includes('極致奢華'))) {
      triggerEvent('boss_reply_good', () => {
        simulateTyping('boss', 3000, () => {
          receiveMessage('boss', {
            senderId: 'boss',
            receiverId: 'me',
            type: 'text',
            content: '嗯...你說得有道理。那就照你說的辦，不錯，有在用腦子。',
          });
        });
      });
    }

  }, [timeRemaining, status, chats, receiveMessage, setTyping]);
}
