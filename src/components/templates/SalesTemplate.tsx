import { ResumeData } from "@/types/resume";
import { colorSchemes } from "@/data/templates";
import { CenteredTag } from "./common/CenteredTag"; // Assuming CenteredTag is a simple div or span
import { useTranslation } from 'react-i18next';

interface SalesTemplateProps {
  data: ResumeData;
}

export const SalesTemplate = ({ data }: SalesTemplateProps) => {
  const { t } = useTranslation();
  const colors = colorSchemes[data.designSettings.colorScheme as keyof typeof colorSchemes];

  return (
    // Absolute positioning to cover the entire A4 page. Significantly reduced base font size.
    <div
      className={`bg-white font-sans text-gray-900 absolute inset-0`}
      style={{
        width: "210mm",
        height: "297mm",
        fontSize: "0.625rem", // !!! SIGNIFICANTLY REDUCED BASE FONT SIZE (10px)
        lineHeight: "1.2", // Slightly tighter default line height
        overflow: "hidden",
      }}
    >
      {/* Header Banner - Reduced padding and font sizes */}
      <div
        className="text-white px-6 py-4" // p-8 to px-6 py-4
        style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}
      >
        <h1 className="text-4xl font-bold mb-1">
          {" "}
          {/* text-5xl to text-4xl, mb-2 to mb-1 */}
          {data.personalInfo.firstName} {data.personalInfo.lastName}
        </h1>
        <p className="text-xl font-light opacity-90">{data.personalInfo.jobTitle}</p> {/* text-2xl to text-xl */}
      </div>

      {/* Contact Bar - Reduced padding and font size */}
      <div className="bg-gray-50 px-6 py-2 text-xs text-gray-600 flex flex-wrap gap-3">
        {" "}
        {/* px-8 p-4 to px-6 py-2, text-sm to text-xs, gap-4 to gap-3 */}
        {data.personalInfo.email && <span>📧 {data.personalInfo.email}</span>}
        {data.personalInfo.phone && <span>📱 {data.personalInfo.phone}</span>}
        {data.personalInfo.city && <span>📍 {data.personalInfo.city}</span>}
        {data.personalInfo.linkedin && <span>💼 {data.personalInfo.linkedin}</span>}
      </div>

      {/* Main Content Area - Reduced overall padding. Recalculate height based on new header/contact bar heights */}
      {/* Header Banner height (approx 4xl + 1mb + 1xl + py-4*2) = 36px + 4px + 24px + 16px = ~80px */}
      {/* Contact Bar height (approx 1xs + py-2*2) = 12px + 8px = ~20px */}
      {/* Total fixed height = ~100px. Let's use 100px for h-[calc(100%-XXXpx)] */}
      <div className="px-6 pt-4 pb-2 flex flex-col flex-grow h-[calc(100%-100px)]">
        {" "}
        {/* px-8 pt-6 pb-4 to px-6 pt-4 pb-2. Adjusted h-[calc(100%-XXXpx)] */}
        {/* Value Proposition - Reduced padding, font size, and margin-bottom */}
        {data.summary && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4" style={{ borderColor: colors.primary }}>
            {" "}
            {/* mb-8 to mb-6, p-6 to p-4 */}
            <h2 className="text-lg font-bold mb-2" style={{ color: colors.primary }}>
              {" "}
              {/* text-xl to text-lg, mb-3 to mb-2 */}
              💡 Value Proposition
            </h2>
            <p className="text-gray-700 leading-tight text-sm">{data.summary}</p>{" "}
            {/* text-base to text-sm, leading-relaxed to leading-tight */}
          </div>
        )}
        {/* Key Achievements Grid - Reduced padding, font sizes, and margin-bottom */}
        <div className="grid grid-cols-3 gap-3 mb-6 no-break">
          {" "}
          {/* gap-4 to gap-3, mb-8 to mb-6 */}
          <div className="p-3 bg-gray-50 rounded-lg text-center border-t-4" style={{ borderColor: colors.primary }}>
            <div className="text-xl font-bold" style={{ color: colors.primary }}>
              {" "}
              {/* text-2xl to text-xl */}
              150%
            </div>
            <div className="text-xs text-gray-600">Target Achievement</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg text-center border-t-4" style={{ borderColor: colors.secondary }}>
            <div className="text-xl font-bold" style={{ color: colors.secondary }}>
              {" "}
              {/* text-2xl to text-xl */}
              $5M+
            </div>
            <div className="text-xs text-gray-600">Revenue Generated</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg text-center border-t-4" style={{ borderColor: colors.primary }}>
            <div className="text-xl font-bold" style={{ color: colors.primary }}>
              {" "}
              {/* text-2xl to text-xl */}
              Top 5%
            </div>
            <div className="text-xs text-gray-600">National Ranking</div>
          </div>
        </div>
        {/* 工作經歷 - Reduced margins, padding, and font sizes */}
        {data.experiences.length > 0 && (
          <div className="mb-6 resume-section">
            {" "}
            {/* mb-8 to mb-6 */}
            <h2 className="text-lg font-bold mb-3 pb-1 border-b-2 keep-with-next" style={{ color: colors.primary }}>
              {" "}
              {/* text-xl to text-lg, mb-4 to mb-3, pb-2 to pb-1 */}
              🚀 Sales {t('resume.experience')}
            </h2>
            {data.experiences.map((exp, idx) => (
              <div key={idx} className="mb-4 pl-4 border-l-4 no-break" style={{ borderColor: colors.secondary }}>
                {" "}
                {/* mb-6 to mb-4, pl-6 to pl-4 */}
                <div className="flex justify-between items-start mb-1">
                  {" "}
                  {/* mb-2 to mb-1 */}
                  <div>
                    <h3 className="text-base font-bold" style={{ color: colors.primary }}>
                      {" "}
                      {/* text-lg to text-base */}
                      {exp.jobTitle}
                    </h3>
                    <p className="text-sm text-gray-600 font-semibold">{exp.employer}</p> {/* text-base to text-sm */}
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold" style={{ color: colors.primary }}>
                      {" "}
                      {/* text-sm to text-xs */}
                      {exp.startDate} - {exp.currentlyWorking ? t('resume.present') : exp.endDate}
                    </span>
                    {exp.city && <p className="text-xxs text-gray-500">{exp.city}</p>} {/* text-xs to text-xxs */}
                  </div>
                </div>
                <p className="text-gray-700 leading-tight text-xs whitespace-pre-line">{exp.description}</p>{" "}
                {/* text-sm to text-xs, leading-relaxed to leading-tight */}
              </div>
            ))}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 flex-grow">
          {" "}
          {/* gap-6 to gap-4 */}
          {/* 學歷 - Reduced margins and font sizes */}
          {data.education.length > 0 && (
            <div className="no-break">
              <h2 className="text-lg font-bold mb-3 pb-1 border-b-2" style={{ color: colors.primary }}>
                {" "}
                {/* text-xl to text-lg, pb-2 to pb-1 */}
                🎓 {t('resume.education')}
              </h2>
              {data.education.map((edu, idx) => (
                <div key={idx} className="mb-2">
                  {" "}
                  {/* mb-3 to mb-2 */}
                  <h3 className="font-bold text-sm">{edu.degree}</h3> {/* text-base to text-sm */}
                  <p className="text-xs text-gray-600">{edu.school}</p> {/* text-sm to text-xs */}
                  <p className="text-xxs text-gray-500">{edu.endDate}</p> {/* text-xs to text-xxs */}
                </div>
              ))}
            </div>
          )}
          {/* 技能 - Reduced margins and tag sizes */}
          {data.skills.length > 0 && (
            <div className="no-break">
              <h2 className="text-lg font-bold mb-3 pb-1 border-b-2" style={{ color: colors.primary }}>
                {" "}
                {/* text-xl to text-lg, pb-2 to pb-1 */}
                🛠️ Key {t('resume.skills')}
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {" "}
                {/* gap-2 to gap-1.5 */}
                {data.skills.map((skill, idx) => (
                  <CenteredTag
                    key={idx}
                    // Added flex, items-center, and justify-center for perfect vertical and horizontal centering
                    className="h-6 rounded-full text-xs font-semibold text-white px-3 flex items-center justify-center"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {skill.name}
                  </CenteredTag>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* 語言能力 - Reduced margins and spacing */}
        {data.languages && data.languages.length > 0 && (
          <div className="mt-6 no-break">
            {" "}
            {/* mt-8 to mt-6 */}
            <h2 className="text-lg font-bold mb-3 pb-1 border-b-2" style={{ color: colors.primary }}>
              {" "}
              {/* text-xl to text-lg, pb-2 to pb-1 */}
              🌍 {t('resume.languages')}
            </h2>
            <div className="flex flex-wrap gap-3">
              {" "}
              {/* gap-4 to gap-3 */}
              {data.languages.map((lang, idx) => (
                <div key={idx} className="text-sm">
                  <span className="font-semibold">{lang.name}</span>
                  <span className="text-gray-600"> - {lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Hobbies - Reduced margins and font size */}
        {data.hobbies && (
          <div className="mt-6 pb-2 no-break">
            {" "}
            {/* mt-8 to mt-6, pb-4 to pb-2 */}
            <h2 className="text-lg font-bold mb-3 pb-1 border-b-2" style={{ color: colors.primary }}>
              {" "}
              {/* text-xl to text-lg, pb-2 to pb-1 */}
              🎯 Interests
            </h2>
            <p className="text-gray-700 leading-tight text-sm">{data.hobbies}</p>{" "}
            {/* text-base to text-sm, leading-relaxed to leading-tight */}
          </div>
        )}
      </div>
    </div>
  );
};
