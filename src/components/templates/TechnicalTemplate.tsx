import { ResumeData } from '@/types/resume';
import { colorSchemes } from '@/data/templates';
import { useTranslation } from 'react-i18next';

interface TechnicalTemplateProps {
  data: ResumeData;
}

export const TechnicalTemplate = ({ data }: TechnicalTemplateProps) => {
  const { t } = useTranslation();
  const colors = colorSchemes[data.designSettings.colorScheme as keyof typeof colorSchemes];
  const { hobbies } = data;
  
  return (
    // Explicit A4 dimensions, NO OUTER PADDING/MARGINS. Base font size further increased.
    <div className={`bg-white w-full font-mono text-gray-900`} style={{ width: '210mm', minHeight: '297mm', fontSize: '0.74rem', lineHeight: 'normal' }}> {/* Increased base font size to 0.74rem, set global line-height */}
      <div className="grid grid-cols-12 h-full">
        {/* Left Sidebar - Removed p-3, using manual pt/pb on content. Using flex to distribute content */}
        <div className="col-span-4 flex flex-col justify-between" style={{ backgroundColor: colors.primary }}>
          <div className="text-white flex-grow px-4"> {/* Added horizontal padding here, flex-grow */}
            <div className="mb-8 pt-4"> {/* Increased mb and pt for more top spacing, added px-4 */}
              <div className="w-24 h-24 rounded-full bg-white/20 mb-4 flex items-center justify-center text-3xl font-bold"> {/* Increased size of initials block */}
                {data.personalInfo.firstName[0]}{data.personalInfo.lastName[0]}
              </div>
            </div>

            {/* Contact - Increased spacing and font sizes */}
            <div className="mb-8"> {/* Increased mb */}
              <h3 className="text-base font-bold mb-3 opacity-70">[CONTACT]</h3> {/* Increased font size and mb */}
              <div className="space-y-2.5 text-sm leading-tight"> {/* Increased space-y, font size, tighter line-height */}
                {data.personalInfo.email && <div className="break-all">{data.personalInfo.email}</div>}
                {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
                {data.personalInfo.city && (
                  <div>
                    {data.personalInfo.city}
                    {data.personalInfo.country && `, ${data.personalInfo.country}`}
                  </div>
                )}
                {data.personalInfo.linkedin && <div className="break-all">{data.personalInfo.linkedin}</div>}
                {data.personalInfo.website && <div className="break-all">{data.personalInfo.website}</div>}
                {data.personalInfo.instagram && <div className="break-all">{data.personalInfo.instagram}</div>}
                {data.personalInfo.youtube && <div className="break-all">{data.personalInfo.youtube}</div>}
              </div>
            </div>

            {/* 技能 - Increased spacing and font sizes */}
            {data.skills.length > 0 && (
              <div className="mb-8"> {/* Increased mb */}
                <h3 className="text-base font-bold mb-3 opacity-70">[{t('resume.skills')}]</h3> {/* Increased font size and mb */}
                <div className="space-y-3"> {/* Increased space-y */}
                  {data.skills.map((skill, idx) => (
                    <div key={idx} className="text-sm"> {/* Increased font size */}
                      <div className="mb-1">{skill.name}</div>
                      <div className="h-2 bg-white/20 rounded"> {/* Increased height of skill bar */}
                        <div 
                          className="h-2 bg-white rounded" // Increased height of skill bar
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 語言能力 - Increased spacing and font sizes */}
            {data.languages && data.languages.length > 0 && (
              <div className="pb-4"> {/* Increased pb for bottom spacing */}
                <h3 className="text-base font-bold mb-3 opacity-70">[{t('resume.languages')}]</h3> {/* Increased font size and mb */}
                <div className="space-y-2 text-sm leading-tight"> {/* Increased space-y, font size, tighter line-height */}
                  {data.languages.map((lang, idx) => (
                    <div key={idx}>{lang.name} - {lang.proficiency}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content - Removed p-3, using manual pt/pb/px on content. Using flex to distribute content */}
        <div className="col-span-8 flex flex-col px-4"> {/* Removed p-3, added px-4 here */}
          <div className="mb-10 pt-4"> {/* Increased mb and pt for more top spacing */}
            <h1 className="text-4xl font-bold mb-2" style={{ color: colors.primary }}> {/* Increased font size and mb */}
              {data.personalInfo.firstName} {data.personalInfo.lastName}
            </h1>
            <p className="text-xl text-gray-600 mb-6">&lt;{data.personalInfo.jobTitle}/&gt;</p> {/* Increased font size and mb */}
            {data.summary && (
              <p className="text-base text-gray-700 leading-normal">{data.summary}</p>
            )}
          </div>

          {/* 工作經歷 - Increased spacing and font sizes */}
          {data.experiences.length > 0 && (
            <div className="mb-10 resume-section"> {/* Increased mb */}
              <h2 className="text-lg font-bold mb-4 keep-with-next" style={{ color: colors.primary }}> {/* Increased font size and mb */}
                {'//'} 工作經歷
              </h2>
              {data.experiences.map((exp, idx) => (
                <div key={idx} className="mb-7 pl-4 border-l-2 no-break" style={{ borderColor: colors.secondary }}> {/* Increased mb */}
                  <div className="flex justify-between items-start mb-2"> {/* Increased mb */}
                    <div>
                      <h3 className="font-bold text-base">{exp.jobTitle}</h3> {/* Increased font size */}
                      <p className="text-sm text-gray-600">{exp.employer}</p> {/* Increased font size */}
                    </div>
                    <span className="text-sm text-gray-500"> {/* Increased font size */}
                      {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-normal whitespace-pre-line">{exp.description}</p> {/* Increased font size */}
                </div>
              ))}
            </div>
          )}

          {/* 學歷 - Increased spacing and font sizes */}
          {data.education.length > 0 && (
            <div className="mb-10 resume-section"> {/* Increased mb */}
              <h2 className="text-lg font-bold mb-4 keep-with-next" style={{ color: colors.primary }}> {/* Increased font size and mb */}
                {'//'} 學歷
              </h2>
              {data.education.map((edu, idx) => (
                <div key={idx} className="mb-4 pl-4 border-l-2 no-break" style={{ borderColor: colors.secondary }}>
                  <h3 className="font-bold text-sm">{edu.degree}</h3>
                  <p className="text-sm text-gray-600">{edu.school} | {edu.endDate}</p>
                </div>
              ))}
            </div>
          )}

          {/* Hobbies */}
          {hobbies && typeof hobbies === 'string' && hobbies.length > 0 && (
            <div className="mb-10 resume-section">
              <h2 className="text-lg font-bold mb-4 keep-with-next" style={{ color: colors.primary }}>
                {'//'} INTERESTS
              </h2>
              <div className="text-sm text-gray-700">{hobbies}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};