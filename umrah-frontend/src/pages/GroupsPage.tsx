import { useState, useMemo } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import AddGroupModal from '../components/groups/AddGroupModal';
import GroupDetailsModal, { type GroupDetailsModalData } from '../components/groups/GroupDetailsModal';
import GroupStatusSelector, { type GroupStatusType } from '../components/groups/GroupStatusSelector';
import {
  ChevronDown,
  Search,
  Plus,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface GroupData {
  id: string;
  code: string;
  name: string;
  mainAgent: string;
  subAgent: string;
  nationality: string;
  pilgrimsCount: number;
  status: 'مكتمل' | 'قيد التجهيز' | 'ناقص';
}

export default function GroupsPage() {
  const { t, isRTL, direction } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [selectedGroup, setSelectedGroup] = useState<GroupDetailsModalData | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [agentFilter, setAgentFilter] = useState('الكل');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [currentPage, setCurrentPage] = useState(1);

  // Group items
  const [groupsList, setGroupsList] = useState<GroupData[]>([
    {
      id: '1',
      code: 'GRP-2401',
      name: isRTL ? 'مجموعة الأنوار 1' : 'Al-Anwar Group 1',
      mainAgent: isRTL ? 'وكالة مكة للطيران' : 'Makkah Aviation Agency',
      subAgent: isRTL ? 'تسهيل للسياحة' : 'Tasheel Tourism',
      nationality: isRTL ? 'باكستان' : 'Pakistan',
      pilgrimsCount: 145,
      status: 'مكتمل',
    },
    {
      id: '2',
      code: 'GRP-2402',
      name: isRTL ? 'أفواج التوحيد' : 'Al-Tawheed Groups',
      mainAgent: isRTL ? 'نور الإيمان الدولية' : 'Noor Al-Iman International',
      subAgent: isRTL ? 'الوكيل الفرعي بمصر' : 'Sub-Agent in Egypt',
      nationality: isRTL ? 'مصر' : 'Egypt',
      pilgrimsCount: 88,
      status: 'قيد التجهيز',
    },
    {
      id: '3',
      code: 'GRP-2403',
      name: isRTL ? 'حجاج جاكرتا المميز' : 'Jakarta Premium Pilgrims',
      mainAgent: isRTL ? 'إندونيسيا ترافيل' : 'Indonesia Travel',
      subAgent: isRTL ? 'رحلات الهدى' : 'Al-Huda Trips',
      nationality: isRTL ? 'إندونيسيا' : 'Indonesia',
      pilgrimsCount: 210,
      status: 'مكتمل',
    },
    {
      id: '4',
      code: 'GRP-2404',
      name: isRTL ? 'فوج الصفا والمروة' : 'Al-Safa & Al-Marwa Group',
      mainAgent: isRTL ? 'الصفا ترافيل الهند' : 'Al-Safa Travel India',
      subAgent: isRTL ? 'تور الصفا الفرعي' : 'Noor Al-Safa Sub-Agent',
      nationality: isRTL ? 'الهند' : 'India',
      pilgrimsCount: 120,
      status: 'ناقص',
    },
    {
      id: '5',
      code: 'GRP-2405',
      name: isRTL ? 'مجموعة طيبة الطيبة' : 'Taibah Al-Taibah Group',
      mainAgent: isRTL ? 'وكالة أنقرة للسياحة' : 'Ankara Tourism Agency',
      subAgent: isRTL ? 'تسهيل تركيا' : 'Tasheel Turkey',
      nationality: isRTL ? 'تركيا' : 'Turkey',
      pilgrimsCount: 65,
      status: 'قيد التجهيز',
    },
    {
      id: '6',
      code: 'GRP-2406',
      name: isRTL ? 'فوج الرحمة والمغفرة' : 'Al-Rahma & Al-Maghfira Group',
      mainAgent: isRTL ? 'رابطة الإسلام إندونيسيا' : 'Islamic Association Indonesia',
      subAgent: isRTL ? 'تسهيل جاكرتا' : 'Tasheel Jakarta',
      nationality: isRTL ? 'إندونيسيا' : 'Indonesia',
      pilgrimsCount: 180,
      status: 'مكتمل',
    },
    {
      id: '7',
      code: 'GRP-2407',
      name: isRTL ? 'مجموعة القدس الشريف' : 'Al-Quds Al-Sharif Group',
      mainAgent: isRTL ? 'وكالة عمان الحديثة' : 'Modern Amman Agency',
      subAgent: isRTL ? 'القدس الأردنية' : 'Al-Quds Jordan',
      nationality: isRTL ? 'الأردن' : 'Jordan',
      pilgrimsCount: 45,
      status: 'ناقص',
    },
    {
      id: '8',
      code: 'GRP-2408',
      name: isRTL ? 'أفواج الرحمن الخاصة' : 'Al-Rahman Special Groups',
      mainAgent: isRTL ? 'الرحمن باكستان' : 'Al-Rahman Pakistan',
      subAgent: isRTL ? 'تسهيل كراتشي' : 'Tasheel Karachi',
      nationality: isRTL ? 'باكستان' : 'Pakistan',
      pilgrimsCount: 112,
      status: 'قيد التجهيز',
    },
  ]);

  // Filtering logic
  const filteredGroups = useMemo(() => {
    return groupsList.filter((grp) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        grp.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grp.mainAgent.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grp.subAgent.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grp.nationality.toLowerCase().includes(searchQuery.toLowerCase());

      const matchAgent =
        agentFilter === 'الكل' ||
        grp.mainAgent === agentFilter ||
        grp.subAgent === agentFilter;

      const matchStatus =
        statusFilter === 'الكل' || grp.status === statusFilter;

      return matchSearch && matchAgent && matchStatus;
    });
  }, [searchQuery, agentFilter, statusFilter, groupsList]);

  const handleStatusChange = (groupId: string, newStatus: GroupStatusType) => {
    setGroupsList((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, status: newStatus } : g))
    );
  };

  return (
    <div
      className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-row"
      dir={direction}
    >
      {/* Sidebar: RTL on Right, LTR on Left */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeTab="groups"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <Navbar
          title={t('groups.title', 'إدارة وتجهيز المجموعات')}
          onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Groups Main Content */}
        <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-[1600px] w-full mx-auto">
          {/* Action / Filter Bar Card Container */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[280px]">
              <input
                type="text"
                placeholder={t('groups.search_placeholder', 'ابحث برقم المجموعة، الاسم، الوكيل أو الجنسية...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full bg-[#f8fafc] border border-slate-200/80 rounded-xl py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 focus:bg-white transition ${
                  isRTL ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'
                }`}
              />
              <Search className={`w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                isRTL ? 'right-3.5' : 'left-3.5'
              }`} />
            </div>

            {/* Filters and Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Agent Filter Dropdown */}
              <div className="relative">
                <select
                  value={agentFilter}
                  onChange={(e) => setAgentFilter(e.target.value)}
                  className={`appearance-none bg-[#f8fafc] hover:bg-slate-100/80 border border-slate-200/80 rounded-xl py-2.5 text-xs sm:text-sm text-slate-700 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 focus:bg-white transition shadow-xs ${
                    isRTL ? 'pr-4 pl-9 text-right' : 'pl-4 pr-9 text-left'
                  }`}
                >
                  <option value="الكل">{isRTL ? 'الوكيل: جميع الوكلاء' : 'Agent: All Agents'}</option>
                  {(() => {
                    try {
                      const saved = localStorage.getItem('system_list_agents');
                      if (saved) {
                        const parsed = JSON.parse(saved);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                          return parsed
                            .filter((a: { status: string }) => a.status === 'Active')
                            .map((agent: { id: string; nameAr: string; nameEn: string }) => {
                              const label = isRTL ? agent.nameAr : agent.nameEn;
                              return (
                                <option key={agent.id} value={label}>
                                  {label}
                                </option>
                              );
                            });
                        }
                      }
                    } catch {
                      // ignore
                    }
                    return (
                      <>
                        <option value={isRTL ? 'حاسوب لتجارة التقنية - 2067' : 'Hasoob Technology Trading - 2067'}>
                          {isRTL ? 'حاسوب لتجارة التقنية - 2067' : 'Hasoob Technology Trading - 2067'}
                        </option>
                        <option value={isRTL ? 'أودست للسياحة والسفر - 2114' : 'ODST Travel and Tourism - 2114'}>
                          {isRTL ? 'أودست للسياحة والسفر - 2114' : 'ODST Travel and Tourism - 2114'}
                        </option>
                        <option value={isRTL ? 'وكالة مكة للطيران' : 'Makkah Aviation Agency'}>{isRTL ? 'وكالة مكة للطيران' : 'Makkah Aviation Agency'}</option>
                        <option value={isRTL ? 'نور الإيمان الدولية' : 'Noor Al-Iman International'}>{isRTL ? 'نور الإيمان الدولية' : 'Noor Al-Iman International'}</option>
                        <option value={isRTL ? 'إندونيسيا ترافيل' : 'Indonesia Travel'}>{isRTL ? 'إندونيسيا ترافيل' : 'Indonesia Travel'}</option>
                        <option value={isRTL ? 'الصفا ترافيل الهند' : 'Safa Travel India'}>{isRTL ? 'الصفا ترافيل الهند' : 'Safa Travel India'}</option>
                        <option value={isRTL ? 'وكالة أنقرة للسياحة' : 'Ankara Tours Agency'}>{isRTL ? 'وكالة أنقرة للسياحة' : 'Ankara Tours Agency'}</option>
                      </>
                    );
                  })()}
                </select>
                <ChevronDown className={`w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                  isRTL ? 'left-3' : 'right-3'
                }`} />
              </div>

              {/* Status Filter Dropdown */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`appearance-none bg-[#f8fafc] hover:bg-slate-100/80 border border-slate-200/80 rounded-xl py-2.5 text-xs sm:text-sm text-slate-700 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 focus:bg-white transition shadow-xs ${
                    isRTL ? 'pr-4 pl-9 text-right' : 'pl-4 pr-9 text-left'
                  }`}
                >
                  <option value="الكل">{isRTL ? 'الحالة: الكل' : 'Status: All'}</option>
                  <option value="مكتمل">{t('common.completed', 'مكتمل')}</option>
                  <option value="قيد التجهيز">{t('common.in_progress', 'قيد التجهيز')}</option>
                  <option value="ناقص">{t('common.incomplete', 'ناقص')}</option>
                </select>
                <ChevronDown className={`w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                  isRTL ? 'left-3' : 'right-3'
                }`} />
              </div>

              {/* Apply Sort Button */}
              <button
                type="button"
                onClick={() => {}}
                className="bg-[#1c2844] hover:bg-[#152037] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs flex items-center justify-center cursor-pointer active:scale-[0.99] whitespace-nowrap"
              >
                <span>{t('groups.apply_sort', 'تطبيق الترتيب')}</span>
              </button>

              {/* Add New Group Button */}
              <button
                onClick={() => {
                  setEditingGroup(null);
                  setIsAddModalOpen(true);
                }}
                className="bg-[#10b981] hover:bg-[#059669] text-white px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] whitespace-nowrap"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>{t('groups.add_new', 'إضافة مجموعة جديدة')}</span>
              </button>
            </div>
          </div>

          {/* Groups Table Card Container */}
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className={`w-full border-collapse ${isRTL ? 'text-right' : 'text-left'}`}>
                {/* Table Header */}
                <thead>
                  <tr className="border-b border-slate-200/80 text-xs sm:text-sm text-slate-700 font-bold bg-[#fafbfc]">
                    <th className="py-4 px-6 whitespace-nowrap">{t('groups.col_code', 'رقم المجموعة')}</th>
                    <th className="py-4 px-6 whitespace-nowrap">{t('groups.col_name', 'اسم المجموعة')}</th>
                    <th className="py-4 px-6 whitespace-nowrap">{t('groups.col_main_agent', 'الوكيل الرئيسي')}</th>
                    <th className="py-4 px-6 whitespace-nowrap">{t('groups.col_sub_agent', 'الوكيل الفرعي')}</th>
                    <th className="py-4 px-6 whitespace-nowrap">{t('groups.col_nationality', 'الجنسية')}</th>
                    <th className="py-4 px-6 text-center whitespace-nowrap">{t('groups.col_pilgrims', 'عدد الحجاج')}</th>
                    <th className="py-4 px-6 text-center whitespace-nowrap">{t('groups.col_status', 'الحالة')}</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {filteredGroups.length > 0 ? (
                    filteredGroups.map((group) => (
                      <tr
                        key={group.id}
                        onClick={() => {
                          setSelectedGroup({
                            id: group.id,
                            code: group.code,
                            name: group.name,
                            groupCodeNumber: '480900XXXXXX',
                            agreementNumber: (group as any).agreementNumber || 'AGR-1125900',
                            mainAgent: group.mainAgent,
                            subAgent: group.subAgent,
                            nationality: group.nationality,
                            pilgrimsCount: group.pilgrimsCount,
                            status: group.status,
                            makkahHotel: isRTL ? 'فندق مكة 1' : 'Makkah Hotel 1',
                            makkahCheckIn: '2024-08-15',
                            makkahCheckOut: '2024-08-20',
                            madinahHotel: isRTL ? 'فندق المدينة المنورة' : 'Madinah Hotel',
                            madinahCheckIn: '2024-08-20',
                            madinahCheckOut: '2024-08-25',
                            departureFlightNo: 'SV-0379',
                            departureDate: '2024-08-25',
                            departureAirport: isRTL ? 'مطار الأمير محمد بن عبدالعزيز - المدينة' : 'Prince Mohammad Bin Abdulaziz Airport - Madinah',
                            arrivalFlightNo: 'SV-0378',
                            arrivalDate: '2024-08-15',
                            transportCompany: isRTL ? 'شركة حافل للنقل' : 'Hafil Transport Company',
                            operationNumber: 'OPS-7489',
                            driverName: isRTL ? 'سامي السلمي' : 'Sami Al-Sulami',
                            driverPhone: '+966 51 234 5678',
                            busPlateNo: '9312 HFL',
                            umrahPermitStatus: isRTL ? 'مقبول' : 'Approved',
                            rawdahMenPermitStatus: isRTL ? 'قيد المراجعة' : 'In Review',
                            rawdahWomenPermitStatus: isRTL ? 'لم يُقدم' : 'Not Submitted',
                            arrivalGrouping: isRTL ? 'مكتمل' : 'Completed',
                            interCityGrouping: isRTL ? 'مغلق' : 'Closed',
                            departureGrouping: isRTL ? 'لا يوجد' : 'None',
                          });
                          setIsDetailsModalOpen(true);
                        }}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      >
                        {/* Group Code */}
                        <td className="py-4 px-6 font-bold text-[#0f172a] whitespace-nowrap">
                          {group.code}
                        </td>

                        {/* Group Name */}
                        <td className="py-4 px-6 font-bold text-slate-800 whitespace-nowrap">
                          {group.name}
                        </td>

                        {/* Main Agent */}
                        <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                          {group.mainAgent}
                        </td>

                        {/* Sub Agent */}
                        <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                          {group.subAgent}
                        </td>

                        {/* Nationality */}
                        <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                          {group.nationality}
                        </td>

                        {/* Pilgrims Count */}
                        <td className="py-4 px-6 text-center font-bold text-[#0f172a] whitespace-nowrap">
                          {group.pilgrimsCount}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <GroupStatusSelector
                            value={group.status}
                            onChange={(newStatus) => handleStatusChange(group.id, newStatus)}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-12 text-center text-slate-400 text-sm"
                      >
                        {t('groups.no_results', 'لا توجد نتائج مطابقة لخيارات البحث')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer & Pagination */}
            <div className="border-t border-slate-200/90 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
              {/* Pagination Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition cursor-pointer disabled:opacity-40"
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentPage(1)}
                  className={`w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center transition cursor-pointer ${
                    currentPage === 1
                      ? 'bg-[#1c2844] text-white shadow-xs'
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  1
                </button>
                <button
                  onClick={() => setCurrentPage(2)}
                  className={`w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center transition cursor-pointer ${
                    currentPage === 2
                      ? 'bg-[#1c2844] text-white shadow-xs'
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  2
                </button>
                <button
                  onClick={() => setCurrentPage(3)}
                  className={`w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center transition cursor-pointer ${
                    currentPage === 3
                      ? 'bg-[#1c2844] text-white shadow-xs'
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  3
                </button>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition cursor-pointer disabled:opacity-40"
                  disabled={currentPage === 3}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Total Count Text */}
              <div className="text-xs sm:text-sm text-slate-500 font-medium">
                {isRTL ? 'عرض ١-٨ من أصل ٢٤ مجموعة نشطة' : 'Showing 1-8 of 24 active groups'}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add New Group Modal / Edit Group Modal */}
      <AddGroupModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingGroup(null);
        }}
        initialData={editingGroup}
        onSuccess={(savedGroup) => {
          if (editingGroup) {
            setGroupsList((prev) =>
              prev.map((g) =>
                g.id === editingGroup.id
                  ? { ...g, ...savedGroup }
                  : g
              )
            );
          } else {
            setGroupsList((prev) => [
              { id: String(Date.now()), ...savedGroup },
              ...prev,
            ]);
          }
          setEditingGroup(null);
        }}
      />

      {/* Group Details Modal */}
      <GroupDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        group={selectedGroup}
        onEdit={(groupData) => {
          setIsDetailsModalOpen(false);
          setEditingGroup(groupData);
          setIsAddModalOpen(true);
        }}
      />
    </div>
  );
}
