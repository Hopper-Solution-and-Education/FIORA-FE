import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { initialPages } from './config';
import PageEditor from './PageEditor';
import type { Page } from './types';

export default function FormManager() {
  const [pages, setPages] = useState<Page[]>(initialPages);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const addPage = () => {
    setPages([
      ...pages,
      {
        data: { heading: 'New Page', subheading: '', button: 'Next' },
        questions: [],
      },
    ]);
    setCurrentPageIndex(pages.length);
  };

  const updatePage = (updatedPage: Page) => {
    const newPages = [...pages];
    newPages[currentPageIndex] = updatedPage;
    setPages(newPages);
  };

  const deletePage = () => {
    if (pages.length > 1) {
      const newPages = pages.filter((_, i) => i !== currentPageIndex);
      setPages(newPages);
      setCurrentPageIndex(Math.min(currentPageIndex, newPages.length - 1));
    }
  };

  const exportConfig = () => {
    const config = JSON.stringify(pages, null, 2);
    const script = `<script>\nconst msfPages = ${config};\n</script>`;
    navigator.clipboard.writeText(script).then(() => {
      toast('Configuration Exported', {
        description: 'The form configuration has been copied to your clipboard.',
      });
    });
  };

  return (
    <div className="mx-auto w-full">
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Multi-Step Form Manager</CardTitle>
          <div className="flex space-x-2">
            <Select
              value={currentPageIndex.toString()}
              onValueChange={(value) => setCurrentPageIndex(Number.parseInt(value))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select page" />
              </SelectTrigger>
              <SelectContent>
                {pages.map((page, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    Page {index + 1}: {page.data.heading}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addPage}>Add Page</Button>
            <Button onClick={exportConfig}>Export Config</Button>
          </div>
        </CardHeader>
        <CardContent>
          <PageEditor page={pages[currentPageIndex]} onUpdate={updatePage} onDelete={deletePage} />
        </CardContent>
      </Card>
    </div>
  );
}
