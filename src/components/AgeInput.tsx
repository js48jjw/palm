import React from 'react';
import { Input } from './ui/Input';
import { isValidAge } from '@/lib/utils';

interface AgeInputProps {
  value: number | '';
  onChange: (age: number | '') => void;
  className?: string;
}

export const AgeInput: React.FC<AgeInputProps> = ({
  value,
  onChange,
  className
}) => {
  const [error, setError] = React.useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (inputValue === '') {
      onChange('');
      setError('');
      return;
    }

    const numValue = parseInt(inputValue, 10);
    
    if (isNaN(numValue)) {
      setError('숫자만 입력해주세요');
      return;
    }

    if (!isValidAge(numValue)) {
      setError('1세부터 120세까지 입력 가능합니다');
      return;
    }

    setError('');
    onChange(numValue);
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        const input = e.currentTarget.querySelector('input');
        if (input) setTimeout(() => input.blur(), 0);
      }}
      autoComplete="off"
    >
      <Input
        type="number"
        placeholder="예: 25"
        value={value}
        onChange={handleChange}
        error={error}
        min="1"
        max="120"
        inputMode="numeric"
        enterKeyHint="done"
        onKeyDown={(e) => {
          if (
            e.key === 'Enter' ||
            e.key === 'Done' ||
            e.key === 'Go' ||
            e.key === 'Next' ||
            e.key === 'Tab'
          ) {
            setTimeout(() => (e.target as HTMLInputElement).blur(), 0);
          }
        }}
      />
    </form>
  );
};