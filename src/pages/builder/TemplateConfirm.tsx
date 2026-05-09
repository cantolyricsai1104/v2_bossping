import { useNavigate } from 'react-router-dom';
import { BuilderLayout } from '@/components/builder/BuilderLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useResume } from '@/contexts/ResumeContext';
import { templates } from '@/data/templates';
import { ResumePreview } from '@/components/builder/ResumePreview';
import { useTranslation } from 'react-i18next';

const TemplateConfirm = () => {
  const navigate = useNavigate();
  const { resumeData } = useResume();
  
  const selectedTemplate = templates.find(t => t.id === resumeData.templateId);

  const handleContinue = () => {
    navigate('/builder/heading');
  };

  const handleChangeTemplate = () => {
    navigate('/templates');
  };

  return (
    <BuilderLayout onNext={handleContinue} nextLabel="Start Building">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Template Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Selected</CardTitle>
              <CardDescription>
                You've chosen the <span className="font-semibold text-foreground">{selectedTemplate?.name}</span> template
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-foreground">Features</h3>
                <ul className="space-y-2">
                  {selectedTemplate?.features.map((feature) => (
                    <li key={feature} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 text-foreground">Perfect For</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedTemplate?.bestFor.join(', ')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-foreground">Available Colors</h3>
                <div className="flex gap-2">
                  {selectedTemplate?.colorSchemes.map((color) => (
                    <div
                      key={color}
                      className="h-8 w-8 rounded-full border-2 border-border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <Button 
                variant="outline" 
                onClick={handleChangeTemplate}
                className="w-full"
              >
                Change Template
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                <li className="text-sm">
                  <span className="font-semibold text-foreground">1.</span> Enter your personal information
                </li>
                <li className="text-sm">
                  <span className="font-semibold text-foreground">2.</span> Add your work experience
                </li>
                <li className="text-sm">
                  <span className="font-semibold text-foreground">3.</span> Include your education
                </li>
                <li className="text-sm">
                  <span className="font-semibold text-foreground">4.</span> List your skills
                </li>
                <li className="text-sm">
                  <span className="font-semibold text-foreground">5.</span> Customize and download
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-foreground">Preview</h3>
          <ResumePreview />
        </div>
      </div>
    </BuilderLayout>
  );
};

export default TemplateConfirm;
