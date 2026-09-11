import { useState } from 'react';
import { X, Star, Bus, Phone, ShieldCheck, CheckCircle2, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface TransportCompany {
  id: string;
  name: string;
  status: 'متاح' | 'متوسط' | 'محجوز';
  rating: number;
  fleetSize: number;
  fleetLabel: string;
  phone: string;
  region: string;
  image: string;
  licenseNumber?: string;
  vehicleTypes?: { name: string; count: number }[];
  address?: string;
  vehicleCategory?: string;
}

interface TransportDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: TransportCompany | null;
}

export default function TransportDetailsModal({
  isOpen,
  onClose,
  company,
}: TransportDetailsModalProps) {
  const { t, isRTL, direction } = useLanguage();
  const [isRequestSuccessOpen, setIsRequestSuccessOpen] = useState(false);

  if (!isOpen || !company) return null;

  const getStatusBadge = (status: TransportCompany['status']) => {
    switch (status) {
      case 'متاح':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#dcfce7] text-[#15803d]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#15803d]" />
            {t('common.available', 'متاح للتشغيل')}
          </span>
        );
      case 'متوسط':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#fef9c3] text-[#a16207]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a16207]" />
            {isRTL ? 'توفر متوسط' : 'Moderate Availability'}
          </span>
        );
      case 'محجوز':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#fee2e2] text-[#e11d48]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48]" />
            {isRTL ? 'محجوز بالكامل' : 'Fully Booked'}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl relative border border-slate-100 flex flex-col justify-between max-h-[92vh] overflow-hidden animate-scaleUp"
        dir={direction}
      >
        {/* Header with image */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-100">
          <img
            src={company.image}
            alt={company.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition cursor-pointer backdrop-blur-xs shadow-md`}
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Status badge & Region */}
          <div className="absolute bottom-4 right-6 left-6 flex items-end justify-between text-white">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1.5">
                {company.name}
              </h2>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                <span>{company.region}</span>
                <span>•</span>
                <span>{company.vehicleCategory || (isRTL ? 'فانات نقل وسيارات ليموزين VIP' : 'VIP Limousines & Shuttles')}</span>
                <span>•</span>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="font-bold text-white">{company.rating}</span>
                  <span className="text-slate-300 text-xs">/ 5.0</span>
                </div>
              </div>
            </div>
            <div>{getStatusBadge(company.status)}</div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          {/* Key Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-3.5 text-center">
              <span className="text-xs text-slate-400 font-normal block mb-1">
                {isRTL ? 'إجمالي الأسطول' : 'Total Fleet'}
              </span>
              <span className="text-sm sm:text-base font-extrabold text-slate-800 flex items-center justify-center gap-1">
                <Bus className="w-4 h-4 text-[#00c48c]" />
                {company.fleetLabel}
              </span>
            </div>

            <div className="bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-3.5 text-center">
              <span className="text-xs text-slate-400 font-normal block mb-1">
                {t('common.phone', 'هاتف الاتصال')}
              </span>
              <span
                dir="ltr"
                className="text-xs sm:text-sm font-bold font-mono text-slate-800 flex items-center justify-center gap-1"
              >
                <Phone className="w-3.5 h-3.5 text-sky-500" />
                {company.phone}
              </span>
            </div>

            <div className="bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-3.5 text-center col-span-2 sm:col-span-1">
              <span className="text-xs text-slate-400 font-normal block mb-1">
                {isRTL ? 'الترخيص المعتمد' : 'License Accreditation'}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {company.licenseNumber || (isRTL ? 'معتمد - هيئة النقل' : 'Certified - Transport Authority')}
              </span>
            </div>
          </div>

          {/* Vehicle Types Breakdown for Pilgrims */}
          <div className="space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-[#0f172a] flex items-center gap-2">
              <Bus className="w-4 h-4 text-[#00c48c]" />
              <span>{t('transport.available_fleet_title', 'أسطول مركبات الحجاج والمعتمرين المتاحة')}</span>
            </h4>

            <div className="space-y-2">
              <div className="bg-white border border-slate-200/90 rounded-xl p-3 flex items-center justify-between shadow-2xs">
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800">
                    {isRTL ? 'فانات ركاب وسياحية حديثة (Transit / HiAce)' : 'Modern Passenger & Tourist Vans (Transit / HiAce)'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {isRTL ? 'مناسبة لنقل المجموعات العائلية والأمتعة بين المطار والفندق' : 'Ideal for family groups and luggage between airport and hotels'}
                  </div>
                </div>
                <span className="text-xs font-bold bg-[#e0f2fe] text-[#0284c7] px-2.5 py-1 rounded-md shrink-0">
                  {Math.max(4, Math.floor(company.fleetSize * 0.4))} {isRTL ? 'مركبة' : 'Vehicles'}
                </span>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl p-3 flex items-center justify-between shadow-2xs">
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800">
                    {isRTL ? 'سيارات ليموزين VIP فاخرة (Mercedes S / BMW)' : 'Luxury VIP Limousines (Mercedes S / BMW)'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {isRTL ? 'لخدمة كبار الشخصيات والوفود الخاصة والاستقبال الحصري' : 'For VIP delegates, executive teams, and exclusive airport receptions'}
                  </div>
                </div>
                <span className="text-xs font-bold bg-[#fef3c7] text-[#b45309] px-2.5 py-1 rounded-md shrink-0">
                  {Math.max(2, Math.floor(company.fleetSize * 0.25))} {isRTL ? 'سيارة' : 'Cars'}
                </span>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl p-3 flex items-center justify-between shadow-2xs">
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800">
                    {isRTL ? 'حافلات نقل حجاج ومعتمرين VIP (50 راكب)' : 'VIP Pilgrim & Umrah Buses (50 Seats)'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {isRTL ? 'مجهزة بنظام تكييف فائق ومقاعد مريحة للرحلات الطويلة' : 'Equipped with heavy-duty AC and reclining seats for intercity journeys'}
                  </div>
                </div>
                <span className="text-xs font-bold bg-[#dcfce7] text-[#15803d] px-2.5 py-1 rounded-md shrink-0">
                  {Math.max(2, Math.floor(company.fleetSize * 0.35))} {isRTL ? 'حافلة' : 'Buses'}
                </span>
              </div>
            </div>
          </div>

          {/* Features / Service Standards */}
          <div className="space-y-2.5">
            <h4 className="text-xs sm:text-sm font-bold text-[#0f172a]">
              {t('transport.safety_standards', 'معايير الخدمة والسلامة')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 bg-[#f8fafc] px-3 py-2 rounded-lg border border-slate-200/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00c48c] shrink-0" />
                <span>{t('transport.gps_tracking', 'نظام تتبع مباشر للمركبات (GPS)')}</span>
              </div>
              <div className="flex items-center gap-2 bg-[#f8fafc] px-3 py-2 rounded-lg border border-slate-200/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00c48c] shrink-0" />
                <span>{t('transport.certified_drivers', 'سائقين معتمدين وذوي خبرة')}</span>
              </div>
              <div className="flex items-center gap-2 bg-[#f8fafc] px-3 py-2 rounded-lg border border-slate-200/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00c48c] shrink-0" />
                <span>{t('transport.passenger_insurance', 'تأمين شامل للركاب والمركبات')}</span>
              </div>
              <div className="flex items-center gap-2 bg-[#f8fafc] px-3 py-2 rounded-lg border border-slate-200/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00c48c] shrink-0" />
                <span>{t('transport.regular_maintenance', 'صيانة دورية وفحص فني معتمد')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 border-t border-slate-200/80 bg-white flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => setIsRequestSuccessOpen(true)}
            className="flex-1 bg-[#00c48c] hover:bg-[#00b07d] text-white py-2.5 sm:py-3 px-6 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs active:scale-95 text-center"
          >
            {t('transport.request_vehicles_btn', 'طلب تشغيل مركبات')}
          </button>

          <button
            onClick={onClose}
            className="border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 sm:py-3 px-6 rounded-xl transition shadow-2xs text-xs sm:text-sm cursor-pointer active:scale-95"
          >
            {t('common.close', 'إغلاق')}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {isRequestSuccessOpen && (
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
                {t('common.success', 'تم بنجاح!')}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                {isRTL
                  ? `تم إرسال طلب تخصيص مركبات إلى ${company.name} بنجاح!`
                  : `Vehicle allocation request sent to ${company.name} successfully!`}
              </p>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={() => {
                  setIsRequestSuccessOpen(false);
                  onClose();
                }}
                className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-bold py-3 px-8 rounded-xl transition shadow-xs text-sm sm:text-base cursor-pointer active:scale-95"
              >
                {t('common.close', 'حسناً')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

