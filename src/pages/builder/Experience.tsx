import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useResume } from '@/contexts/ResumeContext';
import { Loader2, Sparkles, Plus, Trash2, GripVertical } from 'lucide-react';
import type { Experience } from '@/types/resume';
import { DescriptionSuggestions } from '@/components/DescriptionSuggestions';
import { callDeepSeekAPI } from '@/lib/deepseek';
import { useCareerStore } from '@/store/useCareerStore';
import { useTranslation } from 'react-i18next';

const SortableExperienceItem = ({
  exp,
  isExpanded,
  onToggle,
  onUpdate,
  onRemove,
}: {
  exp: Experience;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (updates: Partial<Experience>) => void;
  onRemove: () => void;
}) => {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: exp.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const { resumeData } = useResume();
  const { starStories } = useCareerStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleOptimizeDescription = async () => {
    setIsGenerating(true);
    try {
      const prompt = t('builder.exp_ai_prompt');
      const targetJdText = resumeData.targetJd || t('builder.exp_ai_no_jd');
      
      const fullPrompt = `${prompt}

【目標職缺 JD】：
${targetJdText}

【目前職位與公司】：
職位：${exp.jobTitle}
公司：${exp.employer}

【目前經歷描述】：
${exp.description || t('builder.none')}

【使用者故事 (STAR，可作為參考素材)】：
${starStories.map(s => `[${s.title}]\n${s.content}`).join('\n\n')}
`;
      const response = await callDeepSeekAPI([{ role: 'system', content: fullPrompt }]);
      onUpdate({ description: response.trim() });
    } catch (error) {
      console.error("Experience Optimization Error:", error);
      alert(t('builder.exp_ai_error'));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card ref={setNodeRef} style={style} className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-accent rounded"
            >
              <GripVertical className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="cursor-pointer flex-1 min-w-0" onClick={onToggle}>
              <h3 className="font-semibold truncate">
                {exp.jobTitle || t('builder.new_position')}
                {exp.employer && `${t('builder.at_company')}${exp.employer}`}
              </h3>
              {exp.startDate && (
                <p className="text-sm text-muted-foreground">
                  {exp.startDate} - {exp.currentlyWorking ? t('builder.present') : exp.endDate}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`jobTitle-${exp.id}`}>{t('builder.job_title_label')}</Label>
              <Input
                id={`jobTitle-${exp.id}`}
                value={exp.jobTitle}
                onChange={(e) => onUpdate({ jobTitle: e.target.value })}
                placeholder={t('builder.job_title_example')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`employer-${exp.id}`}>{t('builder.employer_label')}</Label>
              <Input
                id={`employer-${exp.id}`}
                value={exp.employer}
                onChange={(e) => onUpdate({ employer: e.target.value })}
                placeholder={t('builder.employer_example')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`city-${exp.id}`}>{t('builder.city')}</Label>
              <Input
                id={`city-${exp.id}`}
                value={exp.city}
                onChange={(e) => onUpdate({ city: e.target.value })}
                placeholder={t('builder.city_example')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`country-${exp.id}`}>{t('builder.country')}</Label>
              <Input
                id={`country-${exp.id}`}
                value={exp.country}
                onChange={(e) => onUpdate({ country: e.target.value })}
                placeholder={t('builder.country_example')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`startDate-${exp.id}`}>{t('builder.start_date_label')}</Label>
              <Input
                id={`startDate-${exp.id}`}
                type="month"
                value={exp.startDate}
                onChange={(e) => onUpdate({ startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`endDate-${exp.id}`}>{t('builder.end_date')}</Label>
              <Input
                id={`endDate-${exp.id}`}
                type="month"
                value={exp.endDate}
                onChange={(e) => onUpdate({ endDate: e.target.value })}
                disabled={exp.currentlyWorking}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id={`current-${exp.id}`}
              checked={exp.currentlyWorking}
              onCheckedChange={(checked) => {
                onUpdate({ 
                  currentlyWorking: checked === true,
                  endDate: checked ? '' : exp.endDate 
                });
              }}
            />
            <Label htmlFor={`current-${exp.id}`}>{t('builder.currently_working')}</Label>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={`description-${exp.id}`}>{t('builder.description_label')}</Label>
              <Button
                onClick={handleOptimizeDescription}
                disabled={isGenerating}
                size="sm"
                variant="outline"
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                {t('builder.ai_optimize_exp')}
              </Button>
            </div>
            <Textarea
              id={`description-${exp.id}`}
              value={exp.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder={t('builder.exp_desc_placeholder')}
              className="h-32 font-mono text-sm"
            />
          </div>
          
          <DescriptionSuggestions 
            type="experience"
            onAddSuggestion={(suggestion) => {
              const currentDesc = exp.description || '';
              const newDesc = currentDesc ? `${currentDesc}\n• ${suggestion}` : `• ${suggestion}`;
              onUpdate({ description: newDesc });
            }}
          />
        </CardContent>
      )}
    </Card>
  );
};

const ExperiencePage = () => {
  const { t } = useTranslation();
  const { resumeData, updateExperiences, addExperience, updateExperience, removeExperience } = useResume();
  const { experiences } = resumeData;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = experiences.findIndex((exp) => exp.id === active.id);
      const newIndex = experiences.findIndex((exp) => exp.id === over.id);

      const reorderedExperiences = arrayMove(experiences, oldIndex, newIndex);
      updateExperiences(reorderedExperiences);
    }
  };

  const handleAddExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      jobTitle: '',
      employer: '',
      city: '',
      country: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      description: '',
    };
    addExperience(newExp);
    setExpandedId(newExp.id);
  };

  return (
    
      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('builder.experience_title')}</CardTitle>
              <CardDescription>
                {t('builder.experience_subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={experiences.map((exp) => exp.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {experiences.map((exp) => (
                    <SortableExperienceItem
                      key={exp.id}
                      exp={exp}
                      isExpanded={expandedId === exp.id}
                      onToggle={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                      onUpdate={(updates) => updateExperience(exp.id, updates)}
                      onRemove={() => removeExperience(exp.id)}
                    />
                  ))}
                </SortableContext>
              </DndContext>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleAddExperience}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('builder.add_experience')}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <h3 className="text-lg font-semibold mb-4 text-foreground">{t('builder.live_preview')}</h3>
            
          </div>
        </div>
      </div>
    
  );
};

export default ExperiencePage;

