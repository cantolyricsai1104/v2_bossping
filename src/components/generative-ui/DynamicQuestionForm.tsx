import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Send, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface QuestionField {
  id: string;
  label: string;
  type: 'text' | 'textarea';
  placeholder?: string;
}

export interface DynamicQuestionFormProps {
  title: string;
  fields: QuestionField[];
  onSubmit: (answers: Record<string, string>) => void;
}

export function DynamicQuestionForm({ title, fields, onSubmit }: DynamicQuestionFormProps) {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    // Only submit if at least one field has an answer
    const hasAnswers = Object.values(answers).some(val => val.trim().length > 0);
    if (!hasAnswers) return;
    
    setIsSubmitted(true);
    onSubmit(answers);
  };

  if (isSubmitted) {
    return (
      <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl mt-3 text-sm text-slate-500 italic">
        {t('extractor.answers_submitted') || 'Answers submitted to AI...'}
      </div>
    );
  }

  return (
    <div className="bg-white border border-blue-100 rounded-xl overflow-hidden shadow-sm mt-3">
      <div className="bg-blue-50 border-b border-blue-100 p-3 px-4 flex items-center gap-2">
        <HelpCircle size={18} className="text-blue-600" />
        <h4 className="font-semibold text-blue-900 text-sm">{title}</h4>
      </div>
      
      <div className="p-4 space-y-4">
        {fields.map((field) => (
          <div key={field.id} className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">{field.label}</label>
            {field.type === 'textarea' ? (
              <Textarea 
                value={answers[field.id] || ''}
                onChange={(e) => setAnswers({...answers, [field.id]: e.target.value})}
                placeholder={field.placeholder}
                className="min-h-[80px] text-sm"
              />
            ) : (
              <Input 
                value={answers[field.id] || ''}
                onChange={(e) => setAnswers({...answers, [field.id]: e.target.value})}
                placeholder={field.placeholder}
                className="text-sm"
              />
            )}
          </div>
        ))}

        <div className="flex justify-end pt-2">
          <Button 
            onClick={handleSubmit} 
            className="bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs px-3"
            disabled={!Object.values(answers).some(val => val.trim().length > 0)}
          >
            <Send size={14} className="mr-1.5" /> 
            {t('extractor.submit_answers') || 'Submit Answers'}
          </Button>
        </div>
      </div>
    </div>
  );
}