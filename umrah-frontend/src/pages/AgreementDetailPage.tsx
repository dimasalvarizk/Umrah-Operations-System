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
  MapPin,
  Building2,
  Bed,
  Wifi,
  Bus,
  Utensils,
  Clock,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Award,
} from 'lucide-react';
import AgreementPdfModal from '../components/contracts/AgreementPdfModal';
import { useLanguage } from '../context/LanguageContext';
import {
  getHotelsList,
  getHotelByIdOrName,
  STANDARD_ROOM_TYPES,
  type HotelItem,
} from '../utils/hotelsData';

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
    hotelId: 'hotel-grand-zuwar',
    agreementNo: 'AGR-1125900',
    agreementName: 'اتفاقية فندق جراند زوار للضيافة السياحي',
    agreementNameEn: 'Grand Zuwar Hospitality Hotel Agreement',
    entityName: 'فندق جراند زوار للضيافة السياحي',
    entityNameEn: 'Grand Zuwar Hospitality Hotel',
    agentName: 'حاسوب لتجارة التقنية - 2067',
    agentNameEn: 'Hasoob Technology Trading - 2067',
    city: 'مكة المكرمة',
    cityEn: 'Makkah',
    startDate: '02/09/2026',
    endDate: '06/09/2026',
    durationDays: '4',
    totalPrice: '19,200',
    rating: 5,
  },
  {
    id: '2',
    hotelId: '1',
    agreementNo: 'AGR-2294103',
    agreementName: 'اتفاقية فندق جراند زوار',
    agreementNameEn: 'Grand Zuwar Hotel Agreement',
    entityName: 'فندق جراند زوار',
    entityNameEn: 'Grand Zuwar Hotel',
    agentName: 'أودست للسياحة والسفر - 2114',
    agentNameEn: 'ODST Travel and Tourism - 2114',
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
    hotelId: '6',
    agreementNo: 'AGR-3382910',
    agreementName: 'اتفاقية فندق أنوار المدينة',
    agreementNameEn: 'Anwar Al-Madinah Hotel Agreement',
    entityName: 'فندق أنوار المدينة',
    entityNameEn: 'Anwar Al-Madinah Hotel',
    agentName: 'وكالة مكة للطيران',
    agentNameEn: 'Makkah Aviation Agency',
    city: 'المدينة المنورة',
    cityEn: 'Madinah',
    startDate: '10/09/2026',
    endDate: '20/09/2026',
    durationDays: '10',
    totalPrice: '12,500',
    rating: 4,
  },
  {
    id: '4',
    hotelId: '7',
    agreementNo: 'AGR-4401824',
    agreementName: 'اتفاقية سكن طيبة للزوار',
    agreementNameEn: 'Taiba Visitors Residence Agreement',
    entityName: 'سكن طيبة للزوار',
    entityNameEn: 'Taiba Visitors Residence',
    agentName: 'نور الإيمان الدولية',
    agentNameEn: 'Noor Al-Iman Intl',
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
    hotelId: 'hotel-grand-zuwar',
    agreementNo: 'AGR-5561029',
    agreementName: 'اتفاقية فندق جراند زوار',
    agreementNameEn: 'Grand Zuwar Hotel Agreement',
    entityName: 'فندق جراند زوار',
    entityNameEn: 'Grand Zuwar Hotel',
    agentName: 'إندونيسيا ترافيل',
    agentNameEn: 'Indonesia Travel',
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
    hotelId: '8',
    agreementNo: 'AGR-6629104',
    agreementName: 'اتفاقية مجموعة فنادق البركة',
    agreementNameEn: 'Al Barakah Hotels Group Agreement',
    entityName: 'مجموعة فنادق البركة',
    entityNameEn: 'Al Barakah Hotels Group',
    agentName: 'الصفا ترافيل الهند',
    agentNameEn: 'Safa Travel India',
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
    hotelId: '3',
    agreementNo: 'AGR-7738219',
    agreementName: 'اتفاقية نقل الحرمين السريع',
    agreementNameEn: 'Haramain Express Transport Agreement',
    entityName: 'شركة نقل الحرمين السريع',
    entityNameEn: 'Haramain Express Transport Co.',
    agentName: 'حاسوب لتجارة التقنية - 2067',
    agentNameEn: 'Hasoob Technology Trading - 2067',
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
    hotelId: '4',
    agreementNo: 'AGR-8849201',
    agreementName: 'اتفاقية حافلات الراجحي VIP',
    agreementNameEn: 'Al Rajhi VIP Buses Agreement',
    entityName: 'شركة الراجحي للنقل',
    entityNameEn: 'Al Rajhi Transport Co.',
    agentName: 'أودست للسياحة والسفر - 2114',
    agentNameEn: 'ODST Travel and Tourism - 2114',
    city: 'المدينة المنورة',
    cityEn: 'Madinah',
    startDate: '05/09/2026',
    endDate: '20/09/2026',
    durationDays: '15',
    totalPrice: '42,000',
    rating: 5,
  },
];

