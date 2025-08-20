import { useState } from "react";
import { Dropdown } from "../ui/Dropdown";
import { DropdownItem } from "../ui/DropdownItem";
import { Link } from "react-router-dom";
import { BellIcon, XIcon } from "lucide-react";
import Avatar from "../ui/Avatar";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleClick = () => {
    toggleDropdown();
    setNotifying(false);
  };

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleClick}
      >
        <span
          className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 ${
            !notifying ? "hidden" : "flex"
          }`}
        >
          <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
        </span>
        <BellIcon className="w-5 h-5" />
      </button>
      
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900 sm:w-[361px] lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Notifications
          </h5>
          <button
            onClick={toggleDropdown}
            className="text-gray-500 transition dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {/* Example notification items */}
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
            >
              <Avatar 
                src="/images/user/user-02.jpg" 
                alt="User" 
                size="small"
                status="online"
              />
              <span className="block">
                <span className="mb-1.5 block text-sm text-gray-500 dark:text-gray-400 space-x-1">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Terry Franci
                  </span>
                  <span>a commenté votre événement</span>
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Il y a 2 heures
                </span>
              </span>
            </DropdownItem>
          </li>
          
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
            >
              <Avatar 
                src="/images/user/user-03.jpg" 
                alt="User" 
                size="small"
                status="offline"
              />
              <span className="block">
                <span className="mb-1.5 block text-sm text-gray-500 dark:text-gray-400 space-x-1">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Sarah Wilson
                  </span>
                  <span>s'est inscrite à votre événement</span>
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Il y a 4 heures
                </span>
              </span>
            </DropdownItem>
          </li>
          
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
            >
              <Avatar 
                src="/images/user/user-04.jpg" 
                alt="User" 
                size="small"
                status="online"
              />
              <span className="block">
                <span className="mb-1.5 block text-sm text-gray-500 dark:text-gray-400 space-x-1">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Mike Johnson
                  </span>
                  <span>a partagé votre événement</span>
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Il y a 6 heures
                </span>
              </span>
            </DropdownItem>
          </li>
        </ul>
        
        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
          <Link
            to="/notifications"
            className="block w-full text-center text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Voir toutes les notifications
          </Link>
        </div>
      </Dropdown>
    </div>
  );
}
