import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { Question, Option } from './types';

interface QuestionEditorProps {
  question: Question;
  onUpdate: (updatedQuestion: Question) => void;
  onDelete: () => void;
}

export default function QuestionEditor({ question, onUpdate, onDelete }: QuestionEditorProps) {
  const [newOptionLabel, setNewOptionLabel] = useState('');
  const [newOptionValue, setNewOptionValue] = useState('');

  const updateField = (field: keyof Question, value: string | boolean) => {
    onUpdate({ ...question, [field]: value });
  };

  const addOption = () => {
    if (newOptionLabel && newOptionValue) {
      const newOption: Option = { label: newOptionLabel, value: newOptionValue };
      const updatedOptions = [...(question.options || []), newOption];
      onUpdate({ ...question, options: updatedOptions });
      setNewOptionLabel('');
      setNewOptionValue('');
    }
  };

  const removeOption = (index: number) => {
    const updatedOptions = question.options?.filter((_, i) => i !== index);
    onUpdate({ ...question, options: updatedOptions });
  };

  const showOptions = question.type === 'select' || question.type === 'multiselect';

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              value={question.question}
              onChange={(e) => updateField('question', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Select
              value={question.type}
              onValueChange={(value) => updateField('type', value as Question['type'])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select question type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="tel">Phone</SelectItem>
                <SelectItem value="select">Select</SelectItem>
                <SelectItem value="multiselect">Multi Select</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
                <SelectItem value="textarea">Textarea</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <Switch
            id="required"
            checked={question.required}
            onCheckedChange={(checked) => updateField('required', checked)}
          />
          <Label htmlFor="required">Required</Label>
        </div>
        {showOptions && (
          <div className="mt-4">
            <Label>Options</Label>
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input value={option.label} readOnly />
                  <Input value={option.value} readOnly />
                  <Button variant="outline" onClick={() => removeOption(index)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Input
                placeholder="Option Label"
                value={newOptionLabel}
                onChange={(e) => setNewOptionLabel(e.target.value)}
              />
              <Input
                placeholder="Option Value"
                value={newOptionValue}
                onChange={(e) => setNewOptionValue(e.target.value)}
              />
              <Button variant="outline" onClick={addOption}>
                Add Option
              </Button>
            </div>
          </div>
        )}
        <Button onClick={onDelete} variant="outline" className="mt-4">
          Delete Question
        </Button>
      </CardContent>
    </Card>
  );
}
