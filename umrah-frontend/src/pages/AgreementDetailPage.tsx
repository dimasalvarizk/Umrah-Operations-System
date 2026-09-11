import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import {
  FileText,
  Copy,
  Check,
  Printer,
  Edit3,
  Star,
  Plus,
  Info,
  X,
  XCircle,
  Calendar,
} from 'lucide-react';
import AgreementPdfModal from '../components/contracts/AgreementPdfModal';
import { useLanguage } from '../context/LanguageContext';

interface RoomDetailRow {
  id: string;
  type: string;
  capacity: string;
  size: string;
  count: number;
}

const MOCK_AGREEMENTS_DATA = [
  {
    id: '1',
    agreementNo: 'AGR-1125900',
    agreementName: 'اتفاقية فندق جراند زوار للضيافة السياحي',
    agreementNameEn: 'Grand Zuwar Hospitality Hotel Agreement',
    entityName: 'فندق جراند زوار للضيافة السياحي',
    entityNameEn: 'Grand Zuwar Hospitality Hotel',
    city: 'مكة المكرمة',
    cityEn: 'Makkah',
    startDate: '02/09/2026',
    endDate: '06/09/2026',
    durationDays: '4',
    totalPrice: '19,200',
    rating: 4,
  },
  {
    id: '2',
    agreementNo: 'AGR-2294103',
    agreementName: 'اتفاقية فندق جراند زوار',
    agreementNameEn: 'Grand Zuwar Hotel Agreement',
    entityName: 'فندق جراند زوار',
    entityNameEn: 'Grand Zuwar Hotel',
    city: 'مكة المكرمة',
    cityEn: 'Makkah',
    startDate: '01/09/2026',
    endDate: '15/09/2026',
    durationDays: '14',
    totalPrice: '45,000',
    rating: 4,
  },
  {
    id: '3',
    agreementNo: 'AGR-3382910',
    agreementName: 'اتفاقية فندق أنوار المدينة',
    agreementNameEn: 'Anwar Al-Madinah Hotel Agreement',
    entityName: 'فندق أنوار المدينة',
    entityNameEn: 'Anwar Al-Madinah Hotel',
    city: 'المدينة المنورة',
    cityEn: 'Madinah',
    startDate: '10/09/2026',
    endDate: '20/09/2026',
    durationDays: '10',
    totalPrice: '12,500',
    rating: 5,
  },
  {
    id: '4',
    agreementNo: 'AGR-4401824',
    agreementName: 'اتفاقية سكن طيبة للزوار',
    agreementNameEn: 'Taiba Visitors Residence Agreement',
    entityName: 'سكن طيبة للزوار',
    entityNameEn: 'Taiba Visitors Residence',
    city: 'المدينة المنورة',
    cityEn: 'Madinah',
    startDate: '15/08/2026',
    endDate: '25/08/2026',
    durationDays: '10',
    totalPrice: '8,400',
    rating: 3,
  },
  {
    id: '5',
    agreementNo: 'AGR-5561029',
    agreementName: 'اتفاقية فندق جراند زوار',
    agreementNameEn: 'Grand Zuwar Hotel Agreement',
    entityName: 'فندق جراند زوار',
    entityNameEn: 'Grand Zuwar Hotel',
    city: 'مكة المكرمة',
    cityEn: 'Makkah',
    startDate: '01/10/2026',
    endDate: '30/10/2026',
    durationDays: '29',
    totalPrice: '32,000',
    rating: 4,
  },
  {
    id: '6',
    agreementNo: 'AGR-6629104',
    agreementName: 'اتفاقية مجموعة فنادق البركة',
    agreementNameEn: 'Al Barakah Hotels Group Agreement',
    entityName: 'مجموعة فنادق البركة',
    entityNameEn: 'Al Barakah Hotels Group',
    city: 'مكة المكرمة',
    cityEn: 'Makkah',
    startDate: '02/09/2026',
    endDate: '12/09/2026',
    durationDays: '10',
    totalPrice: '64,500',
    rating: 4,
  },
  {
    id: '7',
    agreementNo: 'AGR-7738219',
    agreementName: 'اتفاقية نقل الحرمين السريع',
    agreementNameEn: 'Haramain Express Transport Agreement',
    entityName: 'شركة نقل الحرمين السريع',
    entityNameEn: 'Haramain Express Transport Co.',
    city: 'مكة المكرمة',
    cityEn: 'Makkah',
    startDate: '01/09/2026',
    endDate: '30/09/2026',
    durationDays: '30',
    totalPrice: '85,000',
    rating: 5,
  },
  {
    id: '8',
    agreementNo: 'AGR-8849201',
    agreementName: 'اتفاقية حافلات الراجحي VIP',
    agreementNameEn: 'Al Rajhi VIP Buses Agreement',
    entityName: 'شركة الراجحي للنقل',
    entityNameEn: 'Al Rajhi Transport Co.',
    city: 'المدينة المنورة',
    cityEn: 'Madinah',
    startDate: '05/09/2026',
    endDate: '20/09/2026',
    durationDays: '15',
    totalPrice: '42,000',
    rating: 5,
  },
];

