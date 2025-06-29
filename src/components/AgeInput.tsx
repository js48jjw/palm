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
    <div className={className}>
      <Input
        type="number"
        label="나이를 입력해주세요"
        placeholder="예: 25"
        value={value}
        onChange={handleChange}
        error={error}
        helperText="정확한 나이를 입력하시면 더 정밀한 분석이 가능합니다"
        min="1"
        max="120"
        onKeyDown={(e) => {
          if (
            e.key === 'Enter' ||
            e.key === 'Done' ||
            e.key === 'Go' ||
            e.key === 'Next' ||
            e.key === 'Tab'
          ) {
            (e.target as HTMLInputElement).blur();
          }
        }}
      />
      
      {value && !error && (
        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-700 dark:text-green-300 text-sm">
              {value}세로 설정되었습니다
            </span>
          </div>
        </div>
      )}
    </div>
  );
};