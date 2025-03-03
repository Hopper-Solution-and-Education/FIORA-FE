import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import QuestionEditor from './QuestionEditor';
import type { Page, Question } from './types';

interface PageEditorProps {
  page: Page;
  onUpdate: (updatedPage: Page) => void;
  onDelete: () => void;
}

export default function PageEditor({ page, onUpdate, onDelete }: PageEditorProps) {
  const updatePageData = (field: keyof Page['data'], value: string) => {
    onUpdate({
      ...page,
      data: { ...page.data, [field]: value },
    });
  };

  const addQuestion = () => {
    onUpdate({
      ...page,
      questions: [
        ...page.questions,
        {
          id: `question-${Date.now()}`,
          question: 'New Question',
          type: 'text',
          required: false,
        },
      ],
    });
  };

  const updateQuestion = (index: number, updatedQuestion: Question) => {
    const newQuestions = [...page.questions];
    newQuestions[index] = updatedQuestion;
    onUpdate({ ...page, questions: newQuestions });
  };

  const deleteQuestion = (index: number) => {
    onUpdate({
      ...page,
      questions: page.questions.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="heading">Heading</Label>
          <Input
            id="heading"
            value={page.data.heading}
            onChange={(e) => updatePageData('heading', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="subheading">Subheading</Label>
          <Input
            id="subheading"
            value={page.data.subheading}
            onChange={(e) => updatePageData('subheading', e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="button">Button Text</Label>
        <Input
          id="button"
          value={page.data.button}
          onChange={(e) => updatePageData('button', e.target.value)}
        />
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Questions</h3>
          <Button onClick={addQuestion}>Add Question</Button>
        </div>
        {page.questions.map((question, index) => (
          <QuestionEditor
            key={question.id}
            question={question}
            onUpdate={(updatedQuestion) => updateQuestion(index, updatedQuestion)}
            onDelete={() => deleteQuestion(index)}
          />
        ))}
      </div>
      <Button onClick={onDelete} variant="destructive">
        Delete Page
      </Button>
    </div>
  );
}
