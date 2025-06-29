import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'glass';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default'
}) => {
  const variants = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    gradient: 'bg-gradient-to-br from-white/90 to-purple-50/90 dark:from-gray-800/90 dark:to-purple-900/20 border border-purple-200/50 dark:border-purple-700/50',
    glass: 'bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg border border-white/30 dark:border-gray-700/30'
  };

  return (
    <div
      className={cn(
        'rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300',
        'p-6 sm:p-8',
        variants[variant],
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn('mb-6', className)}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className
}) => {
  return (
    <h2 className={cn(
      'text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white',
      'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent',
      className
    )}>
      {children}
    </h2>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {children}
    </div>
  );
};