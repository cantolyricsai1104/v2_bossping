import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, CheckCircle, ChevronRight, DollarSign, Sparkles, Loader2 } from 'lucide-react';
import { useCareerStore, CareerAnalysis } from '../store/useCareerStore';
import { callDeepSeekAPI } from '../lib/deepseek';
import { useTranslation } from 'react-i18next';

export default function CareerNavigator() {
  const { t, i18n } = useTranslation();
  const { skills, starStories, analysis, setAnalysis } = useCareerStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (skills.length === 0) return;
    
    setIsAnalyzing(true);
    try {
      const languageInstruction = i18n.language === 'en' ? 'Please reply in English' : '使用繁體中文';
      const prompt = `
你是一位熟悉香港 (Hong Kong) 職場生態的資深職涯顧問與人資專家。
根據以下使用者提供的專業技能與經歷：
技能：${skills.join(', ')}
經歷：${starStories.map(s => s.title).join(', ')}

請進行客觀且符合香港市場真實行情的職涯分析，並以 JSON 格式回傳。
注意：薪資必須以「港幣 (HKD)」為單位，且需符合香港市場標準。例如，擁有 3.5 萬 IG 粉絲的社群經營者，具備一定的變現能力與影響力，不應只給予極低薪資。請根據經歷深度判斷其職級 (Junior/Mid-level/Senior)。

請不要使用任何 Markdown 標記 (如 **, # 等)。必須包含以下結構：
{
  "marketValue": {
    "min": 數字 (預估月薪下限，港幣 HKD),
    "max": 數字 (預估月薪上限，港幣 HKD),
    "seniority": "字串 (例如: Junior, Mid-level, Senior, Lead)",
    "suggestion": "給予提升薪資或職級的一句話建議"
  },
  "jobMatches": [
    {
      "title": "職位名稱 (例如: Social Media Manager, Content Strategist)",
      "match": 數字 (0-100 的契合度),
      "desc": "契合度說明"
    }
  ], // 請提供 3 個最佳匹配崗位
  "actionItems": [
    {
      "text": "具體行動建議",
      "done": false,
      "tag": "標籤 (例如: 強烈建議, 提升身價)"
    }
  ] // 請提供 4 個技能升級行動清單
}
${languageInstruction}。
      `;

      const apiMessages = [
        { role: 'system' as const, content: prompt }
      ];
      
      const response = await callDeepSeekAPI(apiMessages, true);
      const parsedResponse = JSON.parse(response) as CareerAnalysis;
      setAnalysis(parsedResponse);
    } catch (error) {
      console.error("Analysis Error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (skills.length > 0 && !analysis && !isAnalyzing) {
      handleAnalyze();
    }
  }, [skills]);

  const displayMarketValue = analysis?.marketValue || {
    min: 20000,
    max: 30000,
    seniority: "Mid-level",
    suggestion: "若想提升薪資，建議強化付費廣告與多渠道整合行銷能力"
  };

  const displayJobMatches = analysis?.jobMatches || [
    { title: '用戶運營', match: 90, desc: '高度契合你的社群管理經驗與溝通能力' },
    { title: '初級產品經理', match: 78, desc: '具備基礎的專案管理概念，需加強需求分析' },
    { title: '數據分析師', match: 65, desc: '邏輯思維強，但缺乏核心 SQL/Python 技能' },
  ];

  const displayActionItems = analysis?.actionItems || [
    { text: '一週內用 Python 寫個小爬蟲', done: false, tag: '強烈建議' },
    { text: '完成 Coursera SQL 基礎課程', done: false, tag: '提升身價' },
    { text: '將公會經歷以 STAR 原則寫入履歷', done: true, tag: '已完成' },
    { text: '了解敏捷開發 (Agile) 核心概念', done: false, tag: '補充知識' },
  ];

  return (
    <div className="flex h-full flex-col bg-slate-50 overflow-y-auto relative">
      {isAnalyzing && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4 border border-blue-100">
            <Loader2 size={48} className="animate-spin text-blue-600" />
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-800">{t('navigator.ai_analyzing')}</h3>
              <p className="text-slate-500 mt-2">{t('navigator.ai_analyzing_sub', { count: skills.length })}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-8 pb-4">
        <h2 className="text-3xl font-bold text-slate-800">{t('navigator.title')}</h2>
        <p className="text-slate-500 mt-2 text-lg">{t('navigator.subtitle')}</p>
        
        {skills.length > 0 && (
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-600 flex items-center gap-1">
              <Sparkles size={16} className="text-blue-500" />
              {t('navigator.skills_extracted')}
            </span>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 p-8 grid grid-cols-12 gap-8">
        {/* Left Column: Recommendations & Radar */}
        <div className="col-span-8 flex flex-col gap-8">
          {/* Salary Gauge */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <DollarSign className="text-emerald-500" />
                {t('navigator.market_value_title')}
              </h3>
              <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{t('navigator.updated_today')}</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl border border-slate-100 relative">
              <span className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {displayMarketValue.seniority}
              </span>
              <p className="text-slate-500 mb-2 font-medium tracking-wide">{t('navigator.your_value')}</p>
              <div className="text-5xl font-black text-slate-800 mb-4 tracking-tighter">
                ${displayMarketValue.min.toLocaleString()} - ${displayMarketValue.max.toLocaleString()} <span className="text-2xl text-slate-400 font-bold">{t('navigator.per_month')}</span>
              </div>
              <p className="text-emerald-600 font-medium flex items-center gap-1 bg-emerald-50 px-4 py-2 rounded-full text-sm">
                <TrendingUp size={16} />
                {displayMarketValue.suggestion}
              </p>
            </div>
          </div>

          {/* Job Matches */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex-1">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Target className="text-blue-600" />
              {t('navigator.best_matches')}
            </h3>
            
            <div className="space-y-4">
              {displayJobMatches.map((job, idx) => (
                <div key={idx} className="group p-6 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer bg-white relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-slate-800 mb-1">{job.title}</h4>
                      <p className="text-slate-500 text-sm">{job.desc}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-black text-blue-600">{job.match}%</div>
                        <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">{t('navigator.match_rate')}</div>
                      </div>
                      <ChevronRight className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Action Items */}
        <div className="col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <CheckCircle className="text-indigo-500" />
            {t('navigator.action_items')}
          </h3>
          
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {displayActionItems.map((item, idx) => (
              <div key={idx} className={`p-4 rounded-xl border transition-all ${item.done ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'}`}>
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    checked={item.done}
                    readOnly
                    className="mt-1 w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <div>
                    <p className={`font-medium ${item.done ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                      {item.text}
                    </p>
                    {!item.done && item.tag && (
                      <span className="inline-block mt-2 px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded">
                        {item.tag}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || skills.length === 0}
            className="w-full mt-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
          >
            {skills.length === 0 ? t('navigator.need_skills') : t('navigator.re_analyze')}
          </button>
        </div>
      </div>
    </div>
  );
}
