import { ResumeData } from '@/types/resume';
import { colorSchemes } from '@/data/templates';
import { getMarginClass, getMarginStyle } from '@/lib/marginUtils';
import { useTranslation } from 'react-i18next';

interface AcademicTemplateProps {
  data: ResumeData;
}

export const AcademicTemplate = ({ data }: AcademicTemplateProps) => {
  const { t } = useTranslation();
  const colors = colorSchemes[data.designSettings.colorScheme as keyof typeof colorSchemes];
  const { hobbies } = data;
  const marginClass = getMarginClass(data.designSettings.margins, data.designSettings.customMarginPx);
  const marginStyle = getMarginStyle(data.designSettings.margins, data.designSettings.customMarginPx, data.designSettings.customHorizontalMarginPx, data.designSettings.customVerticalMarginPx);

  return (
    <div className={`bg-white w-full h-full ${marginClass} font-serif text-gray-900`} style={marginStyle}>
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
        <h1 className="text-5xl font-bold mb-3" style={{ color: colors.primary }}>
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>
        <p className="text-xl mb-4 italic">{data.personalInfo.jobTitle}</p>
        <div className="flex justify-center flex-wrap gap-6 text-sm text-gray-600">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>•</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.city && <span>•</span>}
          {data.personalInfo.city && <span>{data.personalInfo.city}</span>}
          {data.personalInfo.linkedin && (
            <>
              <span>•</span>
              <span>{data.personalInfo.linkedin}</span>
            </>
          )}
          {data.personalInfo.website && (
            <>
              <span>•</span>
              <span>{data.personalInfo.website}</span>
            </>
          )}
          {data.personalInfo.instagram && (
            <>
              <span>•</span>
              <span>{data.personalInfo.instagram}</span>
            </>
          )}
          {data.personalInfo.youtube && (
            <>
              <span>•</span>
              <span>{data.personalInfo.youtube}</span>
            </>
          )}
        </div>
      </div>

      {/* Research Interests / {t('resume.summary')} */}
      {data.summary && (
        <div className="mb-8 resume-section">
          <h2 className="text-2xl font-bold mb-3 text-center keep-with-next" style={{ color: colors.primary }}>
            Research Interests
          </h2>
          <p className="text-center text-gray-700 leading-relaxed max-w-4xl mx-auto">
            {data.summary}
          </p>
        </div>
      )}

      {/* 學歷 */}
      {data.education.length > 0 && (
        <div className="mb-8 resume-section">
          <h2 className="text-2xl font-bold mb-4 text-center pb-2 border-b keep-with-next" style={{ color: colors.primary }}>{t('resume.education')}</h2>
          {data.education.map((edu, idx) => (
            <div key={idx} className="mb-4 text-center no-break">
              <h3 className="font-bold text-lg">{edu.degree}</h3>
              <p className="text-gray-600 italic">{edu.school}</p>
              <p className="text-sm text-gray-500">
                {edu.city && `${edu.city} | `}{edu.endDate}
              </p>
              {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* 工作經歷 / Academic Positions */}
      {data.experiences.length > 0 && (
        <div className="mb-8 resume-section">
          <h2 className="text-2xl font-bold mb-4 text-center pb-2 border-b keep-with-next" style={{ color: colors.primary }}>
            Academic Positions
          </h2>
          {data.experiences.map((exp, idx) => (
            <div key={idx} className="mb-6 no-break">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{exp.jobTitle}</h3>
                  <p className="italic text-gray-600">{exp.employer}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* 技能 / Expertise */}
      {data.skills.length > 0 && (
        <div className="mb-8 resume-section">
          <h2 className="text-2xl font-bold mb-4 text-center pb-2 border-b keep-with-next" style={{ color: colors.primary }}>
            Research {t('resume.skills')} & Expertise
          </h2>
          <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
            {data.skills.map((skill, idx) => (
              <div key={idx} className="text-center py-2 px-4 bg-gray-50 rounded no-break">
                {skill.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 語言能力 */}
      {data.languages && data.languages.length > 0 && (
        <div className="resume-section">
          <h2 className="text-2xl font-bold mb-4 text-center pb-2 border-b keep-with-next" style={{ color: colors.primary }}>{t('resume.languages')}</h2>
          <div className="flex justify-center gap-6 text-center">
            {data.languages.map((lang, idx) => (
              <div key={idx} className="no-break">
                <span className="font-semibold">{lang.name}</span>
                <span className="text-gray-600"> ({lang.proficiency})</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {hobbies && (
        <div className="mt-8 resume-section">
          <h2 className="text-xl font-bold mb-3" style={{ color: colors.primary }}>{t('resume.hobbies')}</h2>
          <p className="text-sm leading-relaxed text-gray-700">{hobbies}</p>
        </div>
      )}
    </div>
  );
};
