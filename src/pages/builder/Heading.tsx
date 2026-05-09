import React from 'react';
import { useState } from 'react';


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useResume } from '@/contexts/ResumeContext';

import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';


const Heading = () => {
  const { t } = useTranslation();
  const { resumeData, updatePersonalInfo } = useResume();
  const { personalInfo } = resumeData;
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: t('builder.invalid_file'),
        description: t('builder.upload_image_file'),
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: t('builder.file_too_large'),
        description: t('builder.upload_less_than_5mb'),
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const objectUrl = URL.createObjectURL(file);
      updatePersonalInfo({ photo: objectUrl });
      
      toast({
        title: t('builder.photo_uploaded'),
        description: t('builder.photo_uploaded_desc'),
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: t('builder.upload_failed'),
        description: t('builder.upload_failed_desc'),
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    updatePersonalInfo({ photo: '' });
    toast({
      title: t('builder.photo_removed'),
      description: t('builder.photo_removed_desc'),
    });
  };

  return (
    
      <div className="grid grid-cols-1 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('builder.personal_info_title')}</CardTitle>
              <CardDescription>
                {t('builder.personal_info_subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Picture Upload */}
              <div className="space-y-2">
                <Label>{t('builder.photo_label')}</Label>
                {personalInfo.photo ? (
                  <div className="relative inline-block">
                    <img
                      src={personalInfo.photo}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-2 border-border"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 rounded-full w-8 h-8"
                      onClick={handleRemovePhoto}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <div className="w-32 h-32 rounded-full border-2 border-dashed border-border flex items-center justify-center hover:border-primary transition-colors">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t('builder.first_name_label')}</Label>
                  <Input
                    id="firstName"
                    value={personalInfo.firstName}
                    onChange={(e) => updatePersonalInfo({ firstName: e.target.value })}
                    placeholder={t('builder.first_name_example')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('builder.last_name_label')}</Label>
                  <Input
                    id="lastName"
                    value={personalInfo.lastName}
                    onChange={(e) => updatePersonalInfo({ lastName: e.target.value })}
                    placeholder={t('builder.last_name_example')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle">{t('builder.job_title_heading_label')}</Label>
                <Input
                  id="jobTitle"
                  value={personalInfo.jobTitle}
                  onChange={(e) => updatePersonalInfo({ jobTitle: e.target.value })}
                  placeholder={t('builder.job_title_heading_example')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('builder.email_label')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                    placeholder="ming@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('builder.phone_label')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                    placeholder="0912-345-678"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">{t('builder.city')}</Label>
                  <Input
                    id="city"
                    value={personalInfo.city}
                    onChange={(e) => updatePersonalInfo({ city: e.target.value })}
                    placeholder={t('builder.city_example')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">{t('builder.country')}</Label>
                  <Input
                    id="country"
                    value={personalInfo.country}
                    onChange={(e) => updatePersonalInfo({ country: e.target.value })}
                    placeholder={t('builder.country_example')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">{t('builder.linkedin_label')}</Label>
                <Input
                  id="linkedin"
                  value={personalInfo.linkedin || ''}
                  onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
                  placeholder="linkedin.com/in/wangdaming"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">{t('builder.website_label')}</Label>
                <Input
                  id="website"
                  value={personalInfo.website || ''}
                  onChange={(e) => updatePersonalInfo({ website: e.target.value })}
                  placeholder="wangdaming.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram">{t('builder.instagram_label')}</Label>
                  <Input
                    id="instagram"
                    value={personalInfo.instagram || ''}
                    onChange={(e) => updatePersonalInfo({ instagram: e.target.value })}
                    placeholder="@username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube">{t('builder.youtube_label')}</Label>
                  <Input
                    id="youtube"
                    value={personalInfo.youtube || ''}
                    onChange={(e) => updatePersonalInfo({ youtube: e.target.value })}
                    placeholder="youtube.com/@channel"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2 text-foreground">{t('builder.heading_tips_title')}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>{t('builder.heading_tip_1')}</li>
                <li>{t('builder.heading_tip_2')}</li>
                <li>{t('builder.heading_tip_3')}</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        
      </div>
    
  );
};

export default Heading;
