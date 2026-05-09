import { useResume } from '@/contexts/ResumeContext';
import { Card } from '@/components/ui/card';
import { ProfessionalTemplate } from '@/components/templates/ProfessionalTemplate';
import { CreativeTemplate } from '@/components/templates/CreativeTemplate';
import { MinimalistTemplate } from '@/components/templates/MinimalistTemplate';
import { ModernTemplate } from '@/components/templates/ModernTemplate';
import { ExecutiveTemplate } from '@/components/templates/ExecutiveTemplate';
import { ClassicTemplate } from '@/components/templates/ClassicTemplate';
import { CorporateTemplate } from '@/components/templates/CorporateTemplate';
import { TechnicalTemplate } from '@/components/templates/TechnicalTemplate';
import { AcademicTemplate } from '@/components/templates/AcademicTemplate';
import { SalesTemplate } from '@/components/templates/SalesTemplate';
import { DesignerTemplate } from '@/components/templates/DesignerTemplate';
import { StartupTemplate } from '@/components/templates/StartupTemplate';
import { ConsultantTemplate } from '@/components/templates/ConsultantTemplate';
import { ManagerTemplate } from '@/components/templates/ManagerTemplate';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
export const ResumePreview = () => {
  const { resumeData } = useResume();

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const templateRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const el = previewContainerRef.current;
    if (!el) return;

    const PAGE_W = 794; // px (A4 width at ~96dpi)
    const PAGE_H = 1123; // px (A4 height at ~96dpi)

    const computeScale = () => {
      const rect = el.getBoundingClientRect();
      const w = rect.width; // container width

      // Scale purely based on container width to prevent infinite resize loops
      // Max scale is 1 to prevent it from getting too large on wide screens
      const s = Math.min(w / PAGE_W, 1);
      
      setScale(s);
      
      // Calculate height based on scale and actual content height
      if (resumeData.pageFormat === 'multiple') {
        setContainerHeight(0); // will use 'auto' in the style
      } else {
        const actualHeight = templateRef.current ? templateRef.current.scrollHeight : PAGE_H;
        setContainerHeight(Math.max(PAGE_H, actualHeight) * s);
      }
    };
    
    // Initial compute
    // Allow a small delay for content to render before measuring
    setTimeout(computeScale, 50);

    // Use a simple resize observer without listening to window scroll
    const ro = new ResizeObserver(() => {
      // Debounce or requestAnimationFrame could be used, but simple compute is fine
      window.requestAnimationFrame(computeScale);
    });
    
    ro.observe(el);
    if (templateRef.current) {
      ro.observe(templateRef.current);
    }
    window.addEventListener('resize', computeScale);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', computeScale);
    };
  }, [resumeData.pageFormat, resumeData]); // add resumeData to dependency to re-compute on content change

  const renderTemplate = () => {
    switch (resumeData.templateId) {
      case 'creative':
        return <CreativeTemplate data={resumeData} />;
      case 'minimalist':
        return <MinimalistTemplate data={resumeData} />;
      case 'modern':
        return <ModernTemplate data={resumeData} />;
      case 'executive':
        return <ExecutiveTemplate data={resumeData} />;
      case 'classic':
        return <ClassicTemplate data={resumeData} />;
      case 'corporate':
        return <CorporateTemplate data={resumeData} />;
      case 'technical':
        return <TechnicalTemplate data={resumeData} />;
      case 'academic':
        return <AcademicTemplate data={resumeData} />;
      case 'sales':
        return <SalesTemplate data={resumeData} />;
      case 'designer':
        return <DesignerTemplate data={resumeData} />;
      case 'startup':
        return <StartupTemplate data={resumeData} />;
      case 'consultant':
        return <ConsultantTemplate data={resumeData} />;
      case 'manager':
        return <ManagerTemplate data={resumeData} />;
      case 'professional':
      default:
        return <ProfessionalTemplate data={resumeData} />;
    }
  };

  return (
    <Card className="w-full bg-background p-0 overflow-hidden">
      <div 
        ref={previewContainerRef} 
        className="w-full" 
        style={{ 
          height: resumeData.pageFormat === 'single' ? containerHeight : 'auto',
          maxHeight: resumeData.pageFormat === 'multiple' ? '80vh' : undefined,
          overflowY: 'auto' 
        }}
      >
        <div
          style={{
            width: '100%',
            height: resumeData.pageFormat === 'single' ? `${containerHeight}px` : 'auto',
          }}
        >
          <div
            ref={templateRef}
            className={`bg-card resume-template ${resumeData.pageFormat === 'multiple' ? 'multi-page' : ''}`}
            style={{
              width: '794px',
              minHeight: '1123px',
              overflow: 'visible',
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              willChange: 'transform',
            }}
          >
            {renderTemplate()}
          </div>
        </div>
      </div>
    </Card>
  );
};
