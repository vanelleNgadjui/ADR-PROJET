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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <HomeSidebar />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        isMobileOpen ? 'ml-0' : isExpanded ? 'ml-0 lg:ml-64' : 'ml-0 lg:ml-16'
      }`}>
        {/* Header - Full width sur mobile */}
        <div className="header-full-width">
          <HomeHeader onToggle={toggleMobileSidebar} onClick={toggleSidebar} />
        </div>
        
        {/* Page Content */}
        <main>
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomeLayout;
