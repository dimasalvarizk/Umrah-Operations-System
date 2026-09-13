import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, Star, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getHotelsList, STANDARD_ROOM_TYPES, type HotelItem } from '../../utils/hotelsData';
import { getHotelsApi } from '../../services/hotelsApi';

import { getSystemListsApi, type BaseListItem } from '../../services/settingsApi';
import { getGroupsApi } from '../../services/groupsApi';

export interface AgreementItem {
  id: string;
  hotelId?: string;
  agreementNo: string;
  agreementName: string;
  entityName: string;
  type: 'فندق' | 'نقل';
  city: string;
  roomsCount: number;
  durationDays: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'نشطة' | 'في انتظار الموافقة' | 'منتهية';
  agentName?: string;
  groupNo?: string;
  packageTier?: string;
  rating?: number;
  roomType?: string;
  bedsCount?: string;
  rooms?: Array<{
    id: string;
    type: string;
    capacity: string;
    size: string;
    count: number;
  }>;
  detailsData?: any;
  notes?: string;
}

interface AddAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newAgreement: AgreementItem) => void;
}

export default function AddAgreementModal({
  isOpen,
  onClose,
  onSuccess,
}: AddAgreementModalProps) {
  const { direction, t, isRTL } = useLanguage();

  const [availableHotels, setAvailableHotels] = useState<HotelItem[]>(() => getHotelsList());
  const [isManualHotel, setIsManualHotel] = useState(false);

  // Form fields starting clean with no dummy values
  const [selectedHotelId, setSelectedHotelId] = useState('');
  const [agentName, setAgentName] = useState('');
  const [packageTier, setPackageTier] = useState('');
  const [groupNo, setGroupNo] = useState('');
  const [agreementNo, setAgreementNo] = useState('');
  const [agreementName, setAgreementName] = useState('');
  const [hotelName, setHotelName] = useState('');
  const [rating, setRating] = useState(5);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPrice, setTotalPrice] = useState('');

  // Dynamic Agents and Packages and Room Types from API
  const [availableAgents, setAvailableAgents] = useState<Array<{ nameEn: string; nameAr: string }>>([]);
  const [availablePackages, setAvailablePackages] = useState<Array<{ nameEn: string; nameAr: string }>>([]);
  const [availableRoomTypes, setAvailableRoomTypes] = useState<BaseListItem[]>([]);

  const loadLiveMasterLists = () => {
    // 1. Fetch live agents from settings & groups DB
    Promise.allSettled([
      getSystemListsApi('agents'),
      getGroupsApi({ limit: 100 }),
      getSystemListsApi('packages'),
      getSystemListsApi('room_types'),
    ]).then(([agentsRes, groupsRes, packagesRes, roomTypesRes]) => {
      const list: Array<{ nameEn: string; nameAr: string }> = [];
      if (agentsRes.status === 'fulfilled' && Array.isArray(agentsRes.value)) {
        agentsRes.value.forEach((a: BaseListItem) => {
          list.push({ nameEn: a.nameEn, nameAr: a.nameAr });
        });
      }
      if (groupsRes.status === 'fulfilled' && Array.isArray(groupsRes.value.groups)) {
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
      }

      if (packagesRes.status === 'fulfilled' && Array.isArray(packagesRes.value) && packagesRes.value.length > 0) {
        setAvailablePackages(packagesRes.value.map((p) => ({ nameEn: p.nameEn, nameAr: p.nameAr })));
      }

      if (roomTypesRes.status === 'fulfilled' && Array.isArray(roomTypesRes.value) && roomTypesRes.value.length > 0) {
        setAvailableRoomTypes(roomTypesRes.value.filter((rt) => rt.status === 'Active'));
      }
    });
  };

  useEffect(() => {
    const handleUpdate = () => {
      loadLiveMasterLists();
    };
    window.addEventListener('umrah_system_lists_updated', handleUpdate);
    return () => {
      window.removeEventListener('umrah_system_lists_updated', handleUpdate);
    };
  }, []);

  // Refresh available hotels, agents, packages from API & clean reset whenever modal opens
  useEffect(() => {
    if (isOpen) {
      // 1. Fetch real-time from Hotels API / Database
      getHotelsApi()
        .then(({ hotels }) => {
          if (Array.isArray(hotels)) {
            setAvailableHotels(hotels);
            if (hotels.length > 0) {
              const first = hotels[0];
              setSelectedHotelId(first.id);
              const hName = isRTL ? first.name : (first.nameEn || first.name);
              setHotelName(hName);
              setRating(first.rating || 5);
              setIsManualHotel(false);
            } else {
              setIsManualHotel(true);
            }
          }
        })
        .catch(() => {
          const fresh = getHotelsList();
          setAvailableHotels(fresh);
          if (fresh.length > 0) {
            const first = fresh[0];
            setSelectedHotelId(first.id);
            const hName = isRTL ? first.name : (first.nameEn || first.name);
            setHotelName(hName);
            setRating(first.rating || 5);
            setIsManualHotel(false);
          } else {
            setIsManualHotel(true);
          }
        });

      loadLiveMasterLists();

      setAgreementNo('');
      setGroupNo('');
      setAgentName('');
      setPackageTier('');
      setAgreementName('');
      setStartDate('');
      setEndDate('');
      setTotalPrice('');
      setNotes('');
      setRoomsCount('');
      setIsSuccessOpen(false);
    }
  }, [isOpen, isRTL]);

  // Room details section with standard room types
  const [roomsCount, setRoomsCount] = useState('');
  const [roomType, setRoomType] = useState(STANDARD_ROOM_TYPES[0] ? (isRTL ? STANDARD_ROOM_TYPES[0].nameAr : STANDARD_ROOM_TYPES[0].nameEn) : '');
  const [bedsCount, setBedsCount] = useState(STANDARD_ROOM_TYPES[0] ? String(STANDARD_ROOM_TYPES[0].bedsCount || 2) : '1');

  const handleRoomTypeChange = (val: string) => {
    setRoomType(val);
    // 1. Check live available room types first
    const liveFound = availableRoomTypes.find((r) => (isRTL ? r.nameAr : r.nameEn) === val || r.nameAr === val || r.nameEn === val);
    if (liveFound && liveFound.secondary) {
      const matchBeds = liveFound.secondary.match(/(\d+)\s*(Beds|Bed|أسرة|سرير)/i);
      if (matchBeds) {
        setBedsCount(matchBeds[1]);
        return;
      }
    }
    // 2. Check standard room types
    const found = STANDARD_ROOM_TYPES.find(
      (r) => (isRTL ? r.nameAr : r.nameEn) === val || r.nameAr === val || r.nameEn === val
    );
    if (found) {
      setBedsCount(String(found.bedsCount));
    }
  };

  // Notes
  const [notes, setNotes] = useState('');

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedStart = startDate
      ? startDate.split('-').reverse().join('/')
      : '';
    const formattedEnd = endDate
      ? endDate.split('-').reverse().join('/')
      : '';

    const selectedHotel = availableHotels.find((h) => h.id === selectedHotelId || h.name === hotelName);
    const resolvedEntityName = hotelName.trim() || (selectedHotel ? (isRTL ? selectedHotel.name : (selectedHotel.nameEn || selectedHotel.name)) : '');

    const calculatedDays =
      startDate && endDate
        ? Math.max(
            1,
            Math.round(
              (new Date(endDate).getTime() - new Date(startDate).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          )
        : 1;

    const generatedAgreementNo = agreementNo.trim() || `AGR-${Math.floor(100000 + Math.random() * 900000)}`;

    const newAgreement: AgreementItem = {
      id: Date.now().toString(),
      hotelId: selectedHotel ? selectedHotel.id : selectedHotelId,
      agreementNo: generatedAgreementNo,
      agreementName: agreementName.trim() || (isRTL ? `اتفاقية ${resolvedEntityName}` : `${resolvedEntityName} Agreement`),
      entityName: resolvedEntityName,
      type: 'فندق',
      city: selectedHotel ? selectedHotel.location : (isRTL ? 'مكة المكرمة' : 'Makkah'),
      roomsCount: parseInt(roomsCount) || 1,
      durationDays: calculatedDays,
      startDate: formattedStart,
      endDate: formattedEnd,
      totalPrice: parseFloat(totalPrice) || 0,
      status: 'نشطة',
      agentName: agentName.trim() || (availableAgents[0] ? (isRTL ? availableAgents[0].nameAr : availableAgents[0].nameEn) : ''),
      groupNo: groupNo.trim(),
      packageTier: packageTier.trim() || (availablePackages[0] ? (isRTL ? availablePackages[0].nameAr : availablePackages[0].nameEn) : 'VIP Executive 14 Days'),
      rating: rating || (selectedHotel ? selectedHotel.rating : 5),
      roomType,
      bedsCount,
      rooms: [
        {
          id: '1',
          type: roomType,
          capacity: `${bedsCount} Persons`,
          size: '28 م²',
          count: parseInt(roomsCount) || 1,
        },
      ],
      notes: notes.trim(),
    };

    onSuccess(newAgreement);
    setIsSuccessOpen(true);
  };

  const handleDoneSuccess = () => {
    setIsSuccessOpen(false);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/30 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white rounded-2xl max-w-[440px] sm:max-w-[460px] w-full shadow-2xl relative border border-slate-100 flex flex-col justify-between max-h-[96vh] overflow-hidden"
        dir={direction}
      >
        {/* Header matching user mockup */}
        <div className="px-6 pt-5 pb-2 flex items-center justify-between bg-white shrink-0">
          <h2 className="text-base font-bold text-[#0f172a] tracking-tight">
            {t('contracts.add_agreement_modal_title', 'إضافة اتفاقية جديدة')}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2]" />
          </button>
        </div>

        {/* Form Body matching user mockup 1:1 */}
        <form
          id="add-agreement-form"
          onSubmit={handleSubmit}
          className="px-6 py-2 space-y-2.5 overflow-y-auto flex-1"
        >
          {/* 1. اسم الوكيل الخارجي */}
          <div className="space-y-0.5">
            <label className="block text-[11px] font-bold text-slate-700">
              {t('contracts.external_agent_name', 'اسم الوكيل الخارجي')}
            </label>
            <select
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="w-full bg-white border border-slate-200/90 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-hidden focus:border-[#1e293b] focus:ring-1 focus:ring-[#1e293b] transition shadow-2xs cursor-pointer"
            >
              <option value="">{isRTL ? 'اختر الوكيل أو الشريك...' : 'Select Agent / Partner...'}</option>
              {availableAgents.map((a, idx) => {
                const val = isRTL ? a.nameAr : (a.nameEn || a.nameAr);
                return (
                  <option key={idx} value={val}>
                    {val}
                  </option>
                );
              })}
              {!availableAgents.some((a) => (isRTL ? a.nameAr : (a.nameEn || a.nameAr)) === agentName || a.nameAr === agentName || a.nameEn === agentName) && agentName && (
                <option value={agentName}>{agentName}</option>
              )}
            </select>
          </div>

          {/* فئة باقة وبرنامج العمرة */}
          <div className="space-y-0.5">
            <label className="block text-[11px] font-bold text-slate-700">
              {isRTL ? 'فئة باقة وبرنامج العمرة' : 'Umrah Package Tier'}
            </label>
            <select
              value={packageTier}
              onChange={(e) => setPackageTier(e.target.value)}
              className="w-full bg-white border border-slate-200/90 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-hidden focus:border-[#1e293b] focus:ring-1 focus:ring-[#1e293b] transition shadow-2xs cursor-pointer"
            >
              <option value="">{isRTL ? 'اختر فئة وباقة العمرة...' : 'Select Umrah Package...'}</option>
              {availablePackages.map((p, idx) => {
                const val = isRTL ? p.nameAr : (p.nameEn || p.nameAr);
                return (
                  <option key={idx} value={val}>
                    {val}
                  </option>
                );
              })}
              {!availablePackages.some((p) => (isRTL ? p.nameAr : (p.nameEn || p.nameAr)) === packageTier || p.nameAr === packageTier || p.nameEn === packageTier) && packageTier && (
                <option value={packageTier}>{packageTier}</option>
              )}
            </select>
          </div>

          {/* 2. رقم المجموعة */}
          <div className="space-y-0.5">
            <label className="block text-[11px] font-bold text-slate-700">
              {t('contracts.group_number', 'رقم المجموعة')}
            </label>
            <input
              type="text"
              value={groupNo}
              onChange={(e) => setGroupNo(e.target.value)}
              placeholder={t('contracts.group_no_placeholder', 'مثال : 400005436343')}
              className="w-full bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#1e293b] focus:ring-1 focus:ring-[#1e293b] transition shadow-2xs font-mono"
            />
          </div>

          {/* 3. رقم الاتفاقية */}
          <div className="space-y-0.5">
            <label className="block text-[11px] font-bold text-slate-700">
              {t('contracts.contract_number', 'رقم الاتفاقية')}
            </label>
            <input
              type="text"
              value={agreementNo}
              onChange={(e) => setAgreementNo(e.target.value)}
              placeholder={t('contracts.agreement_no_placeholder', 'مثال : 10800004324024')}
              className="w-full bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#1e293b] focus:ring-1 focus:ring-[#1e293b] transition shadow-2xs font-mono"
            />
          </div>

          {/* 4. اسم الاتفاقية */}
          <div className="space-y-0.5">
            <label className="block text-[11px] font-bold text-slate-700">
              {t('contracts.agreement_name', 'اسم الاتفاقية')}
            </label>
            <input
              type="text"
              value={agreementName}
              onChange={(e) => setAgreementName(e.target.value)}
              placeholder={t('contracts.agreement_name_placeholder', 'مثال: اتفاقية فندق جراند زوار')}
              className="w-full bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#1e293b] focus:ring-1 focus:ring-[#1e293b] transition shadow-2xs"
            />
          </div>

          {/* 5. اختيار الفندق من قائمة الفنادق المضافة (Menu Hotels) & تقييم الفندق */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* اختيار الفندق / الجهة */}
            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-slate-700">
                  {t('contracts.hotel_name', 'اسم الفندق / الجهة')}
                </label>
                {availableHotels.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsManualHotel(!isManualHotel)}
                    className="text-[10px] text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded font-medium border border-emerald-200 transition cursor-pointer"
                  >
                    {isManualHotel
                      ? (isRTL ? 'قائمة فنادق النظام' : 'Select from Hotels Menu')
                      : (isRTL ? '+ كتابة يدوية' : '+ Manual Entry')}
                  </button>
                )}
              </div>

              {!isManualHotel && availableHotels.length > 0 ? (
                <select
                  value={selectedHotelId}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '__custom__') {
                      setIsManualHotel(true);
                      setSelectedHotelId('');
                      setHotelName('');
                    } else {
                      setSelectedHotelId(val);
                      const found = availableHotels.find((h) => h.id === val || h.name === val);
                      if (found) {
                        const hName = isRTL ? found.name : (found.nameEn || found.name);
                        setHotelName(hName);
                        setRating(found.rating || 5);
                        setAgreementName(isRTL ? `اتفاقية ${found.name}` : `${found.nameEn || found.name} Agreement`);
                      }
                    }
                  }}
                  className="w-full bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-hidden focus:border-[#1e293b] focus:ring-1 focus:ring-[#1e293b] transition shadow-2xs cursor-pointer"
                >
                  {availableHotels.map((h) => (
                    <option key={h.id} value={h.id}>
                      {isRTL ? h.name : (h.nameEn || h.name)} ({h.location || (isRTL ? 'مكة' : 'Makkah')} - {h.rating || 5}★)
                    </option>
                  ))}
                  <option value="__custom__">
                    {isRTL ? '+ كتابة اسم فندق / جهة أخرى يدوياً...' : '+ Type Custom Hotel / Entity...'}
                  </option>
                </select>
              ) : (
                <input
                  type="text"
                  value={hotelName}
                  onChange={(e) => {
                    setHotelName(e.target.value);
                    if (!agreementName || agreementName.startsWith('اتفاقية') || agreementName.endsWith('Agreement')) {
                      setAgreementName(e.target.value ? (isRTL ? `اتفاقية ${e.target.value}` : `${e.target.value} Agreement`) : '');
                    }
                  }}
                  placeholder={t('contracts.hotel_name_placeholder', 'أدخل اسم الفندق أو الشركة')}
                  className="w-full bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#1e293b] focus:ring-1 focus:ring-[#1e293b] transition shadow-2xs"
                />
              )}
            </div>

            {/* تقييم الفندق */}
            <div className="space-y-0.5">
              <label className="block text-[11px] font-bold text-slate-700">
                {t('contracts.hotel_rating', 'تقييم الفندق')}
              </label>
              <div
                className="w-full bg-white border border-slate-200/90 rounded-xl px-3 py-2 flex items-center justify-center gap-2.5 shadow-2xs"
                dir="ltr"
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="cursor-pointer focus:outline-hidden hover:scale-110 transition"
                  >
                    <Star
                      className={`w-4 h-4 fill-none transition-colors ${
                        star <= rating
                          ? 'stroke-[#f59e0b] stroke-[2.4]'
                          : 'stroke-[#dbe1ea] stroke-[2.2]'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 6. تاريخ البداية & تاريخ النهاية */}
          <div className="grid grid-cols-2 gap-3">
            {/* تاريخ البداية */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                {t('contracts.start_date', 'تاريخ البداية')}
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-medium cursor-pointer focus:outline-hidden focus:border-[#1e293b] focus:ring-1 focus:ring-[#1e293b] transition shadow-2xs font-mono"
                />
                <Calendar className={`w-4 h-4 text-slate-400 absolute ${direction === 'rtl' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.8]`} />
              </div>
            </div>

            {/* تاريخ النهاية */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                {t('contracts.end_date', 'تاريخ النهاية')}
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-medium cursor-pointer focus:outline-hidden focus:border-[#1e293b] focus:ring-1 focus:ring-[#1e293b] transition shadow-2xs font-mono"
                />
                <Calendar className={`w-4 h-4 text-slate-400 absolute ${direction === 'rtl' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.8]`} />
              </div>
            </div>
          </div>

          {/* 7. إجمالي السعر */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              {t('contracts.total_price', 'إجمالي السعر')}
            </label>
            <div className="relative">
              <input
                type="text"
                value={totalPrice}
                onChange={(e) => setTotalPrice(e.target.value)}
                placeholder="0.00"
                className="w-full bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1e293b] focus:ring-1 focus:ring-[#1e293b] transition shadow-2xs font-mono"
              />
              <span className={`absolute ${direction === 'rtl' ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600 pointer-events-none`}>
                {t('common.currency', 'ر.س')}
              </span>
            </div>
          </div>

          {/* 8. تفاصيل الغرف */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-bold text-slate-700">
              {t('contracts.room_details_title', 'تفاصيل الغرف المحجوزة في الاتفاقية')}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* عدد الغرف - Rooms Count */}
              <div className="space-y-1">
                <span className="block text-xs text-slate-700 font-bold">
                  {t('contracts.rooms_count', 'عدد الغرف')}
                </span>
                <input
                  type="number"
                  min="1"
                  value={roomsCount}
                  onChange={(e) => setRoomsCount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-white border border-slate-200/90 rounded-xl px-2.5 py-2 text-xs text-center text-slate-800 font-bold focus:outline-hidden focus:border-[#1e293b] shadow-2xs font-mono"
                />
              </div>

              {/* نوع الغرفة - Room Type */}
              <div className="space-y-1">
                <span className="block text-xs text-slate-700 font-bold">
                  {t('contracts.room_type', 'نوع الغرفة')}
                </span>
                <select
                  value={roomType}
                  onChange={(e) => handleRoomTypeChange(e.target.value)}
                  className="w-full bg-white border border-slate-200/90 rounded-xl px-2.5 py-2 text-xs text-slate-800 font-semibold focus:outline-hidden focus:border-[#1e293b] shadow-2xs cursor-pointer truncate"
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
                  {!availableRoomTypes.some((rt) => (isRTL ? rt.nameAr : rt.nameEn) === roomType || rt.nameAr === roomType || rt.nameEn === roomType) &&
                    !STANDARD_ROOM_TYPES.some((rt) => (isRTL ? rt.nameAr : rt.nameEn) === roomType || rt.nameAr === roomType || rt.nameEn === roomType) &&
                    roomType && (
                      <option value={roomType}>{roomType}</option>
                    )}
                </select>
              </div>

              {/* عدد الأسرة - Beds Count */}
              <div className="space-y-1">
                <span className="block text-xs text-slate-700 font-bold">
                  {t('contracts.beds_count', 'عدد الأسرة')}
                </span>
                <input
                  type="number"
                  min="1"
                  value={bedsCount}
                  onChange={(e) => setBedsCount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-white border border-slate-200/90 rounded-xl px-2.5 py-2 text-xs text-center text-slate-800 font-bold focus:outline-hidden focus:border-[#1e293b] shadow-2xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* 9. ملاحظات */}
          <div className="space-y-0.5">
            <label className="block text-[11px] font-bold text-slate-700">
              {t('common.notes', 'الملاحظات')}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('contracts.notes_placeholder', '...أدخل أي تفاصيل أو شروط إضافية بخصوص هذه الاتفاقية')}
              className="w-full bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#1e293b] focus:ring-1 focus:ring-[#1e293b] transition shadow-2xs resize-none"
            />
          </div>
        </form>

        {/* Footer Action Buttons Pinned at bottom matching user mockup */}
        <div className="px-6 pb-5 pt-2 bg-white shrink-0 flex items-center justify-between gap-3">
          <button
            type="submit"
            form="add-agreement-form"
            className="flex-1 bg-[#1e293b] hover:bg-[#0f172a] text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition shadow-xs cursor-pointer active:scale-95 text-center"
          >
            {t('contracts.submit_add_agreement', 'إضافة الاتفاقية')}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition shadow-2xs cursor-pointer active:scale-95 text-center"
          >
            {t('common.cancel', 'إلغاء')}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {isSuccessOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-[370px] sm:max-w-[400px] w-full shadow-2xl text-center space-y-5 border border-slate-100 animate-scaleUp"
            dir={direction}
          >
            <div className="w-20 h-20 rounded-full bg-[#cbf7df]/80 mx-auto flex items-center justify-center">
              <Check className="w-10 h-10 text-[#16a34a] stroke-[2.5]" />
            </div>

            <div className="space-y-1.5 pt-1">
              <h3 className="text-2xl font-bold text-[#0f172a] tracking-tight">
                {t('contracts.add_success_title', 'تم بنجاح!')}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                {t('contracts.add_success_desc', 'تم حفظ وإدراج الاتفاقية بنجاح إلى النظام')}
              </p>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={handleDoneSuccess}
                className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-bold py-3 px-8 rounded-xl transition shadow-xs text-sm sm:text-base cursor-pointer active:scale-95"
              >
                {t('contracts.ok_btn', 'حسناً')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
