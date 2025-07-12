import { Search, X } from "lucide-react";
import { useState } from "react";

export default function EnrolledStudentsHeader({
  onSearch,
  totalCount,
  filteredCount,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Call the onSearch callback if provided
    if (onSearch) {
      onSearch(value);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <div className="sticky top-0 left-0 right-0 w-full py-6 bg-white shadow-sm border-b border-gray-200 z-10">
      <div className="max-w-3xl lg:max-w-7xl mx-auto flex md:flex-row flex-col justify-between items-center px-6">
        <div className="flex items-center space-x-4">
          <h1 className="md:text-2xl text-lg font-bold text-gray-900">
            Enrolled Students
          </h1>
          {totalCount > 0 && (
            <div className={` text-sm text-gray-500  `}>
              {filteredCount !== undefined && filteredCount !== totalCount
                ? `${filteredCount} of ${totalCount} students`
                : `${totalCount} students`}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="border-2 flex py-2 px-3 rounded-lg items-center focus-within:border-blue-500 transition-colors bg-white max-w-xl md:min-w-[320px]">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="px-2 outline-0 focus:ring-0 flex-1 text-sm"
                placeholder="Search by name, email, or username..."
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="ml-2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {searchTerm && (
              <div className="absolute top-full mt-1  text-xs text-gray-500 whitespace-nowrap">
                {filteredCount !== undefined
                  ? `${filteredCount} result${
                      filteredCount !== 1 ? "s" : ""
                    } found`
                  : "Searching..."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
