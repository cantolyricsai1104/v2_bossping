import { ResumeData } from "@/types/resume";
import { colorSchemes } from "@/data/templates";
import { useTranslation } from 'react-i18next';

interface ManagerTemplateProps {
  data: ResumeData;
}

export const ManagerTemplate = ({ data }: ManagerTemplateProps) => {
  const { t } = useTranslation();
  const colors = colorSchemes[data.designSettings.colorScheme as keyof typeof colorSchemes];
  const { hobbies } = data;

  const headerHorizontalPaddingClass = "px-8";
  const contentHorizontalPaddingClass = "px-6";

  return (
    <div
      className={`bg-white w-full h-full font-sans text-gray-900 overflow-hidden
                  print:w-[210mm] print:h-[297mm] print:p-0 print:m-0`}
      style={{
        position: "absolute",
        top: "0 !important",
        left: "0 !important",
        right: "0 !important",
        bottom: "0 !important",
        width: "210mm !important",
        height: "297mm !important", // Explicit height for A4
        minWidth: "210mm !important",
        minHeight: "297mm !important",
        padding: "0 !important",
        margin: "0 !important",
        boxSizing: "border-box",
        lineHeight: "1.05 !important", // Even tighter line-height
        fontSize: "0.75rem !important", // Even smaller base font size
      }}
    >
      <div className="flex flex-col w-full h-full">
        {/* Header Section - Stretched Vertically */}
        <div
          className="text-white relative overflow-hidden py-4" // Increased vertical padding to py-4
          style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}
        >
          <div className={`relative z-10 ${headerHorizontalPaddingClass}`}>
            <h1 className="text-2xl font-bold">
              {data.personalInfo.firstName} {data.personalInfo.lastName}
            </h1>
            <p className="text-base font-light opacity-95 mb-1">{data.personalInfo.jobTitle}</p>
            {/* Even tighter contact info spacing */}
            <div className="flex flex-wrap gap-x-2 text-xs">
              {" "}
              {/* Removed gap-y-0.5 */}
              {data.personalInfo.email && (
                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 py-0 rounded">
                  {" "}
                  {/* py-0.5 to py-0 */}
                  <span>✉</span>
                  <span>{data.personalInfo.email}</span>
                </div>
              )}
              {data.personalInfo.phone && (
                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 py-0 rounded">
                  {" "}
                  {/* py-0.5 to py-0 */}
                  <span>☎</span>
                  <span>{data.personalInfo.phone}</span>
                </div>
              )}
              {data.personalInfo.city && (
                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 py-0 rounded">
                  {" "}
                  {/* py-0.5 to py-0 */}
                  <span>📍</span>
                  <span>{data.personalInfo.city}</span>
                </div>
              )}
              {data.personalInfo.linkedin && (
                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 py-0 rounded">
                  {" "}
                  {/* py-0.5 to py-0 */}
                  <span>💼</span>
                  <span>{data.personalInfo.linkedin}</span>
                </div>
              )}
              {data.personalInfo.website && (
                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 py-0 rounded">
                  {" "}
                  {/* py-0.5 to py-0 */}
                  <span>🌐</span>
                  <span>{data.personalInfo.website}</span>
                </div>
              )}
              {data.personalInfo.instagram && (
                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 py-0 rounded">
                  {" "}
                  {/* py-0.5 to py-0 */}
                  <span>📷</span>
                  <span>{data.personalInfo.instagram}</span>
                </div>
              )}
              {data.personalInfo.youtube && (
                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 py-0 rounded">
                  {" "}
                  {/* py-0.5 to py-0 */}
                  <span>▶</span>
                  <span>{data.personalInfo.youtube}</span>
                </div>
              )}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-60 -mt-40" />
        </div>
        {/* Main Content Area - Below Header - Even tighter vertical spacing */}
        <div className={`flex-grow py-2 ${contentHorizontalPaddingClass}`}>
          {/* Professional {t('resume.summary')} */}
          {data.summary && (
            <div className="mb-3">
              {" "}
              {/* mb-4 to mb-3 */}
              <h2 className="text-lg font-bold mb-2" style={{ color: colors.primary }}>
                Leadership {t('resume.summary')}
              </h2>
              <p className="text-xs text-gray-700 leading-normal">{data.summary}</p> {/* text-sm to text-xs */}
            </div>
          )}
          {/* Key Strengths */}
          {data.skills?.length > 0 && (
            <div className="mb-3">
              {" "}
              {/* mb-4 to mb-3 */}
              <h2 className="text-lg font-bold mb-2" style={{ color: colors.primary }}>
                Key Strengths & Competencies
              </h2>
              <div className="grid grid-cols-3 gap-1">
                {" "}
                {/* gap-2 to gap-1 */}
                {data.skills.slice(0, 6).map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-1 rounded-lg border-2 text-center text-xs font-semibold hover:shadow-md transition-shadow" // p-2 to p-1
                    style={{ borderColor: colors.secondary }}
                  >
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* 工作經歷 */}
          {data.experiences?.length > 0 && (
            <div className="mb-3 resume-section">
              {" "}
              {/* mb-4 to mb-3 */}
              <h2 className="text-lg font-bold mb-2 keep-with-next" style={{ color: colors.primary }}>
                {" "}
                {/* mb-3 to mb-2 */}
                工作經歷
              </h2>
              {data.experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="mb-3 relative pl-6 no-break before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:rounded" // mb-4 to mb-3
                  style={{ "--tw-before-bg-opacity": "1" } as any}
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded"
                    style={{ backgroundColor: colors.secondary }}
                  />
                  <div className="mb-0.5">
                    {" "}
                    {/* mb-1 to mb-0.5 */}
                    <div className="flex justify-between items-start mb-0.5">
                      <div>
                        <h3 className="text-base font-bold">{exp.jobTitle}</h3>
                        <p className="text-xs text-gray-600 font-semibold">{exp.employer}</p>
                        {exp.city && <p className="text-xs text-gray-500">{exp.city}</p>}
                      </div>
                      <div
                        className="px-2 py-0 rounded-lg text-xs font-bold text-white" // py-0.5 to py-0
                        style={{ backgroundColor: colors.primary }}
                      >
                        {exp.startDate} - {exp.currentlyWorking ? t('resume.present') : exp.endDate}
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 leading-normal whitespace-pre-line">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* 學歷 & Additional Info */}
          <div className="grid grid-cols-2 gap-3">
            {" "}
            {/* gap-4 to gap-3 */}
            {data.education?.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-2" style={{ color: colors.primary }}>{t('resume.education')}</h2>
                {data.education.map((edu, idx) => (
                  <div key={idx} className="mb-2 p-1 rounded-lg bg-gray-50">
                    {" "}
                    {/* p-2 to p-1 */}
                    <h3 className="font-bold text-sm">{edu.degree}</h3>
                    <p className="text-xs text-gray-600 font-medium">{edu.school}</p>
                    <p className="text-xs text-gray-500">
                      {edu.city && `${edu.city} | `}{edu.endDate}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div className="space-y-1">
              {" "}
              {/* space-y-2 to space-y-1 */}
              {data.languages && data.languages.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold mb-2" style={{ color: colors.primary }}>{t('resume.languages')}</h2>
                  <div className="space-y-0.5">
                    {" "}
                    {/* space-y-1 to space-y-0.5 */}
                    {data.languages.map((lang, idx) => (
                      <div key={idx} className="flex justify-between p-0.5 bg-gray-50 rounded">
                        {" "}
                        {/* p-1 to p-0.5 */}
                        <span className="font-semibold text-xs">{lang.name}</span>
                        <span className="text-gray-600 text-xs">{lang.proficiency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {data.certifications && data.certifications.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold mb-2" style={{ color: colors.primary }}>{t('resume.certifications')}</h2>
                  <div className="space-y-0.5">
                    {" "}
                    {/* space-y-1 to space-y-0.5 */}
                    {data.certifications.map((cert, idx) => (
                      <div key={idx} className="p-0.5 bg-gray-50 rounded">
                        {" "}
                        {/* p-1 to p-0.5 */}
                        <div className="font-semibold text-xs">{cert.name}</div>
                        <div className="text-xs text-gray-600">
                          {cert.issuer} | {cert.date}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {hobbies && (
            <div className="pt-3">
              {" "}
              {/* pt-4 to pt-3 */}
              <h2 className="text-lg font-bold mb-2" style={{ color: colors.primary }}>{t('resume.hobbies')}</h2>
              <p className="text-xs text-gray-700 leading-normal">{hobbies}</p> {/* text-sm to text-xs */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
