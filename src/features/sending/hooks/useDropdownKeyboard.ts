import { useCallback } from 'react';

interface UseDropdownKeyboardProps<T> {
  isOpen: boolean;
  options: T[];
  highlightIndex: number;
  setHighlightIndex: React.Dispatch<React.SetStateAction<number>>;
  setIsOpen: (open: boolean) => void;
  handleSelect: (item: T) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  localValue: string;
  onChange: (value: number) => void;
  setIsFocused: (focused: boolean) => void;
}

export function useDropdownKeyboard<T>({
  isOpen,
  options,
  highlightIndex,
  setHighlightIndex,
  setIsOpen,
  handleSelect,
  inputRef,
  localValue,
  onChange,
  setIsFocused,
}: UseDropdownKeyboardProps<T>) {
  return useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen && e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setHighlightIndex(0);
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightIndex((prev: number) => Math.min(prev + 1, options.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightIndex >= 0 && options[highlightIndex] !== undefined) {
          handleSelect(options[highlightIndex]);
        } else {
          const parsed = parseFloat(localValue || '');
          if (!isNaN(parsed)) onChange(parsed);
          setIsOpen(false);
          setIsFocused(false);
          inputRef.current?.blur();
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    },
    [
      isOpen,
      options,
      highlightIndex,
      handleSelect,
      inputRef,
      localValue,
      onChange,
      setIsFocused,
      setIsOpen,
      setHighlightIndex,
    ],
  );
}
