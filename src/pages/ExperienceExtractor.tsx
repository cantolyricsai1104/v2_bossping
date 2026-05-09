import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Sparkles, Loader2, PlusCircle } from 'lucide-react';
import { callDeepSeekAPI } from '../lib/deepseek';
import { useCareerStore } from '../store/useCareerStore';
import { useChatStore, Message } from '../store/useChatStore';
import { useTranslation } from 'react-i18next';
import { DynamicComponentRenderer } from '../components/generative-ui/DynamicComponentRenderer';

export default function ExperienceExtractor() {
  const { t, i18n } = useTranslation();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { messages, setMessages, clearChat } = useChatStore();

  useEffect(() => {
    if (messages.length === 0 || (messages.length === 1 && messages[0].role === 'assistant')) {
      setMessages([{ role: 'assistant', content: t('extractor.welcome') }]);
    }
  }, [i18n.language, t, messages.length, setMessages]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { skills, starStories, addSkills, addStarStories } = useCareerStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (customMessage?: string) => {
    const textToSend = customMessage || input.trim();
    if (!textToSend || isLoading) return;
    
    const userMessage = { role: 'user' as const, content: textToSend };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    if (!customMessage) setInput('');
    setIsLoading(true);
    
    try {
      const languageInstruction = i18n.language === 'en' ? 'Please reply in English' : '使用繁體中文';
      const apiMessages = [
        { role: 'system' as const, content: `你是一個支援 Generative UI 的專業職涯顧問與人資專家（熟悉香港市場）。
請根據使用者提供的白話文經歷，進行分析並轉譯。

請以 JSON 格式回傳，必須包含以下欄位：
1. "reply": 給使用者的純文字回應
2. "skills": 專業技能字串陣列 (可選)
3. "starStories": STAR 故事陣列 (可選)
4. "ui": 如果使用者提到具體的工作經歷，請生成一個 UI 讓他們填寫。或者，如果使用者要求進行職涯分析、薪資預估，或者你已經收集到足夠的經歷，請直接返回 CareerDashboard 分析結果。
   支援的 ui 格式：
   - 經驗表單：
     {
       "type": "ExperienceForm",
       "props": { "company": "公司名稱", "role": "職位", "duration": "期間", "description": "STAR原則描述" }
     }
   - 職涯導航儀表板 (薪資需以港幣 HKD 計算)：
     {
       "type": "CareerDashboard",
       "props": {
         "analysis": {
           "marketValue": { "min": 預估月薪下限數字, "max": 上限數字, "seniority": "Junior/Mid-level/Senior", "suggestion": "薪資提升建議" },
           "jobMatches": [ { "title": "職位名稱", "match": 0-100契合度, "desc": "說明" } ],
           "actionItems": [ { "text": "具體行動", "done": false, "tag": "標籤" } ]
         }
       }
     }
   - 提問表單 (當你需要使用者補充具體資訊才能寫出好的履歷或故事時，例如詢問他們的具體職責、人數、專案成果等)：
      {
        "type": "QuestionForm",
        "props": {
          "title": "需要補充更多細節",
          "fields": [
            { "id": "q1", "label": "請問您在這個專案中具體負責什麼？", "type": "textarea", "placeholder": "您的回答..." }
          ]
        }
      }
注意：如果你認為使用者目前的輸入適合進行「職涯分析」或「薪水評估」，請務必產生 "CareerDashboard" UI。如果你覺得使用者的經歷太簡短，你需要追問更多細節才能寫出好的 STAR 履歷，請務必使用 "QuestionForm" UI 產生一個表單讓使用者填寫，不要只用純文字反問。JSON 根層級中必須包含 "ui" 屬性。
${languageInstruction}，格式清晰。` },
        ...newMessages.map(m => ({ role: m.role, content: m.content }))
      ];
      
      const response = await callDeepSeekAPI(apiMessages, true);
      
      try {
        const parsedResponse = JSON.parse(response);
        setMessages([...newMessages, { 
          role: 'assistant', 
          content: parsedResponse.reply,
          ui: parsedResponse.ui
        }]);
        
        if (parsedResponse.skills && Array.isArray(parsedResponse.skills)) {
          addSkills(parsedResponse.skills);
        }
        if (parsedResponse.starStories && Array.isArray(parsedResponse.starStories)) {
          addStarStories(parsedResponse.starStories);
        }
      } catch (parseError) {
        console.error("JSON Parsing Error:", parseError);
        setMessages([...newMessages, { role: 'assistant', content: response }]);
      }
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'assistant', content: t('extractor.error') }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="flex h-full bg-white">
      {/* Left Panel: Chat Interface */}
      <div className="w-2/3 border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{t('extractor.title')}</h2>
            <p className="text-slate-500 mt-1">{t('extractor.subtitle')}</p>
          </div>
          <button 
            onClick={() => {
              clearChat();
              setMessages([{ role: 'assistant', content: t('extractor.welcome') }]);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors text-sm"
          >
            <PlusCircle size={16} />
            {t('extractor.new_chat') || 'New Chat'}
          </button>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
          <div className="flex flex-col gap-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'user' ? (
                  <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-sm max-w-[80%] whitespace-pre-wrap">
                    {msg.content}
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 text-slate-800 p-4 rounded-2xl rounded-tl-sm max-w-[90%] w-[500px] shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-blue-600 font-semibold">
                      <Sparkles size={18} />
                      <span>{t('extractor.ai_translation')}</span>
                    </div>
                    <div className="whitespace-pre-wrap text-slate-600 leading-relaxed">
                      {msg.content}
                    </div>
                    {/* 這裡渲染 Generative UI 元件 */}
                    {msg.ui && (
                      <div className="mt-4">
                        <DynamicComponentRenderer 
                          ui={msg.ui} 
                          onQuestionSubmit={(answers) => {
                            // Convert answers to a readable text string and send to AI
                            const answerText = Object.entries(answers)
                              .map(([id, val]) => `${val}`)
                              .join('\n');
                            handleSend(answerText);
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 text-slate-800 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin text-blue-600" />
                  <span className="text-slate-500">{t('extractor.ai_thinking')}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200">
          <div className="flex items-end gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
            <button className="p-3 text-slate-400 hover:text-blue-600 transition-colors">
              <Mic size={24} />
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('extractor.placeholder')}
              className="flex-1 max-h-32 min-h-[56px] bg-transparent resize-none outline-none py-3 px-2"
              rows={1}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel: Extracted Skills Dashboard */}
      <div className="w-1/3 bg-slate-50 p-6 overflow-y-auto">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Sparkles size={20} className="text-blue-600" />
          {t('extractor.dashboard_title')}
        </h3>
        
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-semibold text-slate-700 mb-3">{t('extractor.skill_tags')}</h4>
            <div className="flex flex-wrap gap-2">
              {skills.length > 0 ? (
                skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 text-sm">{t('extractor.no_skills')}</span>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-semibold text-slate-700 mb-3">{t('extractor.star_stories')}</h4>
            <div className="space-y-3">
              {starStories.length > 0 ? (
                starStories.map((story, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm">
                    <p className="font-medium text-slate-800 mb-1">{story.title}</p>
                    <p className="text-slate-500 whitespace-pre-wrap">{story.content}</p>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm">
                  <p className="text-slate-400">{t('extractor.no_stories')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
