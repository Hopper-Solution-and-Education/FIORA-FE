'use client';

import { FormConfig } from '@/components/common/forms';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { MediaTypeEnum, SectionTypeEnum } from '@/features/landing/constants';
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';
import { JSX, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
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

/** System topics: label + color classes for outline badge */
const SYSTEM_TOPIC: Record<number, { label: string; className: string }> = {
  0: {
    label: 'Centre Icon',
    className: 'text-slate-600 border-slate-600 dark:text-slate-300 dark:border-slate-300',
  },
  1: { label: 'Education', className: 'text-emerald-600 border-emerald-600' },
  2: { label: 'Ecommerce', className: 'text-violet-600 border-violet-600' },
  3: { label: 'Finance', className: 'text-amber-600 border-amber-600' },
  4: { label: 'Insurance', className: 'text-rose-600 border-rose-600' },
};

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

  const mediaType: MediaTypeEnum = useWatch({
    control,
    name: `${mediaPath}.media_type`,
  });

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
  const reviewUploadImageConfig = useReviewUploadImageConfig(mediaPath, mediaType);
  const userReviewMediaFormConfig = useUserReviewMediaFormConfig(mediaPath);

  const { formConfig, uploadImageConfig } = useMemo((): {
    formConfig: JSX.Element[];
    uploadImageConfig: JSX.Element[];
  } => {
    switch (sectionType) {
      case SectionTypeEnum.BANNER:
        return { formConfig: bannerFormConfig, uploadImageConfig: bannerUploadImageConfig };
      case SectionTypeEnum.HEADER:
        return { formConfig: headerFormConfig, uploadImageConfig: headerUploadImageConfig };
      case SectionTypeEnum.FOOTER:
        return { formConfig: footerFormConfig, uploadImageConfig: footerUploadImageConfig };
      case SectionTypeEnum.REVIEW:
        return { formConfig: reviewFormConfig, uploadImageConfig: reviewUploadImageConfig };
      case SectionTypeEnum.VISION_MISSION:
        return { formConfig: visionMissionFormConfig, uploadImageConfig: [] };
      case SectionTypeEnum.SYSTEM:
        return { formConfig: systemFormConfig, uploadImageConfig: systemUploadImageConfig };
      case SectionTypeEnum.PARTNER_LOGO:
        return { formConfig: partnerFormConfig, uploadImageConfig: partnerUploadImageConfig };
      case SectionTypeEnum.KPS:
        return { formConfig: kspFormConfig, uploadImageConfig: kspUploadImageConfig };
      default:
        return { formConfig: [], uploadImageConfig: [] };
    }
  }, [
    sectionType,
    bannerFormConfig,
    headerFormConfig,
    footerFormConfig,
    reviewFormConfig,
    visionMissionFormConfig,
    systemFormConfig,
    partnerFormConfig,
    kspFormConfig,
    bannerUploadImageConfig,
    headerUploadImageConfig,
    footerUploadImageConfig,
    partnerUploadImageConfig,
    systemUploadImageConfig,
    kspUploadImageConfig,
    reviewUploadImageConfig,
  ]);

  const renderMediaPreview = () => {
    const embedCode = methods.watch(`${mediaPath}.embed_code`);
    if (!embedCode) return null;

    return (
      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
        <div className="w-full relative" style={{ paddingBottom: '56.25%' }}>
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

  const renderSubmitButton = () => null;

  const renderSystemTopicBadge = () => {
    const topic = SYSTEM_TOPIC[mediaIndex];
    if (!topic) return null;
    return (
      <Badge variant="outline" className={`text-xs md:text-sm ${topic.className}`}>
        {topic.label}
      </Badge>
    );
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs md:text-sm">
            {mediaType}
          </Badge>
          {sectionType === SectionTypeEnum.SYSTEM && renderSystemTopicBadge()}
        </div>

        <div className="flex items-center space-x-1">
          {sectionType !== SectionTypeEnum.SYSTEM && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={onMoveUp}
                disabled={isFirst}
                className="h-7 w-7 p-0"
                aria-label="Move up"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onMoveDown}
                disabled={isLast}
                className="h-7 w-7 p-0"
                aria-label="Move down"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      <CardContent className="p-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
        <div className="space-y-3">
          {(sectionType === SectionTypeEnum.VISION_MISSION ||
            (sectionType === SectionTypeEnum.REVIEW && mediaType === MediaTypeEnum.EMBEDDED)) &&
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

          {sectionType === SectionTypeEnum.REVIEW && (
            <>
              <h3 className="text-sm font-medium text-center my-4">User Review</h3>
              <FormConfig
                fields={userReviewMediaFormConfig}
                methods={methods}
                renderSubmitButton={renderSubmitButton}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
