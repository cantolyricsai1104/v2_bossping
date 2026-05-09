export interface PersonalInfo {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  linkedin?: string;
  website?: string;
  instagram?: string;
  youtube?: string;
  photo?: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  employer: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  currentlyStudying: boolean;
  description?: string;
  gpa?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export interface DesignSettings {
  colorScheme: string;
  fontFamily: string;
  spacing: 'compact' | 'normal' | 'relaxed';
  margins: 'tight' | 'normal' | 'wide' | 'custom';
  customMarginPx?: number;
  customHorizontalMarginPx?: number;
  customVerticalMarginPx?: number;
}

export interface ResumeData {
  templateId: string;
  targetJd?: string;
  personalInfo: PersonalInfo;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  hobbies?: string;
  customSections: CustomSection[];
  designSettings: DesignSettings;
  pageFormat: 'single' | 'multiple';
}

export interface SavedResume {
  id: string;
  name: string;
  data: ResumeData;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}

export interface SavedResumesCollection {
  resumes: SavedResume[];
  currentWorkingId: string | null;
}

export const defaultResumeData: ResumeData = {
  templateId: 'professional',
  targetJd: '',
  personalInfo: {
    firstName: '',
    lastName: '',
    jobTitle: '',
    email: '',
    phone: '',
    city: '',
    country: '',
  },
  summary: '',
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  hobbies: '',
  customSections: [],
  designSettings: {
    colorScheme: 'blue',
    fontFamily: 'inter',
    spacing: 'normal',
    margins: 'normal',
    customMarginPx: undefined,
    customHorizontalMarginPx: undefined,
    customVerticalMarginPx: undefined,
  },
  pageFormat: 'multiple',
};
