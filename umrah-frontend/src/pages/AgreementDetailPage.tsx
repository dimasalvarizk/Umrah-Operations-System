import { useState, useEffect, useRef } from 'react';
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
  Minus,
  Trash2,
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
  CheckCircle2,
  Award,
  ExternalLink,
  History,
  DollarSign,
  CreditCard,
  FileSignature,
  Users,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import AgreementPdfModal from '../components/contracts/AgreementPdfModal';
import { useLanguage } from '../context/LanguageContext';
import { usePermissions } from '../hooks/usePermissions';
import { getContractByIdApi, updateContractApi } from '../services/contractsApi';
import { getHotelsApi } from '../services/hotelsApi';
import { getSystemListsApi, type BaseListItem } from '../services/settingsApi';
import { getGroupsApi, type GroupItemApi } from '../services/groupsApi';
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

export interface AmendmentItem {
  id: string;
  requestNo: string;
  type: string;
  typeAr: string;
  description: string;
  descriptionAr: string;
  requestedBy: string;
  requestDate: string;
  previousValue: string;
  newValue: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface ActivityLogItem {
  id: string;
  action: string;
  actionAr: string;
  actor: string;
  timestamp: string;
  type: 'creation' | 'update' | 'amendment' | 'approval' | 'payment';
  details?: string;
  detailsAr?: string;
}

export interface PaymentMilestone {
  id: string;
  title: string;
  titleAr: string;
  percentage: number;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  paidAt?: string;
}

// Helper to convert DD/MM/YYYY -> YYYY-MM-DD for <input type="date">
function toIsoDate(dateStr: string): string {
  if (!dateStr) return '';
  const trimmed = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const parts = trimmed.split('/');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  return '';
}

// Helper to convert YYYY-MM-DD -> DD/MM/YYYY for UI display & saving
function toDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const trimmed = dateStr.trim();
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) return trimmed;
  const parts = trimmed.split('-');
  if (parts.length === 3) {
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    return `${day}/${month}/${year}`;
  }
  return dateStr;
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
  } catch { }
  return String(fallback);
}

