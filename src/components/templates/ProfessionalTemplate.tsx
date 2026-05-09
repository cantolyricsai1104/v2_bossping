import { ResumeData } from "@/types/resume";
import { Mail, Phone, MapPin, Globe, Linkedin, Instagram, Youtube } from "lucide-react";
import { CenteredTag } from "./common/CenteredTag";
import { colorSchemes } from "@/data/templates";
import { useTranslation } from 'react-i18next';
import {
  getHorizontalMarginClass,
  getVerticalMarginClass,
  getMarginClass,
  getMarginStyle,
  getHorizontalMarginStyle,
  getVerticalMarginStyle,
} from "@/lib/marginUtils";

interface TemplateProps {
  data: ResumeData;
}

export const ProfessionalTemplate = ({ data }: TemplateProps) => {
  const { t } = useTranslation();
  const { personalInfo, summary, experiences, education, skills, languages, hobbies } = data;
  const colors = colorSchemes[data.designSettings.colorScheme as keyof typeof colorSchemes];
  const horizontalMargin = getHorizontalMarginClass(data.designSettings.margins, data.designSettings.customMarginPx);
  const verticalMargin = getVerticalMarginClass(data.designSettings.margins, data.designSettings.customMarginPx);
  const horizontalMarginStyle = getHorizontalMarginStyle(
    data.designSettings.margins,
    data.designSettings.customMarginPx,
    data.designSettings.customHorizontalMarginPx,
  );
  const verticalMarginStyle = getVerticalMarginStyle(
    data.designSettings.margins,
    data.designSettings.customMarginPx,
    data.designSettings.customVerticalMarginPx,
  );
  const marginClass = getMarginClass(data.designSettings.margins, data.designSettings.customMarginPx);
  const marginStyle = getMarginStyle(
    data.designSettings.margins,
    data.designSettings.customMarginPx,
    data.designSettings.customHorizontalMarginPx,
    data.designSettings.customVerticalMarginPx,
  );

  return (
    <div className={`bg-background text-foreground ${marginClass} font-sans`} style={marginStyle}>
      {/* Header */}
      <div className="border-b-2 pb-4 mb-4 flex items-start gap-6" style={{ borderColor: colors.primary }}>
        {personalInfo.photo && (
          <img src={personalInfo.photo} alt={t('resume.summary')} className="w-20 h-20 rounded-full object-cover flex-shrink-0" />
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground mb-1">
            {personalInfo.firstName || t('resume.firstName') || 'First Name'} {personalInfo.lastName || t('resume.lastName') || 'Last Name'}
          </h1>
          <p className="text-lg text-muted-foreground mb-3">{personalInfo.jobTitle || t('resume.jobTitle') || 'Professional Title'}</p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {personalInfo.email}
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {personalInfo.phone}
              </div>
            )}
            {personalInfo.city && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {personalInfo.city}
                {personalInfo.country && `, ${personalInfo.country}`}
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                {personalInfo.linkedin}
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                {personalInfo.website}
              </div>
            )}
            {personalInfo.instagram && (
              <div className="flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                {personalInfo.instagram}
              </div>
            )}
            {personalInfo.youtube && (
              <div className="flex items-center gap-2">
                <Youtube className="h-4 w-4" />
                {personalInfo.youtube}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* {t('resume.summary')} */}
      {summary && (
        <div className="mb-4 resume-section">
          <h2 className="text-lg font-bold mb-2 uppercase tracking-wide keep-with-next" style={{ color: colors.primary }}>{t('resume.summary')}</h2>
          <p className="text-sm leading-relaxed text-foreground">{summary}</p>
        </div>
      )}

      {/* 工作經歷 */}
      {experiences.length > 0 && (
        <div className="mb-4 resume-section">
          <h2 className="text-lg font-bold mb-2 uppercase tracking-wide keep-with-next" style={{ color: colors.primary }}>{t('resume.experience')}</h2>
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-3 no-break">
              <div className="flex justify-between items-start mb-0.5">
                <h3 className="text-base font-semibold text-foreground">{exp.jobTitle}</h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                  {exp.startDate} - {exp.currentlyWorking ? t('resume.present') : exp.endDate}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {exp.employer}
                {exp.city && ` • ${exp.city}`}
                {exp.country && `, ${exp.country}`}
              </p>
              <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* 學歷 */}
      {education.length > 0 && (
        <div className="mb-4 resume-section">
          <h2 className="text-lg font-bold mb-2 uppercase tracking-wide keep-with-next" style={{ color: colors.primary }}>{t('resume.education')}</h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3 no-break">
              <div className="flex justify-between items-start mb-0.5">
                <h3 className="text-base font-semibold text-foreground">{edu.degree}</h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                  {edu.startDate} - {edu.currentlyStudying ? t('resume.present') : edu.endDate}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">
                {edu.school}
                {edu.city && ` • ${edu.city}`}
                {edu.country && `, ${edu.country}`}
              </p>
              {edu.description && <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* 技能 */}
      {skills.length > 0 && (
        <div className="mb-4 resume-section">
          <h2 className="text-lg font-bold mb-2 uppercase tracking-wide keep-with-next" style={{ color: colors.primary }}>{t('resume.skills')}</h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <CenteredTag
                key={skill.id}
                // Added flex, items-center, and justify-center for perfect vertical and horizontal centering
                className="bg-muted text-foreground text-xs px-2 py-0.5 flex items-center justify-center"
              >
                {skill.name}
              </CenteredTag>
            ))}
          </div>
        </div>
      )}

      {/* 語言能力 */}
      {languages.length > 0 && (
        <div className="mb-4 resume-section">
          <h2 className="text-lg font-bold mb-2 uppercase tracking-wide keep-with-next" style={{ color: colors.primary }}>{t('resume.languages')}</h2>
          <div className="flex flex-wrap gap-3">
            {languages.map((lang) => (
              <div key={lang.id} className="text-xs no-break">
                <span className="font-semibold text-foreground">{lang.name}</span>
                <span className="text-muted-foreground"> - {lang.proficiency}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 興趣愛好 */}
      {hobbies && (
        <div className="mb-4 resume-section">
          <h2 className="text-lg font-bold mb-2 uppercase tracking-wide keep-with-next" style={{ color: colors.primary }}>{t('resume.hobbies')}</h2>
          <p className="text-sm leading-relaxed text-foreground">{hobbies}</p>
        </div>
      )}
    </div>
  );
};
