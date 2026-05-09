import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Download, LayoutTemplate, SlidersHorizontal, ArrowRight, Loader2, Sparkles, Pencil } from 'lucide-react';
import { useCareerStore } from '../store/useCareerStore';
import { callDeepSeekAPI } from '../lib/deepseek';
import { ResumeProvider, useResume } from '@/contexts/ResumeContext';
import { CVForms } from '@/components/cv-builder/CVForms';
import { ResumePreview } from '@/components/builder/ResumePreview';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { templates } from '@/data/templates';
import { sampleResumeData } from '@/data/sampleData';
import { ScrollArea } from '@/components/ui/scroll-area';

// Templates imports
import { CreativeTemplate } from "@/components/templates/CreativeTemplate";
import { MinimalistTemplate } from "@/components/templates/MinimalistTemplate";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { ProfessionalTemplate } from "@/components/templates/ProfessionalTemplate";
import { ExecutiveTemplate } from "@/components/templates/ExecutiveTemplate";
import { DesignerTemplate } from "@/components/templates/DesignerTemplate";
import { CorporateTemplate } from "@/components/templates/CorporateTemplate";
import { TechnicalTemplate } from "@/components/templates/TechnicalTemplate";
import { AcademicTemplate } from "@/components/templates/AcademicTemplate";
import { SalesTemplate } from "@/components/templates/SalesTemplate";
import { StartupTemplate } from "@/components/templates/StartupTemplate";
import { ConsultantTemplate } from "@/components/templates/ConsultantTemplate";
import { ManagerTemplate } from "@/components/templates/ManagerTemplate";
import { ClassicTemplate } from "@/components/templates/ClassicTemplate";

interface GeneratedResume {
  name: string;
  title: string;
  contact: string;
  experiences: {
    companyOrProject: string;
    duration: string;
    role: string;
    bullets: string[];
  }[];
  coreSkills: string[];
}

const TemplateThumbnail = ({ tpl }: { tpl: any }) => {
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.15);
  
  const PAGE_W = 794;
  const PAGE_H = 1123;

  const computeScale = useCallback(() => {
    const el = previewContainerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scaleX = rect.width / PAGE_W;
    const scaleY = rect.height / PAGE_H;
    setScale(Math.min(scaleX, scaleY));
  }, []);

  useEffect(() => {
    computeScale();
    const ro = new ResizeObserver(computeScale);
    if (previewContainerRef.current) ro.observe(previewContainerRef.current);
    window.addEventListener("resize", computeScale);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", computeScale);
    };
  }, [computeScale]);

  const previewData = {
    ...sampleResumeData,
    templateId: tpl.id,
    designSettings: {
      ...sampleResumeData.designSettings,
      colorScheme: tpl.colorSchemes[0],
    },
  };

  const renderTemplatePreview = () => {
    switch (tpl.id) {
      case "creative": return <CreativeTemplate data={previewData} />;
      case "minimalist": return <MinimalistTemplate data={previewData} />;
      case "modern": return <ModernTemplate data={previewData} />;
      case "professional": return <ProfessionalTemplate data={previewData} />;
      case "executive": return <ExecutiveTemplate data={previewData} />;
      case "designer": return <DesignerTemplate data={previewData} />;
      case "corporate": return <CorporateTemplate data={previewData} />;
      case "technical": return <TechnicalTemplate data={previewData} />;
      case "academic": return <AcademicTemplate data={previewData} />;
      case "sales": return <SalesTemplate data={previewData} />;
      case "startup": return <StartupTemplate data={previewData} />;
      case "consultant": return <ConsultantTemplate data={previewData} />;
      case "manager": return <ManagerTemplate data={previewData} />;
      case "classic": return <ClassicTemplate data={previewData} />;
      default: return <ProfessionalTemplate data={previewData} />;
    }
  };

  return (
    <div className="aspect-[1/1.4] rounded-lg overflow-hidden bg-slate-100 mb-3 shadow-sm group-hover:shadow-md transition-shadow relative">
      <div ref={previewContainerRef} className="absolute inset-0 p-1 flex items-center justify-center">
        <div
          className="bg-white shadow-lg"
          style={{
            width: PAGE_W,
            height: PAGE_H,
            transform: `scale(${scale})`,
            transformOrigin: "center center",
            willChange: "transform",
            flexShrink: 0,
            pointerEvents: "none"
          }}
        >
          {renderTemplatePreview()}
        </div>
      </div>
    </div>
  );
};

