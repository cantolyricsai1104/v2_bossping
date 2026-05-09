import { ResumeData } from "@/types/resume";
import { colorSchemes } from "@/data/templates";
import { useTranslation } from 'react-i18next';
// Removed: getMarginClass, getMarginStyle as we are removing margins

interface DesignerTemplateProps {
  data: ResumeData;
}

export const DesignerTemplate = ({ data }: DesignerTemplateProps) => {
  const { t } = useTranslation();
  const colors = colorSchemes[data.designSettings.colorScheme as keyof typeof colorSchemes];
  const { hobbies } = data;
  // Removed: marginClass and marginStyle

  return (
    <div className={`bg-white w-full h-full font-sans`}>
      {" "}
      {/* Removed marginClass and marginStyle */}
      <div className="grid grid-cols-12 w-full h-full">
        {/* Left Creative Panel */}
        <div
          className="col-span-5 text-white relative overflow-hidden p-8" // Added p-8 for internal padding
          style={{ background: `linear-gradient(180deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}
        >
          <div className="relative z-10">
            {/* {t('resume.summary')} Image Placeholder */}
            <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm mb-6 flex items-center justify-center text-4xl font-bold">
              {data.personalInfo.firstName[0]}
              {data.personalInfo.lastName[0]}
            </div>

            <h1 className="text-4xl font-bold mb-2 leading-tight">
              {data.personalInfo.firstName}
              <br />
              {data.personalInfo.lastName}
            </h1>
            <p className="text-xl mb-6 opacity-90">{data.personalInfo.jobTitle}</p>

            {/* Contact */}
            <div className="mb-8 space-y-2 text-sm">
              {data.personalInfo.email && (
                <div className="flex items-start gap-2">
                  <span className="opacity-70">✉</span>
                  <span className="break-all">{data.personalInfo.email}</span>
                </div>
              )}
              {data.personalInfo.phone && (
                <div className="flex items-start gap-2">
                  <span className="opacity-70">☎</span>
                  <span>{data.personalInfo.phone}</span>
                </div>
              )}
              {data.personalInfo.city && (
                <div className="flex items-start gap-2">
                  <span className="opacity-70">📍</span>
                  <span>{data.personalInfo.city}</span>
                </div>
              )}
              {data.personalInfo.linkedin && (
                <div className="flex items-start gap-2">
                  <span className="opacity-70">🔗</span>
                  <span className="break-all">{data.personalInfo.linkedin}</span>
                </div>
              )}
              {data.personalInfo.website && (
                <div className="flex items-start gap-2">
                  <span className="opacity-70">🌐</span>
                  <span className="break-all">{data.personalInfo.website}</span>
                </div>
              )}
              {data.personalInfo.instagram && (
                <div className="flex items-start gap-2">
                  <span className="opacity-70">📷</span>
                  <span className="break-all">{data.personalInfo.instagram}</span>
                </div>
              )}
              {data.personalInfo.youtube && (
                <div className="flex items-start gap-2">
                  <span className="opacity-70">▶</span>
                  <span className="break-all">{data.personalInfo.youtube}</span>
                </div>
              )}
            </div>

            {/* 技能 */}
            {data.skills.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold mb-4 uppercase tracking-wider opacity-80">Expertise</h3>
                <div className="space-y-3">
                  {data.skills.map((skill, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{skill.name}</span>
                        <span className="opacity-70">{skill.level}%</span>
                      </div>
                      <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white rounded-full transition-all"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 語言能力 */}
            {data.languages && data.languages.length > 0 && (
              <div>
                <h3 className="text-sm font-bold mb-3 uppercase tracking-wider opacity-80">{t('resume.languages')}</h3>
                <div className="space-y-2 text-sm">
                  {data.languages.map((lang, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{lang.name}</span>
                      <span className="opacity-70">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* 興趣愛好 for left panel */}
            {hobbies && (
              <div className="mt-8">
                {" "}
                {/* Added mt-8 for spacing from languages */}
                <h2 className="text-sm font-bold mb-3 uppercase tracking-wider opacity-80">{t('resume.hobbies')}</h2>
                <p className="text-sm leading-relaxed text-white opacity-90">{hobbies}</p>
              </div>
            )}
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
        </div>

        {/* Right Content Panel */}
        <div className="col-span-7 text-gray-900 p-8">
          {/* About */}
          {data.summary && (
            <div className="mb-8 resume-section">
              <h2 className="text-2xl font-bold mb-4 keep-with-next" style={{ color: colors.primary }}>
                About Me
              </h2>
              <p className="text-gray-700 leading-relaxed">{data.summary}</p>
            </div>
          )}

          {/* 工作經歷 */}
          {data.experiences.length > 0 && (
            <div className="mb-8 resume-section">
              <h2 className="text-2xl font-bold mb-4 keep-with-next" style={{ color: colors.primary }}>{t('resume.experience')}</h2>
              {data.experiences.map((exp, idx) => (
                <div key={idx} className="mb-6 relative pl-6 no-break">
                  <div
                    className="absolute left-0 top-2 w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors.secondary }}
                  />
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{exp.jobTitle}</h3>
                      <p className="text-gray-600 font-medium">{exp.employer}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {exp.startDate} - {exp.currentlyWorking ? t('resume.present') : exp.endDate}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* 學歷 */}
          {data.education.length > 0 && (
            <div className="resume-section">
              <h2 className="text-2xl font-bold mb-4 keep-with-next" style={{ color: colors.primary }}>{t('resume.education')}</h2>
              {data.education.map((edu, idx) => (
                <div key={idx} className="mb-4 relative pl-6 no-break">
                  <div
                    className="absolute left-0 top-2 w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors.secondary }}
                  />
                  <h3 className="font-bold">{edu.degree}</h3>
                  <p className="text-sm text-gray-600">{edu.school}</p>
                  <p className="text-xs text-gray-500">{edu.endDate}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
