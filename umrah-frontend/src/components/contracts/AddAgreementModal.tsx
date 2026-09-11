import { useState } from 'react';
import { X, Calendar, Star, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface AgreementItem {
  id: string;
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
  const { direction, t } = useLanguage();

  // Form fields matching user mockup 1:1 with realistic defaults
  const [agentName, setAgentName] = useState('حاسوب الهيبة');
  const [groupNo, setGroupNo] = useState('400005436343');
  const [agreementNo, setAgreementNo] = useState('10800004324024');
  const [agreementName, setAgreementName] = useState('اتفاقية فندق جراند زوار');
  const [hotelName, setHotelName] = useState('فندق جراند زوار');
  const [rating, setRating] = useState(4); // 4 outline orange stars + 1 gray star
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPrice, setTotalPrice] = useState('');

  // Room details section
  const [roomsCount, setRoomsCount] = useState('');
  const [roomType, setRoomType] = useState('');
  const [bedsCount, setBedsCount] = useState('');

  // Notes
  const [notes, setNotes] = useState('');

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedStart = startDate
      ? startDate.split('-').reverse().join('/')
      : '02/09/2026';
    const formattedEnd = endDate
      ? endDate.split('-').reverse().join('/')
      : '06/09/2026';

    const newAgreement: AgreementItem = {
      id: Date.now().toString(),
      agreementNo: agreementNo.trim() || `AGR-${Math.floor(1000000 + Math.random() * 9000000)}`,
      agreementName: agreementName.trim() || 'اتفاقية فندق جراند زوار',
      entityName: hotelName.trim() || 'فندق جراند زوار',
      type: 'فندق',
      city: 'مكة المكرمة',
      roomsCount: parseInt(roomsCount) || 8,
      durationDays: 4,
      startDate: formattedStart,
      endDate: formattedEnd,
      totalPrice: parseInt(totalPrice) || 19200,
      status: 'نشطة',
      agentName: agentName.trim(),
      groupNo: groupNo.trim(),
      notes: notes.trim(),
    };

    onSuccess(newAgreement);
    setIsSuccessOpen(true);
  };

  const handleDoneSuccess = () => {
    setIsSuccessOpen(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
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
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder={t('contracts.agent_placeholder', 'مثال: حاسوب الهيبة')}
              className="w-full bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#1e293b] focus:ring-1 focus:ring-[#1e293b] transition shadow-2xs"
            />
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

          {/* 5. اسم الفندق & تقييم الفندق */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* اسم الفندق */}
            <div className="space-y-0.5">
              <label className="block text-[11px] font-bold text-slate-700">
                {t('contracts.hotel_name', 'اسم الفندق')}
              </label>
              <input
                type="text"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                placeholder={t('contracts.hotel_name_placeholder', 'مثال: فندق جراند زوار')}
                className="w-full bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#1e293b] focus:ring-1 focus:ring-[#1e293b] transition shadow-2xs"
              />
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
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="YYYY/MM/DD"
                  className="w-full bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 placeholder:font-mono focus:outline-hidden focus:border-[#1e293b] focus:ring-1 focus:ring-[#1e293b] transition shadow-2xs font-mono"
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
                  type="text"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="YYYY/MM/DD"
                  className="w-full bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 placeholder:font-mono focus:outline-hidden focus:border-[#1e293b] focus:ring-1 focus:ring-[#1e293b] transition shadow-2xs font-mono"
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

            <div className="grid grid-cols-3 gap-2.5">
              {/* عدد الغرف */}
              <div className="space-y-1 text-center">
                <span className="block text-xs text-slate-700 font-bold">
                  {t('contracts.rooms_count', 'عدد الغرف')}
                </span>
                <input
                  type="text"
                  value={roomsCount}
                  onChange={(e) => setRoomsCount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-white border border-slate-200/90 rounded-xl px-2 py-2 text-xs text-center text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1e293b] shadow-2xs font-mono"
                />
              </div>

              {/* نوع الغرفة */}
              <div className="space-y-1 text-center">
                <span className="block text-xs text-slate-700 font-bold">
                  {t('contracts.room_type', 'نوع الغرفة')}
                </span>
                <input
                  type="text"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  placeholder="0 م²"
                  className="w-full bg-white border border-slate-200/90 rounded-xl px-2 py-2 text-xs text-center text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1e293b] shadow-2xs font-mono"
                />
              </div>

              {/* عدد الاسرة */}
              <div className="space-y-1 text-center">
                <span className="block text-xs text-slate-700 font-bold">
                  {t('contracts.beds_count', 'عدد الاسرة')}
                </span>
                <input
                  type="text"
                  value={bedsCount}
                  onChange={(e) => setBedsCount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-white border border-slate-200/90 rounded-xl px-2 py-2 text-xs text-center text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1e293b] shadow-2xs font-mono"
                />
              </div>
            </div>

            {/* Dashed button: + إضافة غرفة */}
            <button
              type="button"
              className="w-full border border-dashed border-slate-400 hover:border-slate-600 bg-white hover:bg-slate-50/70 rounded-xl py-2 text-center text-xs sm:text-sm font-bold text-slate-800 transition cursor-pointer"
            >
              {t('contracts.add_room_btn', '+ إضافة غرفة')}
            </button>
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
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
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
    </div>
  );
}
