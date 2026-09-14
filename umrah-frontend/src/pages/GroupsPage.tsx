import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  Copy,
  Check,
  Trash2,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  getGroupsApi,
  createGroupApi,
  updateGroupApi,
  updateGroupStatusApi,
  deleteGroupApi,
} from '../services/groupsApi';

interface GroupData {
  id: string;
  code: string;
  name: string;
  agreementNumber?: string;
  mainAgent: string;
  subAgent: string;
  nationality: string;
  packageType?: string;
  pilgrimsCount: number;
  status: 'مكتمل' | 'قيد التجهيز' | 'ناقص' | string;
  makkahHotel?: string;
  makkahCheckIn?: string;
  makkahCheckOut?: string;
  madinahHotel?: string;
  madinahCheckIn?: string;
  madinahCheckOut?: string;
  makkahHotel2?: string;
  makkah2CheckIn?: string;
  makkah2CheckOut?: string;
  hospitalityNotes?: string;
  departureAirline?: string;
  departureFlightNo?: string;
  departureDate?: string;
  departureAirport?: string;
  departureDestination?: string;
  arrivalAirline?: string;
  arrivalFlightNo?: string;
  arrivalDate?: string;
  arrivalAirport?: string;
  arrivalOrigin?: string;
  transportCompany?: string;
  operationNumber?: string;
  driverName?: string;
  driverPhone?: string;
  busPlateNo?: string;
  umrahPermitStatus?: string;
  rawdahMenPermitStatus?: string;
  rawdahWomenPermitStatus?: string;
  arrivalGrouping?: string;
  arrivalGroupingStatus?: string;
  interCityGrouping?: string;
  intercityGroupingStatus?: string;
  departureGrouping?: string;
  departureGroupingStatus?: string;
  makkahZiyarat?: string;
  madinahZiyarat?: string;
  enrichmentProgram?: string;
  missingRequirements?: string;
  additionalNotes?: string;
  uploadedFiles?: any;
  hotelsData?: any;
  flightTransportData?: any;
  permitsNotesData?: any;
}

