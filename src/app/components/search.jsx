import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function SearchBar() {
  return (
    <div className="relative w-full max-w-md mx-auto p-2">
      <input
        type="text"
        placeholder="Search..."
        className="w-full pl-12 pr-4 py-2 rounded-full bg-white text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
      <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
    </div>
  );
}