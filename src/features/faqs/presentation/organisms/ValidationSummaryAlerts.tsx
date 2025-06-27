import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import React from 'react';

interface ValidationSummaryAlertsProps {
  validationStats: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
    validationRate: number;
    hasErrors: boolean;
    canImport: boolean;
  };
}

const ValidationSummaryAlerts: React.FC<ValidationSummaryAlertsProps> = ({ validationStats }) => {
  const getAlertIcon = () => {
    if (validationStats.validRows === 0) {
      return <XCircle className="h-5 w-5 text-red-500 mt-1" />;
    }
    if (validationStats.hasErrors) {
      return <AlertTriangle className="h-5 w-5 !text-amber-500 mt-1" />;
    }
    return <CheckCircle className="h-5 w-5 !text-green-500 mt-1" />;
  };

  const getAlertStyles = () => {
    if (validationStats.validRows === 0) {
      return {
        container: 'bg-red-50 border-red-300',
        title: 'text-red-900',
        description: 'text-red-800',
      };
    }
    if (validationStats.hasErrors) {
      return {
        container: 'bg-amber-50 border-amber-300',
        title: 'text-amber-900',
        description: 'text-amber-800',
      };
    }
    return {
      container: 'bg-green-50 border-green-300',
      title: 'text-green-900',
      description: 'text-green-800',
    };
  };

  const styles = getAlertStyles();

  return (
    <div className="space-y-6">
      <Alert className={`mb-6 ${styles.container}`}>
        {getAlertIcon()}
        <AlertTitle className={styles.title}>Validation Complete</AlertTitle>
        <AlertDescription className={styles.description}>
          <div className="flex items-center justify-between ">
            <span>
              {validationStats.validRows} of {validationStats.totalRows} records are valid
              {validationStats.canImport ? ' and ready to import' : ''}
              {validationStats.validationRate > 0 && ` (${validationStats.validationRate}%)`}
            </span>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ValidationSummaryAlerts;
