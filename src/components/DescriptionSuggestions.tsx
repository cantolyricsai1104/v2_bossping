import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Plus, Star } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface SuggestionItem {
  text: string;
  expert?: boolean;
}

interface SuggestionData {
  [key: string]: {
    relatedTitles?: string[];
    suggestions: SuggestionItem[];
  };
}

interface DescriptionSuggestionsProps {
  type: 'experience' | 'education';
  onAddSuggestion: (text: string) => void;
}

const experienceSuggestions: SuggestionData = {
  // Education and Training
  teacher: {
    relatedTitles: ['4K Teacher', '6th Grade Teacher', '7th Grade Teacher', '8th Grade Teacher', 'Academic Lead Teacher'],
    suggestions: [
      { text: 'Developed strong relationships with students, parents, and colleagues by maintaining open lines of communication and fostering a supportive learning environment.', expert: true },
      { text: 'Managed classroom behavior effectively by establishing clear expectations, modeling appropriate conduct, and consistently enforcing established rules and consequences.', expert: true },
      { text: 'Implemented differentiated instruction strategies to meet diverse learning needs and improved student engagement by 30%.', expert: false },
      { text: 'Collaborated with interdisciplinary teams to develop integrated curriculum units that enhanced student understanding.', expert: false },
      { text: 'Utilized formative and summative assessments to track student progress and adjust teaching methods accordingly.', expert: false },
    ],
  },
  tutor: {
    relatedTitles: ['Private Tutor', 'Math Tutor', 'English Tutor', 'SAT Tutor', 'Academic Tutor'],
    suggestions: [
      { text: 'Provided one-on-one instruction to 15+ students, resulting in average grade improvement of 1.5 letter grades over one semester.', expert: true },
      { text: 'Developed customized learning plans tailored to individual student needs, learning styles, and academic goals.', expert: true },
      { text: 'Specialized in standardized test preparation (SAT/ACT), helping students achieve average score improvements of 150+ points.', expert: false },
      { text: 'Maintained detailed progress reports and communicated regularly with parents regarding student achievements and areas for improvement.', expert: false },
      { text: 'Created engaging supplementary materials and practice exercises to reinforce key concepts and improve retention.', expert: false },
    ],
  },
  librarian: {
    relatedTitles: ['School Librarian', 'Public Librarian', 'Digital Librarian', 'Reference Librarian'],
    suggestions: [
      { text: 'Managed library collection of 15,000+ items, including books, digital resources, and multimedia materials for diverse patron needs.', expert: true },
      { text: 'Developed and implemented information literacy programs that improved student research skills by 40%.', expert: true },
      { text: 'Coordinated with teachers to integrate library resources into curriculum, supporting 500+ students annually.', expert: false },
      { text: 'Organized author visits, reading programs, and cultural events that increased library engagement by 35%.', expert: false },
      { text: 'Maintained digital catalog system and trained patrons in effective database search strategies and resource evaluation.', expert: false },
    ],
  },
  professor: {
    relatedTitles: ['Associate Professor', 'Assistant Professor', 'Adjunct Professor', 'Lecturer', 'Distinguished Professor'],
    suggestions: [
      { text: 'Designed and delivered undergraduate and graduate courses to 200+ students annually, maintaining consistent student evaluation ratings above 4.5/5.0.', expert: true },
      { text: 'Published 12 peer-reviewed articles in top-tier journals and presented research at 8 international conferences.', expert: true },
      { text: 'Secured $500K+ in research funding through competitive grants from NSF and private foundations.', expert: false },
      { text: 'Mentored 15 graduate students through thesis completion, with 90% placement rate in academic or industry positions.', expert: false },
      { text: 'Served on university committees for curriculum development, faculty hiring, and strategic planning initiatives.', expert: false },
    ],
  },
  coach: {
    relatedTitles: ['Athletic Coach', 'Sports Coach', 'Team Coach', 'Head Coach', 'Assistant Coach'],
    suggestions: [
      { text: 'Led varsity team to 3 consecutive championship titles through strategic game planning and focused skill development programs.', expert: true },
      { text: 'Developed comprehensive training programs that improved team performance metrics by 45% over two seasons.', expert: true },
      { text: 'Mentored 50+ student-athletes in skill development, sportsmanship, and leadership, with 80% continuing to collegiate athletics.', expert: false },
      { text: 'Coordinated with athletic department on scheduling, budget management, and equipment procurement for team needs.', expert: false },
      { text: 'Implemented data-driven performance analysis to identify strengths, weaknesses, and opportunities for individual improvement.', expert: false },
    ],
  },
  
  // Technology and IT
  'software engineer': {
    relatedTitles: ['Senior Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Engineer', 'Mobile Developer'],
    suggestions: [
      { text: 'Designed and implemented scalable microservices architecture, reducing system latency by 40% and improving overall performance.', expert: true },
      { text: 'Led cross-functional team of 5 developers in delivering high-impact features, resulting in 25% increase in user engagement.', expert: true },
      { text: 'Optimized database queries and caching strategies, decreasing page load time by 60% and enhancing user experience.', expert: false },
      { text: 'Implemented comprehensive testing suite including unit, integration, and end-to-end tests, improving code coverage to 85%.', expert: false },
      { text: 'Mentored junior developers through code reviews and pair programming sessions, fostering team growth and knowledge sharing.', expert: false },
    ],
  },
  'software developer': {
    relatedTitles: ['Application Developer', 'Software Engineer', 'Developer', 'Programmer', 'Coding Specialist'],
    suggestions: [
      { text: 'Developed and maintained 15+ enterprise applications using Java, Python, and React, serving 10,000+ daily users.', expert: true },
      { text: 'Collaborated with product managers and designers to translate business requirements into technical specifications and working software.', expert: true },
      { text: 'Reduced application bugs by 50% through implementation of automated testing frameworks and CI/CD pipelines.', expert: false },
      { text: 'Participated in agile development processes including sprint planning, daily standups, and retrospectives.', expert: false },
      { text: 'Documented technical specifications, API integrations, and system architecture for knowledge sharing and onboarding.', expert: false },
    ],
  },
  'data scientist': {
    relatedTitles: ['Machine Learning Engineer', 'Data Analyst', 'AI Specialist', 'Research Scientist', 'Analytics Lead'],
    suggestions: [
      { text: 'Built predictive models using machine learning algorithms that improved customer retention by 30% and generated $2M in annual revenue.', expert: true },
      { text: 'Analyzed large datasets (10TB+) using Python, R, and SQL to extract actionable insights and drive data-informed decision making.', expert: true },
      { text: 'Developed automated data pipelines that reduced manual processing time by 80% and improved data accuracy.', expert: false },
      { text: 'Created interactive dashboards and visualizations using Tableau and Power BI for executive stakeholder presentations.', expert: false },
      { text: 'Collaborated with engineering teams to deploy machine learning models into production environments at scale.', expert: false },
    ],
  },
  'it manager': {
    relatedTitles: ['IT Director', 'Technology Manager', 'Systems Manager', 'Infrastructure Manager'],
    suggestions: [
      { text: 'Managed IT department of 12 professionals, overseeing infrastructure, security, and support operations for 500+ employees.', expert: true },
      { text: 'Reduced IT operational costs by 25% through strategic vendor negotiations and cloud migration initiatives.', expert: true },
      { text: 'Implemented cybersecurity protocols and disaster recovery plans, achieving 99.9% system uptime and zero security breaches.', expert: false },
      { text: 'Led digital transformation projects including ERP implementation, saving $300K annually in operational efficiency.', expert: false },
      { text: 'Established IT service management processes (ITIL) that improved help desk resolution time by 40%.', expert: false },
    ],
  },
  'web developer': {
    relatedTitles: ['Frontend Developer', 'Full Stack Developer', 'UI Developer', 'Web Designer'],
    suggestions: [
      { text: 'Developed responsive, mobile-first websites using HTML, CSS, JavaScript, and React, serving 50K+ monthly visitors.', expert: true },
      { text: 'Improved website performance scores by 45% through code optimization, lazy loading, and asset compression techniques.', expert: true },
      { text: 'Collaborated with UX designers to implement pixel-perfect designs and ensure consistent user experience across devices.', expert: false },
      { text: 'Integrated RESTful APIs and third-party services including payment gateways, analytics, and CRM systems.', expert: false },
      { text: 'Maintained website security through regular updates, vulnerability scanning, and implementation of SSL certificates.', expert: false },
    ],
  },
  'information security analyst': {
    relatedTitles: ['Cybersecurity Analyst', 'Security Engineer', 'Security Specialist', 'InfoSec Analyst'],
    suggestions: [
      { text: 'Monitored network security systems to detect and respond to 200+ potential threats monthly, preventing data breaches.', expert: true },
      { text: 'Conducted security assessments and penetration testing, identifying and remediating critical vulnerabilities across infrastructure.', expert: true },
      { text: 'Implemented security information and event management (SIEM) system, reducing incident response time by 60%.', expert: false },
      { text: 'Developed security policies and procedures compliant with ISO 27001, GDPR, and industry best practices.', expert: false },
      { text: 'Provided security awareness training to 300+ employees, reducing phishing susceptibility by 70%.', expert: false },
    ],
  },
  
  // Business and Finance
  accountant: {
    relatedTitles: ['Senior Accountant', 'Staff Accountant', 'Public Accountant', 'Tax Accountant', 'Cost Accountant'],
    suggestions: [
      { text: 'Managed monthly financial close process and prepared accurate financial statements for executive leadership review.', expert: true },
      { text: 'Conducted detailed variance analysis that identified $200K in cost-saving opportunities and improved budget accuracy by 15%.', expert: true },
      { text: 'Coordinated annual audit process with external auditors, ensuring 100% compliance with GAAP standards.', expert: false },
      { text: 'Reconciled 50+ accounts monthly, maintaining accuracy rate of 99.5% and resolving discrepancies within 48 hours.', expert: false },
      { text: 'Streamlined accounts payable/receivable processes, reducing processing time by 30% through automation.', expert: false },
    ],
  },
  'investment banker': {
    relatedTitles: ['Associate Investment Banker', 'Vice President Investment Banking', 'Analyst', 'Managing Director'],
    suggestions: [
      { text: 'Executed $500M+ in M&A transactions, providing strategic advisory to Fortune 500 clients throughout deal lifecycle.', expert: true },
      { text: 'Built comprehensive financial models and conducted valuation analysis using DCF, comparable companies, and precedent transactions.', expert: true },
      { text: 'Prepared detailed pitch books and presentations for client meetings and investor roadshows.', expert: false },
      { text: 'Performed extensive due diligence on target companies, analyzing financial statements and market positioning.', expert: false },
      { text: 'Collaborated with legal, accounting, and regulatory teams to ensure smooth transaction execution and closing.', expert: false },
    ],
  },
  'financial manager': {
    relatedTitles: ['Finance Manager', 'Financial Controller', 'Treasury Manager', 'Finance Director'],
    suggestions: [
      { text: 'Directed financial planning and analysis for $50M annual budget, improving forecast accuracy by 20%.', expert: true },
      { text: 'Led team of 8 finance professionals in monthly reporting, budgeting, and variance analysis activities.', expert: true },
      { text: 'Implemented financial controls and procedures that reduced accounting errors by 40% and improved audit outcomes.', expert: false },
      { text: 'Managed cash flow operations and banking relationships, optimizing working capital and reducing borrowing costs by $100K annually.', expert: false },
      { text: 'Presented financial performance to C-suite executives and board of directors with strategic recommendations.', expert: false },
    ],
  },
  'human resources manager': {
    relatedTitles: ['HR Manager', 'Human Capital Manager', 'People Operations Manager', 'Talent Manager'],
    suggestions: [
      { text: 'Led HR operations for 300+ employee organization, overseeing recruitment, onboarding, benefits, and employee relations.', expert: true },
      { text: 'Reduced employee turnover by 25% through implementation of retention programs and competitive compensation strategies.', expert: true },
      { text: 'Managed full-cycle recruitment process, hiring 50+ positions annually with 90% hiring manager satisfaction rate.', expert: false },
      { text: 'Developed and delivered training programs on leadership, diversity & inclusion, and compliance topics to all staff.', expert: false },
      { text: 'Ensured legal compliance with employment laws, maintaining zero violations during regulatory audits.', expert: false },
    ],
  },
  'real estate agent': {
    relatedTitles: ['Realtor', 'Real Estate Broker', 'Property Agent', 'Sales Agent'],
    suggestions: [
      { text: 'Closed $15M+ in residential real estate transactions annually, consistently ranking in top 10% of agents in region.', expert: true },
      { text: 'Built extensive client network through referrals and marketing, maintaining 95% client satisfaction rating.', expert: true },
      { text: 'Conducted market analysis and property valuations to advise clients on optimal pricing strategies.', expert: false },
      { text: 'Negotiated purchase agreements and coordinated with lenders, inspectors, and attorneys to ensure smooth closings.', expert: false },
      { text: 'Utilized digital marketing and social media to showcase properties, resulting in 30% faster sales than market average.', expert: false },
    ],
  },
  'executive assistant': {
    relatedTitles: ['Senior Executive Assistant', 'Administrative Assistant', 'Personal Assistant', 'Chief of Staff'],
    suggestions: [
      { text: 'Provided high-level administrative support to C-suite executive, managing complex calendar with 40+ weekly meetings and travel arrangements.', expert: true },
      { text: 'Coordinated board meetings and executive presentations, ensuring seamless logistics and professional materials preparation.', expert: true },
      { text: 'Managed confidential correspondence and documentation with discretion, maintaining strict confidentiality protocols.', expert: false },
      { text: 'Streamlined office operations and implemented organizational systems that improved executive productivity by 30%.', expert: false },
      { text: 'Served as liaison between executive team and internal/external stakeholders, facilitating clear communication.', expert: false },
    ],
  },
  
  // Project Management
  'project manager': {
    relatedTitles: ['Senior Project Manager', 'Program Manager', 'Scrum Master', 'Product Manager', 'Agile Coach'],
    suggestions: [
      { text: 'Led cross-functional teams of 10+ members to deliver complex projects on time and 15% under budget, exceeding stakeholder expectations.', expert: true },
      { text: 'Implemented Agile methodologies that improved team velocity by 35% and reduced time-to-market for key deliverables.', expert: true },
      { text: 'Managed project portfolio worth $2M+, ensuring alignment with strategic objectives and optimal resource allocation.', expert: false },
      { text: 'Developed risk mitigation strategies that prevented potential project delays and saved $150K in unplanned expenses.', expert: false },
      { text: 'Facilitated stakeholder communication through regular status reports, presentations, and collaborative planning sessions.', expert: false },
    ],
  },
  
  // Marketing
  'marketing manager': {
    relatedTitles: ['Digital Marketing Manager', 'Content Marketing Manager', 'Brand Manager', 'Growth Marketing Manager'],
    suggestions: [
      { text: 'Developed and executed integrated marketing campaigns that increased brand awareness by 45% and generated 200+ qualified leads monthly.', expert: true },
      { text: 'Managed marketing budget of $500K across digital, social, and traditional channels, achieving 150% ROI on campaigns.', expert: true },
      { text: 'Led team of 6 marketing professionals in creating compelling content that drove 60% increase in website traffic.', expert: false },
      { text: 'Analyzed market trends and customer insights to inform strategy, resulting in 30% improvement in customer acquisition costs.', expert: false },
      { text: 'Collaborated with sales team to align messaging and optimize lead nurturing processes, improving conversion rates by 25%.', expert: false },
    ],
  },
  
  // Arts, Design, and Media
  'art director': {
    relatedTitles: ['Creative Director', 'Senior Art Director', 'Design Director', 'Visual Director'],
    suggestions: [
      { text: 'Led creative vision for 20+ multi-channel campaigns, resulting in 50% increase in brand engagement and multiple industry awards.', expert: true },
      { text: 'Managed team of 8 designers and collaborated with copywriters to develop compelling visual narratives for Fortune 500 clients.', expert: true },
      { text: 'Oversaw all aspects of visual design from concept to execution, ensuring brand consistency across print, digital, and video media.', expert: false },
      { text: 'Presented creative concepts to clients and stakeholders, securing approval for 95% of pitched campaigns.', expert: false },
      { text: 'Mentored junior designers in creative techniques, industry best practices, and professional development.', expert: false },
    ],
  },
  'graphic designer': {
    relatedTitles: ['Visual Designer', 'UI/UX Designer', 'Brand Designer', 'Digital Designer'],
    suggestions: [
      { text: 'Created engaging visual designs for digital and print media, contributing to 40% increase in marketing campaign effectiveness.', expert: true },
      { text: 'Designed brand identities, logos, and style guides for 15+ clients, ensuring consistent visual communication.', expert: true },
      { text: 'Collaborated with marketing team to produce social media graphics, website assets, and advertising materials.', expert: false },
      { text: 'Utilized Adobe Creative Suite and Figma to deliver high-quality design work within tight deadlines.', expert: false },
      { text: 'Incorporated user feedback and design principles to continuously improve visual appeal and usability.', expert: false },
    ],
  },
  architect: {
    relatedTitles: ['Project Architect', 'Senior Architect', 'Design Architect', 'Landscape Architect'],
    suggestions: [
      { text: 'Designed 30+ commercial and residential projects valued at $100M+, balancing aesthetics, functionality, and building codes.', expert: true },
      { text: 'Led architectural design teams through all project phases from conceptual design to construction administration.', expert: true },
      { text: 'Utilized AutoCAD, Revit, and SketchUp to create detailed architectural drawings and 3D visualizations.', expert: false },
      { text: 'Coordinated with engineers, contractors, and clients to ensure projects met technical specifications and client vision.', expert: false },
      { text: 'Achieved LEED certification for 5 sustainable building projects, incorporating energy-efficient and eco-friendly design principles.', expert: false },
    ],
  },
  journalist: {
    relatedTitles: ['Reporter', 'News Correspondent', 'Investigative Journalist', 'Editor', 'Columnist'],
    suggestions: [
      { text: 'Researched, wrote, and published 200+ news articles and feature stories, reaching audience of 500K+ readers monthly.', expert: true },
      { text: 'Conducted in-depth interviews with government officials, community leaders, and subject matter experts for investigative pieces.', expert: true },
      { text: 'Broke multiple exclusive stories that influenced public discourse and resulted in policy changes.', expert: false },
      { text: 'Managed tight deadlines in fast-paced newsroom environment while maintaining journalistic integrity and accuracy.', expert: false },
      { text: 'Utilized social media and digital platforms to engage audience and expand story reach by 70%.', expert: false },
    ],
  },
  musician: {
    relatedTitles: ['Professional Musician', 'Session Musician', 'Music Teacher', 'Composer', 'Performer'],
    suggestions: [
      { text: 'Performed 100+ live concerts and recording sessions across diverse venues and musical genres.', expert: true },
      { text: 'Composed original music for films, commercials, and theatrical productions, generating $50K+ in licensing revenue.', expert: true },
      { text: 'Collaborated with artists, producers, and music directors to create high-quality recordings and performances.', expert: false },
      { text: 'Taught music lessons to 25+ students, developing customized curriculum that improved technical proficiency.', expert: false },
      { text: 'Maintained active social media presence and released music on streaming platforms, building fanbase of 10K+ followers.', expert: false },
    ],
  },
  
  // Healthcare and Medicine
  doctor: {
    relatedTitles: ['Physician', 'Medical Doctor', 'Primary Care Physician', 'Specialist', 'Attending Physician'],
    suggestions: [
      { text: 'Provided comprehensive medical care to 2,000+ patients annually, diagnosing and treating diverse medical conditions.', expert: true },
      { text: 'Achieved 98% patient satisfaction rating through compassionate care, clear communication, and evidence-based treatment plans.', expert: true },
      { text: 'Collaborated with multidisciplinary healthcare team including nurses, specialists, and therapists for coordinated patient care.', expert: false },
      { text: 'Maintained detailed electronic medical records and ensured HIPAA compliance and patient confidentiality.', expert: false },
      { text: 'Participated in continuing medical education and stayed current with latest medical research and treatment protocols.', expert: false },
    ],
  },
  nurse: {
    relatedTitles: ['Registered Nurse', 'RN', 'Staff Nurse', 'Charge Nurse', 'Clinical Nurse'],
    suggestions: [
      { text: 'Delivered compassionate patient care in fast-paced hospital setting, managing caseload of 6-8 patients per shift.', expert: true },
      { text: 'Administered medications, monitored vital signs, and collaborated with physicians to implement treatment plans.', expert: true },
      { text: 'Educated patients and families on post-discharge care, medication management, and preventive health measures.', expert: false },
      { text: 'Responded to medical emergencies and provided critical life-saving interventions in urgent situations.', expert: false },
      { text: 'Maintained accurate patient documentation and ensured compliance with hospital policies and regulatory standards.', expert: false },
    ],
  },
  veterinarian: {
    relatedTitles: ['Veterinary Doctor', 'DVM', 'Animal Doctor', 'Veterinary Surgeon'],
    suggestions: [
      { text: 'Provided comprehensive veterinary care to 1,500+ animals annually, including examinations, diagnostics, and surgical procedures.', expert: true },
      { text: 'Performed 200+ surgical procedures including spay/neuter, orthopedic, and emergency operations with 99% success rate.', expert: true },
      { text: 'Diagnosed and treated variety of animal health conditions using advanced diagnostic equipment and laboratory analysis.', expert: false },
      { text: 'Communicated treatment options and preventive care recommendations to pet owners with compassion and clarity.', expert: false },
      { text: 'Managed veterinary clinic operations including staff supervision, inventory management, and client relationship development.', expert: false },
    ],
  },
  surgeon: {
    relatedTitles: ['General Surgeon', 'Orthopedic Surgeon', 'Cardiothoracic Surgeon', 'Neurosurgeon'],
    suggestions: [
      { text: 'Performed 300+ complex surgical procedures with 98% success rate and minimal complication rates.', expert: true },
      { text: 'Specialized in minimally invasive surgical techniques that reduced patient recovery time by 40%.', expert: true },
      { text: 'Led surgical team in operating room, coordinating with anesthesiologists, nurses, and surgical technicians.', expert: false },
      { text: 'Provided pre-operative consultations and post-operative care, ensuring optimal patient outcomes and recovery.', expert: false },
      { text: 'Participated in medical research and clinical trials, contributing to advancement of surgical techniques.', expert: false },
    ],
  },
  pharmacist: {
    relatedTitles: ['Clinical Pharmacist', 'Retail Pharmacist', 'Hospital Pharmacist', 'Staff Pharmacist'],
    suggestions: [
      { text: 'Dispensed 500+ prescriptions daily while counseling patients on medication usage, side effects, and drug interactions.', expert: true },
      { text: 'Collaborated with physicians to optimize medication therapy and identify cost-effective alternatives, saving patients $100K+ annually.', expert: true },
      { text: 'Conducted medication therapy management consultations for patients with chronic conditions like diabetes and hypertension.', expert: false },
      { text: 'Maintained accurate inventory control and ensured compliance with DEA regulations for controlled substances.', expert: false },
      { text: 'Provided immunization services and health screenings, promoting preventive healthcare in the community.', expert: false },
    ],
  },
  
  // Construction and Trades
  electrician: {
    relatedTitles: ['Licensed Electrician', 'Master Electrician', 'Journeyman Electrician', 'Industrial Electrician'],
    suggestions: [
      { text: 'Installed, maintained, and repaired electrical systems for 100+ residential and commercial properties annually.', expert: true },
      { text: 'Diagnosed electrical issues and implemented solutions that improved energy efficiency by 25% and reduced power consumption costs.', expert: true },
      { text: 'Ensured all work complied with National Electrical Code (NEC) and local building regulations.', expert: false },
      { text: 'Read and interpreted blueprints, schematics, and technical diagrams for complex electrical installations.', expert: false },
      { text: 'Mentored 3 apprentice electricians, providing hands-on training in safety procedures and technical skills.', expert: false },
    ],
  },
  plumber: {
    relatedTitles: ['Licensed Plumber', 'Master Plumber', 'Journeyman Plumber', 'Pipefitter'],
    suggestions: [
      { text: 'Installed and repaired plumbing systems for 150+ residential and commercial projects, ensuring code compliance and quality workmanship.', expert: true },
      { text: 'Diagnosed complex plumbing issues and provided cost-effective solutions, achieving 95% first-time fix rate.', expert: true },
      { text: 'Performed water heater installations, pipe repairs, drain cleaning, and fixture replacements.', expert: false },
      { text: 'Maintained detailed work records and provided accurate cost estimates for materials and labor.', expert: false },
      { text: 'Responded to emergency service calls 24/7, resolving critical plumbing failures within 2-hour average response time.', expert: false },
    ],
  },
  welder: {
    relatedTitles: ['Certified Welder', 'MIG Welder', 'TIG Welder', 'Pipe Welder', 'Structural Welder'],
    suggestions: [
      { text: 'Performed precision welding on structural steel, pipelines, and industrial equipment using MIG, TIG, and stick welding techniques.', expert: true },
      { text: 'Maintained 99% weld quality rating through adherence to specifications and rigorous quality control procedures.', expert: true },
      { text: 'Read and interpreted blueprints, welding symbols, and technical drawings for fabrication projects.', expert: false },
      { text: 'Operated welding equipment and conducted routine maintenance to ensure optimal performance and safety.', expert: false },
      { text: 'Obtained AWS welding certifications and maintained compliance with OSHA safety regulations.', expert: false },
    ],
  },
  carpenter: {
    relatedTitles: ['Finish Carpenter', 'Rough Carpenter', 'Master Carpenter', 'Framing Carpenter'],
    suggestions: [
      { text: 'Constructed and installed structural frameworks, cabinets, and custom woodwork for 80+ residential and commercial projects.', expert: true },
      { text: 'Interpreted architectural drawings and specifications to execute precise carpentry work meeting client expectations.', expert: true },
      { text: 'Utilized power tools, hand tools, and measuring instruments to cut, shape, and assemble wood materials.', expert: false },
      { text: 'Collaborated with contractors, electricians, and plumbers to coordinate construction schedules and workflows.', expert: false },
      { text: 'Ensured all work met building codes, safety standards, and quality requirements.', expert: false },
    ],
  },
  'construction manager': {
    relatedTitles: ['Project Manager Construction', 'Site Manager', 'Construction Supervisor', 'General Contractor'],
    suggestions: [
      { text: 'Managed $10M+ construction projects from planning through completion, delivering on time and within budget.', expert: true },
      { text: 'Supervised teams of 30+ workers including subcontractors, ensuring quality work and adherence to safety protocols.', expert: true },
      { text: 'Coordinated project schedules, procurement, and resource allocation to optimize efficiency and minimize delays.', expert: false },
      { text: 'Conducted site inspections and quality control checks, maintaining compliance with building codes and regulations.', expert: false },
      { text: 'Negotiated contracts with vendors and subcontractors, reducing project costs by 15% through strategic partnerships.', expert: false },
    ],
  },
  
  // Legal and Public Service
  lawyer: {
    relatedTitles: ['Attorney', 'Legal Counsel', 'Associate Attorney', 'Partner', 'Trial Lawyer'],
    suggestions: [
      { text: 'Represented 100+ clients in civil litigation, achieving favorable outcomes in 85% of cases through strategic legal arguments.', expert: true },
      { text: 'Drafted and negotiated complex contracts, agreements, and legal documents ensuring client interests and regulatory compliance.', expert: true },
      { text: 'Conducted legal research and analysis on case law, statutes, and regulations to support litigation strategy.', expert: false },
      { text: 'Provided legal counsel to corporate clients on mergers, acquisitions, employment law, and intellectual property matters.', expert: false },
      { text: 'Appeared in court proceedings, depositions, and mediations, effectively advocating for client positions.', expert: false },
    ],
  },
  judge: {
    relatedTitles: ['Magistrate Judge', 'Circuit Judge', 'District Judge', 'Administrative Law Judge'],
    suggestions: [
      { text: 'Presided over 500+ civil and criminal cases, rendering fair and impartial judgments based on law and evidence.', expert: true },
      { text: 'Managed courtroom proceedings with efficiency and decorum, ensuring due process for all parties.', expert: true },
      { text: 'Conducted legal research and analysis to issue well-reasoned written opinions on complex legal matters.', expert: false },
      { text: 'Mediated settlement conferences and alternative dispute resolution processes, resolving 60% of cases pre-trial.', expert: false },
      { text: 'Mentored law clerks and contributed to legal education through speaking engagements and publications.', expert: false },
    ],
  },
  'police officer': {
    relatedTitles: ['Law Enforcement Officer', 'Detective', 'Patrol Officer', 'Sergeant', 'Deputy Sheriff'],
    suggestions: [
      { text: 'Patrolled assigned areas and responded to 1,000+ emergency calls annually, ensuring public safety and law enforcement.', expert: true },
      { text: 'Investigated crimes, collected evidence, and conducted interviews leading to 90% case clearance rate.', expert: true },
      { text: 'Enforced traffic laws and conducted DUI checkpoints, reducing traffic violations by 30% in patrol district.', expert: false },
      { text: 'Testified in court proceedings and prepared detailed incident reports for criminal prosecution.', expert: false },
      { text: 'Engaged in community policing initiatives, building positive relationships with residents and local organizations.', expert: false },
    ],
  },
  soldier: {
    relatedTitles: ['Military Personnel', 'Service Member', 'Enlisted Soldier', 'NCO', 'Specialist'],
    suggestions: [
      { text: 'Served with distinction in military operations, demonstrating leadership, discipline, and commitment to mission success.', expert: true },
      { text: 'Led squad of 10 soldiers in training exercises and operational deployments, ensuring readiness and cohesion.', expert: true },
      { text: 'Operated and maintained specialized military equipment and weapons systems with expert proficiency.', expert: false },
      { text: 'Completed advanced military training including leadership courses, tactical operations, and specialized certifications.', expert: false },
      { text: 'Received commendations and awards for exceptional performance, dedication, and service to country.', expert: false },
    ],
  },
  firefighter: {
    relatedTitles: ['Fire Fighter', 'Paramedic Firefighter', 'Fire Captain', 'Fire Lieutenant'],
    suggestions: [
      { text: 'Responded to 500+ emergency calls including fires, medical emergencies, and hazardous material incidents with rapid response.', expert: true },
      { text: 'Performed fire suppression, search and rescue operations, and emergency medical care, saving lives and protecting property.', expert: true },
      { text: 'Maintained fire apparatus and equipment in constant state of readiness through daily inspections and maintenance.', expert: false },
      { text: 'Conducted fire prevention inspections and public education programs, reducing fire incidents in community by 20%.', expert: false },
      { text: 'Trained in hazmat response, technical rescue, and emergency medical services with multiple certifications.', expert: false },
    ],
  },
  
  // Service and Hospitality
  chef: {
    relatedTitles: ['Executive Chef', 'Sous Chef', 'Head Chef', 'Pastry Chef', 'Line Cook'],
    suggestions: [
      { text: 'Created innovative menus and dishes that increased restaurant revenue by 30% and earned 4.5-star ratings.', expert: true },
      { text: 'Managed kitchen operations for high-volume restaurant serving 300+ covers daily, maintaining food quality and presentation standards.', expert: true },
      { text: 'Led culinary team of 12 cooks, providing training on cooking techniques, plating, and food safety protocols.', expert: false },
      { text: 'Controlled food costs through efficient inventory management and vendor negotiations, reducing waste by 25%.', expert: false },
      { text: 'Ensured compliance with health and safety regulations, achieving perfect scores on health inspections.', expert: false },
    ],
  },
  'waiter': {
    relatedTitles: ['Server', 'Waitress', 'Food Server', 'Restaurant Server', 'Banquet Server'],
    suggestions: [
      { text: 'Provided exceptional customer service to 50+ diners per shift, maintaining 95% customer satisfaction rating.', expert: true },
      { text: 'Increased sales by 20% through effective menu recommendations and upselling techniques.', expert: true },
      { text: 'Managed multiple tables simultaneously in fast-paced environment, ensuring timely food delivery and attentive service.', expert: false },
      { text: 'Processed payments accurately and handled cash transactions, maintaining zero discrepancies in cash handling.', expert: false },
      { text: 'Collaborated with kitchen staff and management to resolve customer concerns and ensure positive dining experience.', expert: false },
    ],
  },
  waitress: {
    relatedTitles: ['Server', 'Waiter', 'Food Server', 'Restaurant Server', 'Banquet Server'],
    suggestions: [
      { text: 'Delivered outstanding customer service in high-volume restaurant, serving 50+ customers per shift with efficiency and warmth.', expert: true },
      { text: 'Built loyal customer base through personalized service and attention to detail, resulting in 30% increase in repeat customers.', expert: true },
      { text: 'Memorized menu items, ingredients, and preparation methods to provide knowledgeable recommendations to guests.', expert: false },
      { text: 'Handled customer complaints professionally and resolved issues to ensure satisfaction and positive reviews.', expert: false },
      { text: 'Maintained clean and organized dining area, adhering to health and safety standards.', expert: false },
    ],
  },
  receptionist: {
    relatedTitles: ['Front Desk Receptionist', 'Office Receptionist', 'Medical Receptionist', 'Hotel Receptionist'],
    suggestions: [
      { text: 'Greeted and assisted 100+ visitors daily, providing professional first impression and excellent customer service.', expert: true },
      { text: 'Managed multi-line phone system, scheduling appointments, and directing calls to appropriate departments with 98% accuracy.', expert: true },
      { text: 'Maintained organized reception area and handled administrative tasks including mail distribution and supply ordering.', expert: false },
      { text: 'Coordinated meeting room bookings and visitor logistics, ensuring smooth office operations.', expert: false },
      { text: 'Processed incoming and outgoing correspondence, packages, and deliveries efficiently and securely.', expert: false },
    ],
  },
  'flight attendant': {
    relatedTitles: ['Cabin Crew', 'Air Hostess', 'Flight Crew', 'Senior Flight Attendant'],
    suggestions: [
      { text: 'Ensured safety and comfort of 150+ passengers per flight, delivering exceptional in-flight service across domestic and international routes.', expert: true },
      { text: 'Conducted pre-flight safety demonstrations and responded to in-flight emergencies with calm professionalism.', expert: true },
      { text: 'Provided food and beverage service, handled special passenger requests, and resolved customer concerns efficiently.', expert: false },
      { text: 'Maintained aircraft cabin cleanliness and checked safety equipment to ensure FAA compliance.', expert: false },
      { text: 'Achieved 98% customer satisfaction rating through attentive service and professional demeanor.', expert: false },
    ],
  },
  'taxi driver': {
    relatedTitles: ['Cab Driver', 'Rideshare Driver', 'Chauffeur', 'Uber Driver', 'Lyft Driver'],
    suggestions: [
      { text: 'Provided safe and reliable transportation services to 50+ passengers daily across metropolitan area.', expert: true },
      { text: 'Maintained 4.9-star driver rating through excellent customer service, punctuality, and clean vehicle maintenance.', expert: true },
      { text: 'Navigated city streets efficiently using GPS and local knowledge to provide fastest routes and optimal experiences.', expert: false },
      { text: 'Managed daily earnings, fuel costs, and vehicle maintenance to optimize profitability and service quality.', expert: false },
      { text: 'Ensured passenger safety through defensive driving techniques and adherence to all traffic regulations.', expert: false },
    ],
  },
}

