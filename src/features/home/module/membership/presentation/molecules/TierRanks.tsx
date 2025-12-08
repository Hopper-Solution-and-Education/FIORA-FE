import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export type TierRankData = {
  label: string;
  value: string;
  suffix: string;
};

interface TierRankProps {
  data: TierRankData[];
  nextTierRanks?: TierRankData[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TierRank = ({ data, nextTierRanks }: TierRankProps) => {
  return (
    <div className="grid w-full min-h-[350px] [&>div]:max-h-[350px] [&>div]:border [&>div]:rounded">
      <Table className="w-full min-w-[720px] table-fixed border">
        {/* Định nghĩa độ rộng cột */}
        <colgroup>
          {/* No. */}
          <col className="hidden sm:table-column sm:w-[15%]" />
          <col className="w-1/2 sm:w-[35%]" />
          <col className="w-1/2 sm:w-[25%]" />
          {/* Unit */}
          <col className="w-auto sm:w-[25%]" />
        </colgroup>

        <TableHeader className="sticky top-0 z-20 bg-background shadow-sm">
          <TableRow className="h-14 *:whitespace-nowrap sticky top-0 bg-background after:content-[''] after:inset-x-0 after:h-px after:bg-border after:absolute after:bottom-0">
            <TableHead className="hidden sm:table-cell text-center py-3 font-semibold text-foreground">
              No.
            </TableHead>
            <TableHead className="text-center py-3 font-semibold text-foreground">
              Benefit
            </TableHead>
            <TableHead className="text-center py-3 font-semibold text-foreground">Value</TableHead>
            <TableHead className="text-center py-3 font-semibold text-foreground">Unit</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data &&
            data
              .sort((a, b) => a.label.localeCompare(b.label))
              .map((item, index) => (
                <TableRow key={item.label} className="h-14 [&>td]:border-r last:border-r-0">
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
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TierRank;
