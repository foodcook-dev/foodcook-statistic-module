import * as React from 'react';
import { Input } from '@/components/ui/input';

import { cn } from '@/utils/common';

interface LabeledInputProps extends React.ComponentProps<'input'> {
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
}

export function Label({ id, label, required }: { id: string; label: string; required?: boolean }) {
  const inputId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <label htmlFor={inputId} className="text-sm leading-none font-medium">
      {label}
      {required && <span className="text-destructive ml-1 text-red-500">*</span>}
    </label>
  );
}

export function LabeledInput(props: LabeledInputProps) {
  const { label, required, error, helperText, className, id, ...rest } = props;
  const inputId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="flex w-full flex-col gap-1.5">
      <Label id={inputId} label={label} required={required} />
      <Input
        id={inputId}
        aria-required={required}
        aria-invalid={!!error}
        className={cn(className, error ? 'border-red-500/60' : '')}
        {...rest}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {!error && helperText && <p className="text-muted-foreground text-xs">{helperText}</p>}
    </div>
  );
}
