import { ResumeData } from '@/types/resume';
import { colorSchemes } from '@/data/templates';
import { getMarginClass, getMarginStyle } from '@/lib/marginUtils';
import { useTranslation } from 'react-i18next';

interface CorporateTemplateProps {
  data: ResumeData;
}

export const CorporateTemplate = ({ data }: CorporateTemplateProps) => {
  const { t } = useTranslation();
  const colors = colorSchemes[data.designSettings.colorScheme as keyof typeof colorSchemes];
  const { hobbies } = data;
  const marginClass = getMarginClass(data.designSettings.margins, data.designSettings.customMarginPx);
  const marginStyle = getMarginStyle(data.designSettings.margins, data.designSettings.customMarginPx, data.designSettings.customHorizontalMarginPx, data.designSettings.customVerticalMarginPx);

  return (
    <div className={`bg-white w-full h-full ${marginClass} font-sans text-gray-800`} style={marginStyle}>
      {/* Header with border */}
      <div className="border-b-4 pb-6 mb-6 flex items-start gap-6" style={{ borderColor: colors.primary }}>
        {data.personalInfo.photo && (
          <img
            src={data.personalInfo.photo}
            alt={t('resume.summary')}
            className="w-24 h-24 rounded-full object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2" style={{ color: colors.primary }}>
            {data.personalInfo.firstName} {data.personalInfo.lastName}
          </h1>
          <p className="text-xl text-gray-600 mb-3">{data.personalInfo.jobTitle}</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {data.personalInfo.email && <span>✉ {data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span>☎ {data.personalInfo.phone}</span>}
            {data.personalInfo.city && <span>📍 {data.personalInfo.city}</span>}
            {data.personalInfo.linkedin && <span>🔗 {data.personalInfo.linkedin}</span>}
            {data.personalInfo.website && <span>🌐 {data.personalInfo.website}</span>}
            {data.personalInfo.instagram && <span>📷 {data.personalInfo.instagram}</span>}
            {data.personalInfo.youtube && <span>▶ {data.personalInfo.youtube}</span>}
          </div>
        </div>
      </div>

      {/* {t('resume.summary')} */}
      {data.summary && (
        <div className="mb-6 resume-section">
          <h2 className="text-xl font-bold mb-3 uppercase keep-with-next" style={{ color: colors.primary }}>{t('resume.summary')}</h2>
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* 工作經歷 */}
      {data.experiences.length > 0 && (
        <div className="mb-6 resume-section">
          <h2 className="text-xl font-bold mb-3 uppercase keep-with-next" style={{ color: colors.primary }}>{t('resume.experience')}</h2>
          {data.experiences.map((exp, idx) => (
            <div key={idx} className="mb-4 no-break">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-bold text-lg">{exp.jobTitle}</h3>
                  <p className="text-gray-600">{exp.employer}{exp.city && ` | ${exp.city}`}</p>
                </div>
                <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                  {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                </span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* 學歷 */}
      {data.education.length > 0 && (
        <div className="mb-6 resume-section">
          <h2 className="text-xl font-bold mb-3 uppercase keep-with-next" style={{ color: colors.primary }}>{t('resume.education')}</h2>
          {data.education.map((edu, idx) => (
            <div key={idx} className="mb-3 no-break">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.school}{edu.city && ` | ${edu.city}`}</p>
                </div>
                <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                  {edu.endDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 技能 */}
      {data.skills.length > 0 && (
        <div className="resume-section">
          <h2 className="text-xl font-bold mb-3 uppercase keep-with-next" style={{ color: colors.primary }}>
            Core Competencies
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {data.skills.map((skill, idx) => (
              <div key={idx} className="text-sm text-gray-700 no-break">• {skill.name}</div>
            ))}
          </div>
        </div>
      )}
      {hobbies && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-3" style={{ color: colors.primary }}>{t('resume.hobbies')}</h2>
          <p className="text-sm leading-relaxed text-gray-700">{hobbies}</p>
        </div>
      )}
    </div>
  );
};
