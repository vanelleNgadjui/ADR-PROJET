import { useState } from "react";
import { MoreHorizontalIcon } from "lucide-react";
import CountryMap from "./CountryMap";

export default function DemographicCard() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Customers Demographic
          </h3>
          <p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
            Number of customer based on country
          </p>
        </div>
        <div className="relative inline-block">
          <button 
            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={toggleDropdown}
          >
            <MoreHorizontalIcon className="w-6 h-6" />
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
              <button
                className="flex w-full px-3 py-2 text-left text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 rounded-lg"
                onClick={closeDropdown}
              >
                View More
              </button>
              <button
                className="flex w-full px-3 py-2 text-left text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 rounded-lg"
                onClick={closeDropdown}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="px-4 py-6 my-6 overflow-hidden border border-gray-200 rounded-2xl dark:border-gray-800 sm:px-6">
        <div className="h-[212px] w-full">
          <CountryMap />
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">US</span>
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm dark:text-white/90">
                USA
              </p>
              <span className="block text-gray-500 text-xs dark:text-gray-400">
                2,379 Customers
              </span>
            </div>
          </div>

          <div className="flex w-full max-w-[140px] items-center gap-3">
            <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
              <div className="absolute left-0 top-0 flex h-full w-[79%] items-center justify-center rounded-sm bg-blue-500 text-xs font-medium text-white"></div>
            </div>
            <p className="font-medium text-gray-800 text-sm dark:text-white/90">
              79%
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">FR</span>
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm dark:text-white/90">
                France
              </p>
              <span className="block text-gray-500 text-xs dark:text-gray-400">
                589 Customers
              </span>
            </div>
          </div>

          <div className="flex w-full max-w-[140px] items-center gap-3">
            <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
              <div className="absolute left-0 top-0 flex h-full w-[23%] items-center justify-center rounded-sm bg-blue-500 text-xs font-medium text-white"></div>
            </div>
            <p className="font-medium text-gray-800 text-sm dark:text-white/90">
              23%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
