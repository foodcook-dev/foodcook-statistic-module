'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/libs/utils';
import { Button } from '@/components/atoms/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/atoms/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/atoms/popover';

const frameworks = [
  {
    value: '강철',
    label: '강철',
  },
  {
    value: '싱싱',
    label: '싱싱',
  },
  {
    value: '초인유통',
    label: '초인유통',
  },
  {
    value: '유나팩',
    label: '유나팩',
  },
  {
    value: '동원에프엔비',
    label: '동원에프엔비',
  },
];
export function ComboboxTemp() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="border border-gray-300 w-[250px] justify-between"
        >
          {value ? (
            frameworks.find((framework) => framework.value === value)?.label
          ) : (
            <span className="opacity-50">매입사를 선택해주세요</span>
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandList>
            <CommandEmpty>매입사가 없습니다</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  className="cursor-pointer"
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === framework.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
