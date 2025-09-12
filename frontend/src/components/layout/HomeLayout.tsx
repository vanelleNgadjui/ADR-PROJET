import React from 'react';
import { useSidebar } from '../../context/dashboard/SidebarContext';
import HomeSidebar from '../sidebar/HomeSidebar';
import HomeHeader from '../header/HomeHeader';

interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
  const { isExpanded, isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar - Fixed */}
      <HomeSidebar />
      
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
        isMobileOpen ? 'ml-0' : isExpanded ? 'ml-0 lg:ml-64' : 'ml-0 lg:ml-16'
      }`}>
        {/* Header - Fixed */}
        <div className="header-full-width">
          <HomeHeader onToggle={toggleMobileSidebar} onClick={toggleSidebar} />
        </div>
        
        {/* Page Content - Scrollable */}
        <main className="flex-1 pt-12 lg:pt-16">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomeLayout;
