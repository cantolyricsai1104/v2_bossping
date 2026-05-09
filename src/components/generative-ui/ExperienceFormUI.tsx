import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useCareerStore } from '../../store/useCareerStore';
import { Check, Briefcase, Calendar, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ExperienceFormUIProps {
  initialData: {
    company: string;
    role: string;
    duration: string;
    description: string;
  };
  onComplete?: () => void;
}

export function ExperienceFormUI({ initialData, onComplete }: ExperienceFormUIProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(initialData);
  const [isSaved, setIsSaved] = useState(false);
  const { addStarStories } = useCareerStore();

  const handleSave = () => {
    // Save to global store
    addStarStories([{
      title: `${formData.role} at ${formData.company}`,
      content: formData.description
    }]);
    setIsSaved(true);
    if (onComplete) onComplete();
  };

  if (isSaved) {
    return (
      <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-center gap-3 text-green-700">
        <div className="bg-green-100 p-2 rounded-full">
          <Check size={20} />
        </div>
        <div>
          <h4 className="font-semibold">{t('builder.experience') || 'Experience'} Saved</h4>
          <p className="text-sm text-green-600">You can view and edit it in the resume builder.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mt-3">
      <div className="bg-slate-50 border-b border-slate-200 p-3 px-4 flex items-center gap-2">
        <Briefcase size={18} className="text-blue-600" />
        <h4 className="font-semibold text-slate-800">{t('builder.add_experience') || 'Add Experience'} (AI Generated)</h4>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500">{t('builder.company_name') || 'Company Name'}</label>
            <Input 
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              placeholder={t('builder.employer_example') || 'e.g. Google'}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500">{t('builder.job_title') || 'Job Title'}</label>
            <Input 
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              placeholder={t('builder.job_title_example') || 'e.g. Frontend Engineer'}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500">{(t('builder.start_date') || 'Start Date')} - {(t('builder.end_date') || 'End Date')}</label>
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              className="pl-9"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              placeholder="e.g. 2021/05 - 2023/08"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500">{t('builder.description') || 'Description'} (STAR)</label>
          <Textarea 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="min-h-[100px]"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Check size={16} className="mr-2" /> {t('builder.save') || 'Confirm & Add to Resume'}
          </Button>
        </div>
      </div>
    </div>
  );
}
