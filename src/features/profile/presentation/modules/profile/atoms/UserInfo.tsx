interface UserInfoProps {
  label: string;
  value: string;
}

export function UserInfo({ label, value }: UserInfoProps) {
  return (
    <div className="flex gap-4 items-center">
      <div className="min-w-[50px] text-sm font-medium text-foreground">{label}:</div>
      <div className="text-base font-medium break-all">{value}</div>
    </div>
  );
}
