'use client';

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useMemo, useState, useCallback } from 'react';
import { FaqsRowValidated, ValidationError } from '../../domain/entities/models/faqs';
import { filterRecords, getCellClassName } from '../../utils/validationHelpers';
import { CollapsibleText, EmptyState, StatusBadge, ValidationTableHeader } from '../atoms';
import { AlertCircle, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface ValidationResultsProps {
  records: FaqsRowValidated[];
  filter: 'all' | 'valid' | 'invalid' | 'duplicate';
}

const COLUMN_CONFIG = [
  { key: 'status', label: 'Status', width: 'min-w-[80px]' },
  { key: 'category', label: 'Category', width: 'min-w-[150px]' },
  { key: 'type', label: 'Type', width: 'min-w-[100px]' },
  { key: 'title', label: 'Title', width: 'min-w-[200px]' },
  { key: 'description', label: 'Description', width: 'min-w-[300px]' },
  { key: 'content', label: 'Content', width: 'min-w-[300px]' },
  { key: 'url', label: 'Url', width: 'min-w-[200px]' },
  { key: 'typeOfUrl', label: 'Type of Url', width: 'min-w-[150px]' },
  { key: 'issues', label: 'Issues', width: 'min-w-[150px]' },
] as const;

// Main Component
const ValidationResults = ({ records, filter }: ValidationResultsProps) => {
  const [expandedErrors, setExpandedErrors] = useState<number[]>([]);
  const [expandedTexts, setExpandedTexts] = useState<string[]>([]);

  const filteredRecords = useMemo(() => filterRecords(records, filter), [records, filter]);

  const handleToggleErrorExpansion = useCallback((index: number) => {
    setExpandedErrors((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  }, []);

  const handleToggleTextExpansion = useCallback((textId: string) => {
    setExpandedTexts((prev) =>
      prev.includes(textId) ? prev.filter((id) => id !== textId) : [...prev, textId],
    );
  }, []);

  if (filteredRecords.length === 0) {
    return <EmptyState filter={filter} />;
  }

  interface ValidationErrorsListProps {
    errors: ValidationError[];
    rowIndex: number;
    isExpanded: boolean;
    onToggle: (index: number) => void;
  }

  const ValidationErrorsList = ({
    errors,
    rowIndex,
    isExpanded,
    onToggle,
  }: ValidationErrorsListProps) => {
    const handleToggle = useCallback(() => {
      onToggle(rowIndex);
    }, [onToggle, rowIndex]);

    if (errors.length === 0) {
      return (
        <span className="text-green-600 text-xs flex items-center">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          No issues
        </span>
      );
    }

    return (
      <Collapsible open={isExpanded} className="w-full">
        <CollapsibleTrigger
          onClick={handleToggle}
          className="flex items-center w-full cursor-pointer text-red-600 text-xs font-medium hover:text-red-700"
        >
          <AlertCircle className="h-3 w-3 mr-1" />
          {errors.length} {errors.length === 1 ? 'error' : 'errors'}
          {isExpanded ? (
            <ChevronUp className="h-3 w-3 ml-1" />
          ) : (
            <ChevronDown className="h-3 w-3 ml-1" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <ul className="text-xs space-y-1.5 bg-red-50 border-red-100 p-1.5 rounded-md border">
            {errors.map((error, index) => (
              <li key={index} className="flex flex-col">
                <span className="text-red-600 ml-1">{error.message}</span>
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <div className="flex">
      <ScrollArea type="always" className="w-1 flex-1">
        <Table className="mb-2">
          <ValidationTableHeader columns={COLUMN_CONFIG} />
          <TableBody>
            {filteredRecords.map((record, index) => (
              <TableRow key={index}>
                <TableCell>
                  <StatusBadge isValid={record.isValid} />
                </TableCell>

                <CollapsibleText
                  text={record.rowData?.category}
                  errors={record.validationErrors}
                  fieldName="category"
                  uniqueId={`category-${index}`}
                  isExpanded={expandedTexts.includes(`category-${index}`)}
                  onToggle={handleToggleTextExpansion}
                  limit={20}
                />

                <TableCell className={getCellClassName(record.validationErrors, 'type')}>
                  {record.rowData?.type}
                </TableCell>

                <CollapsibleText
                  text={record.rowData?.title}
                  errors={record.validationErrors}
                  fieldName="title"
                  uniqueId={`title-${index}`}
                  isExpanded={expandedTexts.includes(`title-${index}`)}
                  onToggle={handleToggleTextExpansion}
                  limit={30}
                />

                <CollapsibleText
                  text={record.rowData?.description}
                  errors={record.validationErrors}
                  fieldName="description"
                  uniqueId={`description-${index}`}
                  isExpanded={expandedTexts.includes(`description-${index}`)}
                  onToggle={handleToggleTextExpansion}
                  limit={80}
                />

                <CollapsibleText
                  text={record.rowData?.content}
                  errors={record.validationErrors}
                  fieldName="content"
                  uniqueId={`content-${index}`}
                  isExpanded={expandedTexts.includes(`content-${index}`)}
                  onToggle={handleToggleTextExpansion}
                />

                <CollapsibleText
                  text={record.rowData?.url}
                  errors={record.validationErrors}
                  fieldName="url"
                  uniqueId={`url-${index}`}
                  isExpanded={expandedTexts.includes(`url-${index}`)}
                  onToggle={handleToggleTextExpansion}
                  limit={30}
                />

                <TableCell className={getCellClassName(record.validationErrors, 'typeOfUrl')}>
                  {record.rowData?.typeOfUrl}
                </TableCell>

                <TableCell>
                  <ValidationErrorsList
                    errors={record.validationErrors}
                    rowIndex={index}
                    isExpanded={expandedErrors.includes(index)}
                    onToggle={handleToggleErrorExpansion}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default ValidationResults;
