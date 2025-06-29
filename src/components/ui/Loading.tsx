import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text,
  className
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className="relative">
        {/* Outer ring */}
        <div className={cn(
          'rounded-full border-4 border-purple-200 dark:border-purple-800',
          sizes[size]
        )} />
        
        {/* Inner spinning ring */}
        <div className={cn(
          'absolute top-0 left-0 rounded-full border-4 border-transparent border-t-purple-500 border-r-purple-500 animate-spin',
          sizes[size]
        )} />
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
        </div>
      </div>
      
      {text && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export const LoadingScreen: React.FC<{ text?: string }> = ({ text = '분석 중...' }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="relative mx-auto w-20 h-20 mb-8">
          {/* Outer pulsing circle */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 animate-ping" />
          
          {/* Middle spinning ring */}
          <div className="absolute inset-2 rounded-full border-4 border-purple-300 dark:border-purple-600" />
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-purple-500 border-r-pink-500 animate-spin" />
          
          {/* Inner floating icon */}
          <div className="absolute inset-6 flex items-center justify-center">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-float" />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          {text}
        </h3>
        
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          손금의 비밀을 해독하고 있습니다 ✨
        </p>
      </div>
    </div>
  );
};