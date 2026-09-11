import { useState, useEffect } from 'react';
import { X, ChevronDown, Calendar, AlertTriangle, Check } from 'lucide-react';
import type { TripItem } from './TripDetailsModal';
import busBadge from '../../assets/bus-badge.png';
import { useLanguage } from '../../context/LanguageContext';

interface AddTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (trip: TripItem) => void;
  initialData?: TripItem | null;
}

export default function AddTripModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: AddTripModalProps) {
  const { t, isRTL, direction } = useLanguage();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  // Section 1: Basic Info
  const [programName, setProgramName] = useState('');
  const [code, setCode] = useState('TRP-9402');
  const [routePath, setRoutePath] = useState('مكة ← المدينة');
  const [programType, setProgramType] = useState('برنامج اقتصادي');

  // Section 2: Dates & Duration
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expectedDuration, setExpectedDuration] = useState('14 Nights');

  // Section 3: Pilgrims & Guide
  const [pilgrimsCount, setPilgrimsCount] = useState<string>('');
  const [guideName, setGuideName] = useState('');
  const [dominantNationality, setDominantNationality] = useState('المغرب');

  // Section 4: Transport
  const [transportType, setTransportType] = useState('حافلة مخصصة');
  const [busNumber, setBusNumber] = useState('BUS-101');
  const [driverName, setDriverName] = useState('محمد العمري');
  const [driverPhone, setDriverPhone] = useState('+966 99988888');

  useEffect(() => {
    if (initialData) {
      setProgramName(initialData.programName || initialData.routeName);
      setCode(initialData.code);
      setRoutePath(initialData.routePath || initialData.routeName || 'مكة ← المدينة');
      setProgramType(initialData.programType || 'برنامج اقتصادي');
      setStartDate(initialData.startDate);
      setEndDate(initialData.endDate);
      setExpectedDuration(initialData.expectedDuration || (isRTL ? '١٤ ليلة' : '14 Nights'));
      setPilgrimsCount(String(initialData.pilgrimsCount || ''));
      setGuideName(initialData.guideName);
      setDominantNationality(initialData.dominantNationality || (isRTL ? 'المغرب' : 'Morocco'));
      setTransportType(initialData.transportType || (isRTL ? 'حافلة مخصصة' : 'Dedicated Bus'));
      setBusNumber(initialData.busNumber || 'BUS-101');
      setDriverName(initialData.driverName || (isRTL ? 'محمد العمري' : 'Mohammed Al-Omari'));
      setDriverPhone(initialData.driverPhone || '+966 99988888');
    } else {
      setProgramName('');
      setCode(`TRP-${Math.floor(1000 + Math.random() * 9000)}`);
      setRoutePath(isRTL ? 'مكة ← المدينة' : 'Makkah ➔ Madinah');
      setProgramType(isRTL ? 'برنامج اقتصادي' : 'Economy Package');
      setStartDate('');
      setEndDate('');
      setExpectedDuration(isRTL ? '١٤ ليلة' : '14 Nights');
      setPilgrimsCount('');
      setGuideName('');
      setDominantNationality(isRTL ? 'المغرب' : 'Morocco');
      setTransportType(isRTL ? 'حافلة مخصصة' : 'Dedicated Bus');
      setBusNumber('BUS-101');
      setDriverName(isRTL ? 'محمد العمري' : 'Mohammed Al-Omari');
      setDriverPhone('+966 99988888');
    }
  }, [initialData, isOpen, isRTL]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const handleConfirmSave = () => {
    const cleanCode = code.replace(/\s*\(.*?\)/, '') || `TRP-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTrip: TripItem = {
      id: initialData?.id || String(Date.now()),
      code: cleanCode,
      routeName: routePath,
      programName: programName || routePath,
      routePath,
      programType,
      startDate: startDate || '01 ذو الحجة',
      endDate: endDate || '15 ذو الحجة',
      expectedDuration,
      pilgrimsCount: Number(pilgrimsCount) || 120,
      guideName: guideName || (isRTL ? 'يوسف مكي' : 'Youssef Makki'),
      dominantNationality,
      status: initialData?.status || 'قيد التنفيذ',
      transportType,
      busNumber,
      driverName,
      driverPhone,
    };

    onSuccess(newTrip);
    setIsConfirmOpen(false);
    setIsSuccessOpen(true);
  };

  const handleDoneSuccess = () => {
    setIsSuccessOpen(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Modal Container */}
      <div
        className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl relative border border-slate-100 flex flex-col justify-between max-h-[95vh] overflow-hidden"
        dir={direction}
      >
        {/* Header */}
        <div className="px-6 sm:px-8 py-4 border-b border-slate-200/80 flex items-center justify-between bg-white shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] tracking-tight">
            {initialData ? (isRTL ? 'تعديل بيانات الرحلة' : 'Edit Trip Details') : t('trips.add_trip', 'إضافة رحلة جديدة')}
          </h2>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer shadow-2xs"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 flex flex-col justify-between">
          <div className="bg-[#f8fafc] border-b border-slate-200/80 px-6 sm:px-8 py-6 space-y-6">
            {/* SECTION 1: Basic info */}
            <div className="space-y-3.5">
              <h3 className="text-sm font-bold text-[#0f172a]">
                {isRTL ? '١. معلومات الرحلة الأساسية' : '1. Basic Trip Information'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isRTL ? 'اسم البرنامج' : 'Program Name'} <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={programName}
                    onChange={(e) => setProgramName(e.target.value)}
                    placeholder={isRTL ? 'أدخل اسم البرنامج هنا...' : 'e.g. Makkah to Madinah VIP Express'}
                    className="w-full bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t('trips.trip_code', 'رقم الرحلة')} <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-transparent border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#00c48c] font-bold font-mono focus:outline-none shadow-2xs cursor-default"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t('trips.route', 'المسار')} <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={routePath}
                      onChange={(e) => setRoutePath(e.target.value)}
                      className={`w-full appearance-none bg-white border border-slate-200/90 rounded-xl py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-300 cursor-pointer shadow-2xs ${
                        isRTL ? 'pr-4 pl-9 text-right' : 'pl-4 pr-9 text-left'
                      }`}
                    >
                      <option value="مكة ← المدينة">{isRTL ? 'مكة ← المدينة' : 'Makkah ➔ Madinah'}</option>
                      <option value="المدينة ← مكة">{isRTL ? 'المدينة ← مكة' : 'Madinah ➔ Makkah'}</option>
                      <option value="مطار جدة ← مكة">{isRTL ? 'مطار جدة ← مكة' : 'Jeddah Airport ➔ Makkah'}</option>
                      <option value="مكة ← مطار جدة">{isRTL ? 'مكة ← مطار جدة' : 'Makkah ➔ Jeddah Airport'}</option>
                      <option value="مكة (الرصيفة) ↔ المدينة">{isRTL ? 'مكة (الرصيفة) ↔ المدينة' : 'Makkah (Rusaifah) ↔ Madinah'}</option>
                      <option value="مكة المكرمة ↔ جبل ثور">{isRTL ? 'مكة المكرمة ↔ جبل ثور' : 'Makkah ↔ Mount Thawr'}</option>
                    </select>
                    <ChevronDown className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                      isRTL ? 'left-3' : 'right-3'
                    }`} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isRTL ? 'نوع البرنامج' : 'Program Type'} <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={programType}
                      onChange={(e) => setProgramType(e.target.value)}
                      className={`w-full appearance-none bg-white border border-slate-200/90 rounded-xl py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-300 cursor-pointer shadow-2xs ${
                        isRTL ? 'pr-4 pl-9 text-right' : 'pl-4 pr-9 text-left'
                      }`}
                    >
                      <option value="برنامج اقتصادي">{isRTL ? 'برنامج اقتصادي' : 'Economy Package'}</option>
                      <option value="برنامج VIP فاخر">{isRTL ? 'برنامج VIP فاخر' : 'VIP Luxury Package'}</option>
                      <option value="برنامج مميز">{isRTL ? 'برنامج مميز' : 'Premium Package'}</option>
                      <option value="برنامج مخصص">{isRTL ? 'برنامج مخصص' : 'Custom Delegation'}</option>
                    </select>
                    <ChevronDown className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                      isRTL ? 'left-3' : 'right-3'
                    }`} />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Dates & Duration */}
            <div className="space-y-3.5">
              <h3 className="text-sm font-bold text-[#0f172a]">
                {isRTL ? '٢. التواريخ والمدة' : '2. Dates & Schedule'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isRTL ? 'تاريخ البدء' : 'Start Date'} <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      placeholder={isRTL ? 'اليوم/الشهر/السنة' : 'DD/MM/YYYY'}
                      className={`w-full bg-white border border-slate-200/90 rounded-xl py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 shadow-2xs ${
                        isRTL ? 'pr-4 pl-10 text-right' : 'pl-4 pr-10 text-left'
                      }`}
                    />
                    <Calendar className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                      isRTL ? 'left-3.5' : 'right-3.5'
                    }`} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isRTL ? 'تاريخ الانتهاء' : 'End Date'} <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      placeholder={isRTL ? 'اليوم/الشهر/السنة' : 'DD/MM/YYYY'}
                      className={`w-full bg-white border border-slate-200/90 rounded-xl py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 shadow-2xs ${
                        isRTL ? 'pr-4 pl-10 text-right' : 'pl-4 pr-10 text-left'
                      }`}
                    />
                    <Calendar className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                      isRTL ? 'left-3.5' : 'right-3.5'
                    }`} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isRTL ? 'المدة المتوقعة' : 'Est. Duration'}
                  </label>
                  <input
                    type="text"
                    value={expectedDuration}
                    onChange={(e) => setExpectedDuration(e.target.value)}
                    placeholder={isRTL ? '١٤ ليلة' : '14 Nights'}
                    className="w-full bg-transparent border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-400 focus:outline-none shadow-2xs cursor-default"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: Pilgrims & Guide */}
            <div className="space-y-3.5">
              <h3 className="text-sm font-bold text-[#0f172a]">
                {isRTL ? '٣. تفاصيل الحجاج والمرشد' : '3. Pilgrims & Guide Info'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t('groups.col_pilgrims', 'عدد المعتمرين')} <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={pilgrimsCount}
                    onChange={(e) => setPilgrimsCount(e.target.value)}
                    placeholder={isRTL ? 'أدخل عدد المعتمرين' : 'Pilgrim count'}
                    className="w-full bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t('trips.guide_name', 'مرشد الرحلة')} <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={guideName}
                      onChange={(e) => setGuideName(e.target.value)}
                      className={`w-full appearance-none bg-white border border-slate-200/90 rounded-xl py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-300 cursor-pointer shadow-2xs ${
                        isRTL ? 'pr-4 pl-9 text-right' : 'pl-4 pr-9 text-left'
                      }`}
                    >
                      <option value="">{isRTL ? 'ابحث عن مرشد...' : 'Select Guide...'}</option>
                      <option value={isRTL ? 'يوسف مكي' : 'Youssef Makki'}>{isRTL ? 'يوسف مكي' : 'Youssef Makki'}</option>
                      <option value={isRTL ? 'عبد الرحمن صابر' : 'Abdulrahman Saber'}>{isRTL ? 'عبد الرحمن صابر' : 'Abdulrahman Saber'}</option>
                      <option value={isRTL ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi'}>{isRTL ? 'أحمد العتيبي' : 'Ahmed Al-Otaibi'}</option>
                      <option value={isRTL ? 'فيصل الحربي' : 'Faisal Al-Harbi'}>{isRTL ? 'فيصل الحربي' : 'Faisal Al-Harbi'}</option>
                      <option value={isRTL ? 'جمال مصطفى' : 'Jamal Mustafa'}>{isRTL ? 'جمال مصطفى' : 'Jamal Mustafa'}</option>
                    </select>
                    <ChevronDown className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                      isRTL ? 'left-3' : 'right-3'
                    }`} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isRTL ? 'الجنسية الغالبة' : 'Primary Nationality'} <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={dominantNationality}
                      onChange={(e) => setDominantNationality(e.target.value)}
                      className={`w-full appearance-none bg-white border border-slate-200/90 rounded-xl py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-300 cursor-pointer shadow-2xs ${
                        isRTL ? 'pr-4 pl-9 text-right' : 'pl-4 pr-9 text-left'
                      }`}
                    >
                      <option value="المغرب">{isRTL ? 'المغرب' : 'Morocco'}</option>
                      <option value="إندونيسيا">{isRTL ? 'إندونيسيا' : 'Indonesia'}</option>
                      <option value="مصر">{isRTL ? 'مصر' : 'Egypt'}</option>
                      <option value="باكستان">{isRTL ? 'باكستان' : 'Pakistan'}</option>
                      <option value="تركيا">{isRTL ? 'تركيا' : 'Turkey'}</option>
                      <option value="الجزائر">{isRTL ? 'الجزائر' : 'Algeria'}</option>
                      <option value="الهند">{isRTL ? 'الهند' : 'India'}</option>
                      <option value="ماليزيا">{isRTL ? 'ماليزيا' : 'Malaysia'}</option>
                    </select>
                    <ChevronDown className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                      isRTL ? 'left-3' : 'right-3'
                    }`} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: Transportation */}
          <div className="bg-white px-6 sm:px-8 py-5 space-y-3 flex-1">
            <div className="flex items-center gap-2.5 text-sm font-bold text-[#0f172a]">
              <img
                src={busBadge}
                alt="Transportation"
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain rounded-lg shrink-0"
              />
              <span>{t('transport.title', 'إدارة النقل والأسطول')}</span>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
                  <span className="text-xs text-slate-400 font-normal">{t('transport.vehicle_type', 'نوع المركبة')}</span>
                  <input
                    type="text"
                    value={transportType}
                    onChange={(e) => setTransportType(e.target.value)}
                    className="text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none flex-1 mx-3"
                  />
                </div>

                <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
                  <span className="text-xs text-slate-400 font-normal">{t('transport.plate_number', 'رقم اللوحة / الحافلة')}</span>
                  <input
                    type="text"
                    value={busNumber}
                    onChange={(e) => setBusNumber(e.target.value)}
                    className="text-xs sm:text-sm font-bold text-slate-800 font-mono bg-transparent focus:outline-none flex-1 mx-3"
                  />
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
                <span className="text-xs text-slate-400 font-normal">{t('trips.driver_name', 'اسم السائق')}</span>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none flex-1 mx-3"
                />
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
                <span className="text-xs text-slate-400 font-normal">{t('trips.driver_phone', 'هاتف السائق')}</span>
                <input
                  type="text"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  dir="ltr"
                  className="text-xs sm:text-sm font-bold text-slate-800 font-mono bg-transparent focus:outline-none flex-1 mx-3"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 sm:px-8 py-4 border-t border-slate-200/80 flex items-center justify-between bg-white shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 px-8 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer shadow-2xs"
            >
              {t('common.cancel', 'إلغاء')}
            </button>

            <button
              type="submit"
              className="bg-[#00c48c] hover:bg-[#00b07d] text-white px-8 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer active:scale-[0.99]"
            >
              {initialData ? t('common.save', 'حفظ التعديلات') : t('trips.add_trip', 'حفظ وإدراج الرحلة')}
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Dialog */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-[370px] sm:max-w-[400px] w-full shadow-2xl text-center space-y-5 border border-slate-100"
            dir={direction}
          >
            <div className="w-20 h-20 rounded-full bg-[#fef3c7] mx-auto flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-[#f59e0b] stroke-[2.2]" />
            </div>

            <div className="space-y-1.5 pt-1">
              <h3 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight">
                {isRTL ? 'هل أنت متأكد؟' : 'Are you sure?'}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                {isRTL ? 'هل تريد حفظ التعديلات؟' : 'Do you want to commit these changes?'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 w-full pt-3">
              <button
                type="button"
                onClick={handleConfirmSave}
                className="flex-1 bg-[#00c48c] hover:bg-[#00b07d] text-white font-bold py-2.5 sm:py-3 px-5 rounded-xl transition shadow-xs text-xs sm:text-sm cursor-pointer active:scale-95"
              >
                {isRTL ? 'نعم، حفظ' : 'Yes, Save'}
              </button>

              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                className="flex-1 border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 sm:py-3 px-5 rounded-xl transition shadow-2xs text-xs sm:text-sm cursor-pointer active:scale-95"
              >
                {t('common.cancel', 'إلغاء')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Dialog */}
      {isSuccessOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-[370px] sm:max-w-[400px] w-full shadow-2xl text-center space-y-5 border border-slate-100 animate-scaleUp"
            dir={direction}
          >
            <div className="w-20 h-20 rounded-full bg-[#cbf7df]/80 mx-auto flex items-center justify-center">
              <Check className="w-10 h-10 text-[#00c48c] stroke-[2.5]" />
            </div>

            <div className="space-y-1.5 pt-1">
              <h3 className="text-2xl font-bold text-[#0f172a] tracking-tight">
                {t('common.success', 'تم بنجاح!')}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                {isRTL ? 'تم حفظ التعديلات بنجاح' : 'Trip details have been saved successfully.'}
              </p>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={handleDoneSuccess}
                className="w-full bg-[#00c48c] hover:bg-[#00b07d] text-white font-bold py-3 px-8 rounded-xl transition shadow-xs text-sm sm:text-base cursor-pointer active:scale-95"
              >
                {isRTL ? 'حسناً' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
