import * as React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/utils/common';
import { FieldWrapper } from './FormField';

interface LabeledTextareaProps extends React.ComponentProps<'textarea'> {
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
}

export function LabeledTextarea(props: LabeledTextareaProps) {
  const { label, required, error, helperText, className, id, ...rest } = props;
  const textareaId = id || `textarea-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <FieldWrapper
      name={rest.name}
      label={label}
      required={required}
      error={error}
      helperText={helperText}
    >
      <Textarea
        id={textareaId}
        aria-required={required}
        aria-invalid={!!error}
        className={cn(className, error ? 'border-red-500/60' : '')}
        {...rest}
      />
    </FieldWrapper>
  );
}
