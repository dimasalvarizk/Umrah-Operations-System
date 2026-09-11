import { useState } from 'react';
import { ChevronDown, Calendar, Plus, X } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

interface Step2HotelsProps {
  makkahHotel1: string;
  setMakkahHotel1: (val: string) => void;
  makkah1CheckIn: string;
  setMakkah1CheckIn: (val: string) => void;
  makkah1CheckOut: string;
  setMakkah1CheckOut: (val: string) => void;
  madinahHotel: string;
  setMadinahHotel: (val: string) => void;
  madinahCheckIn: string;
  setMadinahCheckIn: (val: string) => void;
  madinahCheckOut: string;
  setMadinahCheckOut: (val: string) => void;
  makkahHotel2: string;
  setMakkahHotel2: (val: string) => void;
  makkah2CheckIn: string;
  setMakkah2CheckIn: (val: string) => void;
  makkah2CheckOut: string;
  setMakkah2CheckOut: (val: string) => void;
  hospitalityNotes: string;
  setHospitalityNotes: (val: string) => void;
}

export default function Step2Hotels({
  makkahHotel1,
  setMakkahHotel1,
  makkah1CheckIn,
  setMakkah1CheckIn,
  makkah1CheckOut,
  setMakkah1CheckOut,
  madinahHotel,
  setMadinahHotel,
  madinahCheckIn,
  setMadinahCheckIn,
  madinahCheckOut,
  setMadinahCheckOut,
  makkahHotel2,
  setMakkahHotel2,
  makkah2CheckIn,
  setMakkah2CheckIn,
  makkah2CheckOut,
  setMakkah2CheckOut,
  hospitalityNotes,
  setHospitalityNotes,
}: Step2HotelsProps) {
  const { t, isRTL } = useLanguage();

  const [extraHotels, setExtraHotels] = useState<
    Array<{ id: string; name: string; hotel: string; checkIn: string; checkOut: string }>
  >([]);

  const handleAddHotel = () => {
    const nextIdx = extraHotels.length + 3;
    const isMakkah = nextIdx % 2 !== 0;
    const newHotel = {
      id: Date.now().toString(),
      name: isRTL
        ? `${isMakkah ? 'فندق مكة' : 'فندق المدينة'} ${Math.ceil(nextIdx / 2)}`
        : `${isMakkah ? 'Makkah Hotel' : 'Madinah Hotel'} ${Math.ceil(nextIdx / 2)}`,
      hotel: '',
      checkIn: '',
      checkOut: '',
    };
    setExtraHotels((prev) => [...prev, newHotel]);
  };

  const handleRemoveHotel = (id: string) => {
    setExtraHotels((prev) => prev.filter((h) => h.id !== id));
  };

  const handleUpdateHotel = (
    id: string,
    field: 'hotel' | 'checkIn' | 'checkOut',
    value: string
  ) => {
    setExtraHotels((prev) =>
      prev.map((h) => (h.id === id ? { ...h, [field]: value } : h))
    );
  };

  return (
    <div className="space-y-3.5">
      {/* Hotel 1: Makkah Hotel 1 */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            {t('groups.makkah_hotel', 'فندق مكة')} 1
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
          {/* Hotel Name (6 cols) */}
          <div className="md:col-span-6 space-y-1.5">
            <label className="text-xs font-normal text-slate-400 block">
              {t('hotels.hotel_name', 'اسم الفندق')}
            </label>
            <div className="relative">
              <select
                value={makkahHotel1}
                onChange={(e) => setMakkahHotel1(e.target.value)}
                className={`w-full appearance-none bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-normal cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                  isRTL ? 'pr-3.5 pl-9 text-right' : 'pl-3.5 pr-9 text-left'
                }`}
              >
                <option value="">{isRTL ? 'اختر فندق مكة ١' : 'Select Makkah Hotel 1'}</option>
                <option value="فندق مكة هيلتون">{isRTL ? 'فندق مكة هيلتون' : 'Makkah Hilton Hotel'}</option>
                <option value="فندق أبراج الكسوة">{isRTL ? 'فندق أبراج الكسوة' : 'Kiswah Towers Hotel'}</option>
                <option value="فندق أنجم مكة">{isRTL ? 'فندق أنجم مكة' : 'Anjum Makkah Hotel'}</option>
                <option value="فندق موفنبيك مكة">{isRTL ? 'فندق موفنبيك مكة' : 'Mövenpick Makkah'}</option>
              </select>
              <ChevronDown className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                isRTL ? 'left-3' : 'right-3'
              }`} />
            </div>
          </div>

          {/* Check In Date (3 cols) */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-normal text-slate-400 block">
              {t('groups.checkin', 'تاريخ الدخول')}
            </label>
            <div className="relative">
              <input
                type="date"
                value={makkah1CheckIn}
                onChange={(e) => setMakkah1CheckIn(e.target.value)}
                className={`w-full bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                  isRTL ? 'pr-3.5 pl-9 text-right' : 'pl-3.5 pr-9 text-left'
                }`}
              />
              <Calendar className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                isRTL ? 'left-3' : 'right-3'
              }`} />
            </div>
          </div>

          {/* Check Out Date (3 cols) */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-normal text-slate-400 block">
              {t('groups.checkout', 'تاريخ الخروج')}
            </label>
            <div className="relative">
              <input
                type="date"
                value={makkah1CheckOut}
                onChange={(e) => setMakkah1CheckOut(e.target.value)}
                className={`w-full bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                  isRTL ? 'pr-3.5 pl-9 text-right' : 'pl-3.5 pr-9 text-left'
                }`}
              />
              <Calendar className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                isRTL ? 'left-3' : 'right-3'
              }`} />
            </div>
          </div>
        </div>
      </div>

      {/* Hotel 2: Madinah Hotel */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            {t('groups.madinah_hotel', 'فندق المدينة')}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
          {/* Hotel Name (6 cols) */}
          <div className="md:col-span-6 space-y-1.5">
            <label className="text-xs font-normal text-slate-400 block">
              {t('hotels.hotel_name', 'اسم الفندق')}
            </label>
            <div className="relative">
              <select
                value={madinahHotel}
                onChange={(e) => setMadinahHotel(e.target.value)}
                className={`w-full appearance-none bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-normal cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                  isRTL ? 'pr-3.5 pl-9 text-right' : 'pl-3.5 pr-9 text-left'
                }`}
              >
                <option value="">{isRTL ? 'اختر فندق المدينة' : 'Select Madinah Hotel'}</option>
                <option value="فندق دار التقوى">{isRTL ? 'فندق دار التقوى' : 'Dar Al Taqwa Hotel'}</option>
                <option value="فندق أنوار المدينة موفنبيك">{isRTL ? 'فندق أنوار المدينة موفنبيك' : 'Anwar Al Madinah Mövenpick'}</option>
                <option value="فندق روضة العقيق">{isRTL ? 'فندق روضة العقيق' : 'Rawdat Al Aqeeq Hotel'}</option>
              </select>
              <ChevronDown className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                isRTL ? 'left-3' : 'right-3'
              }`} />
            </div>
          </div>

          {/* Check In Date (3 cols) */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-normal text-slate-400 block">
              {t('groups.checkin', 'تاريخ الدخول')}
            </label>
            <div className="relative">
              <input
                type="date"
                value={madinahCheckIn}
                onChange={(e) => setMadinahCheckIn(e.target.value)}
                className={`w-full bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                  isRTL ? 'pr-3.5 pl-9 text-right' : 'pl-3.5 pr-9 text-left'
                }`}
              />
              <Calendar className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                isRTL ? 'left-3' : 'right-3'
              }`} />
            </div>
          </div>

          {/* Check Out Date (3 cols) */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-normal text-slate-400 block">
              {t('groups.checkout', 'تاريخ الخروج')}
            </label>
            <div className="relative">
              <input
                type="date"
                value={madinahCheckOut}
                onChange={(e) => setMadinahCheckOut(e.target.value)}
                className={`w-full bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                  isRTL ? 'pr-3.5 pl-9 text-right' : 'pl-3.5 pr-9 text-left'
                }`}
              />
              <Calendar className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                isRTL ? 'left-3' : 'right-3'
              }`} />
            </div>
          </div>
        </div>
      </div>

      {/* Hotel 3: Optional Makkah Hotel 2 */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
        <div>
          <h3 className="text-sm font-bold text-slate-400">
            {t('groups.makkah_hotel', 'فندق مكة')} 2 ({t('common.optional', 'اختياري')})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
          <div className="md:col-span-6 space-y-1.5">
            <label className="text-xs font-normal text-slate-400 block">
              {t('hotels.hotel_name', 'اسم الفندق')}
            </label>
            <div className="relative">
              <select
                value={makkahHotel2}
                onChange={(e) => setMakkahHotel2(e.target.value)}
                className={`w-full appearance-none bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-normal cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                  isRTL ? 'pr-3.5 pl-9 text-right' : 'pl-3.5 pr-9 text-left'
                }`}
              >
                <option value="">{isRTL ? 'اختر فندق مكة ٢' : 'Select Makkah Hotel 2'}</option>
                <option value="فندق مكة هيلتون">{isRTL ? 'فندق مكة هيلتون' : 'Makkah Hilton Hotel'}</option>
                <option value="فندق أبراج الكسوة">{isRTL ? 'فندق أبراج الكسوة' : 'Kiswah Towers Hotel'}</option>
                <option value="فندق أنجم مكة">{isRTL ? 'فندق أنجم مكة' : 'Anjum Makkah Hotel'}</option>
              </select>
              <ChevronDown className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                isRTL ? 'left-3' : 'right-3'
              }`} />
            </div>
          </div>

          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-normal text-slate-400 block">
              {t('groups.checkin', 'تاريخ الدخول')}
            </label>
            <div className="relative">
              <input
                type="date"
                value={makkah2CheckIn}
                onChange={(e) => setMakkah2CheckIn(e.target.value)}
                className={`w-full bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                  isRTL ? 'pr-3.5 pl-9 text-right' : 'pl-3.5 pr-9 text-left'
                }`}
              />
              <Calendar className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                isRTL ? 'left-3' : 'right-3'
              }`} />
            </div>
          </div>

          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-normal text-slate-400 block">
              {t('groups.checkout', 'تاريخ الخروج')}
            </label>
            <div className="relative">
              <input
                type="date"
                value={makkah2CheckOut}
                onChange={(e) => setMakkah2CheckOut(e.target.value)}
                className={`w-full bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                  isRTL ? 'pr-3.5 pl-9 text-right' : 'pl-3.5 pr-9 text-left'
                }`}
              />
              <Calendar className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                isRTL ? 'left-3' : 'right-3'
              }`} />
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Extra Hotels */}
      {extraHotels.map((extra) => (
        <div
          key={extra.id}
          className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3 relative animate-fadeIn"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700">
              {extra.name} ({t('common.optional', 'اختياري')})
            </h3>
            <button
              type="button"
              onClick={() => handleRemoveHotel(extra.id)}
              className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded-md hover:bg-red-50 transition cursor-pointer flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>{isRTL ? 'إزالة' : 'Remove'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
            <div className="md:col-span-6 space-y-1.5">
              <label className="text-xs font-normal text-slate-400 block">
                {t('hotels.hotel_name', 'اسم الفندق')}
              </label>
              <div className="relative">
                <select
                  value={extra.hotel}
                  onChange={(e) => handleUpdateHotel(extra.id, 'hotel', e.target.value)}
                  className={`w-full appearance-none bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-normal cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                    isRTL ? 'pr-3.5 pl-9 text-right' : 'pl-3.5 pr-9 text-left'
                  }`}
                >
                  <option value="">{isRTL ? 'اختر الفندق...' : 'Select Hotel...'}</option>
                  <option value="فندق مكة هيلتون">{isRTL ? 'فندق مكة هيلتون' : 'Makkah Hilton Hotel'}</option>
                  <option value="فندق أبراج الكسوة">{isRTL ? 'فندق أبراج الكسوة' : 'Kiswah Towers Hotel'}</option>
                  <option value="فندق أنجم مكة">{isRTL ? 'فندق أنجم مكة' : 'Anjum Makkah Hotel'}</option>
                  <option value="فندق موفنبيك مكة">{isRTL ? 'فندق موفنبيك مكة' : 'Mövenpick Makkah'}</option>
                  <option value="فندق دار التقوى">{isRTL ? 'فندق دار التقوى' : 'Dar Al Taqwa Hotel'}</option>
                  <option value="فندق أنوار المدينة موفنبيك">{isRTL ? 'فندق أنوار المدينة موفنبيك' : 'Anwar Al Madinah Mövenpick'}</option>
                  <option value="فندق روضة العقيق">{isRTL ? 'فندق روضة العقيق' : 'Rawdat Al Aqeeq Hotel'}</option>
                </select>
                <ChevronDown className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                  isRTL ? 'left-3' : 'right-3'
                }`} />
              </div>
            </div>

            <div className="md:col-span-3 space-y-1.5">
              <label className="text-xs font-normal text-slate-400 block">
                {t('groups.checkin', 'تاريخ الدخول')}
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={extra.checkIn}
                  onChange={(e) => handleUpdateHotel(extra.id, 'checkIn', e.target.value)}
                  className={`w-full bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                    isRTL ? 'pr-3.5 pl-9 text-right' : 'pl-3.5 pr-9 text-left'
                  }`}
                />
                <Calendar className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                  isRTL ? 'left-3' : 'right-3'
                }`} />
              </div>
            </div>

            <div className="md:col-span-3 space-y-1.5">
              <label className="text-xs font-normal text-slate-400 block">
                {t('groups.checkout', 'تاريخ الخروج')}
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={extra.checkOut}
                  onChange={(e) => handleUpdateHotel(extra.id, 'checkOut', e.target.value)}
                  className={`w-full bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                    isRTL ? 'pr-3.5 pl-9 text-right' : 'pl-3.5 pr-9 text-left'
                  }`}
                />
                <Calendar className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                  isRTL ? 'left-3' : 'right-3'
                }`} />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Add Another Hotel Button */}
      <div className="flex justify-center py-1">
        <button
          type="button"
          onClick={handleAddHotel}
          className="text-xs sm:text-sm font-semibold text-[#4863aa] hover:text-[#284288] flex items-center gap-1.5 transition py-2 px-4 rounded-xl hover:bg-blue-50/60 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{isRTL ? 'إضافة فندق آخر' : 'Add Another Hotel'}</span>
        </button>
      </div>

      {/* Hospitality / Hosting Field */}
      <div className="space-y-1.5 pt-1">
        <label className="text-xs sm:text-sm font-bold text-slate-800 block">
          {isRTL ? 'استضافة' : 'Hospitality / Special Requests'}
        </label>
        <input
          type="text"
          placeholder={isRTL ? 'أدخل تفاصيل الاستضافة أو الخدمات الخاصة هنا...' : 'Enter hosting details or special services here...'}
          value={hospitalityNotes}
          onChange={(e) => setHospitalityNotes(e.target.value)}
          className="w-full bg-white border border-slate-200/90 rounded-lg px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs"
        />
      </div>
    </div>
  );
}