const DEFAULT_GROUPS: GroupData[] = [
  {
    id: '1',
    code: 'GRP-2401',
    name: 'Al-Anwar Group 1',
    mainAgent: 'Makkah Aviation Agency',
    subAgent: 'Tasheel Tourism',
    nationality: 'Pakistan',
    pilgrimsCount: 145,
    status: 'مكتمل',
  },
  {
    id: '2',
    code: 'GRP-2402',
    name: 'Al-Tawheed Groups',
    mainAgent: 'Noor Al-Iman International',
    subAgent: 'Sub-Agent in Egypt',
    nationality: 'Egypt',
    pilgrimsCount: 88,
    status: 'قيد التجهيز',
  },
  {
    id: '3',
    code: 'GRP-2403',
    name: 'Jakarta Premium Pilgrims',
    mainAgent: 'Indonesia Travel',
    subAgent: 'Al-Huda Trips',
    nationality: 'Indonesia',
    pilgrimsCount: 210,
    status: 'مكتمل',
  },
  {
    id: '4',
    code: 'GRP-2404',
    name: 'Al-Safa & Al-Marwa Group',
    mainAgent: 'Al-Safa Travel India',
    subAgent: 'Noor Al-Safa Sub-Agent',
    nationality: 'India',
    pilgrimsCount: 120,
    status: 'ناقص',
  },
  {
    id: '5',
    code: 'GRP-2405',
    name: 'Taibah Al-Taibah Group',
    mainAgent: 'Ankara Tourism Agency',
    subAgent: 'Tasheel Turkey',
    nationality: 'Turkey',
    pilgrimsCount: 65,
    status: 'قيد التجهيز',
  },
  {
    id: '6',
    code: 'GRP-2406',
    name: 'Islamic Association Indonesia',
    mainAgent: 'Islamic Association Indonesia',
    subAgent: 'Tasheel Jakarta',
    nationality: 'Indonesia',
    pilgrimsCount: 180,
    status: 'مكتمل',
  },
  {
    id: '7',
    code: 'GRP-2407',
    name: 'Al-Quds Al-Sharif Group',
    mainAgent: 'Modern Amman Agency',
    subAgent: 'Al-Quds Jordan',
    nationality: 'Jordan',
    pilgrimsCount: 45,
    status: 'ناقص',
  },
  {
    id: '8',
    code: 'GRP-2408',
    name: 'Al-Rahman Special Groups',
    mainAgent: 'Al-Rahman Pakistan',
    subAgent: 'Tasheel Karachi',
    nationality: 'Pakistan',
    pilgrimsCount: 112,
    status: 'قيد التجهيز',
  },
];

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

  const [searchParams] = useSearchParams();

  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<GroupData | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleCopyCode = (e: React.MouseEvent, code: string, id: string) => {
    e.stopPropagation();
    if (!code || code === '-') return;
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleConfirmDelete = async () => {
    if (!groupToDelete) return;
    setIsDeleting(true);
    try {
      await deleteGroupApi(groupToDelete.id);
      setGroupsList((prev) => prev.filter((g) => g.id !== groupToDelete.id));
      setGroupToDelete(null);
    } catch (err) {
      console.error('Failed to delete group:', err);
      // Local fallback removal
      setGroupsList((prev) => prev.filter((g) => g.id !== groupToDelete.id));
      setGroupToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Group items
  const [groupsList, setGroupsList] = useState<GroupData[]>(() => {
    try {
      const saved = localStorage.getItem('umrah_groups_list');
      return saved ? JSON.parse(saved) : DEFAULT_GROUPS;
    } catch {
      return DEFAULT_GROUPS;
    }
  });

  // Auto open modal when query param is present (e.g. from notification click /groups?openGroup=test)
  useEffect(() => {
    const target = searchParams.get('openGroup') || searchParams.get('groupId') || searchParams.get('code');
    if (target && groupsList.length > 0) {
      const match = groupsList.find(
        (g) =>
          String(g.id) === target ||
          String(g.code).toLowerCase() === target.toLowerCase() ||
          String(g.name).toLowerCase() === target.toLowerCase()
      );
      if (match) {
        setSelectedGroup(match as any);
        setIsDetailsModalOpen(true);
      } else {
        setSearchQuery(target);
      }
    }
  }, [searchParams, groupsList]);

  // Handle immediate open record event if already on the groups page
  useEffect(() => {
    const handleOpenRecord = (e: any) => {
      const detail = e.detail;
      if (detail && (detail.type === 'group' || detail.type === 'permit') && detail.id) {
        const target = String(detail.id);
        const match = groupsList.find(
          (g) =>
            String(g.id) === target ||
            String(g.code).toLowerCase() === target.toLowerCase() ||
            String(g.name).toLowerCase() === target.toLowerCase()
        );
        if (match) {
          setSelectedGroup(match as any);
          setIsDetailsModalOpen(true);
        } else {
          setSearchQuery(target);
        }
      }
    };
    window.addEventListener('umrah_open_record', handleOpenRecord);
    return () => window.removeEventListener('umrah_open_record', handleOpenRecord);
  }, [groupsList]);

  // Load from backend
  const fetchGroups = async () => {
    try {
      const { groups } = await getGroupsApi({
        search: searchQuery,
        agent: agentFilter,
        status: statusFilter,
      });
      if (Array.isArray(groups)) {
        setGroupsList(
          groups.map((g) => ({
            ...g,
            id: String(g.id),
            code: g.code,
            name: g.name,
            agreementNumber: g.agreementNumber || '',
            mainAgent: g.mainAgent || '',
            subAgent: g.subAgent || '',
            nationality: g.nationality || '',
            packageType: g.packageType || '',
            pilgrimsCount: Number(g.pilgrimsCount) || 0,
            status: g.status || 'قيد التجهيز',
            hotelsData: g.hotelsData,
            flightTransportData: g.flightTransportData,
            permitsNotesData: g.permitsNotesData,
          }))
        );
      }
    } catch (err) {
      console.error('Failed to fetch groups from DB:', err);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [searchQuery, agentFilter, statusFilter]);

  // Persist backup to localStorage safely
  useEffect(() => {
    try {
      const lightweight = groupsList.map((g) => ({
        id: g.id,
        code: g.code,
        name: g.name,
        mainAgent: g.mainAgent,
        subAgent: g.subAgent,
        nationality: g.nationality,
        pilgrimsCount: g.pilgrimsCount,
        status: g.status,
      }));
      localStorage.setItem('umrah_groups_list', JSON.stringify(lightweight));
    } catch {}
  }, [groupsList]);

  // Filtering logic
  const filteredGroups = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return (groupsList || []).filter((grp) => {
      if (!grp) return false;
      const code = String(grp.code || '').toLowerCase();
      const name = String(grp.name || '').toLowerCase();
      const mainAgent = String(grp.mainAgent || '').toLowerCase();
      const subAgent = String(grp.subAgent || '').toLowerCase();
      const nationality = String(grp.nationality || '').toLowerCase();

      const matchSearch =
        query === '' ||
        code.includes(query) ||
        name.includes(query) ||
        mainAgent.includes(query) ||
        subAgent.includes(query) ||
        nationality.includes(query);

      const matchAgent =
        agentFilter === 'الكل' ||
        agentFilter === 'All' ||
        grp.mainAgent === agentFilter ||
        grp.subAgent === agentFilter;

      const matchStatus =
        statusFilter === 'الكل' ||
        statusFilter === 'All' ||
        grp.status === statusFilter;

      return matchSearch && matchAgent && matchStatus;
    });
  }, [searchQuery, agentFilter, statusFilter, groupsList]);

  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.max(1, Math.ceil(filteredGroups.length / ITEMS_PER_PAGE));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedGroups = useMemo(() => {
    const start = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredGroups.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredGroups, validCurrentPage]);

  const handleStatusChange = async (groupId: string, newStatus: GroupStatusType) => {
    setGroupsList((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, status: newStatus } : g))
    );

    try {
      await updateGroupStatusApi(groupId, newStatus);
    } catch {}
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
            <div className="flex flex-wrap items-center gap-2.5">
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
                    const dynamicAgents = Array.from(
                      new Set(
                        groupsList
                          .flatMap((g) => [g.mainAgent, g.subAgent])
                          .filter((agent): agent is string => Boolean(agent && agent.trim()))
                      )
                    );
                    const defaultAgents = [
                      'Makkah Aviation Agency',
                      'Noor Al-Iman International',
                      'Indonesia Travel',
                      'Al-Safa Travel India',
                      'Ankara Tourism Agency',
                      'Islamic Association Indonesia',
                      'Modern Amman Agency',
                      'Al-Rahman Pakistan',
                    ];
                    const agents = Array.from(new Set([...dynamicAgents, ...defaultAgents]));
                    return agents.map((agent) => (
                      <option key={agent} value={agent}>
                        {agent}
                      </option>
                    ));
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
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs">
            <div className="overflow-x-auto min-h-[280px] pb-10">
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
                    <th className="py-4 px-6 text-center whitespace-nowrap">{t('common.actions', 'إجراءات')}</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {paginatedGroups.length > 0 ? (
                    paginatedGroups.map((group) => (
                      <tr
                        key={group.id}
                        onClick={() => {
                          const hotels = typeof group.hotelsData === 'string'
                            ? (() => { try { return JSON.parse(group.hotelsData || '{}'); } catch { return {}; } })()
                            : (group.hotelsData || {});
                          const flights = typeof group.flightTransportData === 'string'
                            ? (() => { try { return JSON.parse(group.flightTransportData || '{}'); } catch { return {}; } })()
                            : (group.flightTransportData || {});
                          const permits = typeof group.permitsNotesData === 'string'
                            ? (() => { try { return JSON.parse(group.permitsNotesData || '{}'); } catch { return {}; } })()
                            : (group.permitsNotesData || {});

                          setSelectedGroup({
                            ...group,
                            groupCodeNumber: group.code,
                            agreementNumber: group.agreementNumber || '',
                            mainAgent: group.mainAgent || '',
                            subAgent: group.subAgent || '',
                            nationality: group.nationality || '',
                            packageType: group.packageType || '',
                            pilgrimsCount: group.pilgrimsCount || 0,
                            status: group.status || 'قيد التجهيز',

                            makkahHotel: group.makkahHotel || hotels.makkahHotel || hotels.makkahHotel1 || '',
                            makkahCheckIn: group.makkahCheckIn || hotels.makkahCheckIn || hotels.makkah1CheckIn || '',
                            makkahCheckOut: group.makkahCheckOut || hotels.makkahCheckOut || hotels.makkah1CheckOut || '',
                            madinahHotel: group.madinahHotel || hotels.madinahHotel || '',
                            madinahCheckIn: group.madinahCheckIn || hotels.madinahCheckIn || '',
                            madinahCheckOut: group.madinahCheckOut || hotels.madinahCheckOut || '',
                            makkahHotel2: group.makkahHotel2 || hotels.makkahHotel2 || '',
                            makkah2CheckIn: group.makkah2CheckIn || hotels.makkah2CheckIn || '',
                            makkah2CheckOut: group.makkah2CheckOut || hotels.makkah2CheckOut || '',
                            hospitalityNotes: group.hospitalityNotes || hotels.hospitalityNotes || '',

                            departureAirline: group.departureAirline || flights.departureAirline || '',
                            departureFlightNo: group.departureFlightNo || flights.departureFlightNo || '',
                            departureDate: group.departureDate || flights.departureDate || '',
                            departureAirport: group.departureAirport || flights.departureAirport || '',
                            departureDestination: group.departureDestination || flights.departureDestination || '',
                            arrivalAirline: group.arrivalAirline || flights.arrivalAirline || '',
                            arrivalFlightNo: group.arrivalFlightNo || flights.arrivalFlightNo || '',
                            arrivalDate: group.arrivalDate || flights.arrivalDate || '',
                            arrivalAirport: group.arrivalAirport || flights.arrivalAirport || '',
                            arrivalOrigin: group.arrivalOrigin || flights.arrivalOrigin || '',
                            transportCompany: group.transportCompany || flights.transportCompany || '',
                            operationNumber: group.operationNumber || flights.operationNumber || '',
                            driverName: group.driverName || flights.driverName || '',
                            driverPhone: group.driverPhone || flights.driverPhone || '',
                            busPlateNo: group.busPlateNo || flights.busPlateNo || '',

                            umrahPermitStatus: group.umrahPermitStatus || permits.umrahPermitStatus || 'قيد المراجعة',
                            rawdahMenPermitStatus: group.rawdahMenPermitStatus || permits.rawdahMenPermitStatus || 'قيد المراجعة',
                            rawdahWomenPermitStatus: group.rawdahWomenPermitStatus || permits.rawdahWomenPermitStatus || 'لم يُقدم',
                            arrivalGrouping: group.arrivalGrouping || permits.arrivalGrouping || 'معلق',
                            interCityGrouping: group.interCityGrouping || permits.interCityGrouping || 'معلق',
                            departureGrouping: group.departureGrouping || permits.departureGrouping || 'لا يوجد',
                            makkahZiyarat: group.makkahZiyarat || permits.makkahZiyarat || '',
                            madinahZiyarat: group.madinahZiyarat || permits.madinahZiyarat || '',
                            enrichmentProgram: group.enrichmentProgram || permits.enrichmentProgram || '',
                            missingRequirements: group.missingRequirements || permits.missingRequirements || '',
                            additionalNotes: group.additionalNotes || permits.additionalNotes || '',
                            uploadedFiles: group.uploadedFiles || permits.uploadedFiles || {},
                            hotelsData: hotels,
                            flightTransportData: flights,
                            permitsNotesData: permits,
                          });
                          setIsDetailsModalOpen(true);
                        }}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      >
                        {/* Group Code + Copy Button */}
                        <td className="py-4 px-6 font-bold text-[#0f172a] whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{group.code}</span>
                            <button
                              type="button"
                              onClick={(e) => handleCopyCode(e, group.code, group.id)}
                              className={`p-1.5 rounded-lg border transition cursor-pointer shadow-2xs flex items-center justify-center ${
                                copiedCodeId === group.id
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                                  : 'bg-white border-slate-200/90 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                              }`}
                              title={copiedCodeId === group.id ? (isRTL ? 'تم النسخ!' : 'Copied!') : (isRTL ? 'نسخ رقم المجموعة' : 'Copy Group Number')}
                            >
                              {copiedCodeId === group.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
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
                            value={group.status as GroupStatusType}
                            onChange={(newStatus) => handleStatusChange(group.id, newStatus)}
                          />
                        </td>

                        {/* Actions (Delete Button) */}
                        <td className="py-4 px-6 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setGroupToDelete(group);
                              }}
                              className="w-8 h-8 rounded-lg border border-rose-200/80 bg-white hover:bg-rose-50 text-rose-500 hover:text-rose-600 flex items-center justify-center transition cursor-pointer active:scale-95 shadow-2xs"
                              title={isRTL ? 'حذف المجموعة' : 'Delete Group'}
                            >
                              <Trash2 className="w-3.5 h-3.5 stroke-[2]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
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
                  disabled={validCurrentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center transition cursor-pointer ${
                      validCurrentPage === page
                        ? 'bg-[#1c2844] text-white shadow-xs'
                        : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition cursor-pointer disabled:opacity-40"
                  disabled={validCurrentPage >= totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Total Count Text */}
              <div className="text-xs sm:text-sm text-slate-500 font-medium">
                {isRTL
                  ? `عرض ${filteredGroups.length} من أصل ${groupsList.length} مجموعة نشطة`
                  : `Showing ${filteredGroups.length} of ${groupsList.length} active groups`}
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
        onSuccess={async (savedGroup) => {
          if (editingGroup) {
            try {
              const updated = await updateGroupApi(editingGroup.id, savedGroup);
              setGroupsList((prev) =>
                prev.map((g) =>
                  g.id === editingGroup.id
                    ? {
                        ...g,
                        ...updated,
                        id: String(updated.id),
                        pilgrimsCount: Number(updated.pilgrimsCount) || savedGroup.pilgrimsCount,
                      }
                    : g
                )
              );
              await fetchGroups();
            } catch {
              setGroupsList((prev) =>
                prev.map((g) =>
                  g.id === editingGroup.id
                    ? { ...g, ...savedGroup }
                    : g
                )
              );
            }
          } else {
            try {
              const created = await createGroupApi(savedGroup);
              setGroupsList((prev) => [
                {
                  id: String(created.id),
                  code: created.code,
                  name: created.name,
                  agreementNumber: created.agreementNumber,
                  mainAgent: created.mainAgent || savedGroup.mainAgent || '-',
                  subAgent: created.subAgent || savedGroup.subAgent || '-',
                  nationality: created.nationality || savedGroup.nationality || '-',
                  packageType: created.packageType || savedGroup.packageType,
                  pilgrimsCount: Number(created.pilgrimsCount) || savedGroup.pilgrimsCount,
                  status: created.status || savedGroup.status || 'قيد التجهيز',
                  hotelsData: created.hotelsData || savedGroup.hotelsData,
                  flightTransportData: created.flightTransportData || savedGroup.flightTransportData,
                  permitsNotesData: created.permitsNotesData || savedGroup.permitsNotesData,
                },
                ...prev,
              ]);
              await fetchGroups();
            } catch {
              setGroupsList((prev) => [
                { id: String(Date.now()), ...savedGroup },
                ...prev,
              ]);
            }
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

      {/* Delete Group Confirmation Modal */}
      {groupToDelete && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget && !isDeleting) setGroupToDelete(null); }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 p-6 space-y-5 animate-scaleUp"
            dir={direction}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                <Trash2 className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isRTL ? 'تأكيد حذف المجموعة' : 'Delete Group Confirmation'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isRTL
                    ? 'هل أنت متأكد من رغبتك في حذف هذه المجموعة نهائياً؟'
                    : 'Are you sure you want to permanently delete this group?'}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{isRTL ? 'اسم المجموعة:' : 'Group Name:'}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">{groupToDelete.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{isRTL ? 'رقم المجموعة:' : 'Group Number:'}</span>
                <span className="text-xs font-bold text-slate-700 font-mono bg-white px-2 py-0.5 rounded border border-slate-200/80">
                  {groupToDelete.code}
                </span>
              </div>
              {groupToDelete.pilgrimsCount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">{isRTL ? 'عدد الحجاج:' : 'Pilgrims Count:'}</span>
                  <span className="text-xs font-bold text-slate-800">{groupToDelete.pilgrimsCount}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-rose-600 bg-rose-50/80 border border-rose-200/60 rounded-xl p-3 leading-relaxed">
              {isRTL
                ? 'تنبيه: سيتم حذف جميع بيانات المجموعة والرحلات والتصاريح المرتبطة بها نهائياً ولا يمكن التراجع عن هذا الإجراء.'
                : 'Warning: All flight, hotel, and permit records associated with this group will be deleted. This action cannot be undone.'}
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setGroupToDelete(null)}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer border border-slate-200 active:scale-95 disabled:opacity-50"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition cursor-pointer active:scale-95 shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isRTL ? 'جاري الحذف...' : 'Deleting...'}</span>
                  </>
                ) : (
                  <span>{isRTL ? 'حذف نهائي' : 'Delete Group'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
