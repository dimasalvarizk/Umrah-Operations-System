import { useState } from 'react';
import { X, Info, Calendar, Plane, ShieldCheck, SquarePen, Eye, Paperclip, FileCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import FilePreviewModal, { type FilePreviewData } from '../common/FilePreviewModal';

export interface GroupDetailsModalData {
  id?: string;
  code: string;
  name: string;
  groupCodeNumber?: string;
  agreementNumber?: string;
  mainAgent: string;
  subAgent: string;
  nationality: string;
  pilgrimsCount: number;
  status?: string;

  // Hotels
  makkahHotel?: string;
  makkahCheckIn?: string;
  makkahCheckOut?: string;
  madinahHotel?: string;
  madinahCheckIn?: string;
  madinahCheckOut?: string;

  // Flights & Transport
  departureFlightNo?: string;
  departureDate?: string;
  departureAirport?: string;
  arrivalFlightNo?: string;
  arrivalDate?: string;
  arrivalAirport?: string;
  transportCompany?: string;
  operationNumber?: string;
  driverName?: string;
  driverPhone?: string;
  busPlateNo?: string;

  // Permits & Grouping
  umrahPermitStatus?: string;
  rawdahMenPermitStatus?: string;
  rawdahWomenPermitStatus?: string;
  arrivalGrouping?: string;
  interCityGrouping?: string;
  departureGrouping?: string;

  // Uploaded Files
  uploadedFiles?: Record<string, { name: string; size?: number; url?: string; type?: string; uploadedAt?: string; categoryTitle?: string }>;
}

interface GroupDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  group?: GroupDetailsModalData | null;
  onEdit?: (group: GroupDetailsModalData) => void;
}

