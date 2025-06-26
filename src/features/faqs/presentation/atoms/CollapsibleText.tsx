'use client';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TableCell } from '@/components/ui/table';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useCallback } from 'react';
import { ValidationError } from '../../domain/entities/models/faqs';
import { getCellClassName } from '../../utils/validationHelpers';
import { FAQ_IMPORT_CONSTANTS } from '../../constants/import';

interface CollapsibleTextProps {
  text: string | undefined;
  errors: ValidationError[];
  fieldName: string;
  uniqueId: string;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  limit?: number;
}

const CollapsibleText = ({
  text,
  errors,
  fieldName,
  uniqueId,
  isExpanded,
  onToggle,
  limit = FAQ_IMPORT_CONSTANTS.TEXT_TRUNCATE_LIMIT,
}: CollapsibleTextProps) => {
  const handleToggle = useCallback(() => {
    onToggle(uniqueId);
  }, [onToggle, uniqueId]);

  if (!text || text.length <= limit) {
    return <TableCell className={getCellClassName(errors, fieldName)}>{text || '-'}</TableCell>;
  }

  const truncatedText = text.slice(0, limit);

  return (
    <TableCell className={getCellClassName(errors, fieldName)}>
      <Collapsible open={isExpanded} className="w-full">
        <CollapsibleTrigger
          onClick={handleToggle}
          className="flex items-center w-full cursor-pointer text-left"
        >
          <span className="flex-1">{isExpanded ? text : `${truncatedText}...`}</span>
          {isExpanded ? (
            <ChevronUp className="h-3 w-3 ml-2 flex-shrink-0" />
          ) : (
            <ChevronDown className="h-3 w-3 ml-2 flex-shrink-0" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent>
          {/* Content is handled in the trigger for this case */}
        </CollapsibleContent>
      </Collapsible>
    </TableCell>
  );
};

export default CollapsibleText;
