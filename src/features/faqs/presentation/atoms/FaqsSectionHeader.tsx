interface FaqsSectionHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
}

const FaqsSectionHeader = ({ title, subtitle, count }: FaqsSectionHeaderProps) => {
  return (
    <div className="mb-4">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {subtitle && (
        <div className="text-sm text-muted-foreground">
          {subtitle}
          {count !== undefined && ` (${count} result${count !== 1 ? 's' : ''})`}
        </div>
      )}
    </div>
  );
};

export default FaqsSectionHeader;
