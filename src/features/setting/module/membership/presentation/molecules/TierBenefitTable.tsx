import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
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
    <div className="grid w-full min-h-[350px] [&>div]:max-h-[350px] [&>div]:border [&>div]:rounded">
      <Table className="w-full min-w-[720px] table-fixed border">
        {/* Define column widths */}
        <colgroup>
          {/* No. (hidden on xs, equal width on sm+) */}
          <col className="hidden sm:table-column sm:w-1/6" />
          {/* Equal widths across remaining columns */}
          <col className="w-2/6 sm:w-2/6" />
          <col className="w-1/6 sm:w-1/6" />
          <col className="w-2/6 sm:w-2/6" />
          <col className="w-1/6 sm:w-1/6" />
        </colgroup>

        <TableHeader className="sticky top-0 z-20 bg-background shadow-sm">
          <TableRow className="h-14 *:whitespace-nowrap sticky top-0 bg-background after:content-[''] after:inset-x-0 after:h-px after:bg-border after:absolute after:bottom-0">
            <TableHead className="hidden sm:table-cell text-center py-3 font-semibold text-foreground">
              No.
            </TableHead>
            <TableHead className="text-left py-3 font-semibold text-foreground">Benefit</TableHead>
            <TableHead className="text-right py-3 font-semibold text-foreground">Value</TableHead>
            <TableHead className="text-left py-3 font-semibold text-foreground">Unit</TableHead>
            <TableHead className="text-center py-3 font-semibold text-foreground sticky right-0 z-30">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {dynamicTierFields.map((item, index) => (
            <TableRow key={item.id} className="h-14 [&>td]:border-r last:border-r-0">
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
              <TableCell className="text-center py-3 flex items-center gap-2 justify-center sticky right-0 z-10 bg-background h-14">
                <CommonTooltip content="Edit Benefit">
                  <Icons.edit
                    className="cursor-pointer hover:scale-110 transition-all duration-300 text-blue-500"
                    size={ICON_SIZE.SM}
                    onClick={() => onEditBenefitTier(item)}
                  />
                </CommonTooltip>
                <CommonTooltip content="Delete Benefit">
                  <Icons.trash
                    className="cursor-pointer hover:scale-110 transition-all duration-300 text-red-500"
                    size={ICON_SIZE.SM}
                    onClick={() => onDeleteBenefitTier(item)}
                  />
                </CommonTooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TierBenefitTable;