export default function AgreementDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { t, isRTL, direction } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active tab state
  const [activeTab, setActiveTab] = useState(isRTL ? 'تفاصيل الاتفاقية' : 'Agreement Details');

  // PDF Preview Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Match agreement from params or default to first
  const matchedAgreement = MOCK_AGREEMENTS_DATA.find(
    (item) => item.id === id || item.agreementNo === id
  ) || MOCK_AGREEMENTS_DATA[0];

  // Agreement No. (e.g., AGR-1125900)
  const [agreementNo, setAgreementNo] = useState(matchedAgreement.agreementNo);

  // Copy state
  const [copied, setCopied] = useState(false);

  // Agreement Header Info
  const [agreementTitle, setAgreementTitle] = useState(
    isRTL ? matchedAgreement.agreementName : matchedAgreement.agreementNameEn
  );

  // Basic Info State
  const [agreementDate, setAgreementDate] = useState('29/08/2026');
  const [hotelName, setHotelName] = useState(
    isRTL ? matchedAgreement.entityName : matchedAgreement.entityNameEn
  );
  const [rating, setRating] = useState(matchedAgreement.rating);

  // Agreement Info State
  const [startDate, setStartDate] = useState(matchedAgreement.startDate);
  const [endDate, setEndDate] = useState(matchedAgreement.endDate);
  const [period, setPeriod] = useState(`${matchedAgreement.startDate} - ${matchedAgreement.endDate}`);
  const [durationDays, setDurationDays] = useState(matchedAgreement.durationDays);
  const [totalPrice, setTotalPrice] = useState(matchedAgreement.totalPrice);

  useEffect(() => {
    if (matchedAgreement) {
      setAgreementNo(matchedAgreement.agreementNo);
      setAgreementTitle(isRTL ? matchedAgreement.agreementName : matchedAgreement.agreementNameEn);
      setHotelName(isRTL ? matchedAgreement.entityName : matchedAgreement.entityNameEn);
      setStartDate(matchedAgreement.startDate);
      setEndDate(matchedAgreement.endDate);
      setPeriod(`${matchedAgreement.startDate} - ${matchedAgreement.endDate}`);
      setDurationDays(matchedAgreement.durationDays);
      setTotalPrice(matchedAgreement.totalPrice);
      setRating(matchedAgreement.rating);
    }
  }, [id, isRTL, matchedAgreement]);

  // Room details rows matching mockup
  const [rooms, setRooms] = useState<RoomDetailRow[]>([
    { id: '1', type: isRTL ? 'غرفة ثلاثية' : 'Triple Room', capacity: isRTL ? '٣ أشخاص' : '3 Persons', size: isRTL ? '٢٥ م²' : '25 m²', count: 6 },
    { id: '2', type: isRTL ? 'غرفة ثنائية' : 'Double Room', capacity: isRTL ? 'شخصين' : '2 Persons', size: isRTL ? '٢٨ م²' : '28 m²', count: 8 },
    { id: '3', type: isRTL ? 'غرفة خماسية' : 'Quintuple Room', capacity: isRTL ? '٥ أشخاص' : '5 Persons', size: isRTL ? '٤٥ م²' : '45 m²', count: 3 },
  ]);

  // Edit Modals
  const [isEditBasicOpen, setIsEditBasicOpen] = useState(false);
  const [isEditAgreementOpen, setIsEditAgreementOpen] = useState(false);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);

  // New room form state
  const [newRoomType, setNewRoomType] = useState(isRTL ? 'غرفة رباعية' : 'Quad Room');
  const [newRoomCapacity, setNewRoomCapacity] = useState(isRTL ? '4 أشخاص' : '4 Persons');
  const [newRoomSize, setNewRoomSize] = useState(isRTL ? '35 م²' : '35 m²');
  const [newRoomCount, setNewRoomCount] = useState('4');

  // Copy agreement number
  const handleCopyAgreementNo = () => {
    navigator.clipboard.writeText(agreementNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate totals
  const totalRooms = rooms.reduce((acc, r) => acc + r.count, 0);
  const totalPilgrims = rooms.reduce((acc, r) => {
    const perRoom = r.type.includes('ثلاثية') || r.type.includes('Triple')
      ? 3
      : r.type.includes('ثنائية') || r.type.includes('Double')
        ? 2
        : r.type.includes('خماسية') || r.type.includes('Quintuple')
          ? 5
          : r.type.includes('رباعية') || r.type.includes('Quad')
            ? 4
            : 3;
    return acc + perRoom * r.count;
  }, 0);

  // Add room handler
  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const newRoom: RoomDetailRow = {
      id: Date.now().toString(),
      type: newRoomType,
      capacity: newRoomCapacity,
      size: newRoomSize,
      count: parseInt(newRoomCount) || 1,
    };
    setRooms((prev) => [...prev, newRoom]);
    setIsAddRoomOpen(false);
  };

  const tabs = [
    { id: 'details', label: isRTL ? 'تفاصيل الاتفاقية' : 'Agreement Details' },
    { id: 'requests', label: isRTL ? 'طلبات تعديل الاتفاقية' : 'Amendment Requests' },
    { id: 'logs', label: isRTL ? 'سجل التحديثات' : 'Activity Log' },
    { id: 'hotel', label: isRTL ? 'تفاصيل الفندق' : 'Hotel Details' },
    { id: 'order', label: isRTL ? 'تفاصيل الطلب' : 'Order Details' },
    { id: 'usage', label: isRTL ? 'استخدام الاتفاقية' : 'Agreement Usage' },
  ];

  return (
    <div
      className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-row"
      dir={direction}
    >
      {/* Sidebar */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeTab="contracts"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar
          title={t('contracts.tab_agreement_details', 'تفاصيل الاتفاقية')}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          showBackButton
          onBackClick={() => navigate('/contracts')}
        />

        {/* Page Body */}
        <main className="p-4 sm:p-8 space-y-6 flex-1 max-w-7xl mx-auto w-full">
          {/* Breadcrumb & Top Actions Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Breadcrumb */}
            <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <span
                onClick={() => navigate('/contracts')}
                className="hover:text-[#0f172a] cursor-pointer transition font-semibold"
              >
                {t('nav.contracts', 'الاتفاقيات')}
              </span>
              <span>/</span>
              <span className="text-[#0f172a] font-bold">{t('contracts.tab_agreement_details', 'تفاصيل الاتفاقية')}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsPdfModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition shadow-2xs cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>{t('contracts.print_contract', 'طباعة الاتفاقية')}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditBasicOpen(true)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{t('contracts.edit_basic_info', 'تعديل البيانات')}</span>
              </button>
            </div>
          </div>

          {/* Top Banner Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#d0ebff]/90 text-[#1c7ed6] flex items-center justify-center shrink-0 shadow-2xs">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] tracking-tight">
                  {agreementTitle}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-medium">{t('contracts.reference_no', 'الرقم المرجعي')}:</span>
                  <span className="font-mono font-bold text-slate-800 tracking-wide text-xs sm:text-sm bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/80">
                    {agreementNo}
                  </span>
                  <button
                    onClick={handleCopyAgreementNo}
                    className="p-1 hover:bg-slate-100 rounded-md transition cursor-pointer text-slate-500 hover:text-slate-800"
                    title={isRTL ? 'نسخ الرقم المرجعي' : 'Copy Reference No.'}
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-slate-200/80 flex items-center gap-6 overflow-x-auto text-xs sm:text-sm font-semibold text-slate-500">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.label;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.label)}
                  className={`pb-3 border-b-2 whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'border-[#10b981] text-[#10b981] font-bold'
                      : 'border-transparent hover:text-slate-800 hover:border-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab 1 Content: Agreement Details */}
          {(activeTab === 'تفاصيل الاتفاقية' || activeTab === 'Agreement Details') && (
            <div className="space-y-6">
              {/* 2 Summary Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Card 1: Basic Info */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm sm:text-base font-bold text-[#0f172a]">
                      {t('groups.basic_info', 'البيانات الأساسية')}
                    </h3>
                    <button
                      onClick={() => setIsEditBasicOpen(true)}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-[#eff6ff] text-[#2563eb] hover:bg-[#dbeafe] transition cursor-pointer"
                    >
                      {t('common.edit', 'تعديل')}
                    </button>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{t('contracts.agreement_date', 'تاريخ الاتفاقية')}</span>
                      <span className="font-semibold text-slate-800 font-mono">
                        {agreementDate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{t('contracts.hotel_name', 'اسم الفندق')}</span>
                      <span className="font-bold text-slate-800">{hotelName}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{t('common.rating', 'التصنيف')}</span>
                      <div className="flex items-center gap-1" dir="ltr">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className="w-3.5 h-3.5"
                            stroke={s <= rating ? '#f59e0b' : '#cbd5e1'}
                            fill="none"
                            strokeWidth={2.2}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Agreement Info */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm sm:text-base font-bold text-[#0f172a]">
                      {t('contracts.tab_agreement_details', 'بيانات الاتفاقية')}
                    </h3>
                    <button
                      onClick={() => setIsEditAgreementOpen(true)}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-[#eff6ff] text-[#2563eb] hover:bg-[#dbeafe] transition cursor-pointer"
                    >
                      {t('common.edit', 'تعديل')}
                    </button>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{isRTL ? 'فترة الاتفاقية' : 'Agreement Period'}</span>
                      <span className="font-semibold text-slate-800 font-mono">
                        {period}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{t('contracts.duration_days', 'عدد أيام الاتفاقية')}</span>
                      <span className="font-bold text-slate-800">
                        {durationDays} {isRTL ? 'أيام' : 'Days'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{t('contracts.total_price', 'إجمالي السعر')}</span>
                      <span className="font-bold text-[#10b981] text-sm sm:text-base">
                        {totalPrice} {t('common.currency', 'ر.س')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Room Details Section */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
                {/* Section Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-bold text-[#0f172a]">
                    {t('contracts.room_details_title', 'تفاصيل الغرف')}
                  </h3>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditAgreementOpen(true)}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-[#eff6ff] text-[#2563eb] hover:bg-[#dbeafe] transition cursor-pointer"
                    >
                      {t('common.edit', 'تعديل')}
                    </button>
                    <button
                      onClick={() => setIsAddRoomOpen(true)}
                      className="px-3.5 py-1 rounded-lg text-xs font-bold bg-[#2563eb] hover:bg-blue-700 text-white flex items-center gap-1 transition cursor-pointer shadow-xs active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{t('common.add', 'إضافة')}</span>
                    </button>
                  </div>
                </div>

                {/* Rooms Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-600 font-bold text-xs">
                        <th className="py-3.5 px-6 font-bold whitespace-nowrap text-start">{t('contracts.room_type', 'نوع الغرفة')}</th>
                        <th className="py-3.5 px-6 font-bold whitespace-nowrap text-start">{t('contracts.room_capacity', 'سعة الغرفة')}</th>
                        <th className="py-3.5 px-6 font-bold whitespace-nowrap text-start">{t('contracts.room_size', 'حجم الغرفة')}</th>
                        <th className="py-3.5 px-6 font-bold whitespace-nowrap text-start">{t('contracts.room_count', 'العدد المطلوب')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium text-xs sm:text-sm">
                      {rooms.map((room) => (
                        <tr key={room.id} className="hover:bg-slate-50/50 transition">
                          <td className="py-4 px-6 font-bold text-slate-900 whitespace-nowrap">
                            {room.type}
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap text-slate-600">
                            {room.capacity}
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap text-slate-600 font-mono">
                            {room.size}
                          </td>
                          <td className="py-4 px-6 font-bold text-slate-900 whitespace-nowrap">
                            {room.count} {isRTL ? 'غرف' : 'Rooms'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Blue Info Notice Box */}
                <div className="p-4 sm:p-5">
                  <div className="border border-[#bfdbfe] bg-[#eff6ff] rounded-xl px-4 py-3 flex items-center gap-2.5 text-[#1d4ed8] text-xs sm:text-sm font-semibold">
                    <Info className="w-4 h-4 shrink-0 text-[#2563eb]" />
                    <span>
                      {isRTL
                        ? `${totalRooms} غرف مختارة - (عدد المعتمرين بناء على عدد الغرف المختارة / ${totalPilgrims} معتمر)`
                        : `${totalRooms} rooms selected - (Pilgrim capacity based on selected rooms: ${totalPilgrims} pilgrims)`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other Tabs Placeholder */}
          {activeTab !== 'تفاصيل الاتفاقية' && activeTab !== 'Agreement Details' && (
            <div className="bg-white rounded-2xl p-12 border border-slate-100 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">{activeTab}</h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
                {isRTL
                  ? `قسم ${activeTab} قيد التحديث والربط المباشر مع مزودي الخدمات المعتمدين.`
                  : `${activeTab} section is synchronized with verified service providers.`}
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Edit Basic Info Modal */}
      {isEditBasicOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-5"
            dir={direction}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <h3 className="text-base font-bold text-[#0f172a]">{t('contracts.edit_basic_info', 'تعديل البيانات الأساسية')}</h3>
              <button
                type="button"
                onClick={() => setIsEditBasicOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#f1f5f9] hover:bg-[#e2e8f0] flex items-center justify-center text-slate-600 transition cursor-pointer"
                title={t('common.close', 'إغلاق')}
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Field 1: Agreement Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {t('contracts.agreement_date', 'تاريخ الاتفاقية')}
                </label>
                <div
                  className="border border-slate-200/90 rounded-xl px-3.5 py-2.5 bg-[#f8fafc] flex items-center justify-between"
                >
                  <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                  <input
                    type="text"
                    value={agreementDate}
                    onChange={(e) => setAgreementDate(e.target.value)}
                    className="w-full bg-transparent text-center text-xs sm:text-sm text-slate-800 font-semibold focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Field 2: Hotel Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {t('contracts.hotel_name', 'اسم الفندق')}
                </label>
                <input
                  type="text"
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  className="w-full border border-slate-200/90 rounded-xl px-3.5 py-2.5 bg-[#f8fafc] text-xs sm:text-sm text-slate-800 font-semibold focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              {/* Field 3: Rating */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {t('common.rating', 'التصنيف')}
                </label>
                <div
                  className="border border-slate-200/90 rounded-xl px-3.5 py-2.5 bg-[#f8fafc] flex items-center justify-center"
                >
                  <div className="flex items-center gap-1.5 cursor-pointer" dir="ltr">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setRating(s)}
                        className="transition hover:scale-110 focus:outline-hidden"
                        title={`${s} Stars`}
                      >
                        <Star
                          className="w-4 h-4"
                          stroke={s <= rating ? '#f59e0b' : '#cbd5e1'}
                          fill="none"
                          strokeWidth={2.2}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditBasicOpen(false)}
                className="px-6 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                {t('common.cancel', 'إلغاء')}
              </button>
              <button
                type="button"
                onClick={() => setIsEditBasicOpen(false)}
                className="px-8 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer"
              >
                {t('common.save', 'حفظ')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Agreement Info Modal */}
      {isEditAgreementOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-5"
            dir={direction}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <h3 className="text-base font-bold text-[#0f172a]">{t('contracts.edit_agreement_info', 'تعديل بيانات الاتفاقية')}</h3>
              <button
                type="button"
                onClick={() => setIsEditAgreementOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#f1f5f9] hover:bg-[#e2e8f0] flex items-center justify-center text-slate-600 transition cursor-pointer"
                title={t('common.close', 'إغلاق')}
              >
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Field 1: Period */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {isRTL ? 'فترة الاتفاقية' : 'Agreement Period'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className="border border-slate-200/90 rounded-xl px-3 py-2.5 bg-[#f8fafc] flex items-center justify-between"
                  >
                    <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                    <input
                      type="text"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-transparent text-center text-xs sm:text-sm text-slate-800 font-semibold focus:outline-hidden px-1"
                    />
                    <span className="text-xs text-slate-500 font-medium shrink-0">{isRTL ? 'من' : 'From'}</span>
                  </div>

                  <div
                    className="border border-slate-200/90 rounded-xl px-3 py-2.5 bg-[#f8fafc] flex items-center justify-between"
                  >
                    <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                    <input
                      type="text"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-transparent text-center text-xs sm:text-sm text-slate-800 font-semibold focus:outline-hidden px-1"
                    />
                    <span className="text-xs text-slate-500 font-medium shrink-0">{isRTL ? 'إلى' : 'To'}</span>
                  </div>
                </div>
              </div>

              {/* Field 2: Duration Days */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {t('contracts.duration_days', 'عدد أيام الاتفاقية')}
                </label>
                <div
                  className="border border-slate-200/90 rounded-xl px-3.5 py-2.5 bg-white flex items-center justify-between"
                >
                  <span className="text-xs text-slate-400 font-medium shrink-0">{isRTL ? 'أيام' : 'Days'}</span>
                  <input
                    type="text"
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    className="w-full bg-transparent text-center text-xs sm:text-sm text-slate-800 font-bold focus:outline-hidden px-2"
                  />
                </div>
              </div>

              {/* Field 3: Total Price */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {t('contracts.total_price', 'إجمالي السعر')}
                </label>
                <div
                  className="border border-slate-200/90 rounded-xl px-3.5 py-2.5 bg-white flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-[#10b981] shrink-0">{t('common.currency', 'ر.س')}</span>
                  <input
                    type="text"
                    value={totalPrice}
                    onChange={(e) => setTotalPrice(e.target.value)}
                    className="w-full bg-transparent text-center text-xs sm:text-sm text-slate-800 font-bold focus:outline-hidden px-2"
                  />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditAgreementOpen(false)}
                className="px-6 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                {t('common.cancel', 'إلغاء')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPeriod(`${startDate} - ${endDate}`);
                  setIsEditAgreementOpen(false);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer"
              >
                {t('common.save', 'حفظ التعديلات')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      {isAddRoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <form
            onSubmit={handleSaveRoom}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4"
            dir={direction}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">{isRTL ? 'إضافة نوع غرفة جديدة' : 'Add New Room Type'}</h3>
              <button
                type="button"
                onClick={() => setIsAddRoomOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('contracts.room_type', 'نوع الغرفة')}</label>
                <input
                  type="text"
                  value={newRoomType}
                  onChange={(e) => setNewRoomType(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('contracts.room_capacity', 'سعة الغرفة')}</label>
                <input
                  type="text"
                  value={newRoomCapacity}
                  onChange={(e) => setNewRoomCapacity(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('contracts.room_size', 'حجم الغرفة')}</label>
                <input
                  type="text"
                  value={newRoomSize}
                  onChange={(e) => setNewRoomSize(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('contracts.room_count', 'العدد المطلوب')}</label>
                <input
                  type="number"
                  value={newRoomCount}
                  onChange={(e) => setNewRoomCount(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-blue-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddRoomOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                {t('common.cancel', 'إلغاء')}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
              >
                {t('common.add', 'إضافة الغرفة')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PDF Document Preview & Print Modal */}
      <AgreementPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        data={{
          referenceNumber: agreementNo,
          date: agreementDate,
          status: isRTL ? 'رسمي / معتمد' : 'Official / Approved',
          agreementTitle,
          hotelName,
          city: isRTL ? 'مكة المكرمة' : 'Makkah',
          rating,
          period,
          durationDays,
          totalPrice,
          documentNumber: 'CO-AGR-2026-09',
          rooms: rooms.map((r) => ({
            type: r.type,
            capacity: r.capacity,
            size: r.size,
            count: `${r.count} ${isRTL ? 'غرف' : 'Rooms'}`,
          })),
        }}
      />
    </div>
  );
}

