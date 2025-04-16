import { Search } from "lucide-react";
import React from "react";

const SearchInput = ({ value, onChange }: SearchInputProps) => {
  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <input
        type="search"
        placeholder="Search files and folders..."
        className="pl-8 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search files and folders"
      />
    </div>
  );
};

export default SearchInput;