function ResumeBuilderInner() {
  const { t, i18n } = useTranslation();
  const [generating, setGenerating] = useState(false);
  const [mode, setMode] = useState<'ai' | 'manual'>('ai');
  const [templateOpen, setTemplateOpen] = useState(false);
  const { skills, starStories } = useCareerStore();
  
  const { updateTargetJd, updatePersonalInfo, updateExperiences, updateSkills, updateTemplateId, resumeData } = useResume();
  const jd = resumeData.targetJd || '';

  const handleGenerate = async () => {
    if (!jd.trim() || (skills.length === 0 && starStories.length === 0)) {
      alert(t('jd.need_skills'));
      return;
    }

    setGenerating(true);
    
    try {
      const languageInstruction = i18n.language === 'en' ? 'Please reply in English' : '請使用繁體中文';
      const prompt = `
你是一位專業的履歷優化專家 (Resume Writer)。
使用者的目標是應徵以下職缺 (JD)：
${jd}

使用者目前萃取出的專業技能：
${skills.join(', ')}

使用者目前的 STAR 原則故事：
${starStories.map(s => `[${s.title}]\n${s.content}`).join('\n\n')}

請根據上述職缺描述，從使用者的經歷與技能中，篩選、改寫並組裝成一份「最能打動該職缺人資」的客製化履歷。
請以 JSON 格式回傳，不要包含任何 Markdown 標記，格式如下：
{
  "name": "王大明 (預設名字，或根據經歷推斷)",
  "title": "目標職位名稱",
  "contact": "ming@example.com | 0912-345-678",
  "experiences": [
    {
      "companyOrProject": "專案或組織名稱 (例如：百人遊戲公會)",
      "duration": "年份 (例如：2022 - 2024)",
      "role": "職位或角色 (例如：社群運營與活動策劃)",
      "bullets": [
        "具體貢獻點 1 (強烈建議結合 STAR 故事的數據與結果)",
        "具體貢獻點 2",
        "具體貢獻點 3"
      ]
    }
  ],
  "coreSkills": ["技能1", "技能2", "技能3", "技能4"]
}
${languageInstruction}。經歷的 bullet points 請盡量貼合 JD 中的關鍵字。
      `;

      const apiMessages = [
        { role: 'system' as const, content: prompt }
      ];
      
      const response = await callDeepSeekAPI(apiMessages, true);
      const parsedResponse = JSON.parse(response) as GeneratedResume;
      
      // Update ResumeContext state with generated data
      updatePersonalInfo({
        firstName: parsedResponse.name.split(' ')[0] || '',
        lastName: parsedResponse.name.split(' ').slice(1).join(' ') || '',
        jobTitle: parsedResponse.title || '',
        email: parsedResponse.contact.split(' | ')[0] || '',
        phone: parsedResponse.contact.split(' | ')[1] || '',
      });

      const newExperiences = parsedResponse.experiences.map((exp, idx) => {
        const parts = exp.duration.split('-');
        return {
          id: `exp-${Date.now()}-${idx}`,
          jobTitle: exp.role || '',
          employer: exp.companyOrProject || '',
          city: '',
          country: '',
          startDate: parts[0]?.trim() || '',
          endDate: parts[1]?.trim() || '',
          currentlyWorking: false,
          description: exp.bullets.map(b => `• ${b}`).join('\n')
        };
      });
      updateExperiences(newExperiences);

      const newSkills = parsedResponse.coreSkills.map((skill, idx) => ({
        id: `skill-${Date.now()}-${idx}`,
        name: skill,
        level: 'advanced' as const
      }));
      updateSkills(newSkills);

      // Switch to manual mode to show populated forms
      setMode('manual');
      
    } catch (error) {
      console.error("Resume Generation Error:", error);
      alert(t('jd.error'));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex h-full bg-slate-50">
      {/* Left Panel: JD Input or Manual Edit */}
      <div className="w-1/2 p-8 border-r border-slate-200 bg-white flex flex-col h-full shadow-sm z-10 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-slate-800">{t('jd.title')}</h2>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setMode('ai')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                mode === 'ai' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Sparkles size={18} />
              {t('jd.ai_magic')}
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                mode === 'manual' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Pencil size={18} />
              {t('jd.manual_edit')}
            </button>
          </div>
        </div>
        
        {mode === 'ai' ? (
          <>
            <p className="text-slate-500 mb-4 text-lg">{t('jd.instruction')}</p>
            <div className="flex-1 flex flex-col min-h-0 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
              <div className="bg-slate-100 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-700 tracking-wide">{t('jd.paste_jd')}</span>
                <div className="flex gap-2">
                  <button onClick={() => updateTargetJd('')} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm">
                    {t('jd.clear')}
                  </button>
                </div>
              </div>
              <textarea
                value={jd}
                onChange={(e) => updateTargetJd(e.target.value)}
                placeholder={t('jd.placeholder')}
                className="flex-1 p-6 bg-transparent resize-none outline-none text-slate-700 text-lg leading-relaxed placeholder-slate-400"
              />
            </div>
            <button 
              onClick={handleGenerate}
              disabled={!jd || generating}
              className={`mt-8 w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-md ${
                !jd 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : generating 
                    ? 'bg-blue-400 text-white cursor-wait'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
              }`}
            >
              {generating ? t('jd.generating') : t('jd.generate_btn')}
              {!generating && <ArrowRight size={20} />}
            </button>
          </>
        ) : (
          <div className="flex-1 overflow-hidden rounded-xl border border-slate-200 mt-4 flex flex-col">
            <CVForms />
          </div>
        )}
      </div>

      {/* Right Panel: Resume Preview */}
      <div className="w-1/2 p-8 flex flex-col h-full bg-slate-100 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-blue-600" />
            {t('jd.live_preview')}
          </h3>
          <div className="flex gap-3">
            <Dialog open={templateOpen} onOpenChange={setTemplateOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors shadow-sm">
                  <LayoutTemplate size={18} />
                  {t('jd.change_template')}
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl w-[90vw] h-[90vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2 shrink-0">
                  <DialogTitle className="text-2xl font-bold">{t('jd.select_template')}</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4">
                    {templates.map((tpl) => (
                      <div 
                        key={tpl.id} 
                        className={`cursor-pointer group relative rounded-xl border-2 transition-all ${resumeData.templateId === tpl.id ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-transparent hover:border-slate-300'}`}
                        onClick={() => {
                          updateTemplateId(tpl.id);
                          setTemplateOpen(false);
                        }}
                      >
                        <TemplateThumbnail tpl={tpl} />
                        <h4 className="font-semibold text-slate-800 text-center">{tpl.name}</h4>
                        <p className="text-xs text-slate-500 text-center capitalize">{tpl.category}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <button className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 font-bold transition-colors shadow-sm" onClick={() => {
              const originalTemplate = document.querySelector('.resume-template');
              if (!originalTemplate) return;
              
              const printContainer = document.createElement('div');
              printContainer.id = 'print-container';
              printContainer.style.position = 'absolute';
              printContainer.style.top = '0';
              printContainer.style.left = '0';
              printContainer.style.width = '100%';
              printContainer.style.background = 'white';
              printContainer.style.zIndex = '99999';
              
              const clone = originalTemplate.cloneNode(true) as HTMLElement;
              clone.style.transform = 'none';
              clone.style.width = '210mm';
              clone.style.height = 'auto';
              clone.style.minHeight = '297mm';
              clone.style.margin = '0 auto';
              clone.style.boxShadow = 'none';
              clone.style.position = 'static';
              
              printContainer.appendChild(clone);
              document.body.appendChild(printContainer);
              
              const style = document.createElement('style');
              style.innerHTML = `
                @media print {
                  body > :not(#print-container) {
                    display: none !important;
                  }
                  #print-container {
                    display: block !important;
                    position: static !important;
                  }
                  @page {
                    size: A4 portrait;
                    margin: 0;
                  }
                }
              `;
              document.head.appendChild(style);
              
              window.print();
              
              setTimeout(() => {
                document.body.removeChild(printContainer);
                document.head.removeChild(style);
              }, 500);
            }}>
              <Download size={18} />
              {t('jd.print_pdf')}
            </button>
          </div>
        </div>

        {/* PDF Preview Area */}
        <div className="flex-1 bg-slate-200/50 rounded-xl overflow-hidden relative shadow-inner">
          {generating ? (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
              <p className="text-slate-600 font-medium tracking-wide">{t('jd.extracting')}</p>
            </div>
          ) : null}
          <ScrollArea className="h-full w-full" type="always">
            <div className="p-8 min-h-full flex items-start justify-center">
              <ResumePreview />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

export default function ResumeBuilder() {
  return (
    <ResumeProvider>
      <ResumeBuilderInner />
    </ResumeProvider>
  );
}
