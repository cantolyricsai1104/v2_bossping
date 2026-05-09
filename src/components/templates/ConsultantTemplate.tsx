import { ResumeData } from "@/types/resume";
import { colorSchemes } from "@/data/templates";
import { CenteredTag } from "./common/CenteredTag";
import { getMarginClass, getMarginStyle } from "@/lib/marginUtils";
import { useTranslation } from 'react-i18next';

interface ConsultantTemplateProps {
  data: ResumeData;
}

export const ConsultantTemplate = ({ data }: ConsultantTemplateProps) => {
  const { t } = useTranslation();
  const colors = colorSchemes[data.designSettings.colorScheme as keyof typeof colorSchemes];
  const { hobbies } = data;
  const marginClass = getMarginClass(data.designSettings.margins, data.designSettings.customMarginPx);
  const marginStyle = getMarginStyle(
    data.designSettings.margins,
    data.designSettings.customMarginPx,
    data.designSettings.customHorizontalMarginPx,
    data.designSettings.customVerticalMarginPx,
  );

  return (
    <div className={`bg-white w-full h-full ${marginClass} font-sans text-gray-900`} style={marginStyle}>
      {/* Header with accent bar */}
      <div className="mb-8">
        <div className="h-1 w-24 mb-6" style={{ backgroundColor: colors.primary }} />
        <h1 className="text-5xl font-bold mb-3" style={{ color: colors.primary }}>
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>
        <p className="text-2xl text-gray-600 font-light mb-4">{data.personalInfo.jobTitle}</p>
        <div className="flex flex-wrap gap-8 text-sm text-gray-600">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>|</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.city && <span>|</span>}
          {data.personalInfo.city && <span>{data.personalInfo.city}</span>}
          {data.personalInfo.linkedin && (
            <>
              <span>|</span>
              <span>{data.personalInfo.linkedin}</span>
            </>
          )}
          {data.personalInfo.website && (
            <>
              <span>|</span>
              <span>{data.personalInfo.website}</span>
            </>
          )}
          {data.personalInfo.instagram && (
            <>
              <span>|</span>
              <span>{data.personalInfo.instagram}</span>
            </>
          )}
          {data.personalInfo.youtube && (
            <>
              <span>|</span>
              <span>{data.personalInfo.youtube}</span>
            </>
          )}
        </div>
      </div>

      {/* {t('resume.summary')} */}
      {data.summary && (
        <div className="mb-8 p-6 border-l-4" style={{ borderColor: colors.primary, backgroundColor: "#f9fafb" }}>
          <h2 className="text-lg font-bold mb-3 uppercase tracking-wide" style={{ color: colors.primary }}>{t('resume.summary')}</h2>
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* 工作經歷 */}
      {data.experiences.length > 0 && (
        <div className="mb-8 resume-section">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xl font-bold uppercase tracking-wide keep-with-next" style={{ color: colors.primary }}>{t('resume.experience')}</h2>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
          {data.experiences.map((exp, idx) => (
            <div key={idx} className="mb-6 grid grid-cols-12 gap-6 no-break">
              <div className="col-span-9">
                <h3 className="text-lg font-bold mb-1">{exp.jobTitle}</h3>
                <p className="text-gray-600 font-semibold mb-2">
                  {exp.employer}{exp.city && ` | ${exp.city}`}
                </p>
                <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">{exp.description}</p>
              </div>
              <div className="col-span-3 text-right">
                <CenteredTag
                  className="h-8 px-4 rounded text-sm font-semibold text-white flex items-center justify-center" // Added flex for centering
                  style={{ backgroundColor: colors.primary }}
                >
                  {exp.startDate}
                </CenteredTag>
                <div className="text-center my-2 text-gray-400">to</div>
                <CenteredTag
                  className="h-8 px-4 rounded text-sm font-semibold text-white flex items-center justify-center" // Added flex for centering
                  style={{ backgroundColor: colors.secondary }}
                >
                  {exp.currentlyWorking ? t('resume.present') : exp.endDate}
                </CenteredTag>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        {/* 學歷 */}
        {data.education.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-xl font-bold uppercase tracking-wide" style={{ color: colors.primary }}>{t('resume.education')}</h2>
              <div className="flex-1 h-px bg-gray-300" />
            </div>
            {data.education.map((edu, idx) => (
              <div key={idx} className="mb-4">
                <h3 className="font-bold">{edu.degree}</h3>
                <p className="text-sm text-gray-600">{edu.school}</p>
                <p className="text-xs text-gray-500">{edu.endDate}</p>
              </div>
            ))}
          </div>
        )}

        {/* 技能 */}
        {data.skills.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-xl font-bold uppercase tracking-wide" style={{ color: colors.primary }}>
                Core Competencies
              </h2>
              <div className="flex-1 h-px bg-gray-300" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {data.skills.map((skill, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.secondary }} />
                  <span className="text-sm">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 語言能力 & 證照 */}
      {(data.languages || data.certifications) && (
        <div className="grid grid-cols-2 gap-8 mt-8">
          {data.languages && data.languages.length > 0 && (
            <div>
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-xl font-bold uppercase tracking-wide" style={{ color: colors.primary }}>{t('resume.languages')}</h2>
                <div className="flex-1 h-px bg-gray-300" />
              </div>
              <div className="space-y-2">
                {data.languages.map((lang, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="font-medium">{lang.name}</span>
                    <span className="text-gray-600">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.certifications && data.certifications.length > 0 && (
            <div>
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-xl font-bold uppercase tracking-wide" style={{ color: colors.primary }}>{t('resume.certifications')}</h2>
                <div className="flex-1 h-px bg-gray-300" />
              </div>
              <div className="space-y-2">
                {data.certifications.map((cert, idx) => (
                  <div key={idx} className="text-sm">
                    <div className="font-semibold">{cert.name}</div>
                    <div className="text-gray-600">{cert.issuer}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {hobbies && (
        <div className="mt-8">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-xl font-bold uppercase tracking-wide" style={{ color: colors.primary }}>{t('resume.hobbies')}</h2>
            <div className="flex-1 h-px bg-gray-300" />
          </div>
          <p className="text-gray-700 leading-relaxed">{hobbies}</p>
        </div>
      )}
    </div>
  );
};
