import { ComponentType } from 'react';

export interface CategoryType {
  id: string;
  name: string;
  type: string;
  subCategories: { id: string; name: string }[];
}

export interface AccountCreate {
  name: string;
  type: string;
  currency: string;
  balance: number;
  parentId?: string;
  limit?: number;
}

export interface TabComponentProps {
  title: string;
  description: string;
}

interface ModalComponentProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export interface TabActionHeaderProps {
  title: string;
  description: string;
  buttonLabel: string;
  modalComponent: ComponentType<ModalComponentProps>;
}
