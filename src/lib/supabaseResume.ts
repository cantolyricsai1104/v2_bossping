import { supabase } from "./supabase";
import { ResumeData, SavedResume } from "@/types/resume";

export const saveResumeToDatabase = async (
  name: string,
  data: ResumeData,
  id?: string
): Promise<SavedResume> => {
  const user = (await supabase.auth.getUser()).data.user;
  
  if (!user) {
    throw new Error("User must be logged in to save resumes");
  }

  if (id) {
    // Update existing resume
    const { data: updated, error } = await supabase
      .from("resumes")
      .update({
        name,
        data: data as any,
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: updated.id,
      name: updated.name,
      data: updated.data as unknown as ResumeData,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at,
    };
  } else {
    // Create new resume
    const { data: created, error } = await supabase
      .from("resumes")
      .insert([{
        user_id: user.id,
        name,
        data: data as any,
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      id: created.id,
      name: created.name,
      data: created.data as unknown as ResumeData,
      createdAt: created.created_at,
      updatedAt: created.updated_at,
    };
  }
};

export const updateResumeNameInDatabase = async (
  id: string,
  name: string
): Promise<void> => {
  const user = (await supabase.auth.getUser()).data.user;
  
  if (!user) {
    throw new Error("User must be logged in to update resumes");
  }

  const { error } = await supabase
    .from("resumes")
    .update({ name })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
};

export const loadAllResumesFromDatabase = async (): Promise<SavedResume[]> => {
  const user = (await supabase.auth.getUser()).data.user;
  
  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return data.map((resume) => ({
    id: resume.id,
    name: resume.name,
    data: resume.data as unknown as ResumeData,
    createdAt: resume.created_at,
    updatedAt: resume.updated_at,
  }));
};

export const loadResumeFromDatabase = async (
  id: string
): Promise<SavedResume | null> => {
  const user = (await supabase.auth.getUser()).data.user;
  
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) return null;

  return {
    id: data.id,
    name: data.name,
    data: data.data as unknown as ResumeData,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

export const deleteResumeFromDatabase = async (id: string): Promise<void> => {
  const user = (await supabase.auth.getUser()).data.user;
  
  if (!user) {
    throw new Error("User must be logged in to delete resumes");
  }

  const { error } = await supabase
    .from("resumes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
};

export const duplicateResumeInDatabase = async (
  id: string
): Promise<SavedResume> => {
  const user = (await supabase.auth.getUser()).data.user;
  
  if (!user) {
    throw new Error("User must be logged in to duplicate resumes");
  }

  const original = await loadResumeFromDatabase(id);
  
  if (!original) {
    throw new Error("Resume not found");
  }

  return saveResumeToDatabase(`${original.name} (Copy)`, original.data);
};
