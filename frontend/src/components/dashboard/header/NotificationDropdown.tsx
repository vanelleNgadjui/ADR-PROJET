import { useState } from "react";
import { Dropdown } from "../ui/Dropdown";
import { DropdownItem } from "../ui/DropdownItem";
import { Link } from "react-router-dom";
import Avatar from "../ui/Avatar";
import { BellIcon, XIcon } from "lucide-react";

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

  // Exemples de notifications (à adapter selon notre système)
  const notifications = [
    {
      id: 1,
      user: {
        name: "Marie Dupont",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
        status: "online"
      },
      message: "s'est inscrite à votre événement",
      event: "Conférence sur l'évangélisation",
      time: "Il y a 2h",
      type: "inscription"
    },
    {
      id: 2,
      user: {
        name: "Jean Martin",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        status: "offline"
      },
      message: "a commenté votre événement",
      event: "Retraite spirituelle",
      time: "Il y a 4h",
      type: "commentaire"
    },
    {
      id: 3,
      user: {
        name: "Sophie Bernard",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
        status: "online"
      },
      message: "a partagé votre événement",
      event: "Concert Gospel",
      time: "Il y a 6h",
      type: "partage"
    }
  ];

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
        <BellIcon className="w-5 h-5 text-current" />
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
          {notifications.map((notification) => (
            <li key={notification.id}>
              <DropdownItem
                onItemClick={closeDropdown}
                className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
              >
                <Avatar
                  src={notification.user.avatar}
                  alt={notification.user.name}
                  size="small"
                  status={notification.user.status as "online" | "offline" | "busy" | "none"}
                />

                <span className="block">
                  <span className="mb-1.5 block text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-800 dark:text-white/90">
                      {notification.user.name}
                    </span>
                    {" "}{notification.message}
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    {notification.event}
                  </span>
                  <span className="block text-xs text-gray-400 dark:text-gray-500">
                    {notification.time}
                  </span>
                </span>
              </DropdownItem>
            </li>
          ))}
        </ul>

        <div className="pt-3 mt-auto border-t border-gray-100 dark:border-gray-700">
          <Link
            to="/notifications"
            className="block w-full px-3 py-2 text-sm font-medium text-center text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
            onClick={closeDropdown}
          >
            Voir toutes les notifications
          </Link>
        </div>
      </Dropdown>
    </div>
  );
}
