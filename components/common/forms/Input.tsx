import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  multiline?: boolean;
  rows?: number;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, multiline, rows = 4, ...props }, ref) => {
    const inputClasses = cn(
      "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2",
      error
        ? "border-red-300 focus:border-red-300 focus:ring-red-200"
        : "border-gray-300 focus:border-primary focus:ring-primary/20",
      className
    );

    const renderInput = () => {
      if (multiline) {
        return (
          <textarea
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            className={inputClasses}
            rows={rows}
          />
        );
      }

      return (
        <input
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          className={inputClasses}
          ref={ref as React.Ref<HTMLInputElement>}
        />
      );
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        {renderInput()}
        {(error || helperText) && (
          <p
            className={cn(
              "mt-1 text-sm",
              error ? "text-red-500" : "text-gray-500"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';