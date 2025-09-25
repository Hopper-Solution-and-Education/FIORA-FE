import { Icons } from '@/components/Icon';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ICON_SIZE } from '@/shared/constants/size';
import { DynamicFieldTier } from '../schema/editMemberShip.schema';

type TierBenefitTableProps = {
  dynamicTierFields: DynamicFieldTier[];
  onEditBenefitTier: (item: DynamicFieldTier) => void;
  onDeleteBenefitTier: (item: DynamicFieldTier) => void;
};

const TierBenefitTable = ({
  dynamicTierFields,
  onEditBenefitTier,
  onDeleteBenefitTier,
}: TierBenefitTableProps) => {
  return (
    <div className="h-full min-h-[350px] max-h-[350px] overflow-y-auto overflow-x-auto relative">
      <Table className="w-full min-w-[720px] table-fixed">
        {/* Định nghĩa độ rộng cột */}
        <colgroup>
          {/* No. (equal width on sm+, hidden on xs) */}
          <col className="hidden sm:table-column sm:w-1/5" />
          {/* Equal widths across remaining columns */}
          <col className="w-2/5 sm:w-2/5" />
          <col className="w-1/4 sm:w-1/5" />
          <col className="w-1/4 sm:w-1/5" />
          <col className="w-1/4 sm:w-1/5" />
        </colgroup>

        <TableHeader>
          <TableRow className="h-14 sticky top-0">
            <TableHead className="hidden sm:table-cell text-center py-3">No.</TableHead>
            <TableHead className="text-center py-3">Benefit</TableHead>
            <TableHead className="text-center py-3">Value</TableHead>
            <TableHead className="text-center py-3">Unit</TableHead>
            <TableHead className="text-center py-3 sticky right-0 z-10 ">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {dynamicTierFields.map((item, index) => (
            <TableRow key={item.id} className="h-14">
              <TableCell className="hidden sm:table-cell text-center font-bold text-blue-400 py-3">
                {index + 1}
              </TableCell>
              <TableCell className="whitespace-normal break-words text-left py-3">
                {item.label}
              </TableCell>
              <TableCell className="whitespace-normal break-words text-right py-3">
                {item.value}
              </TableCell>
              <TableCell className="whitespace-normal break-words text-left py-3">
                {item.suffix}
              </TableCell>
              <TableCell className="text-center py-3 flex items-center gap-2 justify-center sticky right-0 z-10">
                <Icons.edit
                  className="cursor-pointer hover:scale-110 transition-all duration-300 text-blue-500"
                  size={ICON_SIZE.SM}
                  onClick={() => onEditBenefitTier(item)}
                />
                <Icons.trash
                  className="cursor-pointer hover:scale-110 transition-all duration-300 text-red-500"
                  size={ICON_SIZE.SM}
                  onClick={() => onDeleteBenefitTier(item)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TierBenefitTable;
