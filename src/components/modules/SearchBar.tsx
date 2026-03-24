import { useState, useCallback, KeyboardEvent } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarParams {
  keyword?: string;
}

interface SearchBarProps {
  onSearch: (params: SearchBarParams) => void;
  onReset?: () => void;
  defaultValue?: string;
}

export function SearchBar({ onSearch, onReset, defaultValue }: SearchBarProps) {
  const [keyword, setKeyword] = useState(defaultValue ?? '');

  const handleSearch = useCallback(() => {
    onSearch({ keyword: keyword.trim() || undefined });
  }, [keyword, onSearch]);

  const handleClearKeyword = useCallback(() => {
    setKeyword('');
    onSearch({});
    onReset?.();
  }, [onSearch, onReset]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleSearch();
    },
    [handleSearch],
  );

  return (
    <div className="flex gap-2">
      <div className="relative w-[300px]">
        <SearchIcon className="text-contrast/80 absolute top-2.5 left-2.5 h-4 w-4" />
        <Input
          placeholder="Search"
          className="pr-8 pl-8"
          onKeyDown={handleKeyDown}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        {keyword && (
          <button
            type="button"
            onClick={handleClearKeyword}
            className="text-contrast/80 hover:text-contrast/40 absolute top-2.5 right-2.5 h-4 w-4"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button variant="outline" onClick={handleSearch}>
        검색
      </Button>
    </div>
  );
}
