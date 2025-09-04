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
  console.log('TierBenefitTable - dynamicTierFields:', dynamicTierFields);
  console.log('TierBenefitTable - total items:', dynamicTierFields.length);

  return (
    <div className="h-full max-h-[500px] overflow-y-auto">
      <Table className="w-full table-fixed">
        {/* Định nghĩa độ rộng cột */}
        <colgroup>
          {/* No. (equal width on sm+, hidden on xs) */}
          <col className="hidden sm:table-column sm:w-1/5" />
          {/* Equal widths across remaining columns */}
          <col className="w-1/4 sm:w-1/5" />
          <col className="w-1/4 sm:w-1/5" />
          <col className="w-1/4 sm:w-1/5" />
          <col className="w-1/4 sm:w-1/5" />
        </colgroup>

        <TableHeader>
          <TableRow className="h-14">
            <TableHead className="hidden sm:table-cell text-center py-3">No.</TableHead>
            <TableHead className="text-center py-3">Benefit</TableHead>
            <TableHead className="text-center py-3">Value</TableHead>
            <TableHead className="text-center py-3">Unit</TableHead>
            <TableHead className="text-center py-3">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {dynamicTierFields.map((item, index) => (
            <TableRow key={item.id} className="h-14">
              <TableCell className="hidden sm:table-cell text-center font-bold text-blue-400 py-3">
                {index + 1}
              </TableCell>
              <TableCell className="truncate text-left py-3">{item.label}</TableCell>
              <TableCell className="truncate text-right py-3">{item.value}</TableCell>
              <TableCell className="truncate text-left py-3">{item.suffix}</TableCell>
              <TableCell className="truncate text-center py-3 flex items-center gap-2 justify-center">
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
