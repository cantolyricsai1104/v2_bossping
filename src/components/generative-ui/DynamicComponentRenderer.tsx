import React from 'react';
import { ExperienceFormUI } from './ExperienceFormUI';
import { CareerDashboardUI, CareerDashboardUIProps } from './CareerDashboardUI';
import { DynamicQuestionForm, QuestionField } from './DynamicQuestionForm';
import { useTranslation } from 'react-i18next';

export interface UIComponentData {
  type: 'ExperienceForm' | 'SkillTags' | 'CareerDashboard' | 'QuestionForm';
  props: any;
}

interface DynamicComponentRendererProps {
  ui: UIComponentData;
  onQuestionSubmit?: (answers: Record<string, string>) => void;
}

export function DynamicComponentRenderer({ ui, onQuestionSubmit }: DynamicComponentRendererProps) {
  const { t } = useTranslation();

  switch (ui.type) {
    case 'ExperienceForm':
      return <ExperienceFormUI initialData={ui.props} />;
    case 'CareerDashboard':
      return <CareerDashboardUI analysis={ui.props.analysis} />;
    case 'QuestionForm':
      return (
        <DynamicQuestionForm 
          title={ui.props.title} 
          fields={ui.props.fields} 
          onSubmit={(answers) => {
            if (onQuestionSubmit) {
              onQuestionSubmit(answers);
            }
          }} 
        />
      );
    case 'SkillTags':
      // 這裡可以實作另一個 UI 元件
      return (
        <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
          <h4 className="font-semibold text-blue-800 mb-2">{t('extractor.suggested_skills') || 'Suggested Skills'}</h4>
          <div className="flex flex-wrap gap-2">
            {ui.props.skills?.map((skill: string, idx: number) => (
              <span key={idx} className="px-2 py-1 bg-white text-blue-600 rounded-md text-sm border border-blue-200">
                {skill}
              </span>
            ))}
          </div>
        </div>
      );
    default:
      return <div className="text-red-500 mt-2 text-sm border border-red-200 p-2 rounded">Unknown UI Type: {ui.type}</div>;
  }
}