// Helper to convert DD/MM/YYYY -> YYYY-MM-DD for <input type="date">
function toIsoDate(dateStr: string): string {
  if (!dateStr) return '';
  const trimmed = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const parts = trimmed.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return trimmed;
}

// Helper to convert YYYY-MM-DD -> DD/MM/YYYY for UI display & saving
function toDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const trimmed = dateStr.trim();
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) return trimmed;
  const parts = trimmed.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  }
  return trimmed;
}

// Helper to calculate days between two dates
function calculateDurationDays(s: string, e: string, fallback: string | number = '4'): string {
  try {
    const sIso = toIsoDate(s);
    const eIso = toIsoDate(e);
    if (sIso && eIso) {
      const startMs = new Date(sIso).getTime();
      const endMs = new Date(eIso).getTime();
      if (!isNaN(startMs) && !isNaN(endMs) && endMs >= startMs) {
        const diff = Math.round((endMs - startMs) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff.toString() : '1';
      }
    }
  } catch {}
  return String(fallback);
}

export default function AgreementDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { t, isRTL, direction } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active tab state
  const [activeTab, setActiveTab] = useState(isRTL ? 'تفاصيل الاتفاقية' : 'Agreement Details');

  // PDF Preview Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Dynamic system hotels list
  const availableHotels = getHotelsList();

  // Dynamic Agents list from system master lists
  const availableAgents = (() => {
    try {
      const saved = localStorage.getItem('system_list_agents');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((a: { status: string }) => a.status === 'Active');
        }
      }
    } catch {
      // fallback
    }
    return [
      { nameEn: 'Hasoob Technology Trading - 2067', nameAr: 'حاسوب لتجارة التقنية - 2067' },
      { nameEn: 'ODST Travel and Tourism - 2114', nameAr: 'أودست للسياحة والسفر - 2114' },
      { nameEn: 'Makkah Aviation Agency', nameAr: 'وكالة مكة للطيران' },
      { nameEn: 'Noor Al-Iman Intl', nameAr: 'نور الإيمان الدولية' },
      { nameEn: 'Indonesia Travel', nameAr: 'إندونيسيا ترافيل' },
      { nameEn: 'Safa Travel India', nameAr: 'الصفا ترافيل الهند' },
      { nameEn: 'Ankara Tours Agency', nameAr: 'وكالة أنقرة للسياحة' },
    ];
  })();

  // Dynamic Packages list from system master lists
  const availablePackages = (() => {
    try {
      const saved = localStorage.getItem('system_list_packages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((p: { status: string }) => p.status === 'Active');
        }
      }
    } catch {
      // fallback
    }
    return [
      { id: '1', nameEn: 'VIP Executive 14 Days', nameAr: 'باقة كبار الشخصيات التنفيذية (١٤ يوم)', secondary: '5-Star Front Row Hotels' },
      { id: '2', nameEn: 'Premium Gold 12 Days', nameAr: 'الباقة الذهبية المميزة (١٢ يوم)', secondary: '5-Star Walking Distance' },
      { id: '3', nameEn: 'Classic Economy 10 Days', nameAr: 'الباقة الاقتصادية الكلاسيكية (١٠ أيام)', secondary: '4-Star Central Hotels' },
      { id: '4', nameEn: 'Ramadan Last 10 Days Special', nameAr: 'برنامج العشر الأواخر من رمضان', secondary: 'Makkah Clock Towers' },
    ];
  })();

  // Agreement Header Info
  const [agreementNo, setAgreementNo] = useState('AGR-1125900');
  const [agreementTitle, setAgreementTitle] = useState(
    isRTL ? 'اتفاقية فندق جراند زوار للضيافة السياحي' : 'Grand Zuwar Hospitality Hotel Agreement'
  );

  // Copy state
  const [copied, setCopied] = useState(false);

  // Hotel Linkage State
  const [hotelId, setHotelId] = useState<string>('hotel-grand-zuwar');
  const [hotelName, setHotelName] = useState(
    isRTL ? 'فندق جراند زوار للضيافة السياحي' : 'Grand Zuwar Hospitality Hotel'
  );

  // Basic Info State
  const [agreementDate, setAgreementDate] = useState('29/08/2026');
  const [agentName, setAgentName] = useState(
    isRTL ? 'حاسوب لتجارة التقنية - 2067' : 'Hasoob Technology Trading - 2067'
  );
  const [packageTier, setPackageTier] = useState(
    isRTL ? 'باقة كبار الشخصيات التنفيذية (١٤ يوم)' : 'VIP Executive 14 Days'
  );
  const [rating, setRating] = useState(5);

  // Agreement Info State
  const [startDate, setStartDate] = useState('02/09/2026');
  const [endDate, setEndDate] = useState('06/09/2026');
  const [period, setPeriod] = useState('02/09/2026 - 06/09/2026');
  const [durationDays, setDurationDays] = useState('4');
  const [totalPrice, setTotalPrice] = useState('19,200');

  // Room details rows
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

  // Helper to load matching agreement
  const getMatchedAgreement = () => {
    try {
      const saved = localStorage.getItem('contracts_agreements_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const found = parsed.find((item: any) => item.id === id || item.agreementNo === id);
          if (found) return found;
        }
      }
    } catch {}
    return (
      MOCK_AGREEMENTS_DATA.find((item) => item.id === id || item.agreementNo === id) ||
      MOCK_AGREEMENTS_DATA[0]
    );
  };

  useEffect(() => {
    const agreement = getMatchedAgreement();
    if (agreement) {
      setAgreementNo(agreement.agreementNo || 'AGR-1125900');
      setAgreementTitle(
        isRTL
          ? (agreement.agreementName || agreement.agreementNameEn || 'اتفاقية فندق جراند زوار')
          : (agreement.agreementNameEn || agreement.agreementName || 'Grand Zuwar Hotel Agreement')
      );
      const hName = isRTL
        ? (agreement.entityName || agreement.entityNameEn || 'فندق جراند زوار للضيافة السياحي')
        : (agreement.entityNameEn || agreement.entityName || 'Grand Zuwar Hospitality Hotel');
      setHotelName(hName);
      setHotelId(agreement.hotelId || 'hotel-grand-zuwar');
      setAgentName(
        isRTL
          ? (agreement.agentName || 'حاسوب لتجارة التقنية - 2067')
          : (agreement.agentNameEn || 'Hasoob Technology Trading - 2067')
      );
      const startDisp = toDisplayDate(agreement.startDate || '02/09/2026');
      const endDisp = toDisplayDate(agreement.endDate || '06/09/2026');
      setAgreementDate(startDisp);
      setStartDate(startDisp);
      setEndDate(endDisp);
      setPeriod(`${startDisp} - ${endDisp}`);
      setDurationDays(String(agreement.durationDays || '4'));
      setTotalPrice(
        typeof agreement.totalPrice === 'number'
          ? agreement.totalPrice.toLocaleString('en-US')
          : String(agreement.totalPrice || '19,200')
      );
      setRating(agreement.rating || 5);

      // Load saved rooms if available
      try {
        const savedRooms = localStorage.getItem(`agreement_rooms_${agreement.id || agreement.agreementNo}`);
        if (savedRooms) {
          const parsedRooms = JSON.parse(savedRooms);
          if (Array.isArray(parsedRooms) && parsedRooms.length > 0) {
            setRooms(parsedRooms);
          }
        }
      } catch {}
    }
  }, [id, isRTL]);

  // Copy agreement number
  const handleCopyAgreementNo = () => {
    navigator.clipboard.writeText(agreementNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Matched Hotel Data from Hotels module
  const currentHotel: HotelItem | undefined = getHotelByIdOrName(hotelId || hotelName);

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

  // Save Basic Info Handler
  const handleSaveBasicInfo = () => {
    try {
      const saved = localStorage.getItem('contracts_agreements_list');
      let list = saved ? JSON.parse(saved) : null;
      if (!Array.isArray(list) || list.length === 0) {
        list = [...MOCK_AGREEMENTS_DATA];
      }

      const targetId = id;
      const idx = list.findIndex(
        (item: any) => item.id === targetId || item.agreementNo === targetId || item.agreementNo === agreementNo
      );

      const formattedAgreementDate = toDisplayDate(agreementDate);

      const updatedRecord = {
        id: idx !== -1 ? list[idx].id : (targetId || Date.now().toString()),
        hotelId,
        agreementNo,
        agreementName: agreementTitle,
        agreementNameEn: agreementTitle,
        entityName: hotelName,
        entityNameEn: hotelName,
        agentName,
        agentNameEn: agentName,
        packageTier,
        rating,
        startDate: formattedAgreementDate || toDisplayDate(startDate),
        endDate: toDisplayDate(endDate),
        durationDays,
        totalPrice,
        status: idx !== -1 ? list[idx].status : 'نشطة',
        type: idx !== -1 ? list[idx].type : 'فندق',
        city: currentHotel ? currentHotel.location : (isRTL ? 'مكة المكرمة' : 'Makkah'),
        roomsCount: rooms.reduce((acc, r) => acc + r.count, 0),
      };

      if (idx !== -1) {
        list[idx] = { ...list[idx], ...updatedRecord };
      } else {
        list.unshift(updatedRecord);
      }

      localStorage.setItem('contracts_agreements_list', JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save agreement basic info:', e);
    }

    setIsEditBasicOpen(false);
  };

  // Save Agreement Details Handler
  const handleSaveAgreementDetails = () => {
    const formattedStart = toDisplayDate(startDate);
    const formattedEnd = toDisplayDate(endDate);
    const updatedPeriod = `${formattedStart} - ${formattedEnd}`;
    const calculatedDays = calculateDurationDays(formattedStart, formattedEnd, durationDays);

    setStartDate(formattedStart);
    setEndDate(formattedEnd);
    setPeriod(updatedPeriod);
    setDurationDays(calculatedDays);

    try {
      const saved = localStorage.getItem('contracts_agreements_list');
      let list = saved ? JSON.parse(saved) : null;
      if (!Array.isArray(list) || list.length === 0) {
        list = [...MOCK_AGREEMENTS_DATA];
      }

      const targetId = id;
      const idx = list.findIndex(
        (item: any) => item.id === targetId || item.agreementNo === targetId || item.agreementNo === agreementNo
      );

      const numericPrice = typeof totalPrice === 'string'
        ? parseFloat(totalPrice.replace(/,/g, '')) || 0
        : totalPrice;

      if (idx !== -1) {
        list[idx] = {
          ...list[idx],
          startDate: formattedStart,
          endDate: formattedEnd,
          durationDays: parseInt(calculatedDays) || 4,
          totalPrice: numericPrice || list[idx].totalPrice,
        };
      }

      localStorage.setItem('contracts_agreements_list', JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save agreement details:', e);
    }

    setIsEditAgreementOpen(false);
  };

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
    const updatedRooms = [...rooms, newRoom];
    setRooms(updatedRooms);

    try {
      localStorage.setItem(`agreement_rooms_${id || agreementNo}`, JSON.stringify(updatedRooms));
    } catch {}

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
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{hotelName}</span>
                        {currentHotel && (
                          <span
                            onClick={() => setActiveTab(isRTL ? 'تفاصيل الفندق' : 'Hotel Details')}
                            className="text-[11px] text-blue-600 hover:underline cursor-pointer font-medium"
                          >
                            ({isRTL ? 'عرض تفاصيل الفندق' : 'View Hotel'})
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{isRTL ? 'الوكيل والشريك الخارجي' : 'External Agent & Partner'}</span>
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 text-xs">
                        {agentName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{isRTL ? 'فئة باقة وبرنامج العمرة' : 'Umrah Package Tier'}</span>
                      <span className="font-bold text-[#1b2a4a] bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200 text-xs">
                        {packageTier}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{t('common.rating', 'التصنيف')}</span>
                      <div className="flex items-center gap-1" dir="ltr">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className="w-3.5 h-3.5"
                            stroke={s <= rating ? '#f59e0b' : '#cbd5e1'}
                            fill={s <= rating ? '#f59e0b' : 'none'}
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

          {/* Tab 4 Content: Hotel Details (Integrated with Hotels Module) */}
          {(activeTab === 'تفاصيل الفندق' || activeTab === 'Hotel Details') && currentHotel && (
            <div className="space-y-6 animate-fadeIn">
              {/* Hotel Hero Banner Card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
                  {/* Hotel Image with Overlay Badge */}
                  <div className="lg:col-span-4 relative rounded-xl overflow-hidden min-h-[220px] bg-slate-100 border border-slate-200/80 group">
                    <img
                      src={currentHotel.image}
                      alt={currentHotel.name}
                      className="w-full h-full object-cover min-h-[220px] max-h-[260px] group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
                          currentHotel.status.includes('متاح') || currentHotel.status.includes('Available')
                            ? 'bg-emerald-500/95 text-white'
                            : 'bg-rose-500/95 text-white'
                        }`}
                      >
                        {currentHotel.status}
                      </span>
                    </div>
                    {currentHotel.distanceToHaram && (
                      <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{currentHotel.distanceToHaram}</span>
                      </div>
                    )}
                  </div>

                  {/* Hotel Details Column */}
                  <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Rating & City Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {currentHotel.location}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            {isRTL ? 'فندق معتمد في نسك' : 'Nusuk Approved'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1" dir="ltr">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className="w-4 h-4"
                              stroke={s <= currentHotel.rating ? '#f59e0b' : '#cbd5e1'}
                              fill={s <= currentHotel.rating ? '#f59e0b' : 'none'}
                              strokeWidth={2}
                            />
                          ))}
                          <span className="text-xs font-bold text-slate-700 ml-1">
                            ({currentHotel.rating}.0)
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                        {isRTL ? currentHotel.name : (currentHotel.nameEn || currentHotel.name)}
                      </h2>
                      {currentHotel.address && (
                        <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{isRTL ? currentHotel.address : (currentHotel.addressEn || currentHotel.address)}</span>
                        </p>
                      )}
                    </div>

                    {/* 3 Metric Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                        <div className="text-[11px] text-slate-500 font-medium">
                          {isRTL ? 'إجمالي الغرف المتاحة بالفندق' : 'Total Available Rooms'}
                        </div>
                        <div className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                          {currentHotel.availableRooms} {isRTL ? 'غرفة' : 'Rooms'}
                        </div>
                      </div>

                      <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3">
                        <div className="text-[11px] text-emerald-800 font-medium">
                          {isRTL ? 'سعر الليلة يبدأ من' : 'Starting Rate / Night'}
                        </div>
                        <div className="text-base sm:text-lg font-bold text-emerald-600 mt-0.5">
                          {currentHotel.pricePerNight} {t('common.currency', 'ر.س')}
                        </div>
                      </div>

                      <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-3">
                        <div className="text-[11px] text-blue-800 font-medium">
                          {isRTL ? 'الغرف المحجوزة بهذه الاتفاقية' : 'Rooms in this Agreement'}
                        </div>
                        <div className="text-base sm:text-lg font-bold text-blue-600 mt-0.5">
                          {totalRooms} {isRTL ? 'غرف' : 'Rooms'}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action link */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-slate-400">
                        {isRTL
                          ? 'بيانات الفندق متطابقة ومتزامنة بالكامل مع قسم الفنادق والإسكان.'
                          : 'Hotel details are fully synchronized with the Hotels Management module.'}
                      </span>
                      <button
                        onClick={() => navigate('/hotels')}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition cursor-pointer hover:underline"
                      >
                        <span>{isRTL ? 'إدارة الفندق في قسم الفنادق' : 'Manage in Hotels Module'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Room Types & Rates Breakdown Table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Bed className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {isRTL ? 'أنواع الغرف والأسعار المعتمدة بالفندق' : 'Approved Room Types & Rates in Hotel'}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {currentHotel.roomTypes?.length || 0} {isRTL ? 'أنواع غرف' : 'Room Types'}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-600 font-bold text-xs">
                        <th className="py-3 px-6 text-start">{t('contracts.room_type', 'نوع الغرفة')}</th>
                        <th className="py-3 px-6 text-start">{t('contracts.room_capacity', 'سعة الغرفة')}</th>
                        <th className="py-3 px-6 text-start">{isRTL ? 'السعر لليلة' : 'Price / Night'}</th>
                        <th className="py-3 px-6 text-start">{isRTL ? 'الغرف المتوفرة' : 'Available Rooms'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                      {(currentHotel.roomTypes || []).map((room) => (
                        <tr key={room.id} className="hover:bg-slate-50/50 transition">
                          <td className="py-4 px-6 font-bold text-slate-900 whitespace-nowrap flex items-center gap-2">
                            <Bed className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>{room.name}</span>
                          </td>
                          <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                            {room.capacity}
                          </td>
                          <td className="py-4 px-6 font-bold text-emerald-600 whitespace-nowrap font-mono">
                            {room.price} {t('common.currency', 'ر.س')}
                          </td>
                          <td className="py-4 px-6 text-slate-700 whitespace-nowrap font-bold">
                            {room.roomsCount} {isRTL ? 'غرفة' : 'Rooms'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Hotel Amenities & Services Grid */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs p-6 space-y-4">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {isRTL ? 'المرافق والخدمات الفندقية المقدمة' : 'Hotel Amenities & Services'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {((isRTL ? currentHotel?.amenities : (currentHotel?.amenitiesEn || currentHotel?.amenities)) || []).map(
                    (amenity, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3 flex items-center gap-3 hover:bg-emerald-50/30 hover:border-emerald-200 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white shadow-2xs flex items-center justify-center text-emerald-600 shrink-0 border border-slate-100">
                          {idx === 0 ? (
                            <Wifi className="w-4 h-4" />
                          ) : idx === 1 ? (
                            <Bus className="w-4 h-4" />
                          ) : idx === 2 ? (
                            <Utensils className="w-4 h-4" />
                          ) : idx === 3 ? (
                            <Clock className="w-4 h-4" />
                          ) : idx === 4 ? (
                            <ShieldCheck className="w-4 h-4" />
                          ) : idx === 5 ? (
                            <Building2 className="w-4 h-4" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          )}
                        </div>
                        <span className="text-xs font-semibold text-slate-800 leading-tight">
                          {amenity}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Other Tabs Placeholder */}
          {activeTab !== 'تفاصيل الاتفاقية' &&
            activeTab !== 'Agreement Details' &&
            activeTab !== 'تفاصيل الفندق' &&
            activeTab !== 'Hotel Details' && (
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
            <div className="space-y-3.5">
              {/* Field 0: Agreement Number (Nusuk System Contract Number) */}
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center justify-between">
                  <span>{isRTL ? 'رقم الاتفاقية (نظام نسك / وزارة الحج والعمرة)' : 'Agreement Number (Nusuk System)'}</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium border border-emerald-200">
                    {isRTL ? 'معتمد في نسك' : 'Nusuk Integrated'}
                  </span>
                </label>
                <input
                  type="text"
                  value={agreementNo}
                  onChange={(e) => setAgreementNo(e.target.value)}
                  placeholder="e.g. AGR-1125900"
                  className="w-full border border-slate-200/90 rounded-xl px-3.5 py-2.5 bg-[#f8fafc] text-xs sm:text-sm text-slate-800 font-bold font-mono focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
                />
              </div>

              {/* Field 1: Agreement Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {t('contracts.agreement_date', 'تاريخ الاتفاقية')}
                </label>
                <div className="relative border border-slate-200/90 rounded-xl px-3.5 py-2.5 bg-[#f8fafc] flex items-center justify-between">
                  <Calendar className="w-4 h-4 text-slate-500 shrink-0 pointer-events-none" />
                  <input
                    type="date"
                    value={toIsoDate(agreementDate)}
                    onChange={(e) => {
                      if (e.target.value) {
                        setAgreementDate(toDisplayDate(e.target.value));
                      }
                    }}
                    className="w-full bg-transparent text-center text-xs sm:text-sm text-slate-800 font-semibold focus:outline-hidden cursor-pointer"
                  />
                </div>
              </div>

              {/* Field 2: Hotel Selector from Added Hotels */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center justify-between">
                  <span>{isRTL ? 'اسم الفندق / المنشأة المضافة' : 'Hotel / Added Entity'}</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium border border-emerald-200">
                    {isRTL ? 'قائمة الفنادق المضافة' : 'From Added Hotels'}
                  </span>
                </label>
                <select
                  value={hotelId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setHotelId(selectedId);
                    const found = availableHotels.find((h) => h.id === selectedId || h.name === selectedId);
                    if (found) {
                      const hName = isRTL ? found.name : (found.nameEn || found.name);
                      setHotelName(hName);
                      setRating(found.rating);
                      setAgreementTitle(isRTL ? `اتفاقية ${found.name}` : `${found.nameEn || found.name} Agreement`);
                    }
                  }}
                  className="w-full border border-slate-200/90 rounded-xl px-3.5 py-2.5 bg-[#f8fafc] text-xs sm:text-sm text-slate-800 font-bold focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                >
                  {availableHotels.map((h) => (
                    <option key={h.id} value={h.id}>
                      {isRTL ? h.name : (h.nameEn || h.name)} ({h.location} - {h.rating}★)
                    </option>
                  ))}
                </select>
              </div>

              {/* Field: External Agent & Partner */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {isRTL ? 'الوكيل والشريك الخارجي' : 'External Agent & Partner'}
                </label>
                <select
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="w-full border border-slate-200/90 rounded-xl px-3.5 py-2.5 bg-[#f8fafc] text-xs sm:text-sm text-slate-800 font-semibold focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                >
                  {availableAgents.map((a, idx) => {
                    const label = isRTL ? a.nameAr : a.nameEn;
                    return (
                      <option key={a.nameEn || idx} value={label}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Field: Umrah Package Tier */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {isRTL ? 'فئة باقة وبرنامج العمرة' : 'Umrah Package Tier'}
                </label>
                <select
                  value={packageTier}
                  onChange={(e) => setPackageTier(e.target.value)}
                  className="w-full border border-slate-200/90 rounded-xl px-3.5 py-2.5 bg-[#f8fafc] text-xs sm:text-sm text-slate-800 font-semibold focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                >
                  {availablePackages.map((p, idx) => {
                    const label = isRTL ? p.nameAr : p.nameEn;
                    const sub = p.secondary ? ` - ${p.secondary}` : '';
                    return (
                      <option key={p.id || idx} value={label}>
                        {label}{sub}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Field 3: Rating */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {t('common.rating', 'التصنيف')}
                </label>
                <div className="border border-slate-200/90 rounded-xl px-3.5 py-2.5 bg-[#f8fafc] flex items-center justify-center">
                  <div className="flex items-center gap-1.5 cursor-pointer" dir="ltr">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setRating(s)}
                        className="transition hover:scale-110 focus:outline-hidden cursor-pointer"
                        title={`${s} Stars`}
                      >
                        <Star
                          className="w-4 h-4"
                          stroke={s <= rating ? '#f59e0b' : '#cbd5e1'}
                          fill={s <= rating ? '#f59e0b' : 'none'}
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
                onClick={handleSaveBasicInfo}
                className="px-8 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer"
              >
                {t('common.save', 'حفظ التعديلات')}
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
                  <div className="relative border border-slate-200/90 rounded-xl px-3 py-2.5 bg-[#f8fafc] flex items-center justify-between">
                    <Calendar className="w-4 h-4 text-slate-500 shrink-0 pointer-events-none" />
                    <input
                      type="date"
                      value={toIsoDate(startDate)}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) {
                          const newStart = toDisplayDate(val);
                          setStartDate(newStart);
                          const days = calculateDurationDays(newStart, endDate, durationDays);
                          setDurationDays(days);
                        }
                      }}
                      className="w-full bg-transparent text-center text-xs sm:text-sm text-slate-800 font-semibold focus:outline-hidden px-1 cursor-pointer"
                    />
                    <span className="text-xs text-slate-500 font-medium shrink-0 pointer-events-none">{isRTL ? 'من' : 'From'}</span>
                  </div>

                  <div className="relative border border-slate-200/90 rounded-xl px-3 py-2.5 bg-[#f8fafc] flex items-center justify-between">
                    <Calendar className="w-4 h-4 text-slate-500 shrink-0 pointer-events-none" />
                    <input
                      type="date"
                      value={toIsoDate(endDate)}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) {
                          const newEnd = toDisplayDate(val);
                          setEndDate(newEnd);
                          const days = calculateDurationDays(startDate, newEnd, durationDays);
                          setDurationDays(days);
                        }
                      }}
                      className="w-full bg-transparent text-center text-xs sm:text-sm text-slate-800 font-semibold focus:outline-hidden px-1 cursor-pointer"
                    />
                    <span className="text-xs text-slate-500 font-medium shrink-0 pointer-events-none">{isRTL ? 'إلى' : 'To'}</span>
                  </div>
                </div>
              </div>

              {/* Field 2: Duration Days */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {t('contracts.duration_days', 'عدد أيام الاتفاقية')}
                </label>
                <div className="border border-slate-200/90 rounded-xl px-3.5 py-2.5 bg-white flex items-center justify-between">
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
                <div className="border border-slate-200/90 rounded-xl px-3.5 py-2.5 bg-white flex items-center justify-between">
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
                onClick={handleSaveAgreementDetails}
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
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('contracts.room_type', 'نوع الغرفة')}</label>
                <select
                  value={newRoomType}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewRoomType(val);
                    const found = STANDARD_ROOM_TYPES.find(
                      (r) => (isRTL ? r.nameAr : r.nameEn) === val || r.nameAr === val || r.nameEn === val
                    );
                    if (found) {
                      setNewRoomCapacity(isRTL ? found.capacityAr : found.capacityEn);
                      setNewRoomSize(found.defaultSize);
                    }
                  }}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-blue-600 bg-white cursor-pointer"
                >
                  {STANDARD_ROOM_TYPES.map((rt) => (
                    <option key={rt.id} value={isRTL ? rt.nameAr : rt.nameEn}>
                      {isRTL ? rt.nameAr : rt.nameEn} ({isRTL ? rt.capacityAr : rt.capacityEn})
                    </option>
                  ))}
                </select>
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
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 cursor-pointer"
              >
                {t('common.cancel', 'إلغاء')}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
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
          agentName,
          packageTier,
          city: currentHotel ? currentHotel.location : (isRTL ? 'مكة المكرمة' : 'Makkah'),
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
