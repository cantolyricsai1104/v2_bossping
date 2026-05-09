import { ResumeData } from "@/types/resume";
import { Mail, Phone, MapPin, Globe, Linkedin, Instagram, Youtube } from "lucide-react";
import { CenteredTag } from "./common/CenteredTag";
import { colorSchemes } from "@/data/templates";
// getMarginClass and getMarginStyle are imported but will not be used on the outermost div
// if the goal is to eliminate outer margins
// import { getMarginClass, getMarginStyle } from '@/lib/marginUtils'; // Keeping for clarity, but won't be applied to the main div
import { useTranslation } from 'react-i18next';

interface TemplateProps {
  data: ResumeData;
}

export const CreativeTemplate = ({ data }: TemplateProps) => {
  const { t } = useTranslation();
  const { personalInfo, summary, experiences, education, skills, languages, hobbies } = data;
  const colors = colorSchemes[data.designSettings.colorScheme as keyof typeof colorSchemes];

  // NOTE: To eliminate outer margins, we will NOT apply marginClass or marginStyle to the outermost div.
  // The outer div will now be responsible for the full 210mm x 297mm without any external padding.
  // const marginClass = getMarginClass(data.designSettings.margins, data.designSettings.customMarginPx);
  // const marginStyle = getMarginStyle(data.designSettings.margins, data.designSettings.customMarginPx, data.designSettings.customHorizontalMarginPx, data.designSettings.customVerticalMarginPx);

  return (
    // Removed marginClass and marginStyle from here to eliminate outer margins
    // Set explicit A4 dimensions for the root container and adjusted base font size
    <div
      className="bg-gradient-to-br from-background to-muted font-sans"
      style={{ width: "210mm", minHeight: "297mm", fontSize: "0.65rem" }}
    >
      {/* Header with Accent Background - Reduced padding and font sizes */}
      <div className="text-white p-4 mb-4 rounded-br-[40px]" style={{ backgroundColor: colors.primary }}>
        {" "}
        {/* p-8 to p-4, mb-6 to mb-4, rounded-br size reduced */}
        <h1 className="text-4xl font-black mb-1">
          {" "}
          {/* text-5xl to text-4xl, mb-2 to mb-1 */}
          {personalInfo.firstName || t('resume.firstName') || 'First Name'} {personalInfo.lastName || t('resume.lastName') || 'Last Name'}
        </h1>
        <p className="text-xl font-light opacity-90">
          {" "}
          {/* text-2xl to text-xl */}
          {personalInfo.jobTitle || t('resume.jobTitle') || 'Professional Title'}
        </p>
      </div>

      {/* Contact Info - Reduced gap, text size, and mb */}
      <div className="flex flex-wrap gap-2 text-xs mb-4 px-4 text-muted-foreground">
        {" "}
        {/* gap-4 to gap-2, text-sm to text-xs, mb-8 to mb-4, added px-4 */}
        {personalInfo.email && (
          <div className="flex items-center gap-1.5">
            {" "}
            {/* gap reduced */}
            <Mail className="h-3.5 w-3.5" style={{ color: colors.primary }} /> {/* icons slightly smaller */}
            {personalInfo.email}
          </div>
        )}
        {personalInfo.phone && (
          <div className="flex items-center gap-1.5">
            {" "}
            {/* gap reduced */}
            <Phone className="h-3.5 w-3.5" style={{ color: colors.primary }} /> {/* icons slightly smaller */}
            {personalInfo.phone}
          </div>
        )}
        {personalInfo.city && (
          <div className="flex items-center gap-1.5">
            {" "}
            {/* gap reduced */}
            <MapPin className="h-3.5 w-3.5" style={{ color: colors.primary }} /> {/* icons slightly smaller */}
            {personalInfo.city}
            {personalInfo.country && `, ${personalInfo.country}`}
          </div>
        )}
        {personalInfo.linkedin && (
          <div className="flex items-center gap-1.5">
            {" "}
            {/* gap reduced */}
            <Linkedin className="h-3.5 w-3.5" style={{ color: colors.primary }} /> {/* icons slightly smaller */}
            {personalInfo.linkedin}
          </div>
        )}
        {personalInfo.website && (
          <div className="flex items-center gap-1.5">
            {" "}
            {/* gap reduced */}
            <Globe className="h-3.5 w-3.5" style={{ color: colors.primary }} /> {/* icons slightly smaller */}
            {personalInfo.website}
          </div>
        )}
        {personalInfo.instagram && (
          <div className="flex items-center gap-1.5">
            {" "}
            {/* gap reduced */}
            <Instagram className="h-3.5 w-3.5" style={{ color: colors.primary }} /> {/* icons slightly smaller */}
            {personalInfo.instagram}
          </div>
        )}
        {personalInfo.youtube && (
          <div className="flex items-center gap-1.5">
            {" "}
            {/* gap reduced */}
            <Youtube className="h-3.5 w-3.5" style={{ color: colors.primary }} /> {/* icons slightly smaller */}
            {personalInfo.youtube}
          </div>
        )}
      </div>

      {/* {t('resume.summary')} - Reduced padding, font sizes, and mb */}
      {summary && (
        <div className="mb-4 bg-card p-4 rounded-lg shadow-sm mx-4 resume-section">
          {" "}
          {/* mb-8 to mb-4, p-6 to p-4, shadow-md to shadow-sm, added mx-4 */}
          <h2 className="text-xl font-bold mb-3 keep-with-next" style={{ color: colors.primary }}>{t('resume.summary')}</h2>{" "}
          {/* text-2xl to text-xl, mb-4 to mb-3 */}
          <p className="text-xs leading-normal text-card-foreground">
            {" "}
            {/* text-sm to text-xs, leading-relaxed to leading-normal */}
            {summary}
          </p>
        </div>
      )}

      {/* Main Grid - Reduced gap */}
      <div className="grid grid-cols-3 gap-4 px-4">
        {" "}
        {/* gap-6 to gap-4, added px-4 to main grid */}
        {/* Left Column - 2/3 width */}
        <div className="col-span-2">
          {/* 工作經歷 - Reduced mb */}
          {experiences.length > 0 && (
            <div className="mb-4 resume-section">
              {" "}
              {/* mb-8 to mb-4 */}
              <h2 className="text-xl font-bold mb-3 pl-3 keep-with-next border-l-4" style={{ color: colors.primary, borderColor: colors.secondary }}>
                {" "}
                {/* text-2xl to text-xl, mb-4 to mb-3, pl-4 to pl-3 */}
                工作經歷
              </h2>
              {experiences.map((exp) => (
                <div key={exp.id} className="mb-4 pl-3 no-break">
                  {" "}
                  {/* mb-6 to mb-4, pl-4 to pl-3 */}
                  <h3 className="text-lg font-bold text-foreground">
                    {" "}
                    {/* text-xl to text-lg */}
                    {exp.jobTitle}
                  </h3>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: colors.primary }}>
                    {" "}
                    {/* text-sm to text-xs, mb-1 to mb-0.5 */}
                    {exp.employer}
                  </p>
                  <p className="text-xxs text-muted-foreground mb-1">
                    {" "}
                    {/* text-xs to text-xxs, mb-2 to mb-1 */}
                    {exp.startDate} - {exp.currentlyWorking ? t('resume.present') : exp.endDate}
                    {exp.city && ` • ${exp.city}`}
                    {exp.country && `, ${exp.country}`}
                  </p>
                  <p className="text-xs text-foreground leading-normal whitespace-pre-line">
                    {" "}
                    {/* text-sm to text-xs, leading-relaxed to leading-normal */}
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* 學歷 - Reduced mb */}
          {education.length > 0 && (
            <div className="mb-4 resume-section">
              {" "}
              {/* mb-8 to mb-4 */}
              <h2 className="text-xl font-bold mb-3 pl-3 keep-with-next border-l-4" style={{ color: colors.primary, borderColor: colors.secondary }}>
                {" "}
                {/* text-2xl to text-xl, mb-4 to mb-3, pl-4 to pl-3 */}
                學歷
              </h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-3 pl-3 no-break">
                  {" "}
                  {/* mb-4 to mb-3, pl-4 to pl-3 */}
                  <h3 className="text-base font-bold text-foreground">
                    {" "}
                    {/* text-lg to text-base */}
                    {edu.degree}
                  </h3>
                  <p className="text-xs font-semibold" style={{ color: colors.primary }}>
                    {" "}
                    {/* text-sm to text-xs */}
                    {edu.school}
                  </p>
                  <p className="text-xxs text-muted-foreground">
                    {" "}
                    {/* text-xs to text-xxs */}
                    {edu.startDate} - {edu.currentlyStudying ? t('resume.present') : edu.endDate}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Right Column - 1/3 width */}
        <div>
          {/* 技能 - Reduced mb */}
          {skills.length > 0 && (
            <div className="mb-4 resume-section">
              {" "}
              {/* mb-8 to mb-4 */}
              <h2 className="text-lg font-bold mb-3 keep-with-next" style={{ color: colors.primary }}>{t('resume.skills')}</h2>{" "}
              {/* text-xl to text-lg, mb-4 to mb-3 */}
              <div className="space-y-1.5">
                {" "}
                {/* space-y-2 to space-y-1.5 */}
                {skills.map((skill) => (
                  // CenteredTag changes: h-8 to h-6, text-sm to text-xs
                  // Added flex, items-center, and justify-center for perfect vertical and horizontal centering
                  <CenteredTag
                    key={skill.id}
                    className="h-6 rounded-md text-xs font-medium w-full flex items-center justify-center"
                    style={{ backgroundColor: `${colors.primary}15` }}
                  >
                    {skill.name}
                  </CenteredTag>
                ))}
              </div>
            </div>
          )}

          {/* 語言能力 - Reduced mb and font sizes */}
          {languages.length > 0 && (
            <div className="resume-section">
              <h2 className="text-lg font-bold mb-3 keep-with-next" style={{ color: colors.primary }}>{t('resume.languages')}</h2>{" "}
              {/* text-xl to text-lg, mb-4 to mb-3 */}
              <div className="space-y-1.5">
                {" "}
                {/* space-y-2 to space-y-1.5 */}
                {languages.map((lang) => (
                  <div key={lang.id} className="text-xs no-break">
                    {" "}
                    {/* text-sm to text-xs */}
                    <p className="font-semibold text-foreground">{lang.name}</p>
                    <p className="text-xxs text-muted-foreground capitalize">{lang.proficiency}</p>{" "}
                    {/* text-xs to text-xxs */}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 興趣愛好 - Reduced mt, mb, and font sizes */}
      {hobbies && (
        <div className="mt-4 resume-section px-4 pb-4">
          {" "}
          {/* mt-6 to mt-4, mb-3 to mb-2, added px-4, pb-4 */}
          <h2 className="text-lg font-bold mb-2 keep-with-next" style={{ color: colors.primary }}>
            {" "}
            {/* text-xl to text-lg, mb-3 to mb-2 */}
            興趣愛好
          </h2>
          <p className="text-xs leading-normal text-gray-700">{hobbies}</p>{" "}
          {/* text-sm to text-xs, leading-relaxed to leading-normal */}
        </div>
      )}
    </div>
  );
};
