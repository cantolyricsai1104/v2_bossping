import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Heading from '@/pages/builder/Heading';
import Experience from '@/pages/builder/Experience';
import Education from '@/pages/builder/Education';
import Skills from '@/pages/builder/Skills';
import Summary from '@/pages/builder/Summary';
import Sections from '@/pages/builder/Sections';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from 'react-i18next';

export const CVForms = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full h-full flex flex-col bg-white">
      <Tabs defaultValue="heading" className="w-full flex-1 flex flex-col min-h-0">
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full h-auto p-1 bg-slate-100 flex-shrink-0">
          <TabsTrigger value="heading" className="py-2">基本資料</TabsTrigger>
          <TabsTrigger value="summary" className="py-2">個人簡介</TabsTrigger>
          <TabsTrigger value="experience" className="py-2">工作經歷</TabsTrigger>
          <TabsTrigger value="education" className="py-2">學歷</TabsTrigger>
          <TabsTrigger value="skills" className="py-2">技能</TabsTrigger>
          <TabsTrigger value="sections" className="py-2">其他</TabsTrigger>
        </TabsList>
        <ScrollArea className="flex-1 w-full bg-slate-50">
          <div className="p-4">
            <TabsContent value="heading" className="m-0"><Heading /></TabsContent>
            <TabsContent value="summary" className="m-0"><Summary /></TabsContent>
            <TabsContent value="experience" className="m-0"><Experience /></TabsContent>
            <TabsContent value="education" className="m-0"><Education /></TabsContent>
            <TabsContent value="skills" className="m-0"><Skills /></TabsContent>
            <TabsContent value="sections" className="m-0"><Sections /></TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
