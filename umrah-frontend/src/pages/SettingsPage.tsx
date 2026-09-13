import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { useLanguage } from '../context/LanguageContext';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const initialTab = (searchParams.get('tab') as SettingsTabId) || 'team';
  const [activeTab, setActiveTab] = useState<SettingsTabId>(initialTab);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as SettingsTabId;
    if (tabFromUrl && ['team', 'profile', 'security', 'notifications', 'lists'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (tabId: SettingsTabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const tabs: Array<{
    id: SettingsTabId;
    labelEn: string;
    labelAr: string;
  }> = [
    {
      id: 'team',
      labelEn: 'Manage Team',
      labelAr: 'فريق العمل والصلاحيات',
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
    },
  ];

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
          <div className="border-b border-slate-200">
            <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar -mb-px">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={`px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer border-b-2 ${
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
          <div className="w-full">
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
