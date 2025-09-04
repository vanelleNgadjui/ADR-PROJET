import type { ReactNode } from "react";
import { useSidebar } from "../../../context/dashboard/SidebarContext";
import Sidebar from "./Sidebar";
import Header from "../header/Header";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isExpanded, isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        isMobileOpen ? 'ml-0' : isExpanded ? 'ml-0 lg:ml-64' : 'ml-0 lg:ml-16'
      }`}>
        {/* Header - Full width sur mobile */}
        <div className="header-full-width">
          <Header onToggle={toggleMobileSidebar} onClick={toggleSidebar} />
        </div>
        
        {/* Page Content */}
        <main className="p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}


