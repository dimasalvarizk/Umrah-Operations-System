import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { useLanguage } from '../context/LanguageContext';
import { usePermissions } from '../hooks/usePermissions';

import ManageTeamTab from '../components/settings/ManageTeamTab';
import EditProfileTab from '../components/settings/EditProfileTab';
import SecurityTab from '../components/settings/SecurityTab';
import NotificationsTab from '../components/settings/NotificationsTab';
import MasterListsTab from '../components/settings/MasterListsTab';

export type SettingsTabId =
  | 'team'
  | 'profile'
  | 'security'
  | 'notifications'
  | 'lists';

export default function SettingsPage() {
  const { direction, t, isRTL } = useLanguage();
  const { isSuperAdmin } = usePermissions();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const rawTab = searchParams.get('tab') as SettingsTabId;
  const initialTab: SettingsTabId = (!isSuperAdmin && (rawTab === 'team' || rawTab === 'lists' || !rawTab))
    ? 'profile'
    : (rawTab || 'team');

  const [activeTab, setActiveTab] = useState<SettingsTabId>(initialTab);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as SettingsTabId;
    if (tabFromUrl && ['team', 'profile', 'security', 'notifications', 'lists'].includes(tabFromUrl)) {
      if (!isSuperAdmin && (tabFromUrl === 'team' || tabFromUrl === 'lists')) {
        setActiveTab('profile');
      } else {
        setActiveTab(tabFromUrl);
      }
    }
  }, [searchParams, isSuperAdmin]);

  const handleTabChange = (tabId: SettingsTabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const allTabs: Array<{
    id: SettingsTabId;
    labelEn: string;
    labelAr: string;
    requiresAdmin?: boolean;
  }> = [
    {
      id: 'team',
      labelEn: 'Manage Team',
      labelAr: 'فريق العمل والصلاحيات',
      requiresAdmin: true,
    },
    {
      id: 'profile',
      labelEn: 'Edit Profile',
      labelAr: 'الملف الشخصي',
    },
    {
      id: 'security',
      labelEn: 'Security & Access',
      labelAr: 'الأمان والحماية',
    },
    {
      id: 'notifications',
      labelEn: 'Notifications',
      labelAr: 'التنبيهات والإشعارات',
    },
    {
      id: 'lists',
      labelEn: 'System Lists',
      labelAr: 'قوائم وبيانات النظام',
      requiresAdmin: true,
    },
  ];

  const tabs = allTabs.filter((tab) => !tab.requiresAdmin || isSuperAdmin);

  return (
    <div
      className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-row font-sans"
      dir={direction}
    >
      {/* Sidebar */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeTab="settings"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar
          title={t('nav.settings', 'الإعدادات')}
          onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Page Main Body */}
        <main className="flex-1 p-4 sm:p-7 space-y-6 max-w-7xl w-full mx-auto">
          {/* Clean Horizontal Navigation Tabs */}
          <div
            className={`border-b border-slate-200 transition-all duration-400 transform ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar -mb-px">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={`px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer border-b-2 active:scale-[0.98] ${
                      isActive
                        ? 'border-amber-500 text-slate-900 font-bold'
                        : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {isRTL ? tab.labelAr : tab.labelEn}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content Panels */}
          <div
            key={activeTab}
            className={`w-full transition-all duration-500 transform animate-fadeIn ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            {activeTab === 'team' && <ManageTeamTab />}
            {activeTab === 'profile' && <EditProfileTab />}
            {activeTab === 'security' && <SecurityTab />}
            {activeTab === 'notifications' && <NotificationsTab />}
            {activeTab === 'lists' && <MasterListsTab />}
          </div>
        </main>
      </div>
    </div>
  );
}
