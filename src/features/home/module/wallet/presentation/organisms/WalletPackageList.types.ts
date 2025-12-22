import type { PackageFX } from '../../domain/entity/PackageFX';

export interface WalletPackageListProps {
  selectedId: string | null;
  setSelectedId: (id: string) => void;
  className?: string;
}

export interface PackageItemData {
  packages: PackageFX[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  getIsPopular: (pkg: PackageFX) => boolean;
}

export interface VirtualListRowProps {
  index: number;
  style: React.CSSProperties;
  data: PackageItemData;
}
