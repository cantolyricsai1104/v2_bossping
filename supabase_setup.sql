-- ==============================================================================
-- 職途導航 (Smart Job Search Engine) - Supabase 初始化 SQL 腳本
-- 請將此腳本複製並貼上至 Supabase 的 SQL Editor 執行
-- ==============================================================================

-- 1. 建立經歷資料表 (Module 1: 碎碎念傾聽者)
CREATE TABLE public.experiences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    raw_content TEXT NOT NULL,          -- 使用者原始輸入（碎碎念）
    extracted_skills TEXT[] DEFAULT '{}', -- AI 萃取出的技能標籤 (例如：['社群運營', '跨部門溝通'])
    star_stories JSONB DEFAULT '[]',    -- AI 轉譯後的 STAR 原則故事陣列
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 建立職涯定位資料表 (Module 2: 職涯導航與市價評估)
CREATE TABLE public.career_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    recommended_roles JSONB DEFAULT '[]', -- AI 推薦的職位方向 (含匹配度與預估起薪)
    action_items JSONB DEFAULT '[]',      -- 技能升級行動清單 (含狀態：進行中/已完成)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 建立履歷與投遞紀錄資料表 (Module 3 & 4: JD 狙擊手 & 智慧投遞)
CREATE TABLE public.applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    target_company TEXT NOT NULL,       -- 目標公司名稱
    target_role TEXT NOT NULL,          -- 目標職缺名稱
    jd_content TEXT NOT NULL,           -- 職位描述 (JD) 內容
    tailored_resume TEXT,               -- AI 生成的定製化履歷 (Markdown 或 JSON 格式)
    cover_letter TEXT,                  -- AI 生成的專屬求職信
    status TEXT DEFAULT 'pending',      -- 狀態 (pending: 準備投遞, applied: 已投遞, interview: 面試邀約, rejected: 感謝信)
    applied_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 啟用 Row Level Security (RLS) 安全機制
-- ==============================================================================

ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 建立 RLS 政策 (Policies) - 只允許使用者讀寫自己的資料
-- ==============================================================================

-- Experiences Policies
CREATE POLICY "Users can view their own experiences" ON public.experiences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own experiences" ON public.experiences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own experiences" ON public.experiences
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own experiences" ON public.experiences
    FOR DELETE USING (auth.uid() = user_id);

-- Career Profiles Policies
CREATE POLICY "Users can view their own career profiles" ON public.career_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own career profiles" ON public.career_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own career profiles" ON public.career_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own career profiles" ON public.career_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- Applications Policies
CREATE POLICY "Users can view their own applications" ON public.applications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications" ON public.applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" ON public.applications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own applications" ON public.applications
    FOR DELETE USING (auth.uid() = user_id);

-- ==============================================================================
-- 4. 建立履歷資料表 (Resumes Builder)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own resumes" ON public.resumes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resumes" ON public.resumes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes" ON public.resumes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes" ON public.resumes
    FOR DELETE USING (auth.uid() = user_id);
