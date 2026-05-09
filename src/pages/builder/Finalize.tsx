import { BuilderLayout } from '@/components/builder/BuilderLayout';
import { ResumePreview } from '@/components/builder/ResumePreview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useResume } from '@/contexts/ResumeContext';
import { templates, colorSchemes } from '@/data/templates';
import { useTranslation } from 'react-i18next';

const FinalizePage = () => {
  const { resumeData, updateDesignSettings, updateTemplateId } = useResume();
  const { designSettings, templateId } = resumeData;

  const currentTemplate = templates.find(t => t.id === templateId);

  return (
    <BuilderLayout>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Template Style</CardTitle>
              <CardDescription>
                Change your template design
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={templateId} onValueChange={updateTemplateId}>
                <div className="grid grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div key={template.id} className="relative">
                      <RadioGroupItem
                        value={template.id}
                        id={template.id}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={template.id}
                        className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer transition-all"
                      >
                        <div className="text-center">
                          <p className="font-semibold text-foreground">{template.name}</p>
                          <p className="text-xs text-muted-foreground">{template.category}</p>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Color Scheme */}
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
              <CardDescription>
                Choose an accent color for your resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={designSettings.colorScheme} onValueChange={(value) => updateDesignSettings({ colorScheme: value })}>
                <div className="grid grid-cols-4 gap-4">
                  {currentTemplate?.colorSchemes.map((color) => (
                    <div key={color} className="relative">
                      <RadioGroupItem
                        value={color}
                        id={`color-${color}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`color-${color}`}
                        className="flex flex-col items-center gap-2 rounded-lg border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer transition-all"
                      >
                        <div
                          className="h-12 w-12 rounded-full"
                          style={{ backgroundColor: colorSchemes[color as keyof typeof colorSchemes]?.primary || color }}
                        />
                        <p className="text-xs capitalize">{color}</p>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Live Preview</h3>
            <ResumePreview />
          </div>
        </div>
      </div>
    </BuilderLayout>
  );
};

export default FinalizePage;
