import { useState } from 'react';


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useResume } from '@/contexts/ResumeContext';
import { Plus, X, GripVertical, Loader2, Sparkles } from 'lucide-react';
import type { Skill } from '@/types/resume';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { callDeepSeekAPI } from '@/lib/deepseek';
import { useCareerStore } from '@/store/useCareerStore';
import { useTranslation } from 'react-i18next';

const SortableSkillItem = ({ skill, onRemove }: { skill: Skill; onRemove: (id: string) => void }) => {
  const { t } = useTranslation();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: skill.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getLevelTranslation = (level: string) => {
    switch (level) {
      case 'beginner': return t('builder.level_beginner_label');
      case 'intermediate': return t('builder.level_intermediate_label');
      case 'advanced': return t('builder.level_advanced_label');
      case 'expert': return t('builder.level_expert_label');
      default: return level;
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center justify-between p-3 bg-card border rounded-lg">
      <div className="flex items-center gap-3 flex-1">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-foreground">{skill.name}</p>
          <p className="text-sm text-muted-foreground">{getLevelTranslation(skill.level)}</p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={() => onRemove(skill.id)}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

const SkillsPage = () => {
  const { t } = useTranslation();
  const { resumeData, addSkill, updateSkills, removeSkill } = useResume();
  const { skills, targetJd } = resumeData;
  const { skills: storeSkills } = useCareerStore();
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<Skill['level']>('intermediate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);

  const handleGenerateSkills = async () => {
    setIsGenerating(true);
    try {
      const prompt = t('builder.skill_ai_prompt');
      const targetJdText = targetJd || t('builder.skill_ai_no_jd');
      
      const fullPrompt = `${prompt}

【目標職缺 JD】：
${targetJdText}

【使用者目前已填寫的技能】：
${[...skills.map(s => s.name), ...storeSkills].join(', ')}
`;
      const response = await callDeepSeekAPI([{ role: 'system', content: fullPrompt }], true);
      const newSuggestions = JSON.parse(response);
      if (Array.isArray(newSuggestions)) {
        setSuggestedSkills(newSuggestions);
      }
    } catch (error) {
      console.error("Skill Suggestion Error:", error);
      alert(t('builder.skill_ai_error'));
    } finally {
      setIsGenerating(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddSkill = () => {
    if (newSkillName.trim()) {
      const newSkill: Skill = {
        id: `skill-${Date.now()}`,
        name: newSkillName.trim(),
        level: newSkillLevel,
      };
      addSkill(newSkill);
      setNewSkillName('');
      setNewSkillLevel('intermediate');
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = skills.findIndex((s) => s.id === active.id);
      const newIndex = skills.findIndex((s) => s.id === over.id);
      updateSkills(arrayMove(skills, oldIndex, newIndex));
    }
  };

  const commonSkills = t('builder.common_skills', { returnObjects: true }) as string[];

  return (
    
      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('builder.skills_title')}</CardTitle>
              <CardDescription>
                {t('builder.skills_subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Skill */}
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="skillName">{t('builder.skill_name')}</Label>
                  <Input
                    id="skillName"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder={t('builder.skill_name_example')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddSkill();
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t('builder.proficiency_label')}</Label>
                  <Select value={newSkillLevel} onValueChange={(value) => setNewSkillLevel(value as Skill['level'])}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('builder.select_proficiency')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">{t('builder.level_beginner_label')}</SelectItem>
                      <SelectItem value="intermediate">{t('builder.level_intermediate_label')}</SelectItem>
                      <SelectItem value="advanced">{t('builder.level_advanced_label')}</SelectItem>
                      <SelectItem value="expert">{t('builder.level_expert_label')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleAddSkill} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('builder.add_skill')}
                </Button>
              </div>

              {/* Suggested Skills */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground">{t('builder.suggested_skills')}</h3>
                  <Button
                    onClick={handleGenerateSkills}
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
                    {t('builder.ai_recommend_skills')}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(suggestedSkills.length > 0 ? suggestedSkills : commonSkills).map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => {
                        setNewSkillName(skill);
                      }}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Added Skills */}
              {skills.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-foreground">{t('builder.your_skills')}</h3>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={skills.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-3">
                        {skills.map((skill) => (
                          <SortableSkillItem key={skill.id} skill={skill} onRemove={removeSkill} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2 text-foreground">{t('builder.skills_tips_title')}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>{t('builder.skill_tip_1')}</li>
                <li>{t('builder.skill_tip_2')}</li>
                <li>{t('builder.skill_tip_3')}</li>
                <li>{t('builder.skill_tip_4')}</li>
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

export default SkillsPage;


