'use client';

import { LucideIcon } from 'lucide-react';

interface FormHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({
  icon: Icon,
  title,
  description,
  iconColor = 'text-blue-600',
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 bg-${iconColor.split('-')[1]}-100 rounded-lg`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default FormHeader;
