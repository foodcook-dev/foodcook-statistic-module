import * as React from 'react';
import tooltips from '@/constants/tooltips.json';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

type TooltipEntry = { label: string; tooltip: string };

export function FieldLabel({
  label,
  required,
  name,
}: {
  label: string;
  required?: boolean;
  name?: string;
}) {
  const entry = name
    ? (tooltips[name as keyof typeof tooltips] as unknown as TooltipEntry | undefined)
    : undefined;
  const tooltip = entry?.tooltip;

  return (
    <label className="flex items-center gap-1 text-sm leading-none font-medium">
      {tooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="text-contrast/30 hover:text-contrast/60 h-3.5 w-3.5 transition-colors" />
            </TooltipTrigger>

            <TooltipContent>
              <p className="max-w-[500px] text-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <div>
        {label}
        {required && <span className="text-destructive ml-1 text-red-500">*</span>}
      </div>
    </label>
  );
}

export function FieldWrapper({
  name,
  label,
  required,
  error,
  helperText,
  children,
  className,
}: {
  name?: string;
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex w-full flex-col gap-1.5 ${className}`}>
      {label && <FieldLabel label={label} required={required} name={name} />}
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
      {!error && helperText && <p className="text-contrast/40 text-xs">{helperText}</p>}
    </div>
  );
}
