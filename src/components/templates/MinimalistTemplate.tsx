import { ResumeData } from '@/types/resume';
import { Linkedin, Globe, Instagram, Youtube } from 'lucide-react';
import { getMarginClass, getMarginStyle } from '@/lib/marginUtils';
import { colorSchemes } from '@/data/templates';
import { useTranslation } from 'react-i18next';

interface TemplateProps {
  data: ResumeData;
}

export const MinimalistTemplate = ({ data }: TemplateProps) => {
  const { t } = useTranslation();
  const { personalInfo, summary, experiences, education, skills, languages, hobbies } = data;
  const colors = colorSchemes[data.designSettings.colorScheme as keyof typeof colorSchemes];
  const marginClass = getMarginClass(data.designSettings.margins, data.designSettings.customMarginPx);
  const marginStyle = getMarginStyle(data.designSettings.margins, data.designSettings.customMarginPx, data.designSettings.customHorizontalMarginPx, data.designSettings.customVerticalMarginPx);

  return (
    <div className={`bg-background text-foreground ${marginClass} font-sans`} style={marginStyle}>
      {/* Header - Minimal */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-light tracking-tight text-foreground mb-3">
          {personalInfo.firstName || 'First Name'} {personalInfo.lastName || 'Last Name'}
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          {personalInfo.jobTitle || 'Professional Title'}
        </p>
        <div className="flex justify-center flex-wrap gap-6 text-sm text-muted-foreground">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.city && (
            <span>
              {personalInfo.city}
              {personalInfo.country && `, ${personalInfo.country}`}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="h-3 w-3" />
              {personalInfo.linkedin}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {personalInfo.website}
            </span>
          )}
          {personalInfo.instagram && (
            <span className="flex items-center gap-1">
              <Instagram className="h-3 w-3" />
              {personalInfo.instagram}
            </span>
          )}
          {personalInfo.youtube && (
            <span className="flex items-center gap-1">
              <Youtube className="h-3 w-3" />
              {personalInfo.youtube}
            </span>
          )}
        </div>
      </div>

      {/* {t('resume.summary')} */}
      {summary && (
        <div className="mb-12 resume-section">
          <p className="text-sm leading-loose text-center text-foreground max-w-3xl mx-auto">
            {summary}
          </p>
        </div>
      )}

      {/* 工作經歷 */}
      {experiences.length > 0 && (
        <div className="mb-12 resume-section">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-6 text-center keep-with-next" style={{ color: colors.primary }}>{t('resume.experience')}</h2>
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-8 no-break">
              <div className="text-center mb-3">
                <h3 className="text-lg font-medium text-foreground">
                  {exp.jobTitle}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {exp.employer}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                </p>
              </div>
              <p className="text-sm text-foreground leading-relaxed text-center max-w-2xl mx-auto whitespace-pre-line">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 學歷 */}
      {education.length > 0 && (
        <div className="mb-12 resume-section">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-6 text-center keep-with-next" style={{ color: colors.primary }}>{t('resume.education')}</h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-6 text-center no-break">
              <h3 className="text-lg font-medium text-foreground">
                {edu.degree}
              </h3>
              <p className="text-sm text-muted-foreground">
                {edu.school}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {edu.startDate} - {edu.currentlyStudying ? 'Present' : edu.endDate}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 技能 & 語言能力 */}
      <div className="grid grid-cols-2 gap-12">
        {/* 技能 */}
        {skills.length > 0 && (
          <div className="resume-section">
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 text-center keep-with-next" style={{ color: colors.primary }}>{t('resume.skills')}</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((skill) => (
                <span key={skill.id} className="text-sm text-foreground no-break">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 語言能力 */}
        {languages.length > 0 && (
          <div className="resume-section">
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-4 text-center keep-with-next" style={{ color: colors.primary }}>{t('resume.languages')}</h2>
            <div className="space-y-2">
              {languages.map((lang) => (
                <div key={lang.id} className="text-sm text-center no-break">
                  <span className="text-foreground">{lang.name}</span>
                  <span className="text-muted-foreground"> • {lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 興趣愛好 */}
      {hobbies && (
        <div className="mt-6 resume-section">
          <h2 className="text-base font-bold mb-3 keep-with-next" style={{ color: colors.primary }}>{t('resume.hobbies')}</h2>
          <p className="text-sm leading-relaxed">{hobbies}</p>
        </div>
      )}
    </div>
  );
};
