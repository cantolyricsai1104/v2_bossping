import { ResumeData } from '@/types/resume';

export const sampleResumeData: ResumeData = {
  templateId: 'professional',
  personalInfo: {
    firstName: '小明',
    lastName: '王',
    jobTitle: '資深行銷經理',
    email: 'ming.wang@email.com',
    phone: '+886 912 345 678',
    city: '台北市',
    country: '台灣',
    linkedin: 'linkedin.com/in/mingwang',
    website: 'mingwang.com',
    photo: ''
  },
  summary: '以結果為導向的行銷專業人士，擁有超過 8 年制定和執行全方位行銷策略的經驗。曾透過創新的數位活動將品牌知名度提升 150% 並帶動營收成長。',
  experiences: [
    {
      id: '1',
      jobTitle: '資深行銷經理',
      employer: '科技巨頭解決方案公司',
      city: '台北市',
      country: '台灣',
      startDate: '2020-03',
      endDate: '',
      currentlyWorking: true,
      description: '• 領導 12 人的行銷團隊，負責數位、內容和社群媒體管道\n• 透過目標客戶行銷 (ABM) 活動，將合格潛在客戶增加 85%\n• 成功推出 3 項新產品，創造總計 450 萬美元的營收影響\n• 管理 200 萬美元的年度行銷預算，並將成本效益提升 23%'
    },
    {
      id: '2',
      jobTitle: '行銷經理',
      employer: '數位創新股份有限公司',
      city: '新北市',
      country: '台灣',
      startDate: '2017-06',
      endDate: '2020-02',
      currentlyWorking: false,
      description: '• 規劃並執行整合行銷活動，使網站流量增加 120%\n• 主導品牌重塑計畫，將品牌認知度提升 65%\n• 管理與 15 家以上外部代理商和供應商的合作關係\n• 導入行銷自動化系統，減少 40% 的手動作業'
    },
    {
      id: '3',
      jobTitle: '行銷專員',
      employer: '新創實驗室',
      city: '台中市',
      country: '台灣',
      startDate: '2015-01',
      endDate: '2017-05',
      currentlyWorking: false,
      description: '• 協調 5 個平台的社群媒體策略，使追蹤人數成長 200%\n• 製作引人入勝的內容，包括部落格文章、白皮書和案例研究\n• 籌辦 12 場成功的行銷活動，平均出席人數達 150 人以上\n• 分析活動績效指標並提供具體可行的見解'
    }
  ],
  education: [
    {
      id: '1',
      degree: '企業管理碩士 (MBA)',
      school: '國立台灣大學',
      city: '台北市',
      country: '台灣',
      startDate: '2013-09',
      endDate: '2015-06',
      currentlyStudying: false,
      description: '主修行銷與策略。GPA：3.85/4.0'
    },
    {
      id: '2',
      degree: '行銷學士',
      school: '國立政治大學',
      city: '台北市',
      country: '台灣',
      startDate: '2009-08',
      endDate: '2013-05',
      currentlyStudying: false,
      description: '以極優等成績畢業。每學期均獲選書卷獎。'
    }
  ],
  skills: [
    { id: '1', name: '數位行銷策略', level: 'expert' },
    { id: '2', name: '內容行銷', level: 'expert' },
    { id: '3', name: '行銷自動化', level: 'advanced' },
    { id: '4', name: 'SEO/SEM', level: 'advanced' },
    { id: '5', name: 'Google Analytics', level: 'advanced' },
    { id: '6', name: '社群媒體行銷', level: 'expert' },
    { id: '7', name: '品牌管理', level: 'advanced' },
    { id: '8', name: '專案管理', level: 'advanced' }
  ],
  languages: [
    { id: '1', name: '中文', proficiency: 'native' },
    { id: '2', name: '英文', proficiency: 'fluent' },
    { id: '3', name: '日文', proficiency: 'conversational' }
  ],
  certifications: [
    {
      id: '1',
      name: 'Google Analytics 認證專家',
      issuer: 'Google',
      date: '2023-08'
    },
    {
      id: '2',
      name: 'HubSpot 集客式行銷認證',
      issuer: 'HubSpot Academy',
      date: '2023-03'
    },
    {
      id: '3',
      name: '國際專案管理師 (PMP)',
      issuer: 'PMI',
      date: '2022-11'
    }
  ],
  hobbies: '攝影、馬拉松、非營利組織義務行銷顧問',
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
  pageFormat: 'multiple'
};