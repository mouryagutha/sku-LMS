import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchText, setSearchText }) => {
  return (
    <div className="w-2/3 px-4 flex bg-zinc-100 items-center gap-2 border border-gray-300 rounded-lg">
      <Search className="text-gray-600" />
      <input
        type="text"
        className="px-2 py-2 rounded-lg bg-zinc-100 w-full focus:outline-none"
        placeholder="Search by title or ISBN"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
