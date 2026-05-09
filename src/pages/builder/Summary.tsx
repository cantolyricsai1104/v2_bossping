import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useResume } from '@/contexts/ResumeContext';
import { useCareerStore } from '@/store/useCareerStore';
import { callDeepSeekAPI } from '@/lib/deepseek';
import { Loader2, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SummaryPage = () => {
  const { t } = useTranslation();
  const { resumeData, updateSummary } = useResume();
  const { summary, targetJd } = resumeData;
  const { skills, starStories } = useCareerStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    try {
      const prompt = t('builder.summary_ai_prompt');
      const targetJdText = targetJd || t('builder.summary_ai_no_jd');
      
      const fullPrompt = `${prompt}

【目標職缺 JD】：
${targetJdText}

【使用者技能】：
${skills.join(', ')}

【使用者故事 (STAR)】：
${starStories.map(s => `[${s.title}]\n${s.content}`).join('\n\n')}

【目前簡介參考 (可優化或重新生成)】：
${summary}
`;
      const response = await callDeepSeekAPI([{ role: 'system', content: fullPrompt }]);
      updateSummary(response.trim());
    } catch (error) {
      console.error("Summary Generation Error:", error);
      alert(t('builder.summary_ai_error'));
    } finally {
      setIsGenerating(false);
    }
  };

  const wordCount = summary.split(/\s+/).filter(word => word.length > 0).length;
  const charCount = summary.length;

  return (
    
      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('builder.summary_title')}</CardTitle>
              <CardDescription>
                {t('builder.summary_subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="summary">{t('builder.your_summary')}</Label>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {wordCount}{t('builder.words_count')}{charCount}{t('builder.chars_count')}
                    </span>
                    <Button 
                      onClick={handleGenerateSummary} 
                      disabled={isGenerating}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isGenerating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 mr-2" />
                      )}
                      {summary ? t('builder.ai_optimize_summary') : t('builder.ai_generate_summary')}
                    </Button>
                  </div>
                </div>
                <Textarea
                  id="summary"
                  value={summary}
                  onChange={(e) => updateSummary(e.target.value)}
                  placeholder={t('builder.summary_placeholder')}
                  rows={8}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {t('builder.summary_length_tip')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('builder.example_summaries')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">{t('builder.for_senior')}</p>
                <p className="text-sm text-muted-foreground italic">
                  {t('builder.senior_example')}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">{t('builder.for_junior')}</p>
                <p className="text-sm text-muted-foreground italic">
                  {t('builder.junior_example')}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">{t('builder.for_career_changer')}</p>
                <p className="text-sm text-muted-foreground italic">
                  {t('builder.career_changer_example')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <h3 className="text-lg font-semibold mb-4 text-foreground">{t('builder.live_preview')}</h3>
            
          </div>
        </div>
      </div>
    
  );
};

export default SummaryPage;
