import { useState } from 'react';


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useResume } from '@/contexts/ResumeContext';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { Education } from '@/types/resume';
import { PromptTemplate } from '@/components/PromptTemplate';
import { DescriptionSuggestions } from '@/components/DescriptionSuggestions';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTranslation } from 'react-i18next';

// Move component outside to prevent re-creation on every render
const SortableEducationCard = ({ 
  edu, 
  expandedId, 
  setExpandedId, 
  updateEducation, 
  removeEducation 
}: { 
  edu: Education;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  updateEducation: (id: string, updates: Partial<Education>) => void;
  removeEducation: (id: string) => void;
}) => {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: edu.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className="border-2">
      <CardHeader className="cursor-pointer" onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-base">
                {edu.degree || t('builder.degree_placeholder')}
              </CardTitle>
              <CardDescription>
                {edu.school || t('builder.school_placeholder')}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              removeEducation(edu.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      {expandedId === edu.id && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`school-${edu.id}`}>{t('builder.school_label')}</Label>
              <Input
                id={`school-${edu.id}`}
                value={edu.school}
                onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                placeholder={t('builder.school_example')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`degree-${edu.id}`}>{t('builder.degree_label')}</Label>
              <Input
                id={`degree-${edu.id}`}
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                placeholder={t('builder.degree_example')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`city-${edu.id}`}>{t('builder.city')}</Label>
              <Input
                id={`city-${edu.id}`}
                value={edu.city}
                onChange={(e) => updateEducation(edu.id, { city: e.target.value })}
                placeholder={t('builder.city_example')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`country-${edu.id}`}>{t('builder.country')}</Label>
              <Input
                id={`country-${edu.id}`}
                value={edu.country}
                onChange={(e) => updateEducation(edu.id, { country: e.target.value })}
                placeholder={t('builder.country_example')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`startDate-${edu.id}`}>{t('builder.start_date_label')}</Label>
              <Input
                id={`startDate-${edu.id}`}
                type="month"
                value={edu.startDate}
                onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`endDate-${edu.id}`}>{t('builder.end_date')}</Label>
              <Input
                id={`endDate-${edu.id}`}
                type="month"
                value={edu.endDate}
                onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                disabled={edu.currentlyStudying}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id={`current-${edu.id}`}
              checked={edu.currentlyStudying}
              onCheckedChange={(checked) =>
                updateEducation(edu.id, { 
                  currentlyStudying: checked as boolean,
                  endDate: checked ? '' : edu.endDate
                })
              }
            />
            <Label htmlFor={`current-${edu.id}`}>{t('builder.currently_studying_here')}</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`gpa-${edu.id}`}>{t('builder.gpa_label')}</Label>
            <Input
              id={`gpa-${edu.id}`}
              value={edu.gpa || ''}
              onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
              placeholder="3.8 / 4.0"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor={`description-${edu.id}`}>{t('builder.description_label_edu')}</Label>
            </div>
            <Textarea
              id={`description-${edu.id}`}
              value={edu.description || ''}
              onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
              placeholder={t('builder.edu_description_placeholder')}
              className="h-24 font-mono text-sm"
            />
          </div>
          
          <DescriptionSuggestions 
            type="education" 
            onAddSuggestion={(text) => {
              const currentDesc = edu.description || '';
              const bulletPoint = text.startsWith('•') ? text : `• ${text}`;
              const newDesc = currentDesc ? `${currentDesc}\n${bulletPoint}` : bulletPoint;
              updateEducation(edu.id, { description: newDesc });
            }} 
          />
        </CardContent>
      )}
    </Card>
  );
};

const EducationPage = () => {
  const { t } = useTranslation();
  const { resumeData, addEducation, updateEducation, updateEducations, removeEducation } = useResume();
  const { education } = resumeData;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      degree: '',
      school: '',
      city: '',
      country: '',
      startDate: '',
      endDate: '',
      currentlyStudying: false,
      description: '',
      gpa: '',
    };
    addEducation(newEdu);
    setExpandedId(newEdu.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = education.findIndex((e) => e.id === active.id);
      const newIndex = education.findIndex((e) => e.id === over.id);
      updateEducations(arrayMove(education, oldIndex, newIndex));
    }
  };

  return (
    
      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('builder.education_title')}</CardTitle>
              <CardDescription>
                {t('builder.education_subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={education.map((e) => e.id)} strategy={verticalListSortingStrategy}>
                  {education.map((edu) => (
                    <SortableEducationCard 
                      key={edu.id} 
                      edu={edu} 
                      expandedId={expandedId}
                      setExpandedId={setExpandedId}
                      updateEducation={updateEducation}
                      removeEducation={removeEducation}
                    />
                  ))}
                </SortableContext>
              </DndContext>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleAddEducation}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('builder.add_education')}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2 text-foreground">{t('builder.edu_tips_title')}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>{t('builder.edu_tip_1')}</li>
                <li>{t('builder.edu_tip_2')}</li>
                <li>{t('builder.edu_tip_3')}</li>
                <li>{t('builder.edu_tip_4')}</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('builder.ai_prompt_title_edu')}</CardTitle>
              <CardDescription>
                {t('builder.ai_prompt_subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <PromptTemplate
                title={t('builder.prompt_generate_edu')}
                description={t('builder.prompt_generate_edu_desc')}
                prompt={t('builder.prompt_text_edu_1')}
              />

              <PromptTemplate
                title={t('builder.prompt_improve')}
                description={t('builder.prompt_improve_desc')}
                prompt={t('builder.prompt_text_edu_2')}
              />

              <PromptTemplate
                title={t('builder.prompt_tailor')}
                description={t('builder.prompt_tailor_edu_desc')}
                prompt={t('builder.prompt_text_edu_3')}
              />

              <PromptTemplate
                title={t('builder.prompt_add_honors')}
                description={t('builder.prompt_add_honors_desc')}
                prompt={t('builder.prompt_text_edu_4')}
              />
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2 text-foreground">{t('builder.how_to_use_ai_prompts')}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>{t('builder.ai_tip_1')}</li>
                <li>{t('builder.ai_tip_2')}</li>
                <li>{t('builder.ai_tip_3')}</li>
                <li>{t('builder.ai_tip_4')}</li>
                <li>{t('builder.ai_tip_5')}</li>
              </ul>
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

export default EducationPage;


