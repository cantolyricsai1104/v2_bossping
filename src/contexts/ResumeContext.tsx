import React, { createContext, useContext, useState, useEffect } from 'react';
import { ResumeData, defaultResumeData, PersonalInfo, Experience, Education, Skill, Language, Certification, CustomSection, DesignSettings, SavedResume } from '@/types/resume';
import { loadResumeData, autoSaveResumeData, getCurrentWorkingId, setCurrentWorkingId } from '@/lib/resumeStorage';
import { useAuth } from './AuthContext';
import { saveResumeToDatabase, loadResumeFromDatabase } from '@/lib/supabaseResume';

interface ResumeContextType {
  resumeData: ResumeData;
  currentSavedId: string | null;
  updateTargetJd: (jd: string) => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  updateSummary: (summary: string) => void;
  addExperience: (experience: Experience) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  updateExperiences: (experiences: Experience[]) => void;
  removeExperience: (id: string) => void;
  addEducation: (education: Education) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  updateEducations: (education: Education[]) => void;
  removeEducation: (id: string) => void;
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  updateSkills: (skills: Skill[]) => void;
  removeSkill: (id: string) => void;
  addLanguage: (language: Language) => void;
  updateLanguage: (id: string, language: Partial<Language>) => void;
  updateLanguages: (languages: Language[]) => void;
  removeLanguage: (id: string) => void;
  addCertification: (cert: Certification) => void;
  updateCertification: (id: string, cert: Partial<Certification>) => void;
  updateCertifications: (certifications: Certification[]) => void;
  removeCertification: (id: string) => void;
  addCustomSection: (section: CustomSection) => void;
  updateCustomSection: (id: string, section: Partial<CustomSection>) => void;
  removeCustomSection: (id: string) => void;
  updateHobbies: (hobbies: string) => void;
  updateDesignSettings: (settings: Partial<DesignSettings>) => void;
  updateTemplateId: (templateId: string) => void;
  updatePageFormat: (format: 'single' | 'multiple') => void;
  resetResume: () => void;
  saveCurrentResume: (name: string) => Promise<SavedResume>;
  loadSavedResume: (id: string) => Promise<void>;
  createNewResume: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [currentSavedId, setCurrentSavedId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loaded = loadResumeData();
    setResumeData(loaded);
    setCurrentSavedId(getCurrentWorkingId());
  }, []);

  useEffect(() => {
    autoSaveResumeData(resumeData);
    // Optionally auto-save to Supabase here if user is logged in
    // But usually it's better to explicitly save or debounce it.
  }, [resumeData]);

  const updateTargetJd = (jd: string) => {
    setResumeData(prev => ({ ...prev, targetJd: jd }));
  };

  const updatePersonalInfo = (info: Partial<PersonalInfo>) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info }
    }));
  };

  const updateSummary = (summary: string) => {
    setResumeData(prev => ({ ...prev, summary }));
  };

  const addExperience = (experience: Experience) => {
    setResumeData(prev => ({
      ...prev,
      experiences: [...prev.experiences, experience]
    }));
  };

  const updateExperience = (id: string, experience: Partial<Experience>) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp =>
        exp.id === id ? { ...exp, ...experience } : exp
      )
    }));
  };

  const updateExperiences = (experiences: Experience[]) => {
    setResumeData(prev => ({
      ...prev,
      experiences
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = (education: Education) => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, education]
    }));
  };

  const updateEducation = (id: string, education: Partial<Education>) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, ...education } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const updateEducations = (education: Education[]) => {
    setResumeData(prev => ({
      ...prev,
      education
    }));
  };

  const addSkill = (skill: Skill) => {
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, skill]
    }));
  };

  const updateSkill = (id: string, skill: Partial<Skill>) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(s =>
        s.id === id ? { ...s, ...skill } : s
      )
    }));
  };

  const updateSkills = (skills: Skill[]) => {
    setResumeData(prev => ({
      ...prev,
      skills
    }));
  };

  const removeSkill = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id)
    }));
  };

  const addLanguage = (language: Language) => {
    setResumeData(prev => ({
      ...prev,
      languages: [...prev.languages, language]
    }));
  };

  const updateLanguage = (id: string, language: Partial<Language>) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.map(lang =>
        lang.id === id ? { ...lang, ...language } : lang
      )
    }));
  };

  const updateLanguages = (languages: Language[]) => {
    setResumeData(prev => ({
      ...prev,
      languages
    }));
  };

  const removeLanguage = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.id !== id)
    }));
  };

  const addCertification = (cert: Certification) => {
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, cert]
    }));
  };

  const updateCertification = (id: string, cert: Partial<Certification>) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.map(c =>
        c.id === id ? { ...c, ...cert } : c
      )
    }));
  };

  const updateCertifications = (certifications: Certification[]) => {
    setResumeData(prev => ({
      ...prev,
      certifications
    }));
  };

  const removeCertification = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c.id !== id)
    }));
  };

  const addCustomSection = (section: CustomSection) => {
    setResumeData(prev => ({
      ...prev,
      customSections: [...prev.customSections, section]
    }));
  };

  const updateCustomSection = (id: string, section: Partial<CustomSection>) => {
    setResumeData(prev => ({
      ...prev,
      customSections: prev.customSections.map(s =>
        s.id === id ? { ...s, ...section } : s
      )
    }));
  };

  const removeCustomSection = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      customSections: prev.customSections.filter(s => s.id !== id)
    }));
  };

  const updateHobbies = (hobbies: string) => {
    setResumeData(prev => ({ ...prev, hobbies }));
  };

  const updateDesignSettings = (settings: Partial<DesignSettings>) => {
    setResumeData(prev => ({
      ...prev,
      designSettings: { ...prev.designSettings, ...settings }
    }));
  };

  const updateTemplateId = (templateId: string) => {
    setResumeData(prev => ({ ...prev, templateId }));
  };

  const updatePageFormat = (format: 'single' | 'multiple') => {
    setResumeData(prev => ({ ...prev, pageFormat: format }));
  };

  const resetResume = () => {
    setResumeData(defaultResumeData);
    setCurrentSavedId(null);
    setCurrentWorkingId(null);
  };

  const saveCurrentResume = async (name: string): Promise<SavedResume> => {
    // Save to localStorage
    const { saveCVWithName } = await import('@/lib/resumeStorage');
    const saved = saveCVWithName(name, resumeData, currentSavedId || undefined);
    setCurrentSavedId(saved.id);
    setCurrentWorkingId(saved.id);
    
    // Save to Supabase if logged in
    if (user) {
      try {
        await saveResumeToDatabase(name, resumeData, currentSavedId || undefined);
      } catch (error) {
        console.error('Failed to save to Supabase:', error);
      }
    }
    
    return saved;
  };

  const loadSavedResume = async (id: string): Promise<void> => {
    // Load from localStorage
    const { loadSavedCV, saveCVWithName } = await import('@/lib/resumeStorage');
    const saved = loadSavedCV(id);
    if (saved) {
      setResumeData(saved.data);
      setCurrentSavedId(id);
      setCurrentWorkingId(id);
    } else if (user) {
      // Try to load from Supabase if not found in localStorage
      try {
        const dbResume = await loadResumeFromDatabase(id);
        if (dbResume) {
          setResumeData(dbResume.data);
          setCurrentSavedId(dbResume.id);
          setCurrentWorkingId(dbResume.id);
          // Sync it back to local storage
          saveCVWithName(dbResume.name, dbResume.data, dbResume.id);
        }
      } catch (error) {
        console.error('Failed to load from Supabase:', error);
      }
    }
  };

  const createNewResume = (): void => {
    setResumeData(defaultResumeData);
    setCurrentSavedId(null);
    setCurrentWorkingId(null);
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        currentSavedId,
        updateTargetJd,
        updatePersonalInfo,
        updateSummary,
        addExperience,
        updateExperience,
        updateExperiences,
        removeExperience,
        addEducation,
        updateEducation,
        updateEducations,
        removeEducation,
        addSkill,
        updateSkill,
        updateSkills,
        removeSkill,
        addLanguage,
        updateLanguage,
        updateLanguages,
        removeLanguage,
        addCertification,
        updateCertification,
        updateCertifications,
        removeCertification,
        addCustomSection,
        updateCustomSection,
        removeCustomSection,
        updateHobbies,
        updateDesignSettings,
        updateTemplateId,
        updatePageFormat,
        resetResume,
        saveCurrentResume,
        loadSavedResume,
        createNewResume,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within ResumeProvider');
  }
  return context;
};
