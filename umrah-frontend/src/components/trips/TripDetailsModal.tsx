import { X, SquarePen, Info, Building2, Plane } from 'lucide-react';
import busBadge from '../../assets/bus-badge.png';
import { useLanguage } from '../../context/LanguageContext';
import { usePermissions } from '../../hooks/usePermissions';

export interface TripItem {
  id: string;
  code: string;
  routeName: string;
  startDate: string;
  endDate: string;
  pilgrimsCount: number;
  guideName: string;
  status: 'مكتمل' | 'قيد التنفيذ' | 'معلق';
  programName?: string;
  routePath?: string;
  programType?: string;
  expectedDuration?: string;
  dominantNationality?: string;
  airline?: string;
  flightNumber?: string;
  airportHub?: string;
  makkahHotel?: string;
  makkahStay?: string;
  madinahHotel?: string;
  madinahStay?: string;
  transportCompany?: string;
  transportType?: string;
  busNumber?: string;
  driverName?: string;
  driverPhone?: string;
  supervisorName?: string;
  supervisorPhone?: string;
  notes?: string;
}

interface TripDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip?: TripItem | null;
  onEdit?: (trip: TripItem) => void;
}

export default function TripDetailsModal({
  isOpen,
  onClose,
  trip,
  onEdit,
}: TripDetailsModalProps) {
  const { t, isRTL, direction } = useLanguage();
  const { isReadOnly } = usePermissions();

  if (!isOpen || !trip) return null;

  const getStatusBadge = (status: TripItem['status']) => {
    switch (status) {
      case 'مكتمل':
        return (
          <span className="text-xs font-bold px-3 py-0.5 rounded-md bg-[#dcfce7] text-[#15803d]">
            {t('common.completed', 'مكتمل')}
          </span>
        );
      case 'قيد التنفيذ':
        return (
          <span className="text-xs font-bold px-3 py-0.5 rounded-md bg-[#fef3c7] text-[#b45309]">
            {t('common.in_progress', 'قيد التنفيذ')}
          </span>
        );
      case 'معلق':
        return (
          <span className="text-xs font-bold px-3 py-0.5 rounded-md bg-[#fee2e2] text-[#e11d48]">
            {t('common.pending', 'معلق')}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Modal Container */}
      <div
        className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl relative border border-slate-100 flex flex-col justify-between max-h-[95vh] overflow-hidden"
        dir={direction}
      >
        {/* Header */}
        <div className="px-6 sm:px-8 py-4 border-b border-slate-200/80 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] tracking-tight">
              {t('trips.trip_details', 'تفاصيل الرحلة')}
            </h2>
            <span className="bg-[#f1f5f9] border border-slate-200/80 text-slate-700 font-mono text-xs px-2.5 py-0.5 rounded-md font-bold shadow-2xs">
              {trip.code}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer shadow-2xs"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 flex flex-col justify-between">
          <div className="bg-[#f8fafc] border-b border-slate-200/80 px-6 sm:px-8 py-6 space-y-6">
            {/* SECTION 1: Basic info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0f172a]">
                <div className="w-6 h-6 rounded-md bg-[#dcfce7] text-[#00c48c] flex items-center justify-center shrink-0">
                  <Info className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span>{t('groups.basic_info', 'المعلومات الأساسية')}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
                  <span className="text-xs text-slate-400 font-normal">{isRTL ? 'اسم البرنامج' : 'Program Name'}</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    {trip.programName || (isRTL ? 'برنامج التيسير المميز' : 'Al-Tayseer Premium Trip')}
                  </span>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
                  <span className="text-xs text-slate-400 font-normal">{t('trips.trip_code', 'رقم الرحلة')}</span>
                  <span className="text-xs sm:text-sm font-bold font-mono text-slate-800">
                    {trip.code}
                  </span>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
                  <span className="text-xs text-slate-400 font-normal">{t('trips.route', 'المسار')}</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    {trip.routeName}
                  </span>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
                  <span className="text-xs text-slate-400 font-normal">{isRTL ? 'تاريخ البدء' : 'Start Date'}</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    {trip.startDate}
                  </span>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
                  <span className="text-xs text-slate-400 font-normal">{isRTL ? 'تاريخ الانتهاء' : 'End Date'}</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    {trip.endDate}
                  </span>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
                  <span className="text-xs text-slate-400 font-normal">{t('groups.col_pilgrims', 'عدد المعتمرين')}</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    {trip.pilgrimsCount} {isRTL ? 'معتمراً' : 'Pilgrims'}
                  </span>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
                  <span className="text-xs text-slate-400 font-normal">{t('trips.guide_name', 'مرشد الرحلة')}</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    {trip.guideName}
                  </span>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
                  <span className="text-xs text-slate-400 font-normal">{t('common.status', 'الحالة')}</span>
                  <div>{getStatusBadge(trip.status)}</div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Accommodation */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0f172a]">
                <div className="w-6 h-6 rounded-md bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center shrink-0">
                  <Building2 className="w-3.5 h-3.5 stroke-[2.3]" />
                </div>
                <span>{t('groups.hotels_accommodation', 'تفاصيل الإقامة')}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
                  <span className="text-xs text-slate-400 font-normal">{t('groups.makkah_hotel', 'فندق مكة')}</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    {trip.makkahHotel || (isRTL ? 'فندق مكة 1' : 'Makkah Hotel 1')}
                  </span>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
                  <span className="text-xs text-slate-400 font-normal">{isRTL ? 'مدة الإقامة بمكة' : 'Makkah Stay Duration'}</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    {trip.makkahStay || '01 - 08 Dhu al-Hijjah'}
                  </span>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
                  <span className="text-xs text-slate-400 font-normal">{t('groups.madinah_hotel', 'فندق المدينة')}</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    {trip.madinahHotel || (isRTL ? 'فندق المدينة المنورة' : 'Madinah Hotel')}
                  </span>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
                  <span className="text-xs text-slate-400 font-normal">{isRTL ? 'مدة الإقامة بالمدينة' : 'Madinah Stay Duration'}</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    {trip.madinahStay || '09 - 15 Dhu al-Hijjah'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* LOWER SECTION BLOCK: Transportation */}
          <div className="bg-white px-6 sm:px-8 py-5 space-y-3 flex-1">
            <div className="flex items-center gap-2 text-sm font-bold text-[#0f172a]">
              <img
                src={busBadge}
                alt="Transportation"
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain rounded-lg shrink-0"
              />
              <span>{t('transport.title', 'النقل والمواصلات')}</span>
            </div>

            <div className="space-y-3">
              <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
                <span className="text-xs text-slate-400 font-normal">{t('trips.transport_company', isRTL ? 'شركة النقل' : 'Transportation Company')}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  {trip.transportCompany || (isRTL ? 'نقل الحرمين السريع' : 'Haramain Express Transport')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
                  <span className="text-xs text-slate-400 font-normal">{t('transport.vehicle_type', 'نوع النقل')}</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    {trip.transportType || (isRTL ? 'حافلة مخصصة' : 'VIP Tourist Coach')}
                  </span>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
                  <span className="text-xs text-slate-400 font-normal">{t('transport.plate_number', 'رقم الحافلة')}</span>
                  <span className="text-xs sm:text-sm font-bold font-mono text-slate-800">
                    {trip.busNumber || 'BUS-101'}
                  </span>
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
                <span className="text-xs text-slate-400 font-normal">{t('trips.driver_name', 'السائق')}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  {trip.driverName || (isRTL ? 'محمد العمري' : 'Mohammed Al-Omari')}
                </span>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
                <span className="text-xs text-slate-400 font-normal">{t('trips.driver_phone', 'رقم الهاتف')}</span>
                <span dir="ltr" className="text-xs sm:text-sm font-bold font-mono text-slate-800">
                  {trip.driverPhone || '+966 99988888'}
                </span>
              </div>
            </div>

            {/* Flight / Airline Details if present */}
            {(trip.airline || trip.flightNumber || trip.airportHub || trip.routeName.includes('مطار') || trip.routeName.toLowerCase().includes('airport') || trip.routeName.includes('جاكرتا')) && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-sm font-bold text-[#0f172a]">
                  <Plane className="w-4 h-4 text-emerald-600" />
                  <span>{isRTL ? 'بيانات الطيران والناقل الجوي' : 'Airline & Flight Details'}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
                    <span className="text-xs text-slate-400 font-normal">{isRTL ? 'الناقل الجوي' : 'Airline / Carrier'}</span>
                    <span className="text-xs sm:text-sm font-bold text-emerald-700">
                      {trip.airline || (isRTL ? 'الخطوط السعودية (SV)' : 'Saudia (SV)')}
                    </span>
                  </div>
                  <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-2xs">
                    <span className="text-xs text-slate-400 font-normal">{isRTL ? 'رقم الرحلة' : 'Flight No.'}</span>
                    <span className="text-xs sm:text-sm font-bold font-mono text-slate-800">
                      {trip.flightNumber || 'SV-379'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 sm:px-8 py-4 border-t border-slate-200/80 flex items-center ${isReadOnly ? 'justify-end' : 'justify-between'} bg-white shrink-0`}>
          {!isReadOnly && (
            <button
              onClick={() => {
                if (onEdit) onEdit(trip);
                onClose();
              }}
              className="bg-[#00c48c] hover:bg-[#00b07d] text-white px-7 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-xs active:scale-95"
            >
              <SquarePen className="w-4 h-4 stroke-[2.2]" />
              <span>{t('common.edit', 'تعديل التفاصيل')}</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 px-8 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer shadow-2xs active:scale-95"
          >
            {t('common.close', 'إغلاق')}
          </button>
        </div>
      </div>
    </div>
  );
}
