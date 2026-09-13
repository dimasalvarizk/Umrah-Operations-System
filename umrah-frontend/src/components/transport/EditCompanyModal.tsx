import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle, Check, ChevronDown, Star } from 'lucide-react';
import type { TransportCompany } from './TransportDetailsModal';
import { useLanguage } from '../../context/LanguageContext';

interface EditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: TransportCompany;
  onSuccess: (updatedCompany: TransportCompany) => void;
}

export default function EditCompanyModal({
  isOpen,
  onClose,
  company,
  onSuccess,
}: EditCompanyModalProps) {
  const { t, isRTL, direction } = useLanguage();

  const [name, setName] = useState(company.name || '');
  const [region, setRegion] = useState(company.region || (isRTL ? 'مكة المكرمة' : 'Makkah'));
  const [status, setStatus] = useState(company.status || 'متاح');
  const [phone, setPhone] = useState(company.phone || '');
  const [email, setEmail] = useState(company.email || '');
  const [address, setAddress] = useState(company.address || '');
  const [rating, setRating] = useState<number>(company.rating ?? 5.0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(company.name || '');
      setRegion(company.region || (isRTL ? 'مكة المكرمة' : 'Makkah'));
      setStatus(company.status || 'متاح');
      setPhone(company.phone || '');
      setEmail(company.email || '');
      setAddress(company.address || '');
      setRating(company.rating ?? 5.0);
      setHoverRating(null);
      setWarningMessage(null);
      setIsConfirmOpen(false);
      setIsSuccessOpen(false);
    }
  }, [company, isRTL, isOpen]);

  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setWarningMessage(isRTL ? 'يرجى كتابة اسم شركة النقل' : 'Please enter the company name');
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleConfirmSave = () => {
    const updated: TransportCompany = {
      ...company,
      name: name.trim(),
      region,
      status,
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      rating: Number(rating) || 5.0,
    };

    onSuccess(updated);
    setIsConfirmOpen(false);
    setIsSuccessOpen(true);
  };

  const handleDoneSuccess = () => {
    setIsSuccessOpen(false);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/30 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl relative border border-slate-100 flex flex-col justify-between max-h-[92vh] overflow-hidden animate-scaleUp"
        dir={direction}
      >
        {/* Header */}
        <div className="px-6 sm:px-8 py-4 border-b border-slate-200/80 flex items-center justify-between bg-white shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] tracking-tight">
            {t('transport.edit_company', 'تعديل بيانات شركة النقل')}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 overflow-y-auto flex-1">
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700">
              {t('transport.company_name', 'اسم الشركة')} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-[#00c48c] transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                {t('transport.main_region', 'المنطقة الرئيسية')}
              </label>
              <div className="relative">
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 bg-white focus:outline-hidden focus:border-[#00c48c] transition cursor-pointer"
                >
                  <option value={isRTL ? 'مكة المكرمة' : 'Makkah'}>{isRTL ? 'مكة المكرمة' : 'Makkah'}</option>
                  <option value={isRTL ? 'المدينة المنورة' : 'Madinah'}>{isRTL ? 'المدينة المنورة' : 'Madinah'}</option>
                  <option value={isRTL ? 'جدة' : 'Jeddah'}>{isRTL ? 'جدة' : 'Jeddah'}</option>
                  <option value={isRTL ? 'الرياض' : 'Riyadh'}>{isRTL ? 'الرياض' : 'Riyadh'}</option>
                </select>
                <ChevronDown className={`w-4 h-4 text-slate-400 absolute ${isRTL ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 pointer-events-none`} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                {t('common.status', 'حالة التوفر')}
              </label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TransportCompany['status'])}
                  className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 bg-white focus:outline-hidden focus:border-[#00c48c] transition cursor-pointer"
                >
                  <option value="متاح">{t('common.available', 'متاح')}</option>
                  <option value="متوسط">{isRTL ? 'متوسط' : 'Moderate'}</option>
                  <option value="محجوز">{isRTL ? 'محجوز' : 'Reserved'}</option>
                </select>
                <ChevronDown className={`w-4 h-4 text-slate-400 absolute ${isRTL ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 pointer-events-none`} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                {t('common.phone', 'رقم الهاتف')}
              </label>
              <input
                type="text"
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono text-slate-800 text-left focus:outline-hidden focus:border-[#00c48c] transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                {t('common.email', 'البريد الإلكتروني')}
              </label>
              <input
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono text-slate-800 text-left focus:outline-hidden focus:border-[#00c48c] transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                {t('common.address', 'العنوان / الموقع')}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={isRTL ? 'مثال: حي المعابدة، مكة المكرمة' : 'e.g. Al-Maabda District, Makkah'}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-[#00c48c] transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                {t('transport.company_rating', 'تقييم الشركة (النجوم)')}
              </label>
              <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs sm:text-sm min-h-[44px]">
                <div className="flex items-center gap-2" dir="ltr">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const displayScore = hoverRating !== null ? hoverRating : rating;
                    const isFilled = displayScore >= starVal;
                    return (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setRating(starVal)}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 hover:scale-120 transition-transform cursor-pointer focus:outline-hidden group"
                        title={`${starVal}.0 / 5.0`}
                      >
                        <Star
                          className={`w-5 h-5 transition-colors ${
                            isFilled
                              ? 'text-amber-500 stroke-amber-500 fill-none stroke-[2.3]'
                              : 'text-slate-300 stroke-slate-300 fill-none stroke-[1.8] group-hover:stroke-amber-300'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-200/80">
            <button
              type="button"
              onClick={onClose}
              className="border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 px-8 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer"
            >
              {t('common.cancel', 'إلغاء')}
            </button>

            <button
              type="submit"
              className="bg-[#00c48c] hover:bg-[#00b07d] text-white px-8 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer active:scale-95"
            >
              {t('common.save', 'حفظ التعديلات')}
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Dialog */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-[370px] sm:max-w-[400px] w-full shadow-2xl text-center space-y-5 border border-slate-100 animate-scaleUp"
            dir={direction}
          >
            <div className="w-20 h-20 rounded-full bg-[#fef3c7] mx-auto flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-[#f59e0b] stroke-[2.2]" />
            </div>

            <div className="space-y-1.5 pt-1">
              <h3 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight">
                {t('common.are_you_sure', 'هل أنت متأكد؟')}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                {t('common.confirm_save_changes', 'هل تريد حفظ التعديلات؟')}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 w-full pt-3">
              <button
                type="button"
                onClick={handleConfirmSave}
                className="flex-1 bg-[#00c48c] hover:bg-[#00b07d] text-white font-bold py-2.5 sm:py-3 px-5 rounded-xl transition shadow-xs text-xs sm:text-sm cursor-pointer active:scale-95"
              >
                {t('common.confirm', 'نعم، حفظ')}
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
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-fadeIn">
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
                {t('transport.company_updated_success', 'تم حفظ التعديلات بنجاح')}
              </p>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={handleDoneSuccess}
                className="w-full bg-[#00c48c] hover:bg-[#00b07d] text-white font-bold py-3 px-8 rounded-xl transition shadow-xs text-sm sm:text-base cursor-pointer active:scale-95"
              >
                {t('common.done', 'حسناً')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warning Dialog */}
      {warningMessage && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-[370px] sm:max-w-[400px] w-full shadow-2xl text-center space-y-5 border border-slate-100 animate-scaleUp"
            dir={direction}
          >
            <div className="w-20 h-20 rounded-full bg-[#fef3c7] mx-auto flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-[#f59e0b] stroke-[2.2]" />
            </div>

            <div className="space-y-1.5 pt-1">
              <h3 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight">
                {t('common.warning', 'تنبيه')}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                {warningMessage}
              </p>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={() => setWarningMessage(null)}
                className="w-full bg-[#00c48c] hover:bg-[#00b07d] text-white font-bold py-3 px-8 rounded-xl transition shadow-xs text-sm sm:text-base cursor-pointer active:scale-95"
              >
                {t('common.close', 'حسناً')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