const educationSuggestions: SuggestionData = {
  'computer science': {
    relatedTitles: ['Software Engineering', 'Information Technology', 'Computer Engineering', 'Data Science'],
    suggestions: [
      { text: 'Completed coursework in algorithms, data structures, machine learning, and distributed systems with 3.9 GPA.', expert: true },
      { text: 'Developed full-stack capstone project using React, Node.js, and MongoDB, serving 500+ active users.', expert: true },
      { text: 'Conducted research on neural networks under Dr. Smith, resulting in publication at IEEE conference.', expert: false },
      { text: 'Served as Teaching Assistant for Introduction to Programming, mentoring 50+ students in Java and Python.', expert: false },
      { text: 'Awarded Dean\'s List all semesters and received Excellence in Computer Science scholarship ($10,000).', expert: false },
    ],
  },
  'business administration': {
    relatedTitles: ['Business Management', 'Finance', 'Marketing', 'International Business', 'Entrepreneurship'],
    suggestions: [
      { text: 'Graduated with honors (3.8 GPA) with concentration in Strategic Management and Organizational Leadership.', expert: true },
      { text: 'Led student consulting team that provided strategic recommendations to 3 local businesses, generating $50K in new revenue.', expert: true },
      { text: 'Completed coursework in financial analysis, marketing strategy, operations management, and business analytics.', expert: false },
      { text: 'Served as President of Business Student Association, organizing networking events for 200+ students and industry professionals.', expert: false },
      { text: 'Awarded Outstanding Student Leader scholarship and recognized for academic excellence in finance courses.', expert: false },
    ],
  },
  'psychology': {
    relatedTitles: ['Clinical Psychology', 'Counseling Psychology', 'Educational Psychology', 'Cognitive Science'],
    suggestions: [
      { text: 'Graduated magna cum laude (3.85 GPA) with thesis on cognitive behavioral interventions for anxiety disorders.', expert: true },
      { text: 'Completed 300+ hours of clinical practicum experience at university counseling center, working with diverse client populations.', expert: true },
      { text: 'Conducted independent research on social cognition, presenting findings at regional psychology conference.', expert: false },
      { text: 'Relevant coursework: abnormal psychology, developmental psychology, psychological assessment, and research methods.', expert: false },
      { text: 'Member of Psi Chi International Honor Society and recipient of Psychology Department Excellence Award.', expert: false },
    ],
  },
  'engineering': {
    relatedTitles: ['Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Chemical Engineering'],
    suggestions: [
      { text: 'Achieved 3.7 GPA with focus on thermodynamics, fluid mechanics, and advanced materials engineering.', expert: true },
      { text: 'Led senior design project developing sustainable energy solution, winning 1st place at Engineering Expo.', expert: true },
      { text: 'Completed internship at Fortune 500 company, contributing to product development team and improving efficiency by 20%.', expert: false },
      { text: 'Published research paper on innovative manufacturing processes in peer-reviewed engineering journal.', expert: false },
      { text: 'Active member of Society of Professional Engineers, participating in professional development workshops and competitions.', expert: false },
    ],
  },
};

