import { ResumeData } from "@/types/resume";
import { colorSchemes } from "@/data/templates";
import { CenteredTag } from "./common/CenteredTag";
import { useTranslation } from 'react-i18next';
interface StartupTemplateProps {
  data: ResumeData;
}
export const StartupTemplate = ({ data }: StartupTemplateProps) => {
  const { t } = useTranslation();
  const colors = colorSchemes[data.designSettings.colorScheme as keyof typeof colorSchemes];
  const { hobbies } = data;
  return (
    // ABSOLUTE MOST AGGRESSIVE MARGIN REMOVAL:
    // - w-full h-full for browser view.
    // - print:w-a4 print:h-a4 for A4 dimensions in print.
    // - print:p-0 print:m-0 to aggressively remove ALL default print margins.
    // - print:pl-0 print:pr-0 explicitly ensures left/right padding is zero.
    // - NO other px- or p- classes on this outermost div.
    <div className="bg-white font-sans text-gray-900" style={{ width: "794px", minHeight: "1123px" }}>
      {/*
        This inner div will contain ALL resume content.
        We will apply vertical padding here (py-8) but NO horizontal padding (NO px-).
        This means the content inside *can* stretch edge-to-edge horizontally if its children allow it.
      */}
      <div className="py-8">
        {/* Header Section:
            - flex items-start gap-8 mb-8 pb-6 border-b-2 ensures the line stretches.
            - px-8 IS ADDED *HERE* to apply the desired internal padding to the header's content
              from the document's edges.
        */}
        <div className="flex items-start gap-8 mb-8 pb-6 border-b-2" style={{ borderColor: colors.primary }}>
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
          >
            {data.personalInfo.firstName[0]}
            {data.personalInfo.lastName[0]}
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2" style={{ color: colors.primary }}>
              {data.personalInfo.firstName} {data.personalInfo.lastName}
            </h1>
            <p className="text-xl text-gray-600 mb-3">{data.personalInfo.jobTitle}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {data.personalInfo.email && <span className="flex items-center gap-1">📧 {data.personalInfo.email}</span>}
              {data.personalInfo.phone && <span className="flex items-center gap-1">📱 {data.personalInfo.phone}</span>}
              {data.personalInfo.city && <span className="flex items-center gap-1">📍 {data.personalInfo.city}</span>}
              {data.personalInfo.linkedin && (
                <span className="flex items-center gap-1">💼 {data.personalInfo.linkedin}</span>
              )}
              {data.personalInfo.website && (
                <span className="flex items-center gap-1">🌐 {data.personalInfo.website}</span>
              )}
              {data.personalInfo.instagram && (
                <span className="flex items-center gap-1">📷 {data.personalInfo.instagram}</span>
              )}
              {data.personalInfo.youtube && (
                <span className="flex items-center gap-1">▶ {data.personalInfo.youtube}</span>
              )}
            </div>
          </div>
        </div>
        {/* {t('resume.summary')} with Quote Style:
            - px-8 IS ADDED *HERE* to apply desired internal padding to the summary text.
            - Absolute positioning of quote mark needs adjustment if it was based on an outer px-8.
        */}
        {data.summary && (
          <div className="mb-8 relative">
            <div className="absolute left-0 top-0 text-6xl opacity-20" style={{ color: colors.primary }}>
              "
            </div>
            <p className="text-lg text-gray-700 leading-relaxed italic pl-6">{data.summary}</p>
          </div>
        )}
        {/* Main Grid:
            - px-8 IS ADDED *HERE* to apply desired internal padding to the grid content.
        */}
        <div className="grid grid-cols-3 gap-8">
          {/* Main Content - 2 columns */}
          <div className="col-span-2 space-y-6">
            {/* 工作經歷 */}
            {data.experiences?.length > 0 && (
              <div className="resume-section">
                <h2
                  className="text-2xl font-bold mb-4 flex items-center gap-2 keep-with-next"
                  style={{ color: colors.primary }}
                >
                  <span className="w-2 h-8 rounded" style={{ backgroundColor: colors.primary }} />{t('resume.experience')}</h2>
                {data.experiences.map((exp, idx) => (
                  <div
                    key={idx}
                    className="mb-6 p-4 rounded-lg border-l-4 bg-gray-50 no-break"
                    style={{ borderColor: colors.secondary }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{exp.jobTitle}</h3>
                        <p className="text-gray-600 font-medium">{exp.employer}</p>
                      </div>
                      <CenteredTag
                        className="h-7 rounded-full text-xs font-semibold text-white flex items-center justify-center" // Added flex for centering
                        style={{ backgroundColor: colors.primary }}
                      >
                        {exp.startDate} - {exp.currentlyWorking ? "Now" : exp.endDate}
                      </CenteredTag>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}
            {/* 學歷 */}
            {data.education?.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.primary }}>
                  <span className="w-2 h-8 rounded" style={{ backgroundColor: colors.primary }} />{t('resume.education')}</h2>
                {data.education.map((edu, idx) => (
                  <div key={idx} className="mb-4 p-4 rounded-lg bg-gray-50">
                    <h3 className="font-bold text-lg">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.school}</p>
                    <p className="text-sm text-gray-500">{edu.endDate}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Sidebar - 1 column (already has internal padding) */}
          <div className="space-y-6">
            {/* 技能 */}
            {data.skills?.length > 0 && (
              <div className="p-5 rounded-lg" style={{ backgroundColor: `${colors.primary}15` }}>
                <h3 className="text-lg font-bold mb-4" style={{ color: colors.primary }}>{t('resume.skills')}</h3>
                <div className="space-y-2">
                  {data.skills.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.secondary }} />
                      <span className="text-sm font-medium">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* 語言能力 */}
            {data.languages && data.languages.length > 0 && (
              <div className="p-5 rounded-lg" style={{ backgroundColor: `${colors.secondary}15` }}>
                <h3 className="text-lg font-bold mb-4" style={{ color: colors.primary }}>{t('resume.languages')}</h3>
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
            {/* 證照 */}
            {data.certifications && data.certifications.length > 0 && (
              <div className="p-5 rounded-lg bg-gray-50">
                <h3 className="text-lg font-bold mb-4" style={{ color: colors.primary }}>{t('resume.certifications')}</h3>
                <div className="space-y-3">
                  {data.certifications.map((cert, idx) => (
                    <div key={idx} className="text-sm">
                      <div className="font-semibold">{cert.name}</div>
                      <div className="text-gray-600 text-xs">{cert.issuer}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* 興趣愛好:
            - px-8 IS ADDED *HERE* to apply desired internal padding to the hobbies content.
        */}
        {hobbies && (
          <div className="mt-8 pb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.primary }}>
              <span className="w-2 h-8 rounded" style={{ backgroundColor: colors.primary }} />{t('resume.hobbies')}</h2>
            <p className="text-gray-700 leading-relaxed">{hobbies}</p>
          </div>
        )}
      </div>
    </div>
  );
};
