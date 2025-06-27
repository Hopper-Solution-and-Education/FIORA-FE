/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { Session, useSession } from 'next-auth/react';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

import Loading from '@/components/common/atoms/Loading';
import { FeatureFlags } from '@/shared/constants/featuresFlags';

interface ModuleAccessLayoutProps {
  featureFlag?: FeatureFlags;
  requiredRoles?: string[];
  children: ReactNode;
}

const ModuleAccessLayout = ({ featureFlag, requiredRoles, children }: ModuleAccessLayoutProps) => {
  const { data: session, status } = useSession() as { data: Session | null; status: string };

  const isFeatureEnabled = featureFlag ? useFeatureIsOn(featureFlag as any) : true;

  if (status === 'loading') {
    return <Loading />;
  }

  // Redirect to 404 if:
  // 1. User is not authenticated (session is null)
  // 2. Feature flag is provided but not enabled
  // 3. Required roles are provided, non-empty, and user's role is not included
  if (
    !session ||
    !isFeatureEnabled ||
    (requiredRoles &&
      requiredRoles.length > 0 &&
      !requiredRoles.includes(session.user.role.toUpperCase()))
  ) {
    notFound();
  }

  return <>{children}</>;
};

export default ModuleAccessLayout;
