import { ResumeData } from "@/types/resume";
import { Mail, Phone, MapPin, Linkedin, Globe, Instagram, Youtube } from "lucide-react";
import { colorSchemes } from "@/data/templates";
import { useTranslation } from 'react-i18next';

interface ModernTemplateProps {
  data: ResumeData;
}

export const ModernTemplate = ({ data }: ModernTemplateProps) => {
  const { t } = useTranslation();
  const { personalInfo, summary, experiences, education, skills, languages, certifications, hobbies } = data;
  const colors = colorSchemes[data.designSettings.colorScheme as keyof typeof colorSchemes];

  return (
    // Base font size reduced to 0.65rem
    <div
      className="bg-white text-gray-900 font-sans w-full"
      style={{ width: "210mm", minHeight: "297mm", fontSize: "0.65rem" }}
    >
      {/* Header with geometric accent */}
      <div className="relative mb-4 px-6 pt-4">
        {" "}
        {/* Reduced mb and pt, px */}
        <div className="absolute top-0 left-0 w-20 h-20 rounded-br-full" style={{ backgroundColor: `${colors.primary}15` }}></div> {/* Smaller accent */}
        <div className="relative z-10 flex items-start gap-3">
          {" "}
          {/* Reduced gap */}
          {personalInfo.photo && (
            <img
              src={personalInfo.photo}
              alt={t('resume.summary')}
              className="w-16 h-16 rounded-full object-cover flex-shrink-0" // Smaller photo
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-0.5">
              {" "}
              {/* Reduced font size */}
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <p className="text-lg font-medium" style={{ color: colors.primary }}>{personalInfo.jobTitle}</p> {/* Reduced font size */}
          </div>
        </div>
      </div>
      {/* Contact Info - Modern Grid */}
      <div className="grid grid-cols-2 gap-1 mb-4 pb-3 border-b-2 px-6" style={{ borderColor: `${colors.primary}33` }}>
        {" "}
        {/* Reduced gap, mb, pb, px */}
        <div className="flex items-center gap-1 text-xxs">
          {" "}
          {/* Reduced text size (assuming text-xxs is defined) and gap */}
          <Mail className="w-2.5 h-2.5" style={{ color: colors.primary }} /> {/* Smaller icon */}
          <span>{personalInfo.email}</span>
        </div>
        <div className="flex items-center gap-1 text-xxs">
          {" "}
          {/* Reduced text size and gap */}
          <Phone className="w-2.5 h-2.5" style={{ color: colors.primary }} /> {/* Smaller icon */}
          <span>{personalInfo.phone}</span>
        </div>
        {personalInfo.city && (
          <div className="flex items-center gap-1 text-xxs">
            {" "}
            {/* Reduced text size and gap */}
            <MapPin className="w-2.5 h-2.5" style={{ color: colors.primary }} /> {/* Smaller icon */}
            <span>
              {personalInfo.city}
              {personalInfo.country && `, ${personalInfo.country}`}
            </span>
          </div>
        )}
        {personalInfo.linkedin && (
          <div className="flex items-center gap-1 text-xxs">
            {" "}
            {/* Reduced text size and gap */}
            <Linkedin className="w-2.5 h-2.5" style={{ color: colors.primary }} /> {/* Smaller icon */}
            <span>{personalInfo.linkedin}</span>
          </div>
        )}
        {personalInfo.website && (
          <div className="flex items-center gap-1 text-xxs">
            {" "}
            {/* Reduced text size and gap */}
            <Globe className="w-2.5 h-2.5" style={{ color: colors.primary }} /> {/* Smaller icon */}
            <span>{personalInfo.website}</span>
          </div>
        )}
        {personalInfo.instagram && (
          <div className="flex items-center gap-1 text-xxs">
            {" "}
            {/* Reduced text size and gap */}
            <Instagram className="w-2.5 h-2.5" style={{ color: colors.primary }} /> {/* Smaller icon */}
            <span>{personalInfo.instagram}</span>
          </div>
        )}
        {personalInfo.youtube && (
          <div className="flex items-center gap-1 text-xxs">
            {" "}
            {/* Reduced text size and gap */}
            <Youtube className="w-2.5 h-2.5" style={{ color: colors.primary }} /> {/* Smaller icon */}
            <span>{personalInfo.youtube}</span>
          </div>
        )}
      </div>
      {/* {t('resume.summary')} */}
      {summary && (
        <div className="mb-4 resume-section px-6">
          {" "}
          {/* Reduced mb, px */}
          <h2 className="text-base font-bold text-primary mb-1.5 flex items-center gap-1 keep-with-next">
            {" "}
            {/* Reduced font size and gap */}
            <div className="w-1 h-4 bg-primary"></div> {/* Smaller accent */}
            {t('resume.summary')}
          </h2>
          <p className="text-xxs leading-normal text-gray-700">{summary}</p>{" "}
          {/* Reduced font size, tightened leading */}
        </div>
      )}
      {/* 工作經歷 */}
      {experiences.length > 0 && (
        <div className="mb-4 resume-section px-6">
          {" "}
          {/* Reduced mb, px */}
          <h2 className="text-base font-bold text-primary mb-2 flex items-center gap-1 keep-with-next">
            {" "}
            {/* Reduced font size and gap */}
            <div className="w-1 h-4 bg-primary"></div> {/* Smaller accent */}
            工作經歷
          </h2>
          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className={`mb-3 no-break ${index !== experiences.length - 1 ? "pb-3 border-b border-gray-200" : ""}`}
            >
              {" "}
              {/* Reduced mb and pb */}
              <div className="flex justify-between items-start mb-0.5">
                {" "}
                {/* Reduced mb */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{exp.jobTitle}</h3> {/* Reduced font size */}
                  <p className="text-xs font-semibold text-primary">{exp.employer}</p> {/* Reduced font size */}
                </div>
                <div className="text-right">
                  <p className="text-xxs text-gray-600 font-medium">
                    {" "}
                    {/* Reduced font size */}
                    {exp.startDate} - {exp.currentlyWorking ? t('resume.present') : exp.endDate}
                  </p>
                  {(exp.city || exp.country) && (
                    <p className="text-xxs text-gray-500">
                      {exp.city}
                      {exp.city && exp.country && ', '}
                      {exp.country}
                    </p>
                  )}{" "}
                  {/* Reduced font size */}
                </div>
              </div>
              <div className="text-xxs text-gray-700 whitespace-pre-line leading-normal">
                {" "}
                {/* Reduced font size, tightened leading */}
                {exp.description}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 px-6">
        {" "}
        {/* Reduced gap, px */}
        {/* 學歷 */}
        {education.length > 0 && (
          <div className="resume-section">
            <h2 className="text-base font-bold text-primary mb-2 flex items-center gap-1 keep-with-next">
              {" "}
              {/* Reduced font size and gap */}
              <div className="w-1 h-4 bg-primary"></div> {/* Smaller accent */}
              學歷
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2 no-break">
                {" "}
                {/* Reduced mb */}
                <h3 className="text-xs font-bold text-gray-900">{edu.degree}</h3> {/* Reduced font size */}
                <p className="text-xxs font-semibold text-primary">{edu.school}</p> {/* Reduced font size */}
                <p className="text-xxs text-gray-600">
                  {" "}
                  {/* Reduced font size */}
                  {edu.startDate} - {edu.currentlyStudying ? t('resume.present') : edu.endDate}
                </p>
              </div>
            ))}
          </div>
        )}
        {/* 技能 */}
        {skills.length > 0 && (
          <div className="resume-section">
            <h2 className="text-base font-bold text-primary mb-2 flex items-center gap-1 keep-with-next">
              {" "}
              {/* Reduced font size and gap */}
              <div className="w-1 h-4 bg-primary"></div> {/* Smaller accent */}
              技能
            </h2>
            <div className="space-y-1.5">
              {" "}
              {/* Reduced space-y */}
              {skills.map((skill) => (
                <div key={skill.id} className="no-break">
                  <div className="flex justify-between text-xxs mb-0.5">
                    {" "}
                    {/* Reduced font size and mb */}
                    <span className="font-medium text-gray-900">{skill.name}</span>
                    <span className="text-gray-600 capitalize">{skill.level}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    {" "}
                    {/* Smaller height */}
                    {/* Fixed: Removed inline JSX comment that caused syntax error */}
                    <div
                      className="h-1 rounded-full transition-all"
                      style={{
                        backgroundColor: colors.primary,
                        width:
                          skill.level === "expert"
                            ? "100%"
                            : skill.level === "advanced"
                              ? "80%"
                              : skill.level === "intermediate"
                                ? "60%"
                                : "40%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* 語言能力 & 證照 */}
      <div className="grid grid-cols-2 gap-4 mt-4 px-6">
        {" "}
        {/* Reduced gap and mt, px */}
        {languages.length > 0 && (
          <div className="resume-section">
            <h2 className="text-base font-bold text-primary mb-2 flex items-center gap-1 keep-with-next">
              {" "}
              {/* Reduced font size and gap */}
              <div className="w-1 h-4 bg-primary"></div> {/* Smaller accent */}
              語言能力
            </h2>
            {languages.map((lang) => (
              <div key={lang.id} className="mb-0.5 text-xxs no-break">
                {" "}
                {/* Reduced mb and font size */}
                <span className="font-medium text-gray-900">{lang.name}</span>
                <span className="text-gray-600"> - {lang.proficiency}</span>
              </div>
            ))}
          </div>
        )}
        {certifications.length > 0 && (
          <div className="resume-section">
            <h2 className="text-base font-bold text-primary mb-2 flex items-center gap-1 keep-with-next">
              {" "}
              {/* Reduced font size and gap */}
              <div className="w-1 h-4 bg-primary"></div> {/* Smaller accent */}
              證照
            </h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-1 text-xxs no-break">
                {" "}
                {/* Reduced mb and font size */}
                <p className="font-medium text-gray-900">{cert.name}</p>
                <p className="text-gray-600">
                  {cert.issuer} - {cert.date}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* 興趣愛好 */}
      {hobbies && (
        <div className="mt-4 resume-section px-6 pb-4">
          {" "}
          {/* Reduced mt and pb, px */}
          <h2 className="text-base font-bold text-primary mb-1.5 flex items-center gap-1 keep-with-next">
            {" "}
            {/* Reduced font size and gap */}
            <div className="w-1 h-4 bg-primary"></div> {/* Smaller accent */}
            興趣愛好
          </h2>
          <p className="text-xxs leading-normal text-gray-700">{hobbies}</p>{" "}
          {/* Reduced font size, tightened leading */}
        </div>
      )}
    </div>
  );
};
