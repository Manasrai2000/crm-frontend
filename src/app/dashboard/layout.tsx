'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
// import DataTable from './components/DataTable';

type Menu = {
  public_secret: string;
  title: string;
  icon: string;
  submenus?: Menu[];
  actions?: Action[];
};

type Action = {
  public_secret: string;
  name: string;
  description: string;
}

// Custom hook for responsive behavior
const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    
    // Initial check
    checkIsMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  return isMobile;
};

export default function DashboardLayout() {
  const [selectedSubMenu, setSelectedSubMenu] = useState<Menu | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useResponsive();

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const handleSubMenuSelect = useCallback((menu: Menu) => {
    setSelectedSubMenu(menu);
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);

  // Memoized sidebar component to prevent unnecessary re-renders
  const sidebarComponent = useMemo(() => (
    <div className={`${sidebarCollapsed ? 'hidden' : 'block'} h-full`}>
      <Sidebar onMenuSelect={handleSubMenuSelect} />
    </div>
  ), [sidebarCollapsed, handleSubMenuSelect]);

  const sidebarStyle = useMemo(() => ({
    width: sidebarCollapsed ? '0' : '250px',
    transform: isMobile && sidebarCollapsed ? 'translateX(-250px)' : 'translateX(0)',
    flexShrink: 0,
  }), [sidebarCollapsed, isMobile]);

  return (
    <div className="flex h-screen w-full relative">
      {/* Mobile Backdrop */}
      {!sidebarCollapsed && isMobile && (
        <div
          className="fixed inset-0 w-full h-full bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          bg-gray-800 text-white p-0 overflow-y-auto shadow-sm
          transition-all duration-300 ease-in-out
          ${isMobile ? 'fixed left-0 top-0 h-full z-20' : 'relative h-full'}
        `}
        style={sidebarStyle}
      >
        {sidebarComponent}
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-grow overflow-hidden transition-all duration-300">
        {/* Topbar */}
        <header className="bg-gray-100 h-[50px] flex-shrink-0">
          <Topbar
            onMenuToggle={toggleSidebar}
            selectedSubMenu={selectedSubMenu}
            sidebarCollapsed={sidebarCollapsed}
          />
        </header>

        {/* Page Content */}
        <main className="flex-grow overflow-auto p-4 bg-white">
          {selectedSubMenu ? (
            // <DataTable submenu={selectedSubMenu} />
            <div className="p-4">
              <div className="flex items-center mb-4">
                <i className={`fas ${selectedSubMenu.icon} text-2xl mr-3 text-blue-500`}></i>
                <h2 className="text-xl font-semibold text-gray-800">{selectedSubMenu.title}</h2>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600 mb-2">Public Secret:</p>
                <code className="text-xs bg-gray-100 p-2 rounded-md block overflow-x-auto">
                  {selectedSubMenu.public_secret}
                </code>
              </div>
              
              {/* Display submenus if available */}
              {selectedSubMenu.submenus && selectedSubMenu.submenus.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Submenus</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedSubMenu.submenus.map(submenu => (
                      <div key={submenu.public_secret} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                        <div className="flex items-center">
                          <i className={`fas ${submenu.icon} text-blue-400 mr-2`}></i>
                          <span className="text-gray-700">{submenu.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <i className="fas fa-list-alt text-4xl text-gray-300 mb-3"></i>
                <p className="text-gray-400 text-lg">Select a menu to view data</p>
                <p className="text-gray-400 text-sm mt-1">Choose an option from the sidebar to get started</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}