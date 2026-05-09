import { useState } from 'react';


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useResume } from '@/contexts/ResumeContext';
import { Plus, Trash2, X, GripVertical } from 'lucide-react';
import type { Language, Certification } from '@/types/resume';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTranslation } from 'react-i18next';

const SortableLanguageItem = ({ lang, onRemove }: { lang: Language; onRemove: (id: string) => void }) => {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lang.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getLangProfTranslation = (proficiency: string) => {
    switch (proficiency) {
      case 'basic': return t('builder.prof_basic');
      case 'conversational': return t('builder.prof_conversational');
      case 'fluent': return t('builder.prof_fluent');
      case 'native': return t('builder.prof_native');
      default: return proficiency;
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center justify-between p-3 bg-card border rounded-lg">
      <div className="flex items-center gap-3 flex-1">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium text-foreground">{lang.name}</p>
          <p className="text-sm text-muted-foreground">{getLangProfTranslation(lang.proficiency)}</p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={() => onRemove(lang.id)}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

const SortableCertificationItem = ({ cert, onRemove }: { cert: Certification; onRemove: (id: string) => void }) => {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cert.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center justify-between p-3 bg-card border rounded-lg">
      <div className="flex items-center gap-3 flex-1">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-foreground">{cert.name}</p>
          <p className="text-sm text-muted-foreground">
            {cert.issuer} • {cert.date}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={() => onRemove(cert.id)}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

const SectionsPage = () => {
  const { t } = useTranslation();
  const { 
    resumeData, 
    addLanguage, 
    updateLanguages,
    removeLanguage,
    addCertification,
    updateCertifications,
    removeCertification,
    updateHobbies 
  } = useResume();
  
  const { languages, certifications, hobbies } = resumeData;
  
  const [newLangName, setNewLangName] = useState('');
  const [newLangProf, setNewLangProf] = useState<Language['proficiency']>('conversational');
  
  const [newCertName, setNewCertName] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [newCertDate, setNewCertDate] = useState('');
  const [newCertUrl, setNewCertUrl] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const commonLanguages = t('builder.common_languages', { returnObjects: true }) as string[];

  const commonHobbies = t('builder.common_hobbies', { returnObjects: true }) as string[];

  const handleAddLanguage = () => {
    if (newLangName.trim()) {
      const newLang: Language = {
        id: `lang-${Date.now()}`,
        name: newLangName.trim(),
        proficiency: newLangProf,
      };
      addLanguage(newLang);
      setNewLangName('');
      setNewLangProf('conversational');
    }
  };

  const handleAddCertification = () => {
    if (newCertName.trim() && newCertIssuer.trim()) {
      const newCert: Certification = {
        id: `cert-${Date.now()}`,
        name: newCertName.trim(),
        issuer: newCertIssuer.trim(),
        date: newCertDate,
      };
      addCertification(newCert);
      setNewCertName('');
      setNewCertIssuer('');
      setNewCertDate('');
    }
  };

  const handleLanguageDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = languages.findIndex((l) => l.id === active.id);
      const newIndex = languages.findIndex((l) => l.id === over.id);
      updateLanguages(arrayMove(languages, oldIndex, newIndex));
    }
  };

  const handleCertificationDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = certifications.findIndex((c) => c.id === active.id);
      const newIndex = certifications.findIndex((c) => c.id === over.id);
      updateCertifications(arrayMove(certifications, oldIndex, newIndex));
    }
  };

  return (
    
      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-6">
          {/* 語言 */}
          <Card>
            <CardHeader>
              <CardTitle>{t('builder.languages_title')}</CardTitle>
              <CardDescription>
                {t('builder.languages_subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="langName">{t('builder.language')}</Label>
                    <Input
                      id="langName"
                      value={newLangName}
                      onChange={(e) => setNewLangName(e.target.value)}
                      placeholder={t('builder.lang_example')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('builder.proficiency')}</Label>
                    <Select value={newLangProf} onValueChange={(value) => setNewLangProf(value as Language['proficiency'])}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('builder.select_level')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">{t('builder.prof_basic')}</SelectItem>
                        <SelectItem value="conversational">{t('builder.prof_conversational')}</SelectItem>
                        <SelectItem value="fluent">{t('builder.prof_fluent')}</SelectItem>
                        <SelectItem value="native">{t('builder.prof_native')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleAddLanguage} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('builder.add_language')}
                </Button>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3 text-foreground">{t('builder.common_languages_title')}</h3>
                <div className="flex flex-wrap gap-2">
                  {commonLanguages.map((lang) => (
                    <Badge
                      key={lang}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => {
                        setNewLangName(lang);
                      }}
                    >
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>

              {languages.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-foreground">{t('builder.your_languages')}</h3>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleLanguageDragEnd}>
                    <SortableContext items={languages.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-2">
                        {languages.map((lang) => (
                          <SortableLanguageItem key={lang.id} lang={lang} onRemove={removeLanguage} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 證照 */}
          <Card>
            <CardHeader>
              <CardTitle>{t('builder.certifications_title')}</CardTitle>
              <CardDescription>
                {t('builder.certifications_subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="certName">{t('builder.cert_name_label')}</Label>
                  <Input
                    id="certName"
                    value={newCertName}
                    onChange={(e) => setNewCertName(e.target.value)}
                    placeholder={t('builder.cert_name_example')}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="certIssuer">{t('builder.issuer')}</Label>
                    <Input
                      id="certIssuer"
                      value={newCertIssuer}
                      onChange={(e) => setNewCertIssuer(e.target.value)}
                      placeholder={t('builder.cert_issuer_example')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="certDate">{t('builder.cert_date_label')}</Label>
                    <Input
                      id="certDate"
                      type="month"
                      value={newCertDate}
                      onChange={(e) => setNewCertDate(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="certUrl">{t('builder.cert_url_label')}</Label>
                  <Input
                    id="certUrl"
                    type="url"
                    value={newCertUrl}
                    onChange={(e) => setNewCertUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <Button onClick={handleAddCertification} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('builder.add_certification')}
                </Button>
              </div>

              {certifications.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-foreground">{t('builder.your_certifications')}</h3>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCertificationDragEnd}>
                    <SortableContext items={certifications.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-2">
                        {certifications.map((cert) => (
                          <SortableCertificationItem key={cert.id} cert={cert} onRemove={removeCertification} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hobbies & Interests */}
          <Card>
            <CardHeader>
              <CardTitle>{t('builder.hobbies_title')}</CardTitle>
              <CardDescription>
                {t('builder.hobbies_subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-3 text-foreground">{t('builder.common_hobbies_title')}</h3>
                <div className="flex flex-wrap gap-2">
                  {commonHobbies.map((hobby) => (
                    <Badge
                      key={hobby}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => {
                        const currentHobbies = hobbies || '';
                        const newHobbies = currentHobbies ? `${currentHobbies}, ${hobby}` : hobby;
                        updateHobbies(newHobbies);
                      }}
                    >
                      {hobby}
                    </Badge>
                  ))}
                </div>
              </div>
              <Textarea
                value={hobbies || ''}
                onChange={(e) => updateHobbies(e.target.value)}
                placeholder={t('builder.hobbies_placeholder')}
                rows={3}
              />
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2 text-foreground">{t('builder.sections_tips_title')}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>{t('builder.section_tip_1')}</li>
                <li>{t('builder.section_tip_2')}</li>
                <li>{t('builder.section_tip_3')}</li>
                <li>{t('builder.section_tip_4')}</li>
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

export default SectionsPage;


