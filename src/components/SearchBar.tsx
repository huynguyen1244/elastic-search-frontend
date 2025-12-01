import { useState } from "react";

type SearchBarProps = {
    onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState("");

    return (
        <div className="flex gap-3 mb-4 items-center">
            <input
                type="text"
                className="flex-1 p-3 border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-200"
                placeholder="Search Elastic..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") onSearch(query);
                }}
            />
            <button
                onClick={() => onSearch(query)}
                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-md hover:opacity-95"
            >
                Search
            </button>
        </div>
    );
}
