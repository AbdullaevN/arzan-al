import React from "react";

interface SearchProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const SearchComponent: React.FC<SearchProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex gap-4 mb-4">
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        type="text"
        className="w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2"
        placeholder="Поиск"
      />
    </div>
  );
};

export default SearchComponent;
