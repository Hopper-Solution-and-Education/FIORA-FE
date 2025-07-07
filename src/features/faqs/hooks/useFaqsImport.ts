import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setStep,
  setActiveTab,
  setSelectedFile,
  setValidationResult,
  clearValidationResult,
  reset,
  ImportStep,
  ValidationTab,
} from '../store/slices/faqsImportSlice';
import { useImportFaqsMutation, useValidateImportFileMutation } from '../store/api/faqsApi';
import { useErrorHandler } from './useErrorHandler';
import { MAX_FILE_SIZE, ALLOWED_TYPES } from '@/shared/constants/import';

const FILE_VALIDATION_ERRORS = {
  SIZE: 'File is too large. Maximum size is 2MB.',
  TYPE: 'Invalid file type. Please upload a .csv or .xlsx file.',
} as const;

export const useFaqsImport = () => {
  const dispatch = useAppDispatch();
  const { step, activeTab, selectedFile, validationResult } = useAppSelector(
    (state) => state.faqsImport,
  );

  const { extractErrorMessage, handleError, handleSuccess } = useErrorHandler();

  const [validateImportFile, { isLoading: isValidating, error: validateError }] =
    useValidateImportFileMutation();
  const [importFaqs, { isLoading: isImporting, error: importError, data: importResult }] =
    useImportFaqsMutation();

  const isLoading = isValidating || isImporting;
  const error = validateError || importError;

  // Validate file constraints
  const validateFile = useCallback((file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) return FILE_VALIDATION_ERRORS.SIZE;
    if (!ALLOWED_TYPES.includes(file.type)) return FILE_VALIDATION_ERRORS.TYPE;
    return null;
  }, []);

  // Handle file selection and validation
  const handleFileSelect = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        handleError(validationError);
        return { error: validationError };
      }

      dispatch(setSelectedFile(file));

      try {
        const formData = new FormData();
        formData.append('file', file);

        const result = await validateImportFile(formData).unwrap();
        if (result?.structuralError) {
          handleError(result.structuralError);
          return { error: result.structuralError };
        }
        dispatch(setValidationResult(result));
        handleSuccess('File validated successfully!');
        return { success: true, data: result };
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        return { error: errorMessage };
      }
    },
    [dispatch, validateFile, validateImportFile, handleError, handleSuccess, extractErrorMessage],
  );

  // Handle import confirmation
  const handleImportConfirm = useCallback(async () => {
    if (!validationResult) {
      const errorMessage = 'No validation result available';
      handleError(errorMessage);
      return { error: errorMessage };
    }

    try {
      const validRecords = validationResult.rows.filter((row) => row.isValid);
      const result = await importFaqs({ validRecords }).unwrap();

      // Navigate to complete step on success
      dispatch(setStep('complete'));
      handleSuccess(`Successfully imported ${validRecords.length} FAQs!`);
      return { success: true, data: result };
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      return { error: errorMessage };
    }
  }, [validationResult, importFaqs, dispatch, handleError, handleSuccess, extractErrorMessage]);

  // Navigation actions
  const navigateTo = useCallback(
    (newStep: ImportStep) => {
      dispatch(setStep(newStep));
    },
    [dispatch],
  );

  const setTab = useCallback(
    (tab: ValidationTab) => {
      dispatch(setActiveTab(tab));
    },
    [dispatch],
  );

  const restart = useCallback(() => {
    dispatch(reset());
  }, [dispatch]);

  // Clear validation data when going back
  const clearValidation = useCallback(() => {
    dispatch(clearValidationResult());
  }, [dispatch]);

  return {
    // UI State from slice
    step,
    activeTab,
    selectedFile,
    validationResult,

    // Server state from RTK Query
    isLoading,
    error,
    importResult,
    isValidating,
    isImporting,

    // Actions
    handleFileSelect,
    handleImportConfirm,
    navigateTo,
    setTab,
    restart,
    clearValidation,
  };
};

export default useFaqsImport;