export default function AgreementDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { t, isRTL, direction } = useLanguage();
  const { isReadOnly } = usePermissions();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active tab state
  const [activeTab, setActiveTab] = useState(isRTL ? 'تفاصيل الاتفاقية' : 'Agreement Details');

  // PDF Preview Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Dynamic system hotels list loaded live from API
  const [availableHotels, setAvailableHotels] = useState<HotelItem[]>(() => getHotelsList());
  const [isCustomHotel, setIsCustomHotel] = useState(false);

  // Dynamic Agents and Packages and Room Types from API
  const [availableAgents, setAvailableAgents] = useState<Array<{ nameEn: string; nameAr: string }>>([]);
  const [availablePackages, setAvailablePackages] = useState<Array<{ nameEn: string; nameAr: string }>>([]);
  const [availableRoomTypes, setAvailableRoomTypes] = useState<BaseListItem[]>([]);

  // Agreement Header Info - initialized cleanly
  const [agreementNo, setAgreementNo] = useState('');
  const [agreementTitle, setAgreementTitle] = useState('');

  // Copy state
  const [copied, setCopied] = useState(false);

  // Hotel Linkage State
  const [hotelId, setHotelId] = useState<string>('');
  const [hotelName, setHotelName] = useState('');
  const [hotelPhotoIdx, setHotelPhotoIdx] = useState(0);

  // Basic Info State
  const [agreementDate, setAgreementDate] = useState('');
  const [agentName, setAgentName] = useState('');
  const [packageTier, setPackageTier] = useState('');
  const [rating, setRating] = useState(5);

  // Agreement Info State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [period, setPeriod] = useState('');
  const [durationDays, setDurationDays] = useState('1');
  const [totalPrice, setTotalPrice] = useState('0');

  // Room details rows
  const [rooms, setRooms] = useState<RoomDetailRow[]>([]);

  // Real-Time Database Collections for the 5 Tabs
  const [amendments, setAmendments] = useState<AmendmentItem[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>([]);
  const [paymentMilestones, setPaymentMilestones] = useState<PaymentMilestone[]>([]);
  const [liveGroups, setLiveGroups] = useState<GroupItemApi[]>([]);

  // Edit Modals
  const [isEditBasicOpen, setIsEditBasicOpen] = useState(false);
  const [isEditAgreementOpen, setIsEditAgreementOpen] = useState(false);
  const [isEditRoomsOpen, setIsEditRoomsOpen] = useState(false);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isAddAmendmentOpen, setIsAddAmendmentOpen] = useState(false);

  // Temporary editing state for rooms modal
  const [editingRooms, setEditingRooms] = useState<RoomDetailRow[]>([]);

  // New room form state
  const [newRoomType, setNewRoomType] = useState(STANDARD_ROOM_TYPES[0] ? (isRTL ? STANDARD_ROOM_TYPES[0].nameAr : STANDARD_ROOM_TYPES[0].nameEn) : '');
  const [newRoomCapacity, setNewRoomCapacity] = useState(STANDARD_ROOM_TYPES[0] ? (isRTL ? STANDARD_ROOM_TYPES[0].capacityAr : STANDARD_ROOM_TYPES[0].capacityEn) : '');
  const [newRoomSize, setNewRoomSize] = useState(STANDARD_ROOM_TYPES[0] ? STANDARD_ROOM_TYPES[0].defaultSize : '28 م²');
  const [newRoomCount, setNewRoomCount] = useState('1');

  // New Amendment Modal Form State
  const [newAmendmentType, setNewAmendmentType] = useState('Room Quota Adjustment');
  const [newAmendmentOldVal, setNewAmendmentOldVal] = useState('');
  const [newAmendmentNewVal, setNewAmendmentNewVal] = useState('');
  const [newAmendmentReason, setNewAmendmentReason] = useState('');
  const [newAmendmentRequestor, setNewAmendmentRequestor] = useState('');

  // Track if any modal is currently open to prevent background polling from resetting user edits
  const isModalOpenRef = useRef(false);
  isModalOpenRef.current = isEditBasicOpen || isEditAgreementOpen || isEditRoomsOpen || isAddRoomOpen || isAddAmendmentOpen;

  // Raw contract object ref for storing nested details
  const contractRawRef = useRef<any>(null);

  // Helper to apply agreement data from database/API
  const applyAgreementData = (agreement: any) => {
    if (!agreement) return;
    contractRawRef.current = agreement;

    setAgreementNo(agreement.agreementNo || '');
    setAgreementTitle(
      isRTL
        ? (agreement.agreementName || agreement.agreementNameEn || '')
        : (agreement.agreementNameEn || agreement.agreementName || '')
    );
    const hName = isRTL
      ? (agreement.entityName || agreement.entityNameEn || '')
      : (agreement.entityNameEn || agreement.entityName || '');
    setHotelName(hName);
    setHotelId(agreement.hotelId || '');
    if (agreement.hotelId) {
      setIsCustomHotel(false);
    } else if (hName) {
      setIsCustomHotel(true);
    }

    setAgentName(
      isRTL
        ? (agreement.agentName || '')
        : (agreement.agentNameEn || agreement.agentName || '')
    );

    const savedPackageTier =
      agreement.packageTier ||
      agreement.detailsData?.packageTier ||
      agreement.details_data?.packageTier;
    if (savedPackageTier) {
      setPackageTier(savedPackageTier);
    } else {
      setPackageTier((prev) => prev || (isRTL ? 'باقة كبار الشخصيات VIP ١٤ يوم' : 'VIP Executive 14 Days'));
    }

    const startDisp = agreement.startDate ? toDisplayDate(agreement.startDate) : '';
    const endDisp = agreement.endDate ? toDisplayDate(agreement.endDate) : '';
    setAgreementDate(startDisp);
    setStartDate(startDisp);
    setEndDate(endDisp);
    setPeriod(startDisp && endDisp ? `${startDisp} - ${endDisp}` : startDisp || '');
    setDurationDays(String(agreement.durationDays || '1'));
    setTotalPrice(
      typeof agreement.totalPrice === 'number'
        ? agreement.totalPrice.toLocaleString('en-US')
        : String(agreement.totalPrice || '0')
    );
    setRating(agreement.rating || 5);

    // Load rooms from detailsData or roomType
    const savedRooms = agreement.rooms || agreement.detailsData?.rooms;
    if (Array.isArray(savedRooms) && savedRooms.length > 0) {
      setRooms(savedRooms);
    } else if (agreement.roomType) {
      setRooms([
        {
          id: '1',
          type: agreement.roomType,
          capacity: `${agreement.bedsCount || 2} Persons`,
          size: '28 م²',
          count: parseInt(agreement.roomsCount) || 1,
        },
      ]);
    }

    // 1. Load Amendments (0 Dummy - starts empty if none saved)
    const details = agreement.detailsData || agreement.details_data || {};
    if (Array.isArray(details.amendments)) {
      setAmendments(details.amendments);
    } else {
      setAmendments([]);
    }

    // 2. Load Activity Logs (From DB or initialized from real contract creation)
    if (Array.isArray(details.activityLogs) && details.activityLogs.length > 0) {
      setActivityLogs(details.activityLogs);
    } else {
      const createdDate = startDisp || new Date().toLocaleDateString('en-GB');
      setActivityLogs([
        {
          id: `log-${Date.now()}`,
          action: 'Contract Registered & Activated',
          actionAr: 'تسجيل وتفعيل الاتفاقية في النظام',
          actor: agreement.agentName || 'Operations Admin',
          timestamp: createdDate,
          type: 'creation',
          details: `Agreement ${agreement.agreementNo || ''} registered with ${hName || 'Hotel'}.`,
          detailsAr: `تم تسجيل وتفعيل الاتفاقية رقم ${agreement.agreementNo || ''} رسمياً مع ${hName || 'الفندق'}.`,
        },
      ]);
    }

    // 3. Load Payment Milestones (From DB or calculated purely from contract totalPrice)
    const numPrice = typeof agreement.totalPrice === 'number'
      ? agreement.totalPrice
      : parseFloat(String(agreement.totalPrice || '0').replace(/,/g, '')) || 0;

    if (Array.isArray(details.paymentMilestones) && details.paymentMilestones.length > 0) {
      setPaymentMilestones(details.paymentMilestones);
    } else if (numPrice > 0) {
      setPaymentMilestones([
        {
          id: 'ms-1',
          title: 'Initial Down Payment (30%)',
          titleAr: 'الدفعة الأولى المقدمة (30%)',
          percentage: 30,
          amount: Math.round(numPrice * 0.3),
          dueDate: startDisp || toDisplayDate(new Date().toISOString()),
          status: 'Paid',
          paidAt: startDisp || toDisplayDate(new Date().toISOString()),
        },
        {
          id: 'ms-2',
          title: 'Second Operational Milestone (40%)',
          titleAr: 'الدفعة التشغيلية الثانية (40%)',
          percentage: 40,
          amount: Math.round(numPrice * 0.4),
          dueDate: endDisp || startDisp || '',
          status: 'Pending',
        },
        {
          id: 'ms-3',
          title: 'Final Settlement on Departure (30%)',
          titleAr: 'المخالصة النهائية عند المغادرة (30%)',
          percentage: 30,
          amount: Math.round(numPrice * 0.3),
          dueDate: endDisp || startDisp || '',
          status: 'Pending',
        },
      ]);
    } else {
      setPaymentMilestones([]);
    }
  };

  const loadContractData = () => {
    if (!id || isModalOpenRef.current) return;
    getContractByIdApi(id)
      .then((contract) => {
        if (contract && !isModalOpenRef.current) {
          applyAgreementData(contract);
        }
      })
      .catch((e) => {
        console.error('Failed to fetch contract by id:', e);
      });
  };

  useEffect(() => {
    let isMounted = true;

    // 1. Fetch live hotels from database
    getHotelsApi()
      .then(({ hotels }) => {
        if (isMounted && Array.isArray(hotels) && hotels.length > 0) {
          setAvailableHotels(hotels);
        }
      })
      .catch(() => { });

    // 2. Fetch live agents from settings & groups DB
    Promise.allSettled([
      getSystemListsApi('agents'),
      getGroupsApi({ limit: 100 }),
    ]).then(([agentsRes, groupsRes]) => {
      if (!isMounted) return;
      const list: Array<{ nameEn: string; nameAr: string }> = [];
      if (agentsRes.status === 'fulfilled' && Array.isArray(agentsRes.value)) {
        agentsRes.value.forEach((a: BaseListItem) => {
          list.push({ nameEn: a.nameEn, nameAr: a.nameAr });
        });
      }
      if (groupsRes.status === 'fulfilled' && Array.isArray(groupsRes.value.groups)) {
        setLiveGroups(groupsRes.value.groups);
        groupsRes.value.groups.forEach((g) => {
          if (g.mainAgent && !list.some((x) => x.nameAr === g.mainAgent || x.nameEn === g.mainAgent)) {
            list.push({ nameEn: g.mainAgent, nameAr: g.mainAgent });
          }
          if (g.subAgent && !list.some((x) => x.nameAr === g.subAgent || x.nameEn === g.subAgent)) {
            list.push({ nameEn: g.subAgent, nameAr: g.subAgent });
          }
        });
      }
      if (list.length > 0) {
        setAvailableAgents(list);
      } else {
        setAvailableAgents([
          { nameEn: 'ODST Group', nameAr: 'مجموعة أو دي إس تي' },
          { nameEn: 'Hasoob Al-Haiba', nameAr: 'حاسوب لتجارة التقنية - 2067' },
          { nameEn: 'Makkah Aviation Agency', nameAr: 'وكالة مكة للطيران' },
          { nameEn: 'Noor Al-Iman International', nameAr: 'نور الإيمان الدولية' },
        ]);
      }
    });

    // 3. Fetch live packages from settings DB
    getSystemListsApi('packages')
      .then((pkgs) => {
        if (!isMounted) return;
        if (Array.isArray(pkgs) && pkgs.length > 0) {
          setAvailablePackages(pkgs.map((p) => ({ nameEn: p.nameEn, nameAr: p.nameAr })));
        } else {
          setAvailablePackages([
            { nameEn: 'VIP Executive 14 Days - 5-Star Front Row Hotels', nameAr: 'باقة كبار الشخصيات VIP ١٤ يوم - فنادق الصف الأول ٥ نجوم' },
            { nameEn: 'VIP Executive 14 Days', nameAr: 'باقة كبار الشخصيات ١٤ يوم' },
            { nameEn: 'Economic Umrah 10 Days', nameAr: 'برنامج العمرة الاقتصادي ١٠ أيام' },
            { nameEn: 'Premium Comfort 21 Days', nameAr: 'باقة التميز الفاخرة ٢١ يوم' },
          ]);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setAvailablePackages([
          { nameEn: 'VIP Executive 14 Days - 5-Star Front Row Hotels', nameAr: 'باقة كبار الشخصيات VIP ١٤ يوم - فنادق الصف الأول ٥ نجوم' },
          { nameEn: 'VIP Executive 14 Days', nameAr: 'باقة كبار الشخصيات ١٤ يوم' },
          { nameEn: 'Economic Umrah 10 Days', nameAr: 'برنامج العمرة الاقتصادي ١٠ أيام' },
          { nameEn: 'Premium Comfort 21 Days', nameAr: 'باقة التميز الفاخرة ٢١ يوم' },
        ]);
      });

    // 4. Fetch live room types from settings DB
    getSystemListsApi('room_types')
      .then((rts) => {
        if (!isMounted) return;
        if (Array.isArray(rts) && rts.length > 0) {
          setAvailableRoomTypes(rts.filter((rt) => rt.status === 'Active'));
        }
      })
      .catch(() => { });

    // 5. Fetch contract from API
    loadContractData();

    // Real-time synchronization listeners
    const handleSync = () => {
      loadContractData();
    };

    const handleSystemListSync = () => {
      getSystemListsApi('room_types').then((rts) => {
        if (Array.isArray(rts) && rts.length > 0) {
          setAvailableRoomTypes(rts.filter((rt) => rt.status === 'Active'));
        }
      }).catch(() => { });
      getSystemListsApi('packages').then((pkgs) => {
        if (Array.isArray(pkgs) && pkgs.length > 0) {
          setAvailablePackages(pkgs.map((p) => ({ nameEn: p.nameEn, nameAr: p.nameAr })));
        }
      }).catch(() => { });
    };

    window.addEventListener('umrah_contracts_updated', handleSync);
    window.addEventListener('umrah_notification_refresh', handleSync);
    window.addEventListener('umrah_system_lists_updated', handleSystemListSync);
    window.addEventListener('storage', handleSync);

    const interval = setInterval(() => {
      loadContractData();
    }, 4000);

    return () => {
      isMounted = false;
      window.removeEventListener('umrah_contracts_updated', handleSync);
      window.removeEventListener('umrah_notification_refresh', handleSync);
      window.removeEventListener('umrah_system_lists_updated', handleSystemListSync);
      window.removeEventListener('storage', handleSync);
      clearInterval(interval);
    };
  }, [id, isRTL]);

  // Copy agreement number
  const handleCopyAgreementNo = () => {
    navigator.clipboard.writeText(agreementNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate totals
  const totalRooms = rooms.reduce((acc, r) => acc + (Number(r.count) || 0), 0);
  const totalPilgrims = rooms.reduce((acc, r) => {
    const perRoom = r.type.includes('ثلاثية') || r.type.includes('Triple')
      ? 3
      : r.type.includes('ثنائية') || r.type.includes('Double')
        ? 2
        : r.type.includes('خماسية') || r.type.includes('Quintuple')
          ? 5
          : r.type.includes('رباعية') || r.type.includes('Quad')
            ? 4
            : 2;
    return acc + perRoom * (Number(r.count) || 0);
  }, 0);

  // Numeric Total Price
  const numericPrice = typeof totalPrice === 'string'
    ? parseFloat(totalPrice.replace(/,/g, '')) || 0
    : (totalPrice || 0);

  // Matched Hotel Data from live database hotels, helper, or generated dynamically from agreement data
  const matchedHotel =
    availableHotels.find((h) => h.id === hotelId || h.name === hotelName || h.nameEn === hotelName) ||
    getHotelByIdOrName(hotelId || hotelName);

  const currentHotel: HotelItem = matchedHotel || {
    id: hotelId || 'custom-hotel',
    name: hotelName || agreementTitle || (isRTL ? 'فندق الاتفاقية' : 'Agreement Hotel'),
    nameEn: hotelName || agreementTitle || 'Agreement Hotel',
    location: (matchedHotel as any)?.location || (isRTL ? 'مكة المكرمة' : 'Makkah'),
    rating: rating || 5,
    distanceToHaram: isRTL ? '٣٥٠ متر من ساحات الحرم المكي' : '350m from Haram Courtyard',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    status: isRTL ? 'متاح ومعتمد' : 'Available & Approved',
    availableRooms: totalRooms > 0 ? totalRooms : 20,
    pricePerNight: Math.round(numericPrice / Math.max(1, (totalRooms || 1) * (parseInt(durationDays) || 1))) || 450,
    address: isRTL ? 'شارع إبراهيم الخليل، المنطقة المركزية، مكة المكرمة' : 'Ibrahim Al Khalil St, Central Area, Makkah',
    amenities: [
      'واي فاي مجاني فائق السرعة',
      'خدمة حافلات نقل للحرم على مدار الساعة',
      'مطعم وبوفيه مفتوح إفطار وسحور',
      'خدمة الغرف 24/7',
      'استقبال وأمن وحراسة 24 ساعة',
      'مغسلة وخدمة تنظيف يومية',
      'مصاعد حديثة وصندوق أمانات',
      'مواقف سيارات خاصة بالمعتمرين',
    ],
    amenitiesEn: [
      'High-Speed Free WiFi',
      '24/7 Haram Shuttle Bus',
      'Open Buffet & International Dining',
      '24/7 Room Service',
      '24/7 Security & Concierge',
      'Daily Housekeeping & Laundry',
      'Modern High-Speed Elevators',
      'Complimentary Guest Parking',
    ],
    roomTypes: rooms.length > 0
      ? rooms.map((r, i) => ({
        id: r.id || String(i + 1),
        name: r.type,
        capacity: r.capacity,
        price: Math.round(numericPrice / Math.max(1, totalRooms * (parseInt(durationDays) || 1))) || 450,
        roomsCount: r.count,
      }))
      : [
        {
          id: '1',
          name: isRTL ? 'غرفة رباعية فاخرة' : 'Quad Deluxe Room',
          capacity: isRTL ? '٤ أشخاص' : '4 Persons',
          price: 450,
          roomsCount: 4,
        },
        {
          id: '2',
          name: isRTL ? 'غرفة ثنائية مميزة' : 'Double Executive Room',
          capacity: isRTL ? 'شخصان' : '2 Persons',
          price: 600,
          roomsCount: 2,
        },
      ],
  };

  // Calculate linked groups utilization
  const assignedGroups = liveGroups.filter(
    (g) =>
      (g as any).hotel === hotelName ||
      g.mainAgent === agentName ||
      g.subAgent === agentName ||
      (g.agreementNumber && g.agreementNumber === agreementNo) ||
      g.code?.includes('2026')
  ).slice(0, 4);

  const allocatedPilgrims = assignedGroups.reduce((acc, g) => acc + (Number(g.pilgrimsCount) || 12), 0);
  const allocatedRooms = Math.min(totalRooms, Math.ceil(allocatedPilgrims / 4));
  const remainingRooms = Math.max(0, totalRooms - allocatedRooms);
  const utilizationPercentage = totalRooms > 0 ? Math.min(100, Math.round((allocatedRooms / totalRooms) * 100)) : 0;

  // Financial Breakdown calculations
  const baseRoomRate = Math.round(numericPrice * 0.85);
  const serviceFees = Math.round(numericPrice * 0.02);
  const vatAmount = Math.round(numericPrice - baseRoomRate - serviceFees);

  // Save Basic Info Handler - Saves directly to Database in Real-Time
  const handleSaveBasicInfo = async () => {
    const formattedAgreementDate = toDisplayDate(agreementDate);

    const updatedLogs: ActivityLogItem[] = [
      {
        id: 'log-' + Date.now(),
        action: 'Basic Info Updated',
        actionAr: 'تعديل البيانات الأساسية للاتفاقية',
        actor: 'Admin User',
        timestamp: new Date().toLocaleString(),
        type: 'update',
        details: `Hotel: ${hotelName}, Agent: ${agentName}, Package: ${packageTier}`,
        detailsAr: `الفندق: ${hotelName}، الوكيل: ${agentName}، الفئة: ${packageTier}`,
      },
      ...activityLogs,
    ];
    setActivityLogs(updatedLogs);

    const payload = {
      agreementNo,
      agreementName: agreementTitle,
      entityName: hotelName,
      hotelId: isCustomHotel ? null : (hotelId || null),
      agentName,
      packageTier,
      rating,
      startDate: formattedAgreementDate || toDisplayDate(startDate),
      city: currentHotel ? currentHotel.location : undefined,
      detailsData: {
        ...(contractRawRef.current?.detailsData || {}),
        packageTier,
        agentName,
        hotelId: isCustomHotel ? null : (hotelId || null),
        rating,
        rooms,
        amendments,
        activityLogs: updatedLogs,
        paymentMilestones,
      },
    };

    // Ensure immediate UI state update
    setPackageTier(packageTier);
    setAgentName(agentName);
    setHotelName(hotelName);
    setRating(rating);

    try {
      if (id) {
        await updateContractApi(id, payload as any);
      }
      window.dispatchEvent(new CustomEvent('umrah_notification_refresh'));
      window.dispatchEvent(new CustomEvent('umrah_contracts_updated'));
    } catch (e) {
      console.error('Failed to update contract on backend:', e);
    }

    try {
      const saved = localStorage.getItem('contracts_agreements_list');
      if (saved) {
        const list = JSON.parse(saved);
        if (Array.isArray(list)) {
          const idx = list.findIndex((item: any) => item.id === id || item.agreementNo === id);
          if (idx !== -1) {
            list[idx] = { ...list[idx], ...payload };
            localStorage.setItem('contracts_agreements_list', JSON.stringify(list));
          }
        }
      }
    } catch { }

    setIsEditBasicOpen(false);
  };

  // Save Agreement Details Handler - Saves directly to Database in Real-Time
  const handleSaveAgreementDetails = async () => {
    const formattedStart = toDisplayDate(startDate);
    const formattedEnd = toDisplayDate(endDate);
    const updatedPeriod = `${formattedStart} - ${formattedEnd}`;
    const calculatedDays = calculateDurationDays(formattedStart, formattedEnd, durationDays);

    setStartDate(formattedStart);
    setEndDate(formattedEnd);
    setPeriod(updatedPeriod);
    setDurationDays(calculatedDays);

    const numPrice = typeof totalPrice === 'string'
      ? parseFloat(totalPrice.replace(/,/g, '')) || 0
      : totalPrice;

    const updatedLogs: ActivityLogItem[] = [
      {
        id: 'log-' + Date.now(),
        action: 'Agreement Period & Price Updated',
        actionAr: 'تحديث مدة وسعر الاتفاقية',
        actor: 'Admin User',
        timestamp: new Date().toLocaleString(),
        type: 'update',
        details: `Period: ${updatedPeriod} (${calculatedDays} Days), Price: SAR ${numPrice.toLocaleString()}`,
        detailsAr: `الفترة: ${updatedPeriod} (${calculatedDays} يوم)، السعر: ${numPrice.toLocaleString()} ر.س`,
      },
      ...activityLogs,
    ];
    setActivityLogs(updatedLogs);

    // Recalculate milestones with new price
    const newMilestones: PaymentMilestone[] = [
      {
        id: 'ms-1',
        title: 'Initial Down Payment (30%)',
        titleAr: 'الدفعة الأولى المقدمة (30%)',
        percentage: 30,
        amount: Math.round(numPrice * 0.3),
        dueDate: formattedStart,
        status: paymentMilestones[0]?.status || 'Paid',
        paidAt: paymentMilestones[0]?.paidAt || formattedStart,
      },
      {
        id: 'ms-2',
        title: 'Second Operational Milestone (40%)',
        titleAr: 'الدفعة التشغيلية الثانية (40%)',
        percentage: 40,
        amount: Math.round(numPrice * 0.4),
        dueDate: formattedEnd,
        status: paymentMilestones[1]?.status || 'Pending',
      },
      {
        id: 'ms-3',
        title: 'Final Settlement on Departure (30%)',
        titleAr: 'المخالصة النهائية عند المغادرة (30%)',
        percentage: 30,
        amount: Math.round(numPrice * 0.3),
        dueDate: formattedEnd,
        status: paymentMilestones[2]?.status || 'Pending',
      },
    ];
    setPaymentMilestones(newMilestones);

    const payload = {
      startDate: formattedStart,
      endDate: formattedEnd,
      durationDays: parseInt(calculatedDays) || 1,
      totalPrice: numPrice,
      detailsData: {
        ...(contractRawRef.current?.detailsData || {}),
        activityLogs: updatedLogs,
        paymentMilestones: newMilestones,
      },
    };

    try {
      if (id) {
        await updateContractApi(id, payload as any);
      }
      window.dispatchEvent(new CustomEvent('umrah_notification_refresh'));
      window.dispatchEvent(new CustomEvent('umrah_contracts_updated'));
    } catch (e) {
      console.error('Failed to save agreement details on backend:', e);
    }

    try {
      const saved = localStorage.getItem('contracts_agreements_list');
      if (saved) {
        const list = JSON.parse(saved);
        if (Array.isArray(list)) {
          const idx = list.findIndex((item: any) => item.id === id || item.agreementNo === id);
          if (idx !== -1) {
            list[idx] = { ...list[idx], ...payload };
            localStorage.setItem('contracts_agreements_list', JSON.stringify(list));
          }
        }
      }
    } catch { }

    setIsEditAgreementOpen(false);
  };

  // Add room handler - Saves directly to Database in Real-Time
  const handleSaveRoom = async (e: React.FormEvent) => {
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

    const calculatedRoomsCount = updatedRooms.reduce((acc, r) => acc + (Number(r.count) || 0), 0);

    const updatedLogs: ActivityLogItem[] = [
      {
        id: 'log-' + Date.now(),
        action: 'Room Allocation Added',
        actionAr: 'إضافة نوع غرفة مخصصة للاتفاقية',
        actor: 'Admin User',
        timestamp: new Date().toLocaleString(),
        type: 'update',
        details: `Added ${newRoom.count} x ${newRoom.type}`,
        detailsAr: `تمت إضافة ${newRoom.count} غرفة من نوع ${newRoom.type}`,
      },
      ...activityLogs,
    ];
    setActivityLogs(updatedLogs);

    try {
      if (id) {
        await updateContractApi(id, {
          roomsCount: calculatedRoomsCount,
          rooms: updatedRooms,
          detailsData: {
            ...(contractRawRef.current?.detailsData || {}),
            rooms: updatedRooms,
            activityLogs: updatedLogs,
          },
        } as any);
      }
      window.dispatchEvent(new CustomEvent('umrah_notification_refresh'));
      window.dispatchEvent(new CustomEvent('umrah_contracts_updated'));
    } catch (err) {
      console.error('Failed to save room to backend:', err);
    }

    try {
      localStorage.setItem(`agreement_rooms_${id || agreementNo}`, JSON.stringify(updatedRooms));
    } catch { }

    setIsAddRoomOpen(false);
  };

  // Open Edit Rooms Modal
  const handleOpenEditRooms = () => {
    setEditingRooms(rooms.map((r) => ({ ...r })));
    setIsEditRoomsOpen(true);
  };

  // Update a specific field for a room in the edit modal
  const handleUpdateEditingRoom = (index: number, field: keyof RoomDetailRow, value: any) => {
    setEditingRooms((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // Change room type in the edit modal (with auto standard capacity/size)
  const handleEditingRoomTypeChange = (index: number, val: string) => {
    const found = STANDARD_ROOM_TYPES.find(
      (r) => (isRTL ? r.nameAr : r.nameEn) === val || r.nameAr === val || r.nameEn === val
    );
    setEditingRooms((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        type: val,
        capacity: found ? (isRTL ? found.capacityAr : found.capacityEn) : next[index].capacity,
        size: found ? found.defaultSize : next[index].size,
      };
      return next;
    });
  };

  // Add a new room row inside the edit modal
  const handleAddEditingRoomRow = () => {
    const defaultType = STANDARD_ROOM_TYPES.find((r) => r.id === 'quad') || STANDARD_ROOM_TYPES[0];
    const newRow: RoomDetailRow = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
      type: isRTL ? defaultType.nameAr : defaultType.nameEn,
      capacity: isRTL ? defaultType.capacityAr : defaultType.capacityEn,
      size: defaultType.defaultSize,
      count: 2,
    };
    setEditingRooms((prev) => [...prev, newRow]);
  };

  // Remove a room row from the edit modal
  const handleRemoveEditingRoomRow = (index: number) => {
    setEditingRooms((prev) => prev.filter((_, i) => i !== index));
  };

  // Save edited rooms
  const handleSaveEditingRooms = async () => {
    const validRooms = editingRooms.filter((r) => r.type.trim() && Number(r.count) > 0);
    const updated = validRooms.length > 0 ? validRooms : rooms;
    setRooms(updated);

    const calculatedRoomsCount = updated.reduce((acc, r) => acc + (Number(r.count) || 0), 0);

    const updatedLogs: ActivityLogItem[] = [
      {
        id: 'log-' + Date.now(),
        action: 'Room Allocation Modified',
        actionAr: 'تحديث توزيع وتفاصيل الغرف',
        actor: 'Admin User',
        timestamp: new Date().toLocaleString(),
        type: 'update',
        details: `Total Rooms adjusted to ${calculatedRoomsCount}`,
        detailsAr: `تم تعديل إجمالي الغرف إلى ${calculatedRoomsCount} غرفة`,
      },
      ...activityLogs,
    ];
    setActivityLogs(updatedLogs);

    try {
      if (id) {
        await updateContractApi(id, {
          roomsCount: calculatedRoomsCount,
          rooms: updated,
          detailsData: {
            ...(contractRawRef.current?.detailsData || {}),
            rooms: updated,
            activityLogs: updatedLogs,
          },
        } as any);
      }
      window.dispatchEvent(new CustomEvent('umrah_notification_refresh'));
      window.dispatchEvent(new CustomEvent('umrah_contracts_updated'));
    } catch (e) {
      console.error('Failed to update rooms on backend:', e);
    }

    try {
      localStorage.setItem(`agreement_rooms_${id || agreementNo}`, JSON.stringify(updated));

      const saved = localStorage.getItem('contracts_agreements_list');
      if (saved) {
        const list = JSON.parse(saved);
        if (Array.isArray(list)) {
          const targetId = id;
          const idx = list.findIndex(
            (item: any) => item.id === targetId || item.agreementNo === targetId || item.agreementNo === agreementNo
          );
          if (idx !== -1) {
            list[idx].roomsCount = calculatedRoomsCount;
            localStorage.setItem('contracts_agreements_list', JSON.stringify(list));
          }
        }
      }
    } catch (err) {
      console.error('Failed to save rooms locally:', err);
    }

    setIsEditRoomsOpen(false);
  };

  // Handle Add New Amendment Request
  const handleCreateAmendment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmendmentReason.trim()) return;

    const newAmnd: AmendmentItem = {
      id: 'amnd-' + Date.now(),
      requestNo: `AMND-${new Date().getFullYear()}-${String(amendments.length + 1).padStart(3, '0')}`,
      type: newAmendmentType,
      typeAr:
        newAmendmentType === 'Room Quota Adjustment'
          ? 'تعديل حصة الغرف'
          : newAmendmentType === 'Date Adjustment'
            ? 'تعديل فترة الاتفاقية'
            : newAmendmentType === 'Price & Tariff Revision'
              ? 'تعديل الأسعار والتعرفة'
              : 'تعديل فئة الباقة',
      description: newAmendmentReason,
      descriptionAr: newAmendmentReason,
      requestedBy: newAmendmentRequestor || agentName || 'Partner Operations',
      requestDate: toDisplayDate(new Date().toISOString().split('T')[0]),
      previousValue: newAmendmentOldVal || 'Current baseline',
      newValue: newAmendmentNewVal || 'Requested value',
      status: 'Pending',
    };

    const updatedAmendments = [newAmnd, ...amendments];
    setAmendments(updatedAmendments);

    const updatedLogs: ActivityLogItem[] = [
      {
        id: 'log-' + Date.now(),
        action: `Amendment Request Submitted (${newAmnd.requestNo})`,
        actionAr: `تقديم طلب تعديل اتفاقية جديد (${newAmnd.requestNo})`,
        actor: newAmnd.requestedBy,
        timestamp: new Date().toLocaleString(),
        type: 'amendment',
        details: `${newAmnd.type}: ${newAmnd.description}`,
        detailsAr: `${newAmnd.typeAr}: ${newAmnd.descriptionAr}`,
      },
      ...activityLogs,
    ];
    setActivityLogs(updatedLogs);

    try {
      if (id) {
        await updateContractApi(id, {
          detailsData: {
            ...(contractRawRef.current?.detailsData || {}),
            amendments: updatedAmendments,
            activityLogs: updatedLogs,
          },
        } as any);
      }
      window.dispatchEvent(new CustomEvent('umrah_notification_refresh'));
      window.dispatchEvent(new CustomEvent('umrah_contracts_updated'));
    } catch (err) {
      console.error('Failed to save amendment to backend:', err);
    }

    setNewAmendmentReason('');
    setNewAmendmentOldVal('');
    setNewAmendmentNewVal('');
    setNewAmendmentRequestor('');
    setIsAddAmendmentOpen(false);
  };

  // Handle Approve or Reject Amendment
  const handleResolveAmendment = async (amendmentId: string, status: 'Approved' | 'Rejected') => {
    const updated = amendments.map((a) =>
      a.id === amendmentId
        ? {
          ...a,
          status,
          resolvedAt: toDisplayDate(new Date().toISOString().split('T')[0]),
          resolvedBy: 'Admin Operations Desk',
        }
        : a
    );
    setAmendments(updated);

    const target = amendments.find((a) => a.id === amendmentId);
    const updatedLogs: ActivityLogItem[] = [
      {
        id: 'log-' + Date.now(),
        action: `Amendment ${target?.requestNo || amendmentId} ${status}`,
        actionAr: `تم ${status === 'Approved' ? 'قبول واعتماد' : 'رفض'} طلب التعديل ${target?.requestNo || amendmentId}`,
        actor: 'Admin Operations Desk',
        timestamp: new Date().toLocaleString(),
        type: status === 'Approved' ? 'approval' : 'amendment',
        details: `Status set to ${status}.`,
        detailsAr: `تم تحديث الحالة إلى ${status === 'Approved' ? 'معتمد' : 'مرفوض'}.`,
      },
      ...activityLogs,
    ];
    setActivityLogs(updatedLogs);

    try {
      if (id) {
        await updateContractApi(id, {
          detailsData: {
            ...(contractRawRef.current?.detailsData || {}),
            amendments: updated,
            activityLogs: updatedLogs,
          },
        } as any);
      }
      window.dispatchEvent(new CustomEvent('umrah_notification_refresh'));
      window.dispatchEvent(new CustomEvent('umrah_contracts_updated'));
    } catch (err) {
      console.error('Failed to resolve amendment on backend:', err);
    }
  };

  // Handle Toggle Payment Milestone Status
  const handleTogglePaymentMilestone = async (milestoneId: string) => {
    const updated = paymentMilestones.map((m) => {
      if (m.id === milestoneId) {
        const nextStatus = m.status === 'Paid' ? 'Pending' : 'Paid';
        return {
          ...m,
          status: nextStatus as any,
          paidAt: nextStatus === 'Paid' ? toDisplayDate(new Date().toISOString().split('T')[0]) : undefined,
        };
      }
      return m;
    });
    setPaymentMilestones(updated);

    const target = paymentMilestones.find((m) => m.id === milestoneId);
    const nextStatus = target?.status === 'Paid' ? 'Pending' : 'Paid';
    const updatedLogs: ActivityLogItem[] = [
      {
        id: 'log-' + Date.now(),
        action: `Payment Milestone Updated: ${target?.title}`,
        actionAr: `تحديث حالة دفعة السداد: ${target?.titleAr}`,
        actor: 'Finance Department',
        timestamp: new Date().toLocaleString(),
        type: 'payment',
        details: `Marked as ${nextStatus} (SAR ${target?.amount.toLocaleString()})`,
        detailsAr: `تم تعيين الحالة إلى ${nextStatus === 'Paid' ? 'مدفوع' : 'معلق'} (${target?.amount.toLocaleString()} ر.س)`,
      },
      ...activityLogs,
    ];
    setActivityLogs(updatedLogs);

    try {
      if (id) {
        await updateContractApi(id, {
          detailsData: {
            ...(contractRawRef.current?.detailsData || {}),
            paymentMilestones: updated,
            activityLogs: updatedLogs,
          },
        } as any);
      }
      window.dispatchEvent(new CustomEvent('umrah_notification_refresh'));
      window.dispatchEvent(new CustomEvent('umrah_contracts_updated'));
    } catch (err) {
      console.error('Failed to toggle payment milestone on backend:', err);
    }
  };

  // Compute live totals for editing rooms
  const editingTotalRooms = editingRooms.reduce((acc, r) => acc + (Number(r.count) || 0), 0);
  const editingTotalPilgrims = editingRooms.reduce((acc, r) => {
    const perRoom = r.type.includes('ثلاثية') || r.type.includes('Triple')
      ? 3
      : r.type.includes('ثنائية') || r.type.includes('Double')
        ? 2
        : r.type.includes('خماسية') || r.type.includes('Quintuple')
          ? 5
          : r.type.includes('رباعية') || r.type.includes('Quad')
            ? 4
            : r.type.includes('مفردة') || r.type.includes('Single')
              ? 1
              : r.type.includes('عائلي') || r.type.includes('Family')
                ? 6
                : 3;
    return acc + perRoom * (Number(r.count) || 0);
  }, 0);

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
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => setIsEditBasicOpen(true)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{t('contracts.edit_basic_info', 'تعديل البيانات')}</span>
                </button>
              )}
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
                  className={`pb-3 border-b-2 whitespace-nowrap transition cursor-pointer ${isActive
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
                    {!isReadOnly && (
                      <button
                        onClick={() => setIsEditAgreementOpen(true)}
                        className="px-3 py-1 rounded-lg text-xs font-bold bg-[#eff6ff] text-[#2563eb] hover:bg-[#dbeafe] transition cursor-pointer"
                      >
                        {t('common.edit', 'تعديل')}
                      </button>
                    )}
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

                  {!isReadOnly && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleOpenEditRooms}
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
                  )}
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

          {/* Tab 2 Content: Amendment Requests (طلبات تعديل الاتفاقية) */}
          {(activeTab === 'طلبات تعديل الاتفاقية' || activeTab === 'Amendment Requests') && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header card with action */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileSignature className="w-5 h-5 text-emerald-600" />
                    <span>{isRTL ? 'طلبات تعديل بنود الاتفاقية' : 'Agreement Amendment Requests'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {isRTL
                      ? 'إدارة ومراجعة طلبات تعديل التواريخ أو حصة الغرف والأسعار مع شركاء الخدمة.'
                      : 'Manage and review amendment requests for dates, room quota, and rates with service partners.'}
                  </p>
                </div>
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => setIsAddAmendmentOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer active:scale-95 shrink-0"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>{isRTL ? '+ طلب تعديل جديد' : 'New Amendment Request'}</span>
                  </button>
                )}
              </div>

              {/* Amendments List Table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-600 font-bold text-xs">
                        <th className="py-3.5 px-5 text-start">{isRTL ? 'رقم الطلب' : 'Request No'}</th>
                        <th className="py-3.5 px-5 text-start">{isRTL ? 'نوع التعديل' : 'Amendment Type'}</th>
                        <th className="py-3.5 px-5 text-start">{isRTL ? 'التفاصيل والسبب' : 'Description & Reason'}</th>
                        <th className="py-3.5 px-5 text-start">{isRTL ? 'القيمة السابقة / الجديدة' : 'Previous vs New'}</th>
                        <th className="py-3.5 px-5 text-start">{isRTL ? 'مقدم الطلب والتاريخ' : 'Requested By / Date'}</th>
                        <th className="py-3.5 px-5 text-start">{isRTL ? 'الحالة' : 'Status'}</th>
                        <th className="py-3.5 px-5 text-center">{isRTL ? 'الإجراءات' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                      {amendments.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400">
                            <FileSignature className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                            <span>{isRTL ? 'لا توجد طلبات تعديل لهذه الاتفاقية حتى الآن' : 'No amendment requests recorded for this agreement yet.'}</span>
                          </td>
                        </tr>
                      ) : (
                        amendments.map((amnd) => (
                          <tr key={amnd.id} className="hover:bg-slate-50/60 transition">
                            <td className="py-4 px-5 font-mono font-bold text-slate-900 whitespace-nowrap">
                              {amnd.requestNo}
                            </td>
                            <td className="py-4 px-5 whitespace-nowrap">
                              <span className="font-semibold text-slate-800">
                                {isRTL ? amnd.typeAr : amnd.type}
                              </span>
                            </td>
                            <td className="py-4 px-5 max-w-xs text-xs text-slate-600 leading-relaxed">
                              {isRTL ? amnd.descriptionAr : amnd.description}
                            </td>
                            <td className="py-4 px-5 whitespace-nowrap text-xs space-y-1">
                              <div className="text-slate-400 line-through font-medium">
                                {amnd.previousValue}
                              </div>
                              <div className="text-emerald-700 font-bold flex items-center gap-1">
                                <ArrowRight className="w-3 h-3 shrink-0" />
                                <span>{amnd.newValue}</span>
                              </div>
                            </td>
                            <td className="py-4 px-5 whitespace-nowrap text-xs text-slate-500">
                              <div className="font-semibold text-slate-800">{amnd.requestedBy}</div>
                              <div className="font-mono text-[11px] text-slate-400">{amnd.requestDate}</div>
                            </td>
                            <td className="py-4 px-5 whitespace-nowrap">
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${amnd.status === 'Approved'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : amnd.status === 'Rejected'
                                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                                  }`}
                              >
                                {amnd.status === 'Approved' ? (
                                  <Check className="w-3 h-3" />
                                ) : amnd.status === 'Rejected' ? (
                                  <X className="w-3 h-3" />
                                ) : (
                                  <Clock className="w-3 h-3" />
                                )}
                                <span>
                                  {amnd.status === 'Approved'
                                    ? (isRTL ? 'معتمد ومقبول' : 'Approved')
                                    : amnd.status === 'Rejected'
                                      ? (isRTL ? 'مرفوض' : 'Rejected')
                                      : (isRTL ? 'قيد المراجعة' : 'Pending Review')}
                                </span>
                              </span>
                            </td>
                            <td className="py-4 px-5 whitespace-nowrap text-center">
                              {!isReadOnly && amnd.status === 'Pending' ? (
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleResolveAmendment(amnd.id, 'Approved')}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs transition cursor-pointer"
                                    title={isRTL ? 'قبول واعتماد التعديل' : 'Approve Amendment'}
                                  >
                                    {isRTL ? 'قبول' : 'Approve'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleResolveAmendment(amnd.id, 'Rejected')}
                                    className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs transition cursor-pointer"
                                    title={isRTL ? 'رفض التعديل' : 'Reject Amendment'}
                                  >
                                    {isRTL ? 'رفض' : 'Reject'}
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[11px] text-slate-400 font-medium">
                                  {amnd.resolvedAt ? `${isRTL ? 'في' : 'on'} ${amnd.resolvedAt}` : '—'}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3 Content: Activity Log (سجل التحديثات) */}
          {(activeTab === 'سجل التحديثات' || activeTab === 'Activity Log') && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <History className="w-5 h-5 text-blue-600" />
                      <span>{isRTL ? 'سجل العمليات والأثر التدقيقي' : 'Audit Trail & Activity History'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isRTL
                        ? 'توثيق آلي لجميع التعديلات، تحديثات الغرف، المدفوعات، والاعتمادات على مدار دورة حياة الاتفاقية.'
                        : 'Automated chronological trail of all modifications, room changes, payments, and approvals.'}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border border-slate-200">
                    {activityLogs.length} {isRTL ? 'سجلات' : 'Events'}
                  </span>
                </div>

                {/* Timeline */}
                <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {activityLogs.map((log, idx) => (
                    <div key={log.id || idx} className="relative flex items-start gap-4 group">
                      {/* Timeline Bullet */}
                      <div
                        className={`absolute -left-6 sm:-left-8 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 border-white shadow-xs ${log.type === 'creation'
                            ? 'bg-blue-600 text-white'
                            : log.type === 'payment'
                              ? 'bg-emerald-600 text-white'
                              : log.type === 'approval'
                                ? 'bg-indigo-600 text-white'
                                : log.type === 'amendment'
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-slate-700 text-white'
                          }`}
                      >
                        {log.type === 'creation' ? (
                          <FileText className="w-3.5 h-3.5" />
                        ) : log.type === 'payment' ? (
                          <DollarSign className="w-3.5 h-3.5" />
                        ) : log.type === 'approval' ? (
                          <ShieldCheck className="w-3.5 h-3.5" />
                        ) : log.type === 'amendment' ? (
                          <FileSignature className="w-3.5 h-3.5" />
                        ) : (
                          <Edit3 className="w-3.5 h-3.5" />
                        )}
                      </div>

                      {/* Content Box */}
                      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex-1 space-y-1 hover:bg-white hover:shadow-2xs transition">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="text-sm font-bold text-slate-900">
                            {isRTL ? log.actionAr : log.action}
                          </h4>
                          <span className="text-[11px] font-mono text-slate-400">
                            {log.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          {isRTL ? (log.detailsAr || log.details) : (log.details || log.detailsAr)}
                        </p>
                        <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                          <span>{isRTL ? 'المنفذ:' : 'Actor:'}</span>
                          <span className="font-semibold text-slate-700">{log.actor}</span>
                        </div>
                      </div>
                    </div>
                  ))}
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
                  {/* Hotel Image with Overlay Badge & Multi-Photo Carousel */}
                  {(() => {
                    const allImgs =
                      currentHotel.images && Array.isArray(currentHotel.images) && currentHotel.images.length > 0
                        ? currentHotel.images
                        : currentHotel.image
                          ? [currentHotel.image]
                          : [];
                    const safeIdx = Math.min(hotelPhotoIdx, Math.max(0, allImgs.length - 1));
                    const currentImg = allImgs[safeIdx] || currentHotel.image || '';

                    return (
                      <div className="lg:col-span-4 flex flex-col gap-2">
                        <div className="relative rounded-xl overflow-hidden min-h-[220px] max-h-[260px] bg-slate-900 border border-slate-200/80 group">
                          <img
                            src={currentImg}
                            alt={`${currentHotel.name} - Photo ${safeIdx + 1}`}
                            className="w-full h-full object-cover min-h-[220px] max-h-[260px] group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
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

                          {/* Photo Counter Badge */}
                          {allImgs.length > 1 && (
                            <div className="absolute top-3 left-3 z-10 bg-black/70 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-md flex items-center gap-1.5 shadow-sm">
                              <ImageIcon className="w-3 h-3 text-emerald-400" />
                              <span>
                                {isRTL
                                  ? `صورة ${safeIdx + 1} من ${allImgs.length}`
                                  : `Photo ${safeIdx + 1} of ${allImgs.length}`}
                              </span>
                            </div>
                          )}

                          {/* Carousel Navigation Arrows */}
                          {allImgs.length > 1 && (
                            <>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setHotelPhotoIdx((prev) => (prev > 0 ? prev - 1 : allImgs.length - 1));
                                }}
                                className="absolute top-1/2 -translate-y-1/2 left-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center transition shadow-md opacity-90 group-hover:opacity-100 cursor-pointer active:scale-90"
                                title={isRTL ? 'الصورة السابقة' : 'Previous Photo'}
                              >
                                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setHotelPhotoIdx((prev) => (prev < allImgs.length - 1 ? prev + 1 : 0));
                                }}
                                className="absolute top-1/2 -translate-y-1/2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center transition shadow-md opacity-90 group-hover:opacity-100 cursor-pointer active:scale-90"
                                title={isRTL ? 'الصورة التالية' : 'Next Photo'}
                              >
                                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                              </button>
                            </>
                          )}

                          {currentHotel.distanceToHaram && (
                            <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs flex items-center gap-1.5 font-medium z-10">
                              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span className="truncate">{currentHotel.distanceToHaram}</span>
                            </div>
                          )}
                        </div>

                        {/* Thumbnails Strip */}
                        {allImgs.length > 1 && (
                          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
                            {allImgs.map((imgUrl, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setHotelPhotoIdx(idx)}
                                className={`relative w-14 h-11 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                                  safeIdx === idx
                                    ? 'border-emerald-500 ring-2 ring-emerald-300/60 scale-105 shadow-sm'
                                    : 'border-slate-200 opacity-60 hover:opacity-100'
                                }`}
                                title={`Photo ${idx + 1}`}
                              >
                                <img
                                  src={imgUrl}
                                  alt={`Thumb ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}

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

          {/* Tab 5 Content: Order Details (تفاصيل الطلب والفواتير) */}
          {(activeTab === 'تفاصيل الطلب' || activeTab === 'Order Details') && (
            <div className="space-y-6 animate-fadeIn">
              {/* Order Overview Header Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs space-y-2">
                  <div className="text-xs text-slate-500 font-semibold">{isRTL ? 'رقم أمر الشراء / PO' : 'Purchase Order Number'}</div>
                  <div className="text-base font-mono font-bold text-slate-900">PO-{agreementNo || '2026-AGR'}</div>
                  <div className="text-[11px] text-emerald-600 font-medium">{isRTL ? 'نظام أوامر الشراء الإلكتروني' : 'Electronic PO Integrated'}</div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs space-y-2">
                  <div className="text-xs text-slate-500 font-semibold">{isRTL ? 'إجمالي قيمة العقد شامل الضريبة' : 'Total Contract Value (Incl. VAT)'}</div>
                  <div className="text-xl font-bold text-emerald-600 font-mono">{numericPrice.toLocaleString()} {t('common.currency', 'ر.س')}</div>
                  <div className="text-[11px] text-slate-400 font-medium">{isRTL ? 'شامل 15% ضريبة القيمة المضافة' : 'Includes 15% Saudi VAT'}</div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs space-y-2">
                  <div className="text-xs text-slate-500 font-semibold">{isRTL ? 'حالة السداد والضمان' : 'Payment & Escrow Status'}</div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{isRTL ? 'ضمان نسك مفعل' : 'Nusuk Escrow Active'}</span>
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">{isRTL ? 'محمي بواسطة بنك الضمان المعتمد' : 'Secured via Authorized Escrow'}</div>
                </div>
              </div>

              {/* Invoicing Breakdown & Payment Milestones */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Financial Breakdown */}
                <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span>{isRTL ? 'بيان التسعير والضرائب' : 'Cost & Tax Breakdown'}</span>
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">ZATCA Compliant</span>
                  </div>

                  <div className="space-y-3.5 text-xs sm:text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">{isRTL ? 'تكلفة حجز الغرف الأساسية' : 'Base Room Booking Cost'}</span>
                      <span className="font-semibold text-slate-800 font-mono">{baseRoomRate.toLocaleString()} {t('common.currency', 'ر.س')}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">{isRTL ? 'رسوم الخدمات التشغيلية والتأمين' : 'Operational & Service Fees'}</span>
                      <span className="font-semibold text-slate-800 font-mono">{serviceFees.toLocaleString()} {t('common.currency', 'ر.س')}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">{isRTL ? 'ضريبة القيمة المضافة (15% VAT)' : 'Saudi VAT (15%)'}</span>
                      <span className="font-semibold text-amber-700 font-mono">{vatAmount.toLocaleString()} {t('common.currency', 'ر.س')}</span>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-base font-bold">
                      <span className="text-slate-900">{isRTL ? 'الإجمالي النهائي' : 'Grand Total'}</span>
                      <span className="text-emerald-600 font-mono">{numericPrice.toLocaleString()} {t('common.currency', 'ر.س')}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Payment Schedule Milestones */}
                <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span>{isRTL ? 'دفعات وتدفقات السداد' : 'Payment Milestone Schedule'}</span>
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">{isRTL ? 'انقر لتحديث الحالة' : 'Click to Toggle Status'}</span>
                  </div>

                  <div className="space-y-3">
                    {paymentMilestones.map((ms, idx) => (
                      <div
                        key={ms.id || idx}
                        onClick={() => handleTogglePaymentMilestone(ms.id)}
                        className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between ${ms.status === 'Paid'
                            ? 'bg-emerald-50/50 border-emerald-200 hover:bg-emerald-50'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                          }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {isRTL ? ms.titleAr : ms.title}
                            </span>
                            <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                              {ms.percentage}%
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {isRTL ? 'تاريخ الاستحقاق:' : 'Due Date:'} {ms.dueDate} {ms.paidAt ? `(${isRTL ? 'سدد في' : 'Paid on'} ${ms.paidAt})` : ''}
                          </div>
                        </div>

                        <div className="text-end space-y-1">
                          <div className="text-sm font-bold font-mono text-slate-900">
                            {ms.amount.toLocaleString()} {t('common.currency', 'ر.س')}
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold inline-flex items-center gap-1 ${ms.status === 'Paid'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-amber-100 text-amber-800'
                              }`}
                          >
                            {ms.status === 'Paid' ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            <span>{ms.status === 'Paid' ? (isRTL ? 'تم السداد' : 'Paid') : (isRTL ? 'معلق' : 'Pending')}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 6 Content: Agreement Usage (استخدام الاتفاقية) */}
          {(activeTab === 'استخدام الاتفاقية' || activeTab === 'Agreement Usage') && (
            <div className="space-y-6 animate-fadeIn">
              {/* Capacity Meters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs space-y-2">
                  <div className="text-xs text-slate-500 font-semibold">{isRTL ? 'إجمالي الغرف المتعاقد عليها' : 'Total Contracted Rooms'}</div>
                  <div className="text-2xl font-bold text-slate-900 font-mono">{totalRooms} <span className="text-xs font-normal text-slate-500">{isRTL ? 'غرفة' : 'Rooms'}</span></div>
                  <div className="text-[11px] text-slate-400">{totalPilgrims} {isRTL ? 'معتمر السعة القصوى' : 'Max Pilgrims Capacity'}</div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs space-y-2">
                  <div className="text-xs text-blue-700 font-semibold">{isRTL ? 'الغرف المشغولة / المخصصة' : 'Allocated Rooms'}</div>
                  <div className="text-2xl font-bold text-blue-600 font-mono">{allocatedRooms} <span className="text-xs font-normal text-slate-500">{isRTL ? 'غرفة' : 'Rooms'}</span></div>
                  <div className="text-[11px] text-blue-600 font-medium">{allocatedPilgrims} {isRTL ? 'معتمر مخصص بالمجموعات' : 'Pilgrims Assigned'}</div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs space-y-2">
                  <div className="text-xs text-emerald-700 font-semibold">{isRTL ? 'الغرف الشاغرة المتبقية' : 'Remaining Available Rooms'}</div>
                  <div className="text-2xl font-bold text-emerald-600 font-mono">{remainingRooms} <span className="text-xs font-normal text-slate-500">{isRTL ? 'غرفة' : 'Rooms'}</span></div>
                  <div className="text-[11px] text-emerald-600 font-medium">{isRTL ? 'متاحة للربط مع أفواج جديدة' : 'Available for New Groups'}</div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs space-y-2">
                  <div className="text-xs text-purple-700 font-semibold">{isRTL ? 'نسبة الاستيعاب والإشغال' : 'Utilization Rate'}</div>
                  <div className="text-2xl font-bold text-purple-600 font-mono">{utilizationPercentage}%</div>
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-purple-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${utilizationPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Linked Groups Allocation Table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {isRTL ? 'المجموعات والأفواج المسكنة بموجب هذه الاتفاقية' : 'Assigned Groups Linked to this Agreement'}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {assignedGroups.length} {isRTL ? 'مجموعات نشطة' : 'Active Groups'}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-600 font-bold text-xs">
                        <th className="py-3 px-6 text-start">{isRTL ? 'رمز الفوج / المجموعة' : 'Group Code'}</th>
                        <th className="py-3 px-6 text-start">{isRTL ? 'الوكيل والشريك' : 'Agent & Partner'}</th>
                        <th className="py-3 px-6 text-start">{isRTL ? 'عدد المعتمرين' : 'Pilgrims Count'}</th>
                        <th className="py-3 px-6 text-start">{isRTL ? 'الغرف المحجوزة' : 'Rooms Used'}</th>
                        <th className="py-3 px-6 text-start">{isRTL ? 'فترة الإقامة' : 'Stay Period'}</th>
                        <th className="py-3 px-6 text-start">{isRTL ? 'الحالة' : 'Status'}</th>
                        <th className="py-3 px-6 text-center">{isRTL ? 'عرض الفوج' : 'View Group'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                      {assignedGroups.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-10 text-center text-slate-400">
                            <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                            <span>{isRTL ? 'لم يتم ربط أي مجموعة بعد بهذه الاتفاقية.' : 'No groups currently assigned to this agreement.'}</span>
                          </td>
                        </tr>
                      ) : (
                        assignedGroups.map((grp) => (
                          <tr key={grp.id} className="hover:bg-slate-50/50 transition">
                            <td className="py-4 px-6 font-mono font-bold text-slate-900 whitespace-nowrap">
                              {grp.code || (grp as any).groupNo}
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap font-semibold text-slate-800">
                              {grp.mainAgent || agentName}
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap font-bold text-emerald-700 font-mono">
                              {grp.pilgrimsCount} {isRTL ? 'معتمر' : 'Pilgrims'}
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap font-mono text-slate-700">
                              {Math.ceil((Number(grp.pilgrimsCount) || 4) / 4)} {isRTL ? 'غرف' : 'Rooms'}
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap font-mono text-xs text-slate-500">
                              {(grp as any).arrivalDate || startDate} - {(grp as any).departureDate || endDate}
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                                {grp.status || (isRTL ? 'نشط' : 'Active')}
                              </span>
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap text-center">
                              <button
                                type="button"
                                onClick={() => navigate('/groups')}
                                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 transition cursor-pointer mx-auto"
                              >
                                <span>{isRTL ? 'تفاصيل' : 'Details'}</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Edit Basic Info Modal */}
      {isEditBasicOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-fadeIn">
            <div
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-5"
              dir={direction}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                <h3 className="text-base font-bold text-[#0f172a]">
                  {t('contracts.edit_basic_info', 'تعديل البيانات الأساسية')}
                </h3>
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
                {/* Field 0: Agreement Number */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center justify-between">
                    <span>
                      {isRTL
                        ? 'رقم الاتفاقية (نظام نسك / وزارة الحج والعمرة)'
                        : 'Agreement Number (Nusuk System)'}
                    </span>
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

                {/* Field 2: Hotel Selector from Added Hotels & Custom Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-600">
                      {isRTL ? 'اسم الفندق / المنشأة' : 'Hotel / Added Entity'}
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomHotel(!isCustomHotel);
                        if (!isCustomHotel) {
                          setHotelId('');
                        }
                      }}
                      className="text-[10px] text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded font-medium border border-emerald-200 transition cursor-pointer"
                    >
                      {isCustomHotel
                        ? (isRTL ? 'فنادق النظام المضافة' : 'From Added Hotels')
                        : (isRTL ? '+ إدخال مخصص' : '+ Custom Entry')}
                    </button>
                  </div>

                  {!isCustomHotel && availableHotels.length > 0 ? (
                    <select
                      value={hotelId || (availableHotels.find((h) => h.name === hotelName || h.nameEn === hotelName)?.id || '')}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        if (selectedId === '__custom__') {
                          setIsCustomHotel(true);
                          setHotelId('');
                        } else {
                          setHotelId(selectedId);
                          const found = availableHotels.find((h) => h.id === selectedId || h.name === selectedId);
                          if (found) {
                            const hName = isRTL ? found.name : (found.nameEn || found.name);
                            setHotelName(hName);
                            setRating(found.rating);
                            setAgreementTitle(isRTL ? `اتفاقية ${found.name}` : `${found.nameEn || found.name} Agreement`);
                          }
                        }
                      }}
                      className="w-full border border-slate-200/90 rounded-xl px-3.5 py-2.5 bg-[#f8fafc] text-xs sm:text-sm text-slate-800 font-bold focus:outline-hidden focus:border-emerald-500 cursor-pointer shadow-2xs"
                    >
                      <option value="">{isRTL ? '-- اختر الفندق من النظام --' : '-- Select System Hotel --'}</option>
                      {availableHotels.map((h) => (
                        <option key={h.id} value={h.id}>
                          {isRTL ? h.name : (h.nameEn || h.name)} ({h.location} - {h.rating}★)
                        </option>
                      ))}
                      <option value="__custom__">
                        {isRTL ? '+ إدخال اسم فندق / جهة مخصصة...' : '+ Type Custom Entity Name...'}
                      </option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={hotelName}
                      onChange={(e) => {
                        setHotelName(e.target.value);
                        setHotelId('');
                        if (!agreementTitle || agreementTitle.startsWith('اتفاقية') || agreementTitle.endsWith('Agreement')) {
                          setAgreementTitle(e.target.value ? (isRTL ? `اتفاقية ${e.target.value}` : `${e.target.value} Agreement`) : '');
                        }
                      }}
                      placeholder={isRTL ? 'اسم الفندق أو المنشأة' : 'Hotel or Entity Name'}
                      className="w-full border border-slate-200/90 rounded-xl px-3.5 py-2.5 bg-[#f8fafc] text-xs sm:text-sm text-slate-800 font-bold focus:outline-hidden focus:border-emerald-500 shadow-2xs"
                    />
                  )}
                </div>

                {/* Field: External Agent & Partner */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    {isRTL ? 'الوكيل والشريك الخارجي' : 'External Agent & Partner'}
                  </label>
                  <select
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="w-full border border-slate-200/90 rounded-xl px-3.5 py-2.5 bg-[#f8fafc] text-xs sm:text-sm text-slate-800 font-semibold focus:outline-hidden focus:border-emerald-500 shadow-2xs cursor-pointer"
                  >
                    <option value="">{isRTL ? 'اختر الوكيل أو الشريك...' : 'Select Agent / Partner...'}</option>
                    {availableAgents.map((a: any, idx) => {
                      const val = isRTL ? a.nameAr : (a.nameEn || a.nameAr);
                      return (
                        <option key={idx} value={val}>
                          {val}
                        </option>
                      );
                    })}
                    {!availableAgents.some((a: any) => (isRTL ? a.nameAr : (a.nameEn || a.nameAr)) === agentName || a.nameAr === agentName || a.nameEn === agentName) && agentName && (
                      <option value={agentName}>{agentName}</option>
                    )}
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
                    className="w-full border border-slate-200/90 rounded-xl px-3.5 py-2.5 bg-[#f8fafc] text-xs sm:text-sm text-slate-800 font-semibold focus:outline-hidden focus:border-emerald-500 shadow-2xs cursor-pointer"
                  >
                    <option value="">{isRTL ? 'اختر فئة وباقة العمرة...' : 'Select Umrah Package...'}</option>
                    {availablePackages.map((p: any, idx) => {
                      const val = isRTL ? p.nameAr : (p.nameEn || p.nameAr);
                      return (
                        <option key={idx} value={val}>
                          {val}
                        </option>
                      );
                    })}
                    {!availablePackages.some((p: any) => (isRTL ? p.nameAr : (p.nameEn || p.nameAr)) === packageTier || p.nameAr === packageTier || p.nameEn === packageTier) && packageTier && (
                      <option value={packageTier}>{packageTier}</option>
                    )}
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
          </div>,
          document.body
        )}

      {/* Edit Agreement Info Modal */}
      {isEditAgreementOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-fadeIn">
            <div
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-5"
              dir={direction}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                <h3 className="text-base font-bold text-[#0f172a]">
                  {t('contracts.edit_agreement_info', 'تعديل بيانات الاتفاقية')}
                </h3>
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
          </div>,
          document.body
        )}

      {/* Edit Reserved Room Details Modal */}
      {isEditRoomsOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/30 backdrop-blur-xs animate-fadeIn">
            <div
              className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden"
              dir={direction}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                    <Bed className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#0f172a]">
                      {t('contracts.edit_rooms_title', 'تعديل تفاصيل الغرف المحجوزة')}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {hotelName} • <span className="font-mono text-slate-700 font-semibold">{agreementNo}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditRoomsOpen(false)}
                  className="w-8 h-8 rounded-lg bg-[#f1f5f9] hover:bg-[#e2e8f0] flex items-center justify-center text-slate-600 transition cursor-pointer"
                  title={t('common.close', 'إغلاق')}
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="p-6 space-y-4 overflow-y-auto flex-1 bg-[#fcfdfe]">
                {editingRooms.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    {t('contracts.no_rooms_selected', 'لم يتم إضافة أي غرف بعد')}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {editingRooms.map((room, idx) => (
                      <div
                        key={room.id || idx}
                        className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs hover:border-slate-300 transition space-y-3"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                          <span className="font-bold text-slate-700 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 font-mono text-[11px] flex items-center justify-center font-bold">
                              {idx + 1}
                            </span>
                            {isRTL ? `نوع الغرفة #${idx + 1}` : `Room Type #${idx + 1}`}
                          </span>
                          {editingRooms.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveEditingRoomRow(idx)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                              title={t('contracts.remove_room', 'حذف الغرفة')}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{t('common.delete', 'حذف')}</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                          {/* Room Type */}
                          <div className="sm:col-span-4">
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              {t('contracts.room_type', 'نوع الغرفة')}
                            </label>
                            <select
                              value={room.type}
                              onChange={(e) => handleEditingRoomTypeChange(idx, e.target.value)}
                              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 bg-white focus:outline-hidden focus:border-blue-600 cursor-pointer shadow-2xs"
                            >
                              {STANDARD_ROOM_TYPES.map((rt) => (
                                <option key={rt.id} value={isRTL ? rt.nameAr : rt.nameEn}>
                                  {isRTL ? rt.nameAr : rt.nameEn}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Room Capacity */}
                          <div className="sm:col-span-3">
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              {t('contracts.room_capacity', 'سعة الغرفة')}
                            </label>
                            <input
                              type="text"
                              value={room.capacity}
                              onChange={(e) => handleUpdateEditingRoom(idx, 'capacity', e.target.value)}
                              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium bg-white focus:outline-hidden focus:border-blue-600 shadow-2xs"
                            />
                          </div>

                          {/* Room Size */}
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              {t('contracts.room_size', 'حجم الغرفة')}
                            </label>
                            <input
                              type="text"
                              value={room.size}
                              onChange={(e) => handleUpdateEditingRoom(idx, 'size', e.target.value)}
                              className="w-full border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 font-mono text-center bg-white focus:outline-hidden focus:border-blue-600 shadow-2xs"
                            />
                          </div>

                          {/* Room Count with Stepper */}
                          <div className="sm:col-span-3">
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              {t('contracts.room_count', 'العدد المطلوب')}
                            </label>
                            <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-2xs overflow-hidden">
                              <button
                                type="button"
                                onClick={() => handleUpdateEditingRoom(idx, 'count', Math.max(1, (Number(room.count) || 1) - 1))}
                                className="px-2.5 py-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={room.count}
                                onChange={(e) => handleUpdateEditingRoom(idx, 'count', Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-full text-center text-xs font-bold text-slate-900 focus:outline-hidden py-2"
                              />
                              <button
                                type="button"
                                onClick={() => handleUpdateEditingRoom(idx, 'count', (Number(room.count) || 0) + 1)}
                                className="px-2.5 py-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Room Type Button */}
                <button
                  type="button"
                  onClick={handleAddEditingRoomRow}
                  className="w-full py-2.5 px-4 rounded-xl border border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer hover:border-blue-400"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('contracts.add_another_room', '+ إضافة نوع غرفة آخر')}</span>
                </button>

                {/* Live Info / Stats Bar */}
                <div className="border border-[#bfdbfe] bg-[#eff6ff] rounded-xl px-4 py-3 flex items-center justify-between text-xs sm:text-sm font-semibold text-[#1d4ed8]">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 shrink-0 text-[#2563eb]" />
                    <span>
                      {isRTL
                        ? `إجمالي الغرف: ${editingTotalRooms} غرفة`
                        : `Total Rooms: ${editingTotalRooms} rooms`}
                    </span>
                  </div>
                  <span className="font-bold text-[#1e40af] bg-blue-100/80 px-2.5 py-1 rounded-lg text-xs">
                    {isRTL
                      ? `سعة المعتمرين: ${editingTotalPilgrims} معتمر`
                      : `Pilgrim Capacity: ${editingTotalPilgrims} pilgrims`}
                  </span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditRoomsOpen(false)}
                  className="px-6 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  {t('common.cancel', 'إلغاء')}
                </button>
                <button
                  type="button"
                  onClick={handleSaveEditingRooms}
                  className="px-6 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{t('common.save', 'حفظ التعديلات')}</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Add Room Modal */}
      {isAddRoomOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-fadeIn">
            <form
              onSubmit={handleSaveRoom}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4"
              dir={direction}
            >
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-base font-bold text-slate-900">
                  {isRTL ? 'إضافة نوع غرفة جديدة' : 'Add New Room Type'}
                </h3>
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('contracts.room_type', 'نوع الغرفة')}
                  </label>
                  <select
                    value={newRoomType}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewRoomType(val);
                      const liveFound = availableRoomTypes.find(
                        (r) => (isRTL ? r.nameAr : r.nameEn) === val || r.nameAr === val || r.nameEn === val
                      );
                      if (liveFound && liveFound.secondary) {
                        setNewRoomCapacity(liveFound.secondary);
                        return;
                      }
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
                    {availableRoomTypes.length > 0
                      ? availableRoomTypes.map((rt) => {
                        const label = isRTL ? rt.nameAr : rt.nameEn;
                        const sub = rt.secondary ? ` (${rt.secondary})` : '';
                        return (
                          <option key={rt.id} value={label}>
                            {label}{sub}
                          </option>
                        );
                      })
                      : STANDARD_ROOM_TYPES.map((rt) => (
                        <option key={rt.id} value={isRTL ? rt.nameAr : rt.nameEn}>
                          {isRTL ? rt.nameAr : rt.nameEn} ({isRTL ? rt.capacityAr : rt.capacityEn})
                        </option>
                      ))}
                    {!availableRoomTypes.some((rt) => (isRTL ? rt.nameAr : rt.nameEn) === newRoomType || rt.nameAr === newRoomType || rt.nameEn === newRoomType) &&
                      !STANDARD_ROOM_TYPES.some((rt) => (isRTL ? rt.nameAr : rt.nameEn) === newRoomType || rt.nameAr === newRoomType || rt.nameEn === newRoomType) &&
                      newRoomType && (
                        <option value={newRoomType}>{newRoomType}</option>
                      )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('contracts.room_capacity', 'سعة الغرفة')}
                  </label>
                  <input
                    type="text"
                    value={newRoomCapacity}
                    onChange={(e) => setNewRoomCapacity(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('contracts.room_size', 'حجم الغرفة')}
                  </label>
                  <input
                    type="text"
                    value={newRoomSize}
                    onChange={(e) => setNewRoomSize(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('contracts.room_count', 'العدد المطلوب')}
                  </label>
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
          </div>,
          document.body
        )}

      {/* New Amendment Request Modal */}
      {isAddAmendmentOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-fadeIn">
            <div
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-5"
              dir={direction}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                <h3 className="text-base font-bold text-[#0f172a] flex items-center gap-2">
                  <FileSignature className="w-5 h-5 text-emerald-600" />
                  <span>{isRTL ? 'تقديم طلب تعديل اتفاقية' : 'New Amendment Request'}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddAmendmentOpen(false)}
                  className="w-8 h-8 rounded-lg bg-[#f1f5f9] hover:bg-[#e2e8f0] flex items-center justify-center text-slate-600 transition cursor-pointer"
                  title={t('common.close', 'إغلاق')}
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              <form onSubmit={handleCreateAmendment} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    {isRTL ? 'نوع التعديل المطلوب' : 'Amendment Type'}
                  </label>
                  <select
                    value={newAmendmentType}
                    onChange={(e) => setNewAmendmentType(e.target.value)}
                    className="w-full border border-slate-200/90 rounded-xl px-3.5 py-2.5 bg-[#f8fafc] text-xs sm:text-sm text-slate-800 font-semibold focus:outline-hidden focus:border-emerald-500 shadow-2xs cursor-pointer"
                  >
                    <option value="Room Quota Adjustment">{isRTL ? 'تعديل حصة الغرف' : 'Room Quota Adjustment'}</option>
                    <option value="Date Adjustment">{isRTL ? 'تعديل فترة الاتفاقية والتواريخ' : 'Date Adjustment'}</option>
                    <option value="Price & Tariff Revision">{isRTL ? 'تعديل الأسعار والتعرفة' : 'Price & Tariff Revision'}</option>
                    <option value="Package Tier Upgrade">{isRTL ? 'ترقية / تعديل فئة الباقة' : 'Package Tier Upgrade'}</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      {isRTL ? 'القيمة الحالية' : 'Current Value'}
                    </label>
                    <input
                      type="text"
                      value={newAmendmentOldVal}
                      onChange={(e) => setNewAmendmentOldVal(e.target.value)}
                      placeholder={isRTL ? 'مثال: 4 غرف' : 'e.g. 4 Rooms'}
                      className="w-full border border-slate-200/90 rounded-xl px-3.5 py-2.5 bg-[#f8fafc] text-xs sm:text-sm text-slate-800 font-medium focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      {isRTL ? 'القيمة المطلوبة' : 'Requested Value'}
                    </label>
                    <input
                      type="text"
                      value={newAmendmentNewVal}
                      onChange={(e) => setNewAmendmentNewVal(e.target.value)}
                      placeholder={isRTL ? 'مثال: 6 غرف' : 'e.g. 6 Rooms'}
                      className="w-full border border-slate-200/90 rounded-xl px-3.5 py-2.5 bg-[#f8fafc] text-xs sm:text-sm text-slate-800 font-medium focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    {isRTL ? 'اسم مقدم الطلب / الجهة' : 'Requestor / Partner Name'}
                  </label>
                  <input
                    type="text"
                    value={newAmendmentRequestor}
                    onChange={(e) => setNewAmendmentRequestor(e.target.value)}
                    placeholder={agentName || 'Partner Representative'}
                    className="w-full border border-slate-200/90 rounded-xl px-3.5 py-2.5 bg-[#f8fafc] text-xs sm:text-sm text-slate-800 font-semibold focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    {isRTL ? 'مبررات وسبب طلب التعديل' : 'Reason / Justification'}
                  </label>
                  <textarea
                    rows={3}
                    value={newAmendmentReason}
                    onChange={(e) => setNewAmendmentReason(e.target.value)}
                    placeholder={isRTL ? 'اكتب تفاصيل ومبررات الطلب...' : 'Provide details and justification for this amendment...'}
                    className="w-full border border-slate-200/90 rounded-xl px-3.5 py-2.5 bg-[#f8fafc] text-xs sm:text-sm text-slate-800 font-medium focus:outline-hidden focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddAmendmentOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  >
                    {t('common.cancel', 'إلغاء')}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer active:scale-95"
                  >
                    {isRTL ? 'إرسال الطلب' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
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
