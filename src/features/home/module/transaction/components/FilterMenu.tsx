import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/shared/utils';
import { MOCK_ACCOUNTS, TRANSACTION_TABLE_COLUMNS } from '../types/constants';
import { DropdownOption } from '../types/types';

const FilterMenu = () => {
  // const handleShowHideColumn = (key: string) => {
  //   // Show/Hide column
  //   key = key;
  // };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="px-3 py-2 bg-gray-500">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.5 3C4.67157 3 4 3.67157 4 4.5C4 5.32843 4.67157 6 5.5 6C6.32843 6 7 5.32843 7 4.5C7 3.67157 6.32843 3 5.5 3ZM3 5C3.01671 5 3.03323 4.99918 3.04952 4.99758C3.28022 6.1399 4.28967 7 5.5 7C6.71033 7 7.71978 6.1399 7.95048 4.99758C7.96677 4.99918 7.98329 5 8 5H13.5C13.7761 5 14 4.77614 14 4.5C14 4.22386 13.7761 4 13.5 4H8C7.98329 4 7.96677 4.00082 7.95048 4.00242C7.71978 2.86009 6.71033 2 5.5 2C4.28967 2 3.28022 2.86009 3.04952 4.00242C3.03323 4.00082 3.01671 4 3 4H1.5C1.22386 4 1 4.22386 1 4.5C1 4.77614 1.22386 5 1.5 5H3ZM11.9505 10.9976C11.7198 12.1399 10.7103 13 9.5 13C8.28967 13 7.28022 12.1399 7.04952 10.9976C7.03323 10.9992 7.01671 11 7 11H1.5C1.22386 11 1 10.7761 1 10.5C1 10.2239 1.22386 10 1.5 10H7C7.01671 10 7.03323 10.0008 7.04952 10.0024C7.28022 8.8601 8.28967 8 9.5 8C10.7103 8 11.7198 8.8601 11.9505 10.0024C11.9668 10.0008 11.9833 10 12 10H13.5C13.7761 10 14 10.2239 14 10.5C14 10.7761 13.7761 11 13.5 11H12C11.9833 11 11.9668 10.9992 11.9505 10.9976ZM8 10.5C8 9.67157 8.67157 9 9.5 9C10.3284 9 11 9.67157 11 10.5C11 11.3284 10.3284 12 9.5 12C8.67157 12 8 11.3284 8 10.5Z"
              fill="currentColor"
              fill-rule="evenodd"
              clip-rule="evenodd"
            ></path>
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-fit min-w-200 rounded-lg p-4"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <h2 className="font-semibold">Filter & Settings</h2>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Filter contentss */}
        <div className="w-full h-fit flex justify-start items-start gap-2 pt-2">
          {/* Show/hide columns */}
          <DropdownMenuGroup className="w-fit">
            {/* <h4 className="text-sm w-max mb-2">Hide/Unhide columns</h4> */}

            <div className="w-full h-full flex flex-col justify-start items-center">
              <div className="w-full flex justify-between items-center px-2">
                <Label>Visible</Label>
                <Label className="text-blue-600">Hide All</Label>
              </div>
              {Object.keys(TRANSACTION_TABLE_COLUMNS)
                .splice(0, 4)
                .map((key: string, idx: number) => (
                  <DropdownMenuItem
                    key={idx}
                    className="w-[200px] py-1 flex justify-between items-center cursor-pointer"
                    onClick={(e: any) => {
                      e.preventDefault();
                      // handleShowHideColumn(key);
                    }}
                  >
                    {/* Detail button */}
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z"
                        fill="currentColor"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <p className="w-full font-semibold">{key}</p>
                    <Button variant="ghost" className="px-2 py-1 hover:bg-gray-200 ">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.5 11C4.80285 11 2.52952 9.62184 1.09622 7.50001C2.52952 5.37816 4.80285 4 7.5 4C10.1971 4 12.4705 5.37816 13.9038 7.50001C12.4705 9.62183 10.1971 11 7.5 11ZM7.5 3C4.30786 3 1.65639 4.70638 0.0760002 7.23501C-0.0253338 7.39715 -0.0253334 7.60288 0.0760014 7.76501C1.65639 10.2936 4.30786 12 7.5 12C10.6921 12 13.3436 10.2936 14.924 7.76501C15.0253 7.60288 15.0253 7.39715 14.924 7.23501C13.3436 4.70638 10.6921 3 7.5 3ZM7.5 9.5C8.60457 9.5 9.5 8.60457 9.5 7.5C9.5 6.39543 8.60457 5.5 7.5 5.5C6.39543 5.5 5.5 6.39543 5.5 7.5C5.5 8.60457 6.39543 9.5 7.5 9.5Z"
                          fill="currentColor"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </Button>
                  </DropdownMenuItem>
                ))}
            </div>
            <DropdownMenuSeparator className="mb-4" />
            <div className="w-full h-full flex flex-col justify-start items-center">
              <div className="w-full flex justify-between items-center px-2">
                <Label>Hidden</Label>
                <Label className="text-blue-600">Show All</Label>
              </div>
              {Object.keys(TRANSACTION_TABLE_COLUMNS)
                .splice(5)
                .map((key: string, idx: number) => (
                  <DropdownMenuItem
                    key={idx}
                    className="w-[200px] py-1 flex justify-between items-center cursor-pointer"
                    onClick={(e: any) => {
                      e.preventDefault();
                      // handleShowHideColumn(key);
                    }}
                  >
                    {/* Detail button */}
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z"
                        fill="currentColor"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <p className="w-full opacity-80">{key}</p>
                    <Button variant="ghost" className="px-2 py-1 hover:bg-gray-200 ">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.3536 2.35355C13.5488 2.15829 13.5488 1.84171 13.3536 1.64645C13.1583 1.45118 12.8417 1.45118 12.6464 1.64645L10.6828 3.61012C9.70652 3.21671 8.63759 3 7.5 3C4.30786 3 1.65639 4.70638 0.0760002 7.23501C-0.0253338 7.39715 -0.0253334 7.60288 0.0760014 7.76501C0.902945 9.08812 2.02314 10.1861 3.36061 10.9323L1.64645 12.6464C1.45118 12.8417 1.45118 13.1583 1.64645 13.3536C1.84171 13.5488 2.15829 13.5488 2.35355 13.3536L4.31723 11.3899C5.29348 11.7833 6.36241 12 7.5 12C10.6921 12 13.3436 10.2936 14.924 7.76501C15.0253 7.60288 15.0253 7.39715 14.924 7.23501C14.0971 5.9119 12.9769 4.81391 11.6394 4.06771L13.3536 2.35355ZM9.90428 4.38861C9.15332 4.1361 8.34759 4 7.5 4C4.80285 4 2.52952 5.37816 1.09622 7.50001C1.87284 8.6497 2.89609 9.58106 4.09974 10.1931L9.90428 4.38861ZM5.09572 10.6114L10.9003 4.80685C12.1039 5.41894 13.1272 6.35031 13.9038 7.50001C12.4705 9.62183 10.1971 11 7.5 11C6.65241 11 5.84668 10.8639 5.09572 10.6114Z"
                          fill="currentColor"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </Button>
                  </DropdownMenuItem>
                ))}
            </div>
          </DropdownMenuGroup>

          {/* Seperator */}
          <div className="w-[2px] h-full bg-gray-300 mx-4"></div>

          {/* Filter criteria */}
          <DropdownMenuGroup className="w-[250px]">
            {/* <h4 className="text-sm w-max">Filters</h4> */}
            <div className="w-full h-full flex flex-col justify-start items-start gap-4">
              {/* Type Filter */}
              <div className="w-full flex flex-col gap-2">
                <Label>Type</Label>
                <Select
                  name="Select Type"
                  // value={amountCurrency}
                  required
                  // onValueChange={(value) => setAmountCurrency(value as TransactionCurrency)}
                >
                  <SelectTrigger className="w-full px-4 py-3">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Expense', 'Income', 'Transfer'].map((typeOption) => (
                      <SelectItem key={typeOption} value={typeOption.toString()}>
                        {typeOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Seperator */}
              <div className="w-[2px] h-full bg-gray-300 mx-4"></div>

              {/* Partner Filter */}
              <div className="w-full flex flex-col gap-2">
                <Label>Partner</Label>
                <Select
                  name="Select Partners"
                  // value={amountCurrency}
                  required
                  // onValueChange={(value) => setAmountCurrency(value as TransactionCurrency)}
                >
                  <SelectTrigger className="w-full px-4 py-3">
                    <SelectValue placeholder="Select Partners" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_ACCOUNTS.map((option: DropdownOption, index: number) => (
                      <SelectItem key={index} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DropdownMenuGroup>

          {/* Seperator */}
          <div className="w-[2px] h-full bg-gray-300 mx-4"></div>

          {/* Filter criteria */}
          <DropdownMenuGroup className="w-[250px]">
            {/* <h4 className="text-sm w-max">Filters</h4> */}
            <div className="w-full h-full flex flex-col justify-start items-start gap-4">
              {/* Type Filter */}
              <div className="w-full flex flex-col gap-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  // disabled={isRegistering} // Disable during register period
                  // value={amountValue}
                  min={0}
                  placeholder="Min"
                  // onChange={handleAmountChange}
                  required
                  className={cn('w-full')}
                />
                <Input
                  type="number"
                  // disabled={isRegistering} // Disable during register period
                  // value={amountValue}
                  min={0}
                  placeholder="Max"
                  // onChange={handleAmountChange}
                  required
                  className={cn('w-full')}
                />
              </div>
            </div>
          </DropdownMenuGroup>
        </div>

        {/* <DropdownMenuGroup>
          <DropdownMenuItem>Account</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Notifications</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Log out</DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterMenu;