export default function GroupDetailsModal({
  isOpen,
  onClose,
  group,
  onEdit,
}: GroupDetailsModalProps) {
  const { t, isRTL, direction } = useLanguage();
  const [previewFile, setPreviewFile] = useState<FilePreviewData | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (!isOpen) return null;

  const defaultFiles: Record<string, { name: string; size?: number; url?: string; type?: string; uploadedAt?: string; categoryTitle?: string }> = {
    arrivalGrouping: {
      name: 'Frame 82717156.png',
      size: 348120,
      uploadedAt: '15/08/2024',
      categoryTitle: isRTL ? 'تفويج الوصول' : 'Arrival Grouping',
    },
    umrahPermit: {
      name: 'nusuk_permit_GRP2401.pdf',
      size: 512000,
      uploadedAt: '12/08/2024',
      categoryTitle: isRTL ? 'تصريح عمرة (نسك)' : 'Umrah Permit (Nusuk)',
    },
    rawdahMen: {
      name: 'rawdah_permit_men.pdf',
      size: 380400,
      uploadedAt: '14/08/2024',
      categoryTitle: isRTL ? 'تصريح الروضة - رجال' : 'Rawdah Permit (Men)',
    },
  };

  const data: GroupDetailsModalData = {
    code: group?.code || 'GRP-2401',
    name: group?.name || (isRTL ? 'مجموعة الأنوار 1' : 'Al-Anwar 1 Delegation'),
    groupCodeNumber: group?.groupCodeNumber || '480900XXXXXX',
    agreementNumber: group?.agreementNumber || 'AGR-1125900',
    mainAgent: group?.mainAgent || (isRTL ? 'شركة تسهيل' : 'Tasheel Tours'),
    subAgent: group?.subAgent || (isRTL ? 'وكالة مكة للطيران' : 'Makkah Aviation Agency'),
    nationality: group?.nationality || (isRTL ? 'باكستان' : 'Pakistan'),
    pilgrimsCount: group?.pilgrimsCount || 145,

    makkahHotel: group?.makkahHotel || (isRTL ? 'فندق مكة 1' : 'Makkah Hotel 1'),
    makkahCheckIn: group?.makkahCheckIn || '2024-08-15',
    makkahCheckOut: group?.makkahCheckOut || '2024-08-20',
    madinahHotel: group?.madinahHotel || (isRTL ? 'فندق المدينة المنورة' : 'Madinah Hotel'),
    madinahCheckIn: group?.madinahCheckIn || '2024-08-20',
    madinahCheckOut: group?.madinahCheckOut || '2024-08-25',

    departureFlightNo: group?.departureFlightNo || 'SV-0379',
    departureDate: group?.departureDate || '2024-08-25',
    departureAirport: group?.departureAirport || (isRTL ? 'مطار الأمير محمد بن عبدالعزيز - المدينة' : 'Prince Mohammad Bin Abdulaziz Airport - Madinah'),
    arrivalFlightNo: group?.arrivalFlightNo || 'SV-0378',
    arrivalDate: group?.arrivalDate || '2024-08-15',
    arrivalAirport: group?.arrivalAirport || (isRTL ? 'مطار الملك عبدالعزيز - جدة' : 'King Abdulaziz Airport - Jeddah'),
    transportCompany: group?.transportCompany || (isRTL ? 'شركة حافل للنقل' : 'Hafil Transport Company'),
    operationNumber: group?.operationNumber || 'OPS-7489',
    driverName: group?.driverName || (isRTL ? 'سامي السلمي' : 'Sami Al-Sulami'),
    driverPhone: group?.driverPhone || '+966 51 234 5678',
    busPlateNo: group?.busPlateNo || '9312 HFL',

    umrahPermitStatus: group?.umrahPermitStatus || (isRTL ? 'مقبول' : 'Approved'),
    rawdahMenPermitStatus: group?.rawdahMenPermitStatus || (isRTL ? 'قيد المراجعة' : 'In Review'),
    rawdahWomenPermitStatus: group?.rawdahWomenPermitStatus || (isRTL ? 'لم يُقدم' : 'Not Submitted'),
    arrivalGrouping: group?.arrivalGrouping || (isRTL ? 'مكتمل' : 'Completed'),
    interCityGrouping: group?.interCityGrouping || (isRTL ? 'مغلق' : 'Closed'),
    departureGrouping: group?.departureGrouping || (isRTL ? 'لا يوجد' : 'None'),
    uploadedFiles: group?.uploadedFiles && Object.keys(group.uploadedFiles).length > 0 ? group.uploadedFiles : defaultFiles,
  };

  const handleOpenDocPreview = (fileItem: { name: string; size?: number; url?: string; type?: string; uploadedAt?: string; categoryTitle?: string }) => {
    setPreviewFile({
      name: fileItem.name,
      size: fileItem.size,
      url: fileItem.url,
      type: fileItem.type,
      uploadedAt: fileItem.uploadedAt,
      categoryTitle: fileItem.categoryTitle,
    });
    setIsPreviewOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Modal Container */}
      <div
        className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl relative border border-slate-100 flex flex-col justify-between max-h-[94vh] overflow-hidden"
        dir={direction}
      >
        {/* Header */}
        <div className="px-6 sm:px-8 py-4 border-b border-slate-200/80 flex items-center justify-between bg-[#f8fafc] shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] tracking-tight">
              {t('groups.details_title', 'تفاصيل المجموعة')}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold text-slate-600">
                {data.name}
              </span>
              <span className="bg-white text-slate-600 border border-slate-200/80 px-2 py-0.5 rounded text-xs font-mono font-medium shadow-2xs">
                {data.code}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition cursor-pointer shadow-2xs"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 sm:px-8 py-5 space-y-5 overflow-y-auto flex-1 bg-white">
          {/* SECTION 1: Basic Info */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 justify-start text-[#0f172a] font-bold text-sm">
              <div className="w-7 h-7 rounded-lg bg-[#cbf7ea] text-[#00897b] flex items-center justify-center shrink-0">
                <Info className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span>{t('groups.basic_info', 'المعلومات الأساسية')}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{t('groups.col_name', 'اسم المجموعة')}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">{data.name}</span>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{t('groups.col_code', 'رقم المجموعة (نسك)')}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 font-mono">{data.groupCodeNumber}</span>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{isRTL ? 'رقم الاتفاقية (نظام نسك)' : 'Agreement Number (Nusuk)'}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-emerald-100/70 text-emerald-800 px-1.5 py-0.2 rounded font-semibold border border-emerald-200">
                    Nusuk
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-800 font-mono">{data.agreementNumber}</span>
                </div>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{t('groups.col_main_agent', 'الوكيل الرئيسي')}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">{data.mainAgent}</span>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{t('groups.col_sub_agent', 'الوكيل الفرعي')}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">{data.subAgent}</span>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{t('groups.col_nationality', 'الجنسية')}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <span>{data.nationality}</span>
                </span>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{t('groups.col_pilgrims', 'عدد المعتمرين')}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">{data.pilgrimsCount} {isRTL ? 'معتمراً' : 'Pilgrims'}</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: Accommodation */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 justify-start text-[#0f172a] font-bold text-sm">
              <div className="w-7 h-7 rounded-lg bg-[#cbf7ea] text-[#00897b] flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span>{t('groups.hotels_accommodation', 'الإقامة والفنادق')}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{t('groups.makkah_hotel', 'فندق مكة')}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">{data.makkahHotel}</span>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{t('groups.checkin', 'تاريخ الدخول')} ({isRTL ? 'مكة' : 'Makkah'})</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">{data.makkahCheckIn}</span>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{t('groups.checkout', 'تاريخ الخروج')} ({isRTL ? 'مكة' : 'Makkah'})</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">{data.makkahCheckOut}</span>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{t('groups.madinah_hotel', 'فندق المدينة')}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">{data.madinahHotel}</span>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{t('groups.checkin', 'تاريخ الدخول')} ({isRTL ? 'المدينة' : 'Madinah'})</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">{data.madinahCheckIn}</span>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{t('groups.checkout', 'تاريخ الخروج')} ({isRTL ? 'المدينة' : 'Madinah'})</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">{data.madinahCheckOut}</span>
              </div>
            </div>
          </div>

          {/* SECTION 3: Flights & Transport */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 justify-start text-[#0f172a] font-bold text-sm">
              <div className="w-7 h-7 rounded-lg bg-[#cbf7ea] text-[#00897b] flex items-center justify-center shrink-0">
                <Plane className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span>{t('groups.flights_transport', 'الرحلات والنقل')}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{t('groups.departure_flight', 'رحلة المغادرة')}</span>
                <span dir="ltr" className="text-xs sm:text-sm font-bold text-slate-800 font-mono">{data.departureFlightNo}</span>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{isRTL ? 'تاريخ المغادرة' : 'Departure Date'}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">{data.departureDate}</span>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{t('groups.departure_airport', 'مطار المغادرة')}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">{data.departureAirport}</span>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{t('groups.arrival_flight', 'رحلة القدوم')}</span>
                <span dir="ltr" className="text-xs sm:text-sm font-bold text-slate-800 font-mono">{data.arrivalFlightNo}</span>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{isRTL ? 'تاريخ الوصول' : 'Arrival Date'}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">{data.arrivalDate}</span>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{t('groups.arrival_airport', 'مطار القدوم')}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">{data.arrivalAirport}</span>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{t('groups.transport_company', 'شركة النقل')}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">{data.transportCompany || (isRTL ? 'شركة حافل للنقل' : 'Hafil Transport Company')}</span>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{isRTL ? 'رقم التشغيل' : 'Operation Code'}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 font-mono">{data.operationNumber || 'OPS-7489'}</span>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{isRTL ? 'اسم السائق' : 'Driver Name'}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">{data.driverName || (isRTL ? 'سامي السلمي' : 'Sami Al-Sulami')}</span>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{isRTL ? 'رقم جوال السائق' : 'Driver Phone'}</span>
                <span dir="ltr" className="text-xs sm:text-sm font-bold text-slate-800 font-mono">{data.driverPhone || '+966 51 234 5678'}</span>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{isRTL ? 'رقم لوحة الحافلة' : 'Bus Plate No.'}</span>
                <span dir="ltr" className="text-xs sm:text-sm font-bold text-slate-800 font-mono">{data.busPlateNo || '9312 HFL'}</span>
              </div>
            </div>
          </div>

          {/* SECTION 4: Permits & Logistics */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 justify-start text-[#0f172a] font-bold text-sm">
              <div className="w-7 h-7 rounded-lg bg-[#cbf7ea] text-[#00897b] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span>{t('groups.permits_ziyarat', 'التصاريح والزيارات والتفويج')}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{t('groups.umrah_permit', 'تصريح عمرة')}</span>
                <div className="bg-[#e6f9f0] border border-[#10b981]/20 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 text-xs font-bold text-[#10b981]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                  <span>{data.umrahPermitStatus}</span>
                </div>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{t('groups.rawdah_men', 'تصاريح الروضة - رجال')}</span>
                <div className="bg-[#fef3c7] border border-[#f59e0b]/20 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 text-xs font-bold text-[#d97706]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                  <span>{data.rawdahMenPermitStatus}</span>
                </div>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{t('groups.rawdah_women', 'تصاريح الروضة - نساء')}</span>
                <div className="bg-slate-100 border border-slate-200/80 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 text-xs font-bold text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>{data.rawdahWomenPermitStatus}</span>
                </div>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{isRTL ? 'تفويج الوصول' : 'Arrival Grouping'}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-slate-800">{data.arrivalGrouping}</span>
                  {data.uploadedFiles?.['arrivalGrouping'] && (
                    <button
                      type="button"
                      onClick={() => handleOpenDocPreview(data.uploadedFiles!['arrivalGrouping'])}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[11px] font-medium transition cursor-pointer"
                      title={isRTL ? 'معاينة الملف المرفق' : 'View attached file'}
                    >
                      <Eye className="w-3 h-3" />
                      <span className="truncate max-w-[80px]">{data.uploadedFiles['arrivalGrouping'].name}</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{isRTL ? 'تفويج بين المدن' : 'Inter-City Grouping'}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">{data.interCityGrouping}</span>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{isRTL ? 'تفويج المغادرة' : 'Departure Grouping'}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">{data.departureGrouping}</span>
              </div>
            </div>
          </div>

          {/* SECTION 5: Attached Documents & Manifests */}
          {data.uploadedFiles && Object.keys(data.uploadedFiles).length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 justify-start text-[#0f172a] font-bold text-sm">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Paperclip className="w-4 h-4 stroke-[2.2]" />
                </div>
                <span>{isRTL ? 'المستندات والمرفقات الرسمية المرفوعة' : 'Attached Files & Documents'}</span>
                <span className="text-[11px] font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {Object.keys(data.uploadedFiles).length} {isRTL ? 'ملفات' : 'files'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.entries(data.uploadedFiles).map(([key, file]) => (
                  <div
                    key={key}
                    onClick={() => handleOpenDocPreview(file)}
                    className="bg-[#f8fafc] hover:bg-emerald-50/50 border border-slate-200/80 hover:border-emerald-300 rounded-xl p-3 flex items-center justify-between transition cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition shrink-0">
                        {file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg') ? (
                          <Eye className="w-4 h-4 stroke-[2]" />
                        ) : (
                          <FileCheck className="w-4 h-4 stroke-[2]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-800 transition" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {file.categoryTitle || key} • {file.uploadedAt || '15/08/2024'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDocPreview(file);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-white transition"
                        title={isRTL ? 'معاينة' : 'Preview'}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 border-t border-slate-200/80 flex items-center justify-between bg-[#f8fafc] shrink-0">
          <button
            onClick={() => {
              if (onEdit) onEdit(data);
              onClose();
            }}
            className="bg-[#009688] hover:bg-[#00897b] text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shadow-xs cursor-pointer active:scale-[0.99]"
          >
            <SquarePen className="w-4 h-4 stroke-[2.5]" />
            <span>{t('common.edit', 'تعديل التفاصيل')}</span>
          </button>

          <button
            onClick={onClose}
            className="border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 px-8 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer active:scale-[0.99] shadow-2xs"
          >
            {t('common.close', 'إغلاق')}
          </button>
        </div>
      </div>

      {/* File Preview Modal */}
      <FilePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        file={previewFile}
      />
    </div>
  );
}
