import React from 'react';
import { cn } from '@/lib/utils';

interface GenderSelectorProps {
  value: 'male' | 'female' | '';
  onChange: (gender: 'male' | 'female') => void;
  className?: string;
}

export const GenderSelector: React.FC<GenderSelectorProps> = ({
  value,
  onChange,
  className
}) => {
  return (
    <div className={cn('w-full', className)}>
      {/* <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        성별 선택
      </label> */}
      
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onChange('male')}
          className={cn(
            'relative p-2 rounded-2xl border-2 transition-all duration-300',
            'hover:shadow-lg transform hover:-translate-y-1',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            value === 'male'
              ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 shadow-lg'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-500'
          )}
        >
          <div className="flex flex-row items-center justify-center gap-1">
            <div className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center text-lg',
              value === 'male'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            )}>
              👨
            </div>
            <span className={cn(
              'font-medium text-sm',
              value === 'male'
                ? 'text-blue-700 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-300'
            )}>
              남성
            </span>
            {value === 'male' && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </button>

        <button
          type="button"
          onClick={() => onChange('female')}
          className={cn(
            'relative p-2 rounded-2xl border-2 transition-all duration-300',
            'hover:shadow-lg transform hover:-translate-y-1',
            'focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2',
            value === 'female'
              ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/30 shadow-lg'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-pink-300 dark:hover:border-pink-500'
          )}
        >
          <div className="flex flex-row items-center justify-center gap-1">
            <div className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center text-lg',
              value === 'female'
                ? 'bg-pink-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            )}>
              👩
            </div>
            <span className={cn(
              'font-medium text-sm',
              value === 'female'
                ? 'text-pink-700 dark:text-pink-300'
                : 'text-gray-700 dark:text-gray-300'
            )}>
              여성
            </span>
            {value === 'female' && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};