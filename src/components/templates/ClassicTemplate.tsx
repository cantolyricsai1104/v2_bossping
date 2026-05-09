import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Globe, Instagram, Youtube } from 'lucide-react';
import { getMarginClass, getMarginStyle } from '@/lib/marginUtils';
import { colorSchemes } from '@/data/templates';
import { useTranslation } from 'react-i18next';

interface ClassicTemplateProps {
  data: ResumeData;
}

export const ClassicTemplate = ({ data }: ClassicTemplateProps) => {
  const { t } = useTranslation();
  const { personalInfo, summary, experiences, education, skills, languages, certifications, hobbies } = data;
  const colors = colorSchemes[data.designSettings.colorScheme as keyof typeof colorSchemes];
  const marginClass = getMarginClass(data.designSettings.margins, data.designSettings.customMarginPx);
  const marginStyle = getMarginStyle(data.designSettings.margins, data.designSettings.customMarginPx, data.designSettings.customHorizontalMarginPx, data.designSettings.customVerticalMarginPx);
  
  return (
    <div className={`bg-white text-gray-900 ${marginClass} font-sans`} style={marginStyle}>
      {/* Classic Header */}
      <div className="mb-8 pb-4 border-b-2 border-gray-900 flex items-start gap-6">
        {personalInfo.photo && (
          <img
            src={personalInfo.photo}
            alt={t('resume.summary')}
            className="w-24 h-24 rounded-full object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <p className="text-lg text-gray-700 mb-3">{personalInfo.jobTitle}</p>
          
          {/* Contact Info */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Mail className="w-3 h-3" />
            {personalInfo.email}
          </span>
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            {personalInfo.phone}
          </span>
          {personalInfo.city && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {personalInfo.city}
              {personalInfo.country && `, ${personalInfo.country}`}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="w-3 h-3" />
              {personalInfo.linkedin}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {personalInfo.website}
            </span>
          )}
          {personalInfo.instagram && (
            <span className="flex items-center gap-1">
              <Instagram className="w-3 h-3" />
              {personalInfo.instagram}
            </span>
          )}
          {personalInfo.youtube && (
            <span className="flex items-center gap-1">
              <Youtube className="w-3 h-3" />
              {personalInfo.youtube}
            </span>
          )}
        </div>
        </div>
      </div>

      {/* {t('resume.summary')} */}
      {summary && (
        <div className="mb-6 resume-section">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide keep-with-next">{t('resume.summary')}</h2>
          <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
        </div>
      )}

      {/* 工作經歷 */}
      {experiences.length > 0 && (
        <div className="mb-6 resume-section">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide keep-with-next">{t('resume.experience')}</h2>
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-5 no-break">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-base font-bold text-gray-900">{exp.jobTitle}</h3>
                <p className="text-sm text-gray-600">
                  {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                </p>
              </div>
              <div className="flex justify-between items-baseline mb-2">
                <p className="text-sm font-semibold text-gray-700">{exp.employer}</p>
                <p className="text-sm text-gray-600">
                  {exp.city}
                  {exp.country && `, ${exp.country}`}
                </p>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {exp.description}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 學歷 */}
      {education.length > 0 && (
        <div className="mb-6 resume-section">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide keep-with-next">{t('resume.education')}</h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-4 no-break">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-base font-bold text-gray-900">{edu.degree}</h3>
                <p className="text-sm text-gray-600">
                  {edu.startDate} - {edu.currentlyStudying ? 'Present' : edu.endDate}
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-700">{edu.school}</p>
              <p className="text-sm text-gray-600">
                {edu.city}
                {edu.country && `, ${edu.country}`}
              </p>
              {edu.description && (
                <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 技能 */}
      {skills.length > 0 && (
        <div className="mb-6 resume-section">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide keep-with-next">{t('resume.skills')}</h2>
          <div className="grid grid-cols-3 gap-2">
            {skills.map((skill) => (
              <div key={skill.id} className="text-sm text-gray-700 no-break">
                <span className="font-medium">{skill.name}</span>
                <span className="text-gray-600"> ({skill.level})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 語言能力 & 證照 */}
      <div className="grid grid-cols-2 gap-8">
        {languages.length > 0 && (
          <div className="resume-section">
            <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide keep-with-next">{t('resume.languages')}</h2>
            {languages.map((lang) => (
              <div key={lang.id} className="mb-1 text-sm no-break">
                <span className="font-medium text-gray-900">{lang.name}</span>
                <span className="text-gray-600"> - {lang.proficiency}</span>
              </div>
            ))}
          </div>
        )}

        {certifications.length > 0 && (
          <div className="resume-section">
            <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide keep-with-next">{t('resume.certifications')}</h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-2 text-sm no-break">
                <p className="font-medium text-gray-900">{cert.name}</p>
                <p className="text-gray-600">{cert.issuer} - {cert.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 興趣愛好 */}
      {hobbies && (
        <div className="mt-6 resume-section">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide keep-with-next">{t('resume.hobbies')}</h2>
          <p className="text-sm leading-relaxed text-gray-700">{hobbies}</p>
        </div>
      )}
    </div>
  );
};
