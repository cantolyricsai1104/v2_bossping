import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';
import { Award, Target, BookOpen, MessageSquare, ArrowLeft, Briefcase, Zap, TrendingUp, ChevronRight, Loader2 } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { callDeepSeekAPI } from '../../lib/deepseek';
import { supabase } from '../../lib/supabase';

export default function Report() {
  const navigate = useNavigate();
  const { score, currentJob } = useGameStore();
  const [analysisText, setAnalysisText] = useState('分析中...');
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  const handleRetry = () => {
    navigate('/');
  };

  // Convert raw scores (e.g. -30 to +40) to 0-100 scale for the chart
  const normalize = (val: number, min = -50, max = 50) => {
    const clamped = Math.max(min, Math.min(max, val));
    return Math.round(((clamped - min) / (max - min)) * 100);
  };

  const scoreData = {
    detail: normalize(score.attentionToDetail),
    data: normalize(score.dataAnalysis),
    eq: normalize(score.eq),
  };

  const chartData = [
    { subject: '細心度', A: scoreData.detail, fullMark: 100 },
    { subject: '數據分析', A: scoreData.data, fullMark: 100 },
    { subject: '向上管理', A: scoreData.eq, fullMark: 100 },
    { subject: '跨部門溝通', A: Math.round((scoreData.eq + scoreData.detail) / 2), fullMark: 100 },
    { subject: '抗壓性', A: 85, fullMark: 100 }, // Simulated fixed score for demo
  ];

  useEffect(() => {
    async function processReport() {
      let aiResponse = '你的表現還有進步空間，建議先從基礎執行任務開始累積經驗。';
      try {
        aiResponse = await callDeepSeekAPI([
          {
            role: 'system',
            content: '你是一位資深職涯顧問。請根據使用者的各項能力分數（0-100分），用繁體中文給出一段約 50 字的綜合評價與職涯建議。'
          },
          {
            role: 'user',
            content: `應徵職位：${currentJob?.title || '行銷專員'}\n細心度：${scoreData.detail}\n數據分析：${scoreData.data}\n向上管理(EQ)：${scoreData.eq}\n跨部門溝通：${Math.round((scoreData.eq + scoreData.detail) / 2)}\n請給出建議。`
          }
        ]);
        setAnalysisText(aiResponse);
      } catch (error) {
        console.error("Failed to generate analysis:", error);
        setAnalysisText(aiResponse);
      } finally {
        setIsAnalyzing(false);
      }

      // Save to Supabase
      try {
        if (supabase) {
          await supabase.from('simulations').insert([
            {
              job_title: currentJob?.title || '行銷專員',
              score_detail: scoreData.detail,
              score_data: scoreData.data,
              score_eq: scoreData.eq,
              ai_analysis: aiResponse,
              created_at: new Date().toISOString()
            }
          ]);
          console.log('Record saved to Supabase');
        }
      } catch (error) {
        console.error("Failed to save to Supabase:", error);
      }
    }
    
    processReport();
  }, [currentJob, scoreData.detail, scoreData.data, scoreData.eq]);

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-4 lg:p-8 overflow-y-auto font-['PingFang_SC','-apple-system',sans-serif]">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#07C160]/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-[#07C160] rounded-full text-sm font-medium mb-4">
                <Briefcase className="w-4 h-4" />
                模擬完成
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">職涯適配度診斷書</h1>
              <p className="text-gray-500 text-lg">
                應徵職位：<span className="font-medium text-gray-800">{currentJob?.title || '行銷專員'}</span>
              </p>
            </div>
            <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center border border-green-100 shadow-sm shrink-0">
              <Award className="w-10 h-10 text-[#07C160]" />
            </div>
          </div>
        </div>

        {/* AI Analysis Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 flex gap-4 items-start">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-blue-900 mb-1 flex items-center gap-2">
              AI 綜合評價
              {isAnalyzing && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
            </h3>
            <p className="text-blue-800/80 leading-relaxed whitespace-pre-wrap">
              {analysisText}
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Radar Chart Area */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-[#07C160]" />
              能力雷達圖
            </h2>
            <div className="flex-1 min-h-[250px] -ml-6">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="User" dataKey="A" stroke="#07C160" strokeWidth={2} fill="#07C160" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Score Bars */}
            <div className="space-y-4 mt-4 pt-6 border-t border-gray-100">
              <div>
                <div className="flex justify-between items-center text-sm mb-1.5">
                  <span className="text-gray-600 font-medium">數據敏感度 (ROI決策)</span>
                  <span className="font-bold text-gray-900">{scoreData.data}/100</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${scoreData.data}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center text-sm mb-1.5">
                  <span className="text-gray-600 font-medium">向上管理 (老闆溝通)</span>
                  <span className="font-bold text-gray-900">{scoreData.eq}/100</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all duration-1000" style={{ width: `${scoreData.eq}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Items & Interview Prep */}
          <div className="space-y-6 flex flex-col">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                行動清單 (Action List)
              </h2>
              <div className="space-y-3">
                {scoreData.data < 60 ? (
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                    <h3 className="font-bold text-blue-900 mb-1 text-sm">強化數據分析能力</h3>
                    <p className="text-blue-800/80 text-sm">在 ROI 決策中，你忽略了轉換率的重要性。建議考取 Google Analytics 基礎證照，並學習計算 CVR (轉換率) 與 CAC (獲客成本)。</p>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                    <h3 className="font-bold text-blue-900 mb-1 text-sm">進階數據策略</h3>
                    <p className="text-blue-800/80 text-sm">你展現了良好的數據敏感度！下一步建議學習 A/B Testing 框架與 SQL 基礎，朝資深成效優化師邁進。</p>
                  </div>
                )}
                
                {scoreData.detail < 60 && (
                  <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100">
                    <h3 className="font-bold text-orange-900 mb-1 text-sm">提升細節敏銳度</h3>
                    <p className="text-orange-800/80 text-sm">你沒發現海報上的過期資訊。建議未來在交件前，使用「Checklist」檢查法，避免公關危機。</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-purple-500" />
                面試 STAR 故事庫
              </h2>
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
                <p className="text-purple-800/80 text-sm leading-relaxed">
                  <span className="font-bold text-purple-900 block mb-2">💡 面試官：「請分享一個你處理主管不合理要求的經驗。」</span>
                  {scoreData.eq > 60 ? (
                    <span>你可以這樣說：「在一次行銷專案中，主管提出與品牌調性不符的文案建議。我沒有直接拒絕，而是<span className="bg-purple-200/50 font-medium px-1 rounded">提出能兼顧主管目的（吸引年輕人）與品牌定位的替代方案</span>，最終成功說服主管...」</span>
                  ) : (
                    <span>你目前缺乏這個經驗。下次遇到主管提出與專業衝突的要求時，試著在「服從」與「拒絕」之間，找出第三條路：<span className="bg-purple-200/50 font-medium px-1 rounded">提供有數據佐證的替代方案</span>。</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center pt-4 pb-12">
          <button 
            onClick={handleRetry}
            className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-xl shadow-gray-900/20 hover:bg-gray-800 transition-all flex items-center gap-2"
          >
            返回首頁，挑戰其他情境
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}