export const DescriptionSuggestions = ({ type, onAddSuggestion }: DescriptionSuggestionsProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const suggestions = type === 'experience' ? experienceSuggestions : educationSuggestions;
  const placeholderText = type === 'experience' ? 'Search by job title for pre-written examples' : 'Search by degree or major for pre-written examples';
  const headerTitle = type === 'experience' ? 'Job Description Suggestions' : 'Education Description Suggestions';

  const filteredCategories = Object.keys(suggestions).filter(key =>
    key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentSuggestions = selectedCategory ? suggestions[selectedCategory] : null;

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedCategory(null);
  };

  const handleSearch = () => {
    if (searchQuery && filteredCategories.length > 0) {
      setSelectedCategory(filteredCategories[0]);
    }
  };

  const handleAddSuggestion = (text: string) => {
    const currentDescription = '';
    const bulletPoint = text.startsWith('•') ? text : `• ${text}`;
    const newDescription = currentDescription 
      ? `${currentDescription}\n${bulletPoint}` 
      : bulletPoint;
    onAddSuggestion(newDescription);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{headerTitle}</CardTitle>
        <CardDescription>
          Search for your {type === 'experience' ? 'job title' : 'degree/major'} to get professional description examples you can add with one click
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={placeholderText}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button onClick={handleSearch} size="icon" className="shrink-0">
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {searchQuery && filteredCategories.length > 0 && !selectedCategory && (
          <div>
            <p className="text-sm font-medium mb-2 text-foreground">Related {type === 'experience' ? 'Job Titles' : 'Programs'}:</p>
            <div className="flex flex-wrap gap-2">
              {filteredCategories.slice(0, 5).map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="text-xs"
                >
                  <Search className="w-3 h-3 mr-1" />
                  {category}
                </Button>
              ))}
            </div>
          </div>
        )}

        {currentSuggestions && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                Showing results for <span className="font-semibold capitalize">{selectedCategory}</span>
              </p>
              <Button variant="ghost" size="sm" onClick={handleClearSearch}>
                Clear
              </Button>
            </div>

            {currentSuggestions.relatedTitles && (
              <div>
                <p className="text-xs font-medium mb-2 text-muted-foreground">
                  Related {type === 'experience' ? 'Job Titles' : 'Programs'}:
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentSuggestions.relatedTitles.map((title) => (
                    <Badge key={title} variant="secondary" className="text-xs">
                      {title}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {currentSuggestions.suggestions.map((suggestion, index) => (
                  <Card key={index} className="border bg-card hover:bg-accent/5 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Button
                          size="icon"
                          variant="outline"
                          className="shrink-0 h-8 w-8 rounded-full"
                          onClick={() => handleAddSuggestion(suggestion.text)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <div className="flex-1 min-w-0">
                          {suggestion.expert && (
                            <div className="flex items-center gap-1 mb-1">
                              <Star className="w-3 h-3 text-primary fill-primary" />
                              <span className="text-xs font-semibold text-primary">Expert Recommended</span>
                            </div>
                          )}
                          <p className="text-sm text-foreground leading-relaxed">
                            {suggestion.text}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {searchQuery && filteredCategories.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No results found for "{searchQuery}"</p>
            <p className="text-xs mt-1">Try searching for: {type === 'experience' ? 'teacher, software engineer, project manager' : 'computer science, business, engineering'}</p>
          </div>
        )}

        {!searchQuery && !selectedCategory && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">Search to get started</p>
            <p className="text-xs mt-1">
              Try: {type === 'experience' 
                ? '"teacher", "software engineer", "project manager"' 
                : '"computer science", "business administration", "psychology"'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
