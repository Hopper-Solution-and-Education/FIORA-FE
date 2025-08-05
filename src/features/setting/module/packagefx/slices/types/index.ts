export interface PackageFx {
  id: string;
  name: string;
  total?: number | null;
  attachments?: any[];
  fxAmount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PackageFXAttachment {
  id: string;
  url: string;
}

export interface PackageFXWithAttachments extends PackageFx {
  attachments: PackageFXAttachment[];
  attachment_id?: string[];
}

export interface PackageFxState {
  packages: {
    isLoading: boolean;
    data: PackageFXWithAttachments[] | undefined;
    error: string | null;
    message?: string;
    total?: number;
    page?: number;
    limit?: number;
  };
  selectedPackage: PackageFXWithAttachments | null;
  deleteConfirmOpen: boolean;
}
export const initialPackageFxState: PackageFxState = {
  packages: {
    isLoading: false,
    data: [],
    error: null,
    message: '',
    total: 0,
  },
  selectedPackage: null,
  deleteConfirmOpen: false,
};

export interface CreatePackageFxPayload {
  fxAmount: number;
  attachments?: File[];
}

export interface UpdatePackageFxPayload extends CreatePackageFxPayload {
  id: string;
  removeAttachmentIds?: string[];
  newFiles?: File[];
}
export interface PackageFxApiResponse {
  data: PackageFXWithAttachments[];
  total: number;
  page: number;
  message: string;
}
