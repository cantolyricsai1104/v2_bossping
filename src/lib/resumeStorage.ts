import { ResumeData, defaultResumeData, SavedResume, SavedResumesCollection } from '@/types/resume';

const STORAGE_KEY = 'resumeforge_resume_data';
const SAVED_CVS_KEY = 'resumeforge_saved_cvs';
const WORKING_RESUME_KEY = 'resumeforge_working_resume';
const AUTOSAVE_DELAY = 500;

let autosaveTimeout: NodeJS.Timeout | null = null;

export const saveResumeData = (data: ResumeData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save resume data:', error);
  }
};

export const loadResumeData = (): ResumeData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load resume data:', error);
  }
  return defaultResumeData;
};

export const autoSaveResumeData = (data: ResumeData): void => {
  if (autosaveTimeout) {
    clearTimeout(autosaveTimeout);
  }
  autosaveTimeout = setTimeout(() => {
    saveResumeData(data);
  }, AUTOSAVE_DELAY);
};

export const clearResumeData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const exportResumeAsJSON = (data: ResumeData): void => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `resume-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importResumeFromJSON = (file: File): Promise<ResumeData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// Multi-CV Management Functions

export const loadSavedCVsCollection = (): SavedResumesCollection => {
  try {
    const stored = localStorage.getItem(SAVED_CVS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load saved CVs:', error);
  }
  return { resumes: [], currentWorkingId: null };
};

const saveCVsCollection = (collection: SavedResumesCollection): void => {
  try {
    localStorage.setItem(SAVED_CVS_KEY, JSON.stringify(collection));
  } catch (error) {
    console.error('Failed to save CVs collection:', error);
  }
};

export const saveCVWithName = (name: string, data: ResumeData, id?: string): SavedResume => {
  const collection = loadSavedCVsCollection();
  const timestamp = new Date().toISOString();
  
  const savedResume: SavedResume = {
    id: id || crypto.randomUUID(),
    name,
    data,
    createdAt: id ? (collection.resumes.find(r => r.id === id)?.createdAt || timestamp) : timestamp,
    updatedAt: timestamp,
  };

  if (id) {
    // Update existing
    collection.resumes = collection.resumes.map(r => r.id === id ? savedResume : r);
  } else {
    // Add new
    collection.resumes.push(savedResume);
  }
  
  collection.currentWorkingId = savedResume.id;
  saveCVsCollection(collection);
  return savedResume;
};

export const loadAllSavedCVs = (): SavedResume[] => {
  const collection = loadSavedCVsCollection();
  return collection.resumes.sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
};

export const loadSavedCV = (id: string): SavedResume | null => {
  const collection = loadSavedCVsCollection();
  return collection.resumes.find(r => r.id === id) || null;
};

export const deleteSavedCV = (id: string): void => {
  const collection = loadSavedCVsCollection();
  collection.resumes = collection.resumes.filter(r => r.id !== id);
  if (collection.currentWorkingId === id) {
    collection.currentWorkingId = null;
  }
  saveCVsCollection(collection);
};

export const updateSavedCV = (id: string, name: string, data: ResumeData): void => {
  saveCVWithName(name, data, id);
};

export const duplicateSavedCV = (id: string): SavedResume | null => {
  const original = loadSavedCV(id);
  if (!original) return null;
  
  const newName = `${original.name} (Copy)`;
  return saveCVWithName(newName, original.data);
};

export const getCurrentWorkingId = (): string | null => {
  const collection = loadSavedCVsCollection();
  return collection.currentWorkingId;
};

export const setCurrentWorkingId = (id: string | null): void => {
  const collection = loadSavedCVsCollection();
  collection.currentWorkingId = id;
  saveCVsCollection(collection);
};
