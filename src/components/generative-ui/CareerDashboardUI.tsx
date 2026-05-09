import React from 'react';
import { Target, TrendingUp, CheckCircle, ChevronRight, DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface CareerDashboardUIProps {
  analysis: {
    marketValue: {
      min: number;
      max: number;
      seniority: string;
      suggestion: string;
    };
    jobMatches: {
      title: string;
      match: number;
      desc: string;
    }[];
    actionItems: {
      text: string;
      done: boolean;
      tag: string;
    }[];
  };
}

export function CareerDashboardUI({ analysis }: CareerDashboardUIProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white border border-indigo-100 rounded-xl overflow-hidden shadow-sm mt-4 p-4 space-y-6 max-w-full">
      <div className="flex items-center gap-2 border-b border-indigo-50 pb-3">
        <Target className="text-indigo-600" size={24} />
        <h3 className="font-bold text-lg text-slate-800">
          {t('navigator.title') || 'Career Navigator Dashboard'}
        </h3>
      </div>

      {/* Salary & Seniority */}
      <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 relative">
        <span className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
          {analysis.marketValue.seniority}
        </span>
        <p className="text-slate-500 mb-1 text-sm font-medium">{t('navigator.your_value') || 'Estimated Market Value'}</p>
        <div className="text-2xl font-black text-slate-800 mb-2">
          ${analysis.marketValue.min.toLocaleString()} - ${analysis.marketValue.max.toLocaleString()} <span className="text-base text-slate-400 font-bold">{t('navigator.per_month') || 'HKD / Month'}</span>
        </div>
        <p className="text-emerald-600 font-medium flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg text-sm">
          <TrendingUp size={14} />
          {analysis.marketValue.suggestion}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Job Matches */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
            <Target className="text-blue-500" size={16} />
            {t('navigator.best_matches') || 'Best Job Matches'}
          </h4>
          <div className="space-y-2">
            {analysis.jobMatches.map((job, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-white shadow-sm flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800 text-sm">{job.title}</div>
                  <div className="text-slate-500 text-xs truncate max-w-[150px] md:max-w-[200px]">{job.desc}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-black text-blue-600">{job.match}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Items */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
            <CheckCircle className="text-indigo-500" size={16} />
            {t('navigator.action_items') || 'Action Items'}
          </h4>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {analysis.actionItems.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2 rounded-lg border border-slate-100 bg-slate-50 text-sm">
                <input type="checkbox" checked={item.done} readOnly className="mt-0.5 text-indigo-600 rounded border-slate-300" />
                <div>
                  <div className="text-slate-700 font-medium leading-tight">{item.text}</div>
                  {item.tag && <span className="inline-block mt-1 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] rounded font-semibold">{item.tag}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}