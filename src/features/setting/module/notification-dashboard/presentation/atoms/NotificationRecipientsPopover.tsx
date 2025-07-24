import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useMemo, useRef, useState } from 'react';

interface NotificationRecipientsPopoverProps {
  recipients: string | string[];
  children: React.ReactNode;
}

const NotificationRecipientsPopover = ({
  recipients,
  children,
}: NotificationRecipientsPopoverProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const emails = useMemo(() => {
    if (Array.isArray(recipients)) return recipients;
    if (typeof recipients === 'string') return [recipients];
    return [];
  }, [recipients]);

  const filtered = useMemo(() => {
    if (!search) return emails;
    return emails.filter((email) => email.toLowerCase().includes(search.toLowerCase()));
  }, [emails, search]);

  // Hover handlers
  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(true);
  };
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setOpen(false), 50); // small delay for UX
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </PopoverTrigger>

      <PopoverContent
        className="w-64 p-2"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        align="start"
      >
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2"
        />
        <div className="max-h-48 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((email, idx) => (
              <div
                key={email + idx}
                className="px-2 py-1 text-sm text-gray-800 hover:bg-gray-100 rounded cursor-pointer text-left"
              >
                {email}
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-sm px-2 py-2 text-center">No recipients found</div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationRecipientsPopover;
