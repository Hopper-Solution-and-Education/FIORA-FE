'use client';

import { FormConfig } from '@/components/common/forms';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { MediaTypeEnum, SectionTypeEnum } from '@/features/landing/constants';
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';
import { JSX } from 'react';
import { useFormContext } from 'react-hook-form';
import { useUserReviewMediaFormConfig } from '../config';
import useBannerFormConfig from '../config/useBannerFormConfig';
import useBannerUploadImageConfig from '../config/useBannerUploadImageConfig';
import useFooterFormConfig from '../config/useFooterFormConfig';
import useFooterUploadImageConfig from '../config/useFooterUploadImageConfig';
import useHeaderFormConfig from '../config/useHeaderFormConfig';
import useHeaderUploadImageConfig from '../config/useHeaderUploadImageConfig';
import useKSPFormConfig from '../config/useKSPFormConfig';
import useKSPUploadImageConfig from '../config/useKSPUploadImageConfig';
import usePartnerFormConfig from '../config/usePartnerFormConfig';
import usePartnerUploadImageConfig from '../config/usePartnerUploadImageConfig';
import useReviewFormConfig from '../config/useReviewFormConfig';
import useReviewUploadImageConfig from '../config/useReviewUploadImageConfig';
import useSystemFormConfig from '../config/useSystemFormConfig';
import useSystemUploadImageConfig from '../config/useSystemUploadImageConfig';
import useVisionMissionFormConfig from '../config/useVisionMissionFormConfig';

interface MediaItemProps {
  mediaIndex: number;
  control: any;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  sectionType: SectionTypeEnum;
}

export default function MediaItem({
  mediaIndex,
  control,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  sectionType,
}: MediaItemProps) {
  const methods = useFormContext();

  const mediaPath = `medias.${mediaIndex}`;
  const mediaType = control._formValues.medias[mediaIndex].media_type;

  const bannerFormConfig = useBannerFormConfig(mediaPath);
  const headerFormConfig = useHeaderFormConfig(mediaPath);
  const footerFormConfig = useFooterFormConfig(mediaPath);
  const reviewFormConfig = useReviewFormConfig(mediaPath, mediaType);
  const visionMissionFormConfig = useVisionMissionFormConfig(mediaPath);
  const systemFormConfig = useSystemFormConfig(mediaPath);
  const partnerFormConfig = usePartnerFormConfig(mediaPath);
  const kspFormConfig = useKSPFormConfig(mediaPath);
  const bannerUploadImageConfig = useBannerUploadImageConfig(mediaPath);
  const headerUploadImageConfig = useHeaderUploadImageConfig(mediaPath);
  const footerUploadImageConfig = useFooterUploadImageConfig(mediaPath);
  const partnerUploadImageConfig = usePartnerUploadImageConfig(mediaPath);
  const systemUploadImageConfig = useSystemUploadImageConfig(mediaPath);
  const kspUploadImageConfig = useKSPUploadImageConfig(mediaPath);
  const reviewUploadImageConfig = useReviewUploadImageConfig(mediaPath);
  const userReviewMediaFormConfig = useUserReviewMediaFormConfig(mediaPath);
  let formConfig: JSX.Element[] = [];
  let uploadImageConfig: JSX.Element[] = [];

  switch (sectionType) {
    case SectionTypeEnum.BANNER:
      formConfig = bannerFormConfig;
      uploadImageConfig = bannerUploadImageConfig;
      break;
    case SectionTypeEnum.HEADER:
      formConfig = headerFormConfig;
      uploadImageConfig = headerUploadImageConfig;
      break;
    case SectionTypeEnum.FOOTER:
      formConfig = footerFormConfig;
      uploadImageConfig = footerUploadImageConfig;
      break;
    case SectionTypeEnum.REVIEW:
      formConfig = reviewFormConfig;
      uploadImageConfig = reviewUploadImageConfig;
      break;
    case SectionTypeEnum.VISION_MISSION:
      formConfig = visionMissionFormConfig;
      break;
    case SectionTypeEnum.SYSTEM:
      formConfig = systemFormConfig;
      uploadImageConfig = systemUploadImageConfig;
      break;
    case SectionTypeEnum.PARTNER_LOGO:
      formConfig = partnerFormConfig;
      uploadImageConfig = partnerUploadImageConfig;
      break;
    case SectionTypeEnum.KPS:
      formConfig = kspFormConfig;
      uploadImageConfig = kspUploadImageConfig;
      break;
    default:
      formConfig = [];
      uploadImageConfig = [];
      break;
  }

  const renderMediaPreview = () => {
    const embedCode = methods.watch(`${mediaPath}.embed_code`);

    return (
      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
        <div className="w-full relative" style={{ paddingBottom: '56.25%' /* 16:9 ratio */ }}>
          <div
            className="absolute inset-0 w-full h-full rounded-md"
            dangerouslySetInnerHTML={{
              __html: `<style>iframe { width: 100% !important; height: 100% !important; border: none; border-radius: 8px; }</style>${embedCode}`,
            }}
          />
        </div>
      </div>
    );
  };

  const renderSubmitButton = () => {
    return null;
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs md:text-sm">
              {mediaType}
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveUp}
            disabled={isFirst}
            className="h-7 w-7 p-0"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveDown}
            disabled={isLast}
            className="h-7 w-7 p-0"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
        <div className="space-y-3">
          {sectionType === SectionTypeEnum.VISION_MISSION && renderMediaPreview()}
          {sectionType === SectionTypeEnum.REVIEW &&
            mediaType === MediaTypeEnum.EMBEDDED &&
            renderMediaPreview()}
          <div className="mt-5">
            <FormConfig
              fields={uploadImageConfig}
              methods={methods}
              renderSubmitButton={renderSubmitButton}
            />
          </div>
        </div>
        <div className="space-y-3">
          <FormConfig
            fields={formConfig}
            methods={methods}
            renderSubmitButton={renderSubmitButton}
          />

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-center my-4">User Review</h3>
            {sectionType === SectionTypeEnum.REVIEW && (
              <FormConfig
                fields={userReviewMediaFormConfig}
                methods={methods}
                renderSubmitButton={renderSubmitButton}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
