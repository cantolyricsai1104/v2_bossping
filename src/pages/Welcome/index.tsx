import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';
import { Briefcase, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { callDeepSeekAPI } from '../../lib/deepseek';

export default function Welcome() {
  const navigate = useNavigate();
  const startGame = useGameStore((state) => state.startGame);
  const [jdUrl, setJdUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const handleStart = async () => {
    if (jdUrl) {
      setAnalyzing(true);
      try {
        const response = await callDeepSeekAPI([
          { 
            role: 'system', 
            content: '你是一個資深 HR。請根據使用者提供的職缺描述或連結，分析並萃取出三個關鍵資訊：職位名稱(title)、工作內容簡介(description，限30字內)、三個核心能力要求(requirements)。請務必以 JSON 格式回傳，格式為：{"title": "...", "description": "...", "requirements": ["...", "...", "..."]}'
          },
          {
            role: 'user',
            content: `請分析這份職缺：${jdUrl}`
          }
        ], true);
        
        const parsed = JSON.parse(response);
        setAnalyzing(false);
        launchGame({
          id: 'custom_job',
          title: parsed.title || '客製化職位',
          description: parsed.description || '負責處理公司交辦之專案與核心業務。',
          requirements: parsed.requirements || ['問題解決', '溝通協調', '執行力']
        });
      } catch (error) {
        console.error("JD Analysis failed:", error);
        setAnalyzing(false);
        // Fallback to default if API fails
        launchGame();
      }
    } else {
      launchGame();
    }
  };

  const launchGame = (customJob?: any) => {
    const jobData = customJob || {
      id: 'marketing_exec',
      title: 'Junior Marketing Executive',
      description: '負責社群媒體運營、KOL 合作與數據追蹤。',
      requirements: ['數據敏感度', '跨部門溝通', '危機處理能力']
    };
    startGame(jobData);
    navigate('/simulation');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#07C160] p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Briefcase className="w-8 h-8 text-[#07C160]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Boss-Pings</h1>
            <p className="text-white/90 text-sm">3分鐘沉浸式職場生存戰</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#07C160]" />
              JD 實境化引擎
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              不知道這份工作到底在做什麼？貼上職缺連結，我們直接幫你生成 3 分鐘的真實職場情境！
            </p>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">輸入 JD 連結 (可選)</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="https://www.104.com.tw/job/..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#07C160]/20 focus:border-[#07C160] transition-all"
                  value={jdUrl}
                  onChange={(e) => setJdUrl(e.target.value)}
                  disabled={analyzing}
                />
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <div className="text-sm text-orange-800">
              <p className="font-medium mb-1">今日體驗職位：行銷專員 (Marketing Exec)</p>
              <p className="text-orange-700/80">你將面臨老闆施壓、預算抉擇與突發危機。準備好接受挑戰了嗎？</p>
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={analyzing}
            className={`w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
              analyzing ? 'bg-[#07C160]/70 cursor-not-allowed' : 'bg-[#07C160] hover:bg-[#06ad56] active:scale-[0.98]'
            }`}
          >
            {analyzing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                分析 JD 中...
              </div>
            ) : (
              <>
                進入職場
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
