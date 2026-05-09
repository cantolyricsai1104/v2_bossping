import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Sparkles, Loader2 } from 'lucide-react';
import { callDeepSeekAPI } from '../lib/deepseek';
import { useCareerStore } from '../store/useCareerStore';
import { useTranslation } from 'react-i18next';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ExperienceExtractor() {
  const { t, i18n } = useTranslation();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t('extractor.welcome') }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { skills, starStories, addSkills, addStarStories } = useCareerStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = { role: 'user' as const, content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    
    try {
      const languageInstruction = i18n.language === 'en' ? 'Please reply in English' : '使用繁體中文';
      const apiMessages = [
        { role: 'system' as const, content: `你是一個專業的職涯顧問。請將使用者的白話文經歷，轉譯成「可以寫在履歷上的專業技能 (Professional Skills for CV)」與「STAR 原則故事」。\n請不要使用任何 Markdown 標記 (如 **, # 等)。請以 JSON 格式回傳，必須包含以下三個欄位：\n1. "reply": 給使用者的純文字回應\n2. "skills": 履歷專業技能陣列 (字串陣列，例如「社群媒體經營與成長策略 (Social Media Growth & Organic Acquisition)」)\n3. "starStories": STAR 故事陣列 (每個元素包含 "title" 和 "content" 兩個字串欄位，內容需明確包含情境、任務、行動與結果)。\n${languageInstruction}，格式清晰。` },
        ...newMessages
      ];
      
      const response = await callDeepSeekAPI(apiMessages, true);
      
      try {
        const parsedResponse = JSON.parse(response);
        setMessages([...newMessages, { role: 'assistant', content: parsedResponse.reply }]);
        
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
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">{t('extractor.title')}</h2>
          <p className="text-slate-500 mt-1">{t('extractor.subtitle')}</p>
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
                  <div className="bg-white border border-slate-200 text-slate-800 p-4 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-blue-600 font-semibold">
                      <Sparkles size={18} />
                      <span>{t('extractor.ai_translation')}</span>
                    </div>
                    <div className="whitespace-pre-wrap text-slate-600 leading-relaxed">
                      {msg.content}
                    </div>
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
