import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useResume } from '@/contexts/ResumeContext';

interface SaveCVDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SaveCVDialog = ({ open, onOpenChange }: SaveCVDialogProps) => {
  const { saveCurrentResume, resumeData } = useResume();
  const [name, setName] = useState(
    resumeData.personalInfo?.firstName 
      ? `${resumeData.personalInfo.firstName}'s Resume`
      : 'My Resume'
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveCurrentResume(name);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save CV:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Resume</DialogTitle>
          <DialogDescription>
            Give your resume a name to save it. If you are logged in, it will also be synced to your account.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter resume name"
            disabled={isSaving}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !name.trim()}>
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};