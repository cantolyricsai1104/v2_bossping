import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Globe, Instagram, Youtube } from 'lucide-react';
import { getMarginClass, getMarginStyle } from '@/lib/marginUtils';
import { useTranslation } from 'react-i18next';

interface ExecutiveTemplateProps {
  data: ResumeData;
}

export const ExecutiveTemplate = ({ data }: ExecutiveTemplateProps) => {
  const { t } = useTranslation();
  const { personalInfo, summary, experiences, education, skills, certifications, hobbies } = data;
  const marginClass = getMarginClass(data.designSettings.margins, data.designSettings.customMarginPx);
  const marginStyle = getMarginStyle(data.designSettings.margins, data.designSettings.customMarginPx, data.designSettings.customHorizontalMarginPx, data.designSettings.customVerticalMarginPx);
  
  return (
    <div className={`bg-white text-gray-900 ${marginClass} font-serif`} style={marginStyle}>
      {/* Elegant Header */}
      <div className="text-center mb-8 pb-6 border-b-2 border-gray-800">
        <h1 className="text-5xl font-bold text-gray-900 mb-3 tracking-wide">
          {personalInfo.firstName.toUpperCase()} {personalInfo.lastName.toUpperCase()}
        </h1>
        <p className="text-xl text-gray-700 font-light tracking-wider mb-4">{personalInfo.jobTitle}</p>
        
        {/* Contact Info - Centered */}
        <div className="flex justify-center flex-wrap gap-6 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Mail className="w-3 h-3" />
            {personalInfo.email}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            {personalInfo.phone}
          </span>
          <span>•</span>
          {(personalInfo.city || personalInfo.country) && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {personalInfo.city}
              {personalInfo.city && personalInfo.country && ', '}
              {personalInfo.country}
            </span>
          )}
          {personalInfo.linkedin && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Linkedin className="w-3 h-3" />
                {personalInfo.linkedin}
              </span>
            </>
          )}
          {personalInfo.website && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {personalInfo.website}
              </span>
            </>
          )}
          {personalInfo.instagram && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Instagram className="w-3 h-3" />
                {personalInfo.instagram}
              </span>
            </>
          )}
          {personalInfo.youtube && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Youtube className="w-3 h-3" />
                {personalInfo.youtube}
              </span>
            </>
          )}
        </div>
      </div>

      {/* {t('resume.summary')} */}
      {summary && (
        <div className="mb-8 resume-section">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center tracking-wide border-b border-gray-300 pb-2 keep-with-next">
            EXECUTIVE {t('resume.summary')}
          </h2>
          <p className="text-base leading-relaxed text-gray-700 text-center max-w-4xl mx-auto font-sans">
            {summary}
          </p>
        </div>
      )}

      {/* 工作經歷 */}
      {experiences.length > 0 && (
        <div className="mb-8 resume-section">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center tracking-wide border-b border-gray-300 pb-2 keep-with-next">
            PROFESSIONAL {t('resume.experience')}
          </h2>
          {experiences.map((exp, index) => (
            <div key={exp.id} className={`mb-8 no-break ${index !== experiences.length - 1 ? 'pb-6' : ''}`}>
              <div className="mb-3">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-xl font-bold text-gray-900">{exp.jobTitle}</h3>
                  <p className="text-sm text-gray-600 font-sans">
                    {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                  </p>
                </div>
                <div className="flex justify-between items-baseline">
                  <p className="text-lg text-gray-700 italic">{exp.employer}</p>
                  {(exp.city || exp.country) && (
                    <p className="text-sm text-gray-600 font-sans">
                      {exp.city}
                      {exp.city && exp.country && ', '}
                      {exp.country}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-base text-gray-700 whitespace-pre-line leading-relaxed font-sans pl-4">
                {exp.description}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-12">
        {/* 學歷 */}
        {education.length > 0 && (
          <div className="resume-section">
            <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-wide border-b border-gray-300 pb-2 keep-with-next">{t('resume.education')}</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-4 no-break">
                <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                <p className="text-md text-gray-700 italic">{edu.school}</p>
                <p className="text-sm text-gray-600 font-sans">
                  {edu.startDate} - {edu.currentlyStudying ? 'Present' : edu.endDate}
                </p>
                {edu.description && (
                  <p className="text-sm text-gray-600 mt-2 font-sans whitespace-pre-line">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 技能 & 證照 */}
        <div>
          {skills.length > 0 && (
            <div className="mb-6 resume-section">
              <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-wide border-b border-gray-300 pb-2 keep-with-next">
                CORE COMPETENCIES
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {skills.map((skill) => (
                  <div key={skill.id} className="text-sm text-gray-700 font-sans no-break">
                    • {skill.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div className="resume-section">
              <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-wide border-b border-gray-300 pb-2 keep-with-next">{t('resume.certifications')}</h2>
              {certifications.map((cert) => (
                <div key={cert.id} className="mb-3 text-sm font-sans no-break">
                  <p className="font-medium text-gray-900">{cert.name}</p>
                  <p className="text-gray-600">{cert.issuer}, {cert.date}</p>
                </div>
              ))}
            </div>
          )}

          {/* 興趣愛好 */}
          {hobbies && (
            <div className="mt-6 resume-section">
              <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-wide border-b border-gray-300 pb-2 keep-with-next">{t('resume.hobbies')}</h2>
              <p className="text-sm leading-relaxed font-sans text-gray-700">{hobbies}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
