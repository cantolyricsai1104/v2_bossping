import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ArrowLeft, Save, Check, ChevronDown } from 'lucide-react';
import { SaveCVDialog } from '@/components/SaveCVDialog';

const builderSteps = [
  { path: '/builder/template', label: 'Template', step: 1 },
  { path: '/builder/heading', label: 'Personal Info', step: 2 },
  { path: '/builder/experience', label: 'Experience', step: 3 },
  { path: '/builder/education', label: 'Education', step: 4 },
  { path: '/builder/skills', label: 'Skills', step: 5 },
  { path: '/builder/summary', label: 'Summary', step: 6 },
  { path: '/builder/sections', label: 'Additional', step: 7 },
  { path: '/builder/finalize', label: 'Finalize', step: 8 },
];

interface BuilderLayoutProps {
  children: ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  backLabel?: string;
  hideNavigation?: boolean;
}

export const BuilderLayout = ({
  children,
  onNext,
  onBack,
  nextLabel = 'Save & Continue',
  backLabel = 'Back',
  hideNavigation = false,
}: BuilderLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  const currentStepData = builderSteps.find(s => s.path === location.pathname);
  const currentStep = currentStepData?.step || 1;
  const progress = (currentStep / builderSteps.length) * 100;

  useEffect(() => {
    setIsSaved(false);
    const timer = setTimeout(() => setIsSaved(true), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      const prevStep = builderSteps.find(s => s.step === currentStep - 1);
      if (prevStep) {
        navigate(prevStep.path);
      } else {
        navigate('/templates');
      }
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      const nextStep = builderSteps.find(s => s.step === currentStep + 1);
      if (nextStep) {
        navigate(nextStep.path);
      } else {
        navigate('/preview');
      }
    }
  };

  const handleExit = () => {
    setShowExitDialog(true);
  };

  const confirmExit = () => {
    navigate('/');
  };

  const handleStepClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExit}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Exit
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <span className="hidden md:inline">Step {currentStep}:</span> {currentStepData?.label}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {builderSteps.map((step) => (
                    <DropdownMenuItem
                      key={step.path}
                      onClick={() => handleStepClick(step.path)}
                      className={location.pathname === step.path ? 'bg-accent' : ''}
                    >
                      <span className="mr-2 text-muted-foreground">{step.step}.</span>
                      {step.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-sm">
                {isSaved ? (
                  <>
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Saved</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 text-muted-foreground animate-pulse" />
                    <span className="text-muted-foreground">Saving...</span>
                  </>
                )}
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowSaveDialog(true)}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Save CV</span>
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="pb-2">
            <Progress value={progress} className="h-1" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Navigation Footer */}
      {!hideNavigation && (
        <footer className="sticky bottom-0 bg-background border-t border-border shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handleBack}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {backLabel}
              </Button>
              <Button
                onClick={handleNext}
                className="gap-2"
              >
                {nextLabel}
              </Button>
            </div>
          </div>
        </footer>
      )}

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to exit?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress has been automatically saved. You can return to continue editing anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmExit}>Exit Builder</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Save CV Dialog */}
      <SaveCVDialog open={showSaveDialog} onOpenChange={setShowSaveDialog} />
    </div>
  );
};
