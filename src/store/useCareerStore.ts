import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StarStory {
  title: string;
  content: string;
}

export interface JobMatch {
  title: string;
  match: number;
  desc: string;
}

export interface ActionItem {
  text: string;
  done: boolean;
  tag: string;
}

export interface MarketValue {
  min: number;
  max: number;
  seniority: string;
  suggestion: string;
}

export interface CareerAnalysis {
  marketValue: MarketValue;
  jobMatches: JobMatch[];
  actionItems: ActionItem[];
}

interface CareerState {
  skills: string[];
  starStories: StarStory[];
  analysis: CareerAnalysis | null;
  addSkills: (newSkills: string[]) => void;
  addStarStories: (newStories: StarStory[]) => void;
  setAnalysis: (analysis: CareerAnalysis) => void;
  clear: () => void;
}

export const useCareerStore = create<CareerState>()(
  persist(
    (set) => ({
      skills: [],
      starStories: [],
      analysis: null,
      addSkills: (newSkills) =>
        set((state) => ({
          skills: Array.from(new Set([...state.skills, ...newSkills])),
        })),
      addStarStories: (newStories) =>
        set((state) => {
          // 避免重複加入標題相同的故事
          const existingTitles = new Set(state.starStories.map((s) => s.title));
          const uniqueNewStories = newStories.filter((s) => !existingTitles.has(s.title));
          return {
            starStories: [...state.starStories, ...uniqueNewStories],
          };
        }),
      setAnalysis: (analysis) => set({ analysis }),
      clear: () => set({ skills: [], starStories: [], analysis: null }),
    }),
    {
      name: 'career-storage', // name of the item in the storage (must be unique)
    }
  )
);
