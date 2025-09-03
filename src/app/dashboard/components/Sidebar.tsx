'use client';

import { API } from '@/config/api_urls';
import { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

// Import all necessary Font Awesome icons
import { 
  faDashboard, 
  faCog, 
  faTools,
  faCircle,
  faChevronDown,
  faQuestionCircle,
  // Add more icons as needed based on your API response
  faUsers,
  faShoppingCart,
  faChartBar,
  faFile,
  faBox,
  faTag,
  faBell,
  faEnvelope,
  faCubes,
  faLayerGroup,
  faShieldAlt,
  faBars,
  faList
} from '@fortawesome/free-solid-svg-icons';

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

type SidebarProps = {
  onMenuSelect: (menu: Menu) => void;
};

// Comprehensive icon mapping based on your API response
const iconMap: { [key: string]: any } = {
  // Main menu icons from your API
  'fa-dashboard': faDashboard,
  'fa-cog': faCog,
  'fa-tools': faTools,
  'fa-circle': faCircle,
  
  // Additional icons that might be used
  'fa-users': faUsers,
  'fa-user': faUsers,
  'fa-shopping-cart': faShoppingCart,
  'fa-chart-bar': faChartBar,
  'fa-file': faFile,
  'fa-box': faBox,
  'fa-tag': faTag,
  'fa-bell': faBell,
  'fa-envelope': faEnvelope,
  'fa-cubes': faCubes,
  'fa-layer-group': faLayerGroup,
  'fa-shield-alt': faShieldAlt,
  'fa-bars': faBars,
  'fa-list': faList,
  
  // UI icons
  'fa-chevron-down': faChevronDown,
  'fa-question-circle': faQuestionCircle,
};

export default function Sidebar({ onMenuSelect }: SidebarProps) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the appropriate icon component with fallback
  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || faCircle; // Default to circle icon
  };

  // Fetch menus - wrapped in useCallback to prevent infinite re-renders
  const fetchMenus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('access') || '' : '';
      
      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      const response = await axios.get(API.MENUS, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const fetchedMenus = response.data.data as Menu[];
        setMenus(fetchedMenus);

        if (fetchedMenus.length > 0) {
          const firstMenu = fetchedMenus[0];
          handleMenuSelect(firstMenu);
          
          // Expand if it has submenus
          if (firstMenu.submenus?.length) {
            setExpandedMenus(new Set([firstMenu.public_secret]));
          }
        }
      } else {
        setError(response.data.message || 'Menu fetch failed');
        console.error('Menu fetch failed:', response.data.message);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'API Error';
      setError(errorMessage);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const handleMenuSelect = (menu: Menu) => {
    setSelectedMenuId(menu.public_secret);
    onMenuSelect(menu);
  };

  const handleSubMenuSelect = (submenu: Menu) => {
    setSelectedMenuId(submenu.public_secret);
    onMenuSelect(submenu);
  };

  const toggleMenuExpansion = (menuSecret: string, menu: Menu) => {
    const newExpanded = new Set(expandedMenus);
    
    if (newExpanded.has(menuSecret)) {
      newExpanded.delete(menuSecret);
    } else {
      newExpanded.add(menuSecret);
    }
    
    setExpandedMenus(newExpanded);
    
    // If menu has no submenus, select it directly when clicked
    if (!menu.submenus?.length) {
      handleMenuSelect(menu);
    }
  };

  const isMenuActive = (menu: Menu): boolean => {
    return menu.public_secret === selectedMenuId || 
           menu.submenus?.some(sub => sub.public_secret === selectedMenuId) || 
           false;
  };

  const isSubMenuActive = (submenu: Menu): boolean => {
    return submenu.public_secret === selectedMenuId;
  };

  if (loading) {
    return (
      <div className="sidebar-inner h-full flex flex-col bg-gray-800 text-white w-full md:w-[250px] min-w-0">
        <div className="sidebar-brand h-12 shadow bg-white text-gray-900 flex-shrink-0 flex items-center justify-center">
          <h5 className="m-0 font-semibold">CRM</h5>
        </div>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <p className="mt-2 text-gray-400">Loading menus...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sidebar-inner h-full flex flex-col bg-gray-800 text-white w-full md:w-[250px] min-w-0">
        <div className="sidebar-brand h-12 shadow bg-white text-gray-900 flex-shrink-0 flex items-center justify-center">
          <h5 className="m-0 font-semibold">CRM</h5>
        </div>
        <div className="flex items-center justify-center h-full p-4">
          <div className="text-center">
            <FontAwesomeIcon icon={faQuestionCircle} className="text-red-400 text-2xl mb-2" />
            <p className="text-red-300">Error loading menus</p>
            <p className="text-gray-400 text-sm mt-1">{error}</p>
            <button 
              onClick={() => fetchMenus()}
              className="mt-3 px-3 py-1 bg-gray-700 rounded text-sm hover:bg-gray-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sidebar-inner h-full flex flex-col bg-gray-800 text-white w-full md:w-[250px] min-w-0 transition-all duration-300">
      {/* Logo/Brand Section */}
      <div className="sidebar-brand h-12 shadow bg-white text-gray-900 flex-shrink-0 flex items-center justify-center">
        <h5 className="m-0 font-semibold">CRM</h5>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav flex-grow overflow-y-auto py-2 px-2">
        {menus.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <FontAwesomeIcon icon={faDashboard} className="text-2xl mb-2 opacity-50" />
            <p>No menus available</p>
          </div>
        ) : (
          menus.map((menu) => {
            const hasSubmenus = menu.submenus && menu.submenus.length > 0;
            const isExpanded = expandedMenus.has(menu.public_secret);
            const isActive = isMenuActive(menu);
            const IconComponent = getIconComponent(menu.icon);

            return (
              <div key={menu.public_secret} className="menu-group mb-1">
                {/* Menu Item */}
                <button
                  className={`w-full px-3 py-1.5 rounded-md transition-all duration-200 flex items-center justify-between group ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'hover:bg-gray-700 text-gray-200'
                  }`}
                  onClick={() => toggleMenuExpansion(menu.public_secret, menu)}
                  type="button"
                >
                  <div className="flex items-center">
                    <FontAwesomeIcon 
                      icon={IconComponent} 
                      className={`w-4 h-4 text-center mr-3 ${
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                      }`} 
                    />
                    <span className="font-medium">{menu.title}</span>
                  </div>
                  
                  {hasSubmenus && (
                    <FontAwesomeIcon 
                      icon={faChevronDown} 
                      className={`text-xs transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      } ${isActive ? 'text-white' : 'text-gray-400'}`} 
                    />
                  )}
                </button>

                {/* Submenu Items */}
                {hasSubmenus && isExpanded && (
                  <div className="mt-1 pl-3">
                    {menu.submenus!.map((submenu) => {
                      const SubIconComponent = getIconComponent(submenu.icon);
                      const isSubActive = isSubMenuActive(submenu);
                      
                      return (
                        <button
                          key={submenu.public_secret}
                          onClick={() => handleSubMenuSelect(submenu)}
                          className={`w-full px-3 py-2 rounded-md transition-all duration-200 flex items-center text-left mb-1 ${
                            isSubActive
                              ? 'bg-blue-500/20 text-blue-200 border-l-2 border-blue-400 -ml-0.5'
                              : 'hover:bg-gray-700/50 text-gray-300'
                          }`}
                        >
                          <FontAwesomeIcon 
                            icon={SubIconComponent} 
                            className={`w-3 h-3 text-center mr-3 ${
                              isSubActive ? 'text-blue-300' : 'text-gray-500'
                            }`} 
                          />
                          <span className="text-sm">{submenu.title}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </nav>
    </div>
  );
}