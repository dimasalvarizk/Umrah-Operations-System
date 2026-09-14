import { useState } from 'react';
import { X, Info, Calendar, Plane, ShieldCheck, SquarePen, Eye, Paperclip, Image as ImageIcon, FileText } from 'lucide-react';
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
  packageType?: string;
  pilgrimsCount: number;
  status?: string;

  // Hotels
  makkahHotel?: string;
  makkahCheckIn?: string;
  makkahCheckOut?: string;
  madinahHotel?: string;
  madinahCheckIn?: string;
  madinahCheckOut?: string;
  makkahHotel2?: string;
  makkah2CheckIn?: string;
  makkah2CheckOut?: string;
  hospitalityNotes?: string;

  // Flights & Transport
  departureAirline?: string;
  departureFlightNo?: string;
  departureDate?: string;
  departureAirport?: string;
  departureDestination?: string;
  arrivalAirline?: string;
  arrivalFlightNo?: string;
  arrivalDate?: string;
  arrivalAirport?: string;
  arrivalOrigin?: string;
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
  arrivalGroupingStatus?: string;
  interCityGrouping?: string;
  intercityGroupingStatus?: string;
  departureGrouping?: string;
  departureGroupingStatus?: string;
  makkahZiyarat?: string;
  madinahZiyarat?: string;
  enrichmentProgram?: string;
  missingRequirements?: string;
  additionalNotes?: string;

  // Uploaded Files & Blobs
  uploadedFiles?: Record<string, { name: string; size?: number; url?: string; type?: string; uploadedAt?: string; categoryTitle?: string }>;
  hotelsData?: any;
  flightTransportData?: any;
  permitsNotesData?: any;
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

  const hotels = typeof (group as any)?.hotelsData === 'string' 
    ? (() => { try { return JSON.parse((group as any)?.hotelsData || '{}'); } catch { return {}; } })()
    : ((group as any)?.hotelsData || {});
  const flights = typeof (group as any)?.flightTransportData === 'string' 
    ? (() => { try { return JSON.parse((group as any)?.flightTransportData || '{}'); } catch { return {}; } })()
    : ((group as any)?.flightTransportData || {});
  const permits = typeof (group as any)?.permitsNotesData === 'string' 
    ? (() => { try { return JSON.parse((group as any)?.permitsNotesData || '{}'); } catch { return {}; } })()
    : ((group as any)?.permitsNotesData || {});

  const data: GroupDetailsModalData = {
    id: group?.id,
    code: group?.code || '-',
    name: group?.name || '-',
    groupCodeNumber: group?.groupCodeNumber || group?.code || '-',
    agreementNumber: group?.agreementNumber || '-',
    mainAgent: group?.mainAgent || '-',
    subAgent: group?.subAgent || '-',
    nationality: group?.nationality || '-',
    packageType: group?.packageType || (group as any)?.package_type || '',
    pilgrimsCount: group?.pilgrimsCount || 0,
    status: group?.status || '-',

    makkahHotel: group?.makkahHotel || hotels.makkahHotel || hotels.makkahHotel1 || '-',
    makkahCheckIn: group?.makkahCheckIn || hotels.makkahCheckIn || hotels.makkah1CheckIn || '-',
    makkahCheckOut: group?.makkahCheckOut || hotels.makkahCheckOut || hotels.makkah1CheckOut || '-',
    madinahHotel: group?.madinahHotel || hotels.madinahHotel || '-',
    madinahCheckIn: group?.madinahCheckIn || hotels.madinahCheckIn || '-',
    madinahCheckOut: group?.madinahCheckOut || hotels.madinahCheckOut || '-',
    makkahHotel2: group?.makkahHotel2 || hotels.makkahHotel2 || '',
    makkah2CheckIn: group?.makkah2CheckIn || hotels.makkah2CheckIn || '',
    makkah2CheckOut: group?.makkah2CheckOut || hotels.makkah2CheckOut || '',
    hospitalityNotes: group?.hospitalityNotes || hotels.hospitalityNotes || '',

    departureAirline: group?.departureAirline || flights.departureAirline || '',
    departureFlightNo: group?.departureFlightNo || flights.departureFlightNo || '-',
    departureDate: group?.departureDate || flights.departureDate || '-',
    departureAirport: group?.departureAirport || flights.departureAirport || '-',
    departureDestination: group?.departureDestination || flights.departureDestination || '',
    arrivalAirline: group?.arrivalAirline || flights.arrivalAirline || '',
    arrivalFlightNo: group?.arrivalFlightNo || flights.arrivalFlightNo || '-',
    arrivalDate: group?.arrivalDate || flights.arrivalDate || '-',
    arrivalAirport: group?.arrivalAirport || flights.arrivalAirport || '-',
    arrivalOrigin: group?.arrivalOrigin || flights.arrivalOrigin || '',
    transportCompany: group?.transportCompany || flights.transportCompany || '-',
    operationNumber: group?.operationNumber || flights.operationNumber || '-',
    driverName: group?.driverName || flights.driverName || '-',
    driverPhone: group?.driverPhone || flights.driverPhone || '-',
    busPlateNo: group?.busPlateNo || flights.busPlateNo || '-',

    umrahPermitStatus: group?.umrahPermitStatus || permits.umrahPermitStatus || (isRTL ? 'مقبول' : 'Approved'),
    rawdahMenPermitStatus: group?.rawdahMenPermitStatus || permits.rawdahMenPermitStatus || (isRTL ? 'قيد المراجعة' : 'In Review'),
    rawdahWomenPermitStatus: group?.rawdahWomenPermitStatus || permits.rawdahWomenPermitStatus || (isRTL ? 'لم يُقدم' : 'Not Submitted'),
    arrivalGrouping: group?.arrivalGrouping || permits.arrivalGrouping || (isRTL ? 'مكتمل' : 'Completed'),
    interCityGrouping: group?.interCityGrouping || permits.interCityGrouping || (isRTL ? 'معلق' : 'In Progress'),
    departureGrouping: group?.departureGrouping || permits.departureGrouping || (isRTL ? 'لا يوجد' : 'None'),
    makkahZiyarat: group?.makkahZiyarat || permits.makkahZiyarat || '',
    madinahZiyarat: group?.madinahZiyarat || permits.madinahZiyarat || '',
    enrichmentProgram: group?.enrichmentProgram || permits.enrichmentProgram || '',
    missingRequirements: group?.missingRequirements || permits.missingRequirements || '',
    additionalNotes: group?.additionalNotes || permits.additionalNotes || '',
    uploadedFiles: (group?.uploadedFiles && Object.keys(group.uploadedFiles).length > 0) 
      ? group.uploadedFiles 
      : (permits.uploadedFiles && Object.keys(permits.uploadedFiles).length > 0) 
        ? permits.uploadedFiles 
        : {},
    hotelsData: hotels,
    flightTransportData: flights,
    permitsNotesData: permits,
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
              {/* Umrah Permit */}
              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-400 font-normal">{t('groups.umrah_permit', 'تصريح عمرة')}</span>
                <div className="flex items-center gap-2">
                  <div className="bg-[#e6f9f0] border border-[#10b981]/20 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 text-xs font-bold text-[#10b981]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                    <span>{data.umrahPermitStatus}</span>
                  </div>
                  {data.uploadedFiles?.['umrahPermit'] && (
                    <button
                      type="button"
                      onClick={() => handleOpenDocPreview(data.uploadedFiles!['umrahPermit'])}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[11px] font-medium transition cursor-pointer shadow-2xs"
                      title={data.uploadedFiles['umrahPermit'].name}
                    >
                      <Eye className="w-3 h-3 text-emerald-600" />
                      <span className="truncate max-w-[85px]">{data.uploadedFiles['umrahPermit'].name}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Rawdah Men */}
              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-400 font-normal">{t('groups.rawdah_men', 'تصاريح الروضة - رجال')}</span>
                <div className="flex items-center gap-2">
                  <div className="bg-[#fef3c7] border border-[#f59e0b]/20 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 text-xs font-bold text-[#d97706]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                    <span>{data.rawdahMenPermitStatus}</span>
                  </div>
                  {data.uploadedFiles?.['rawdahMen'] && (
                    <button
                      type="button"
                      onClick={() => handleOpenDocPreview(data.uploadedFiles!['rawdahMen'])}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[11px] font-medium transition cursor-pointer shadow-2xs"
                      title={data.uploadedFiles['rawdahMen'].name}
                    >
                      <Eye className="w-3 h-3 text-emerald-600" />
                      <span className="truncate max-w-[85px]">{data.uploadedFiles['rawdahMen'].name}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Rawdah Women */}
              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-400 font-normal">{t('groups.rawdah_women', 'تصاريح الروضة - نساء')}</span>
                <div className="flex items-center gap-2">
                  <div className="bg-slate-100 border border-slate-200/80 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 text-xs font-bold text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>{data.rawdahWomenPermitStatus}</span>
                  </div>
                  {data.uploadedFiles?.['rawdahWomen'] && (
                    <button
                      type="button"
                      onClick={() => handleOpenDocPreview(data.uploadedFiles!['rawdahWomen'])}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[11px] font-medium transition cursor-pointer shadow-2xs"
                      title={data.uploadedFiles['rawdahWomen'].name}
                    >
                      <Eye className="w-3 h-3 text-emerald-600" />
                      <span className="truncate max-w-[85px]">{data.uploadedFiles['rawdahWomen'].name}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Arrival Grouping */}
              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-400 font-normal">{isRTL ? 'تفويج الوصول' : 'Arrival Grouping'}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-slate-800">{data.arrivalGrouping}</span>
                  {data.uploadedFiles?.['arrivalGrouping'] && (
                    <button
                      type="button"
                      onClick={() => handleOpenDocPreview(data.uploadedFiles!['arrivalGrouping'])}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[11px] font-medium transition cursor-pointer shadow-2xs"
                      title={data.uploadedFiles['arrivalGrouping'].name}
                    >
                      <Eye className="w-3 h-3 text-emerald-600" />
                      <span className="truncate max-w-[85px]">{data.uploadedFiles['arrivalGrouping'].name}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Inter-City Grouping */}
              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-400 font-normal">{isRTL ? 'تفويج بين المدن' : 'Inter-City Grouping'}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-slate-800">{data.interCityGrouping}</span>
                  {data.uploadedFiles?.['interCityGrouping'] && (
                    <button
                      type="button"
                      onClick={() => handleOpenDocPreview(data.uploadedFiles!['interCityGrouping'])}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[11px] font-medium transition cursor-pointer shadow-2xs"
                      title={data.uploadedFiles['interCityGrouping'].name}
                    >
                      <Eye className="w-3 h-3 text-emerald-600" />
                      <span className="truncate max-w-[85px]">{data.uploadedFiles['interCityGrouping'].name}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Departure Grouping */}
              <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-400 font-normal">{isRTL ? 'تفويج المغادرة' : 'Departure Grouping'}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-slate-800">{data.departureGrouping}</span>
                  {data.uploadedFiles?.['departureGrouping'] && (
                    <button
                      type="button"
                      onClick={() => handleOpenDocPreview(data.uploadedFiles!['departureGrouping'])}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[11px] font-medium transition cursor-pointer shadow-2xs"
                      title={data.uploadedFiles['departureGrouping'].name}
                    >
                      <Eye className="w-3 h-3 text-emerald-600" />
                      <span className="truncate max-w-[85px]">{data.uploadedFiles['departureGrouping'].name}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Makkah Ziyarat */}
              {(data.makkahZiyarat || data.uploadedFiles?.['makkahZiyarat']) && (
                <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-400 font-normal">{isRTL ? 'مزارات مكة المكرمة' : 'Makkah Ziyarat Places'}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-800 truncate max-w-[120px]">{data.makkahZiyarat || '-'}</span>
                    {data.uploadedFiles?.['makkahZiyarat'] && (
                      <button
                        type="button"
                        onClick={() => handleOpenDocPreview(data.uploadedFiles!['makkahZiyarat'])}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[11px] font-medium transition cursor-pointer shadow-2xs"
                        title={data.uploadedFiles['makkahZiyarat'].name}
                      >
                        <Eye className="w-3 h-3 text-emerald-600" />
                        <span className="truncate max-w-[85px]">{data.uploadedFiles['makkahZiyarat'].name}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Madinah Ziyarat */}
              {(data.madinahZiyarat || data.uploadedFiles?.['madinahZiyarat']) && (
                <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-400 font-normal">{isRTL ? 'مزارات المدينة المنورة' : 'Madinah Ziyarat Places'}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-800 truncate max-w-[120px]">{data.madinahZiyarat || '-'}</span>
                    {data.uploadedFiles?.['madinahZiyarat'] && (
                      <button
                        type="button"
                        onClick={() => handleOpenDocPreview(data.uploadedFiles!['madinahZiyarat'])}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[11px] font-medium transition cursor-pointer shadow-2xs"
                        title={data.uploadedFiles['madinahZiyarat'].name}
                      >
                        <Eye className="w-3 h-3 text-emerald-600" />
                        <span className="truncate max-w-[85px]">{data.uploadedFiles['madinahZiyarat'].name}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Enrichment Program */}
              {(data.enrichmentProgram || data.uploadedFiles?.['enrichmentProgram']) && (
                <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-400 font-normal">{isRTL ? 'البرنامج الإثرائي' : 'Enrichment Program'}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-800 truncate max-w-[120px]">{data.enrichmentProgram || '-'}</span>
                    {data.uploadedFiles?.['enrichmentProgram'] && (
                      <button
                        type="button"
                        onClick={() => handleOpenDocPreview(data.uploadedFiles!['enrichmentProgram'])}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[11px] font-medium transition cursor-pointer shadow-2xs"
                        title={data.uploadedFiles['enrichmentProgram'].name}
                      >
                        <Eye className="w-3 h-3 text-emerald-600" />
                        <span className="truncate max-w-[85px]">{data.uploadedFiles['enrichmentProgram'].name}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Missing Requirements */}
              {(data.missingRequirements || data.uploadedFiles?.['missingRequirements']) && (
                <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-400 font-normal">{isRTL ? 'النواقص والطلبات' : 'Missing Requirements'}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-800 truncate max-w-[120px]">{data.missingRequirements || '-'}</span>
                    {data.uploadedFiles?.['missingRequirements'] && (
                      <button
                        type="button"
                        onClick={() => handleOpenDocPreview(data.uploadedFiles!['missingRequirements'])}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[11px] font-medium transition cursor-pointer shadow-2xs"
                        title={data.uploadedFiles['missingRequirements'].name}
                      >
                        <Eye className="w-3 h-3 text-emerald-600" />
                        <span className="truncate max-w-[85px]">{data.uploadedFiles['missingRequirements'].name}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Notes */}
              {(data.additionalNotes || data.uploadedFiles?.['additionalNotes']) && (
                <div className="bg-[#f8fafc] border border-slate-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between gap-2 sm:col-span-2">
                  <span className="text-xs text-slate-400 font-normal">{isRTL ? 'ملاحظات إضافية' : 'Additional Notes'}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-800 truncate max-w-[200px]">{data.additionalNotes || '-'}</span>
                    {data.uploadedFiles?.['additionalNotes'] && (
                      <button
                        type="button"
                        onClick={() => handleOpenDocPreview(data.uploadedFiles!['additionalNotes'])}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[11px] font-medium transition cursor-pointer shadow-2xs"
                        title={data.uploadedFiles['additionalNotes'].name}
                      >
                        <Eye className="w-3 h-3 text-emerald-600" />
                        <span className="truncate max-w-[85px]">{data.uploadedFiles['additionalNotes'].name}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(data.uploadedFiles).map(([key, file]) => {
                  const ext = file.name.split('.').pop()?.toLowerCase() || '';
                  const isImg = ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext) || file.type?.startsWith('image/');
                  const isPdf = ext === 'pdf' || file.type === 'application/pdf';

                  const formatSize = (bytes?: number) => {
                    if (!bytes) return '';
                    if (bytes < 1024) return `${bytes} B`;
                    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
                    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
                  };

                  return (
                    <div
                      key={key}
                      onClick={() => handleOpenDocPreview(file)}
                      className="bg-[#f8fafc] hover:bg-emerald-50/40 border border-slate-200/90 hover:border-emerald-300 rounded-xl p-3 flex items-center justify-between gap-3 transition cursor-pointer group shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Thumbnail / Icon Badge */}
                        <div className="w-11 h-11 rounded-lg bg-white border border-slate-200/90 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs group-hover:border-emerald-300 transition">
                          {isImg && file.url && !file.url.startsWith('blob:') ? (
                            <img
                              src={file.url}
                              alt={file.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                                (e.target as HTMLElement).parentElement?.classList.add('bg-emerald-50');
                              }}
                            />
                          ) : isPdf ? (
                            <div className="w-full h-full bg-rose-50 text-rose-600 flex flex-col items-center justify-center">
                              <FileText className="w-5 h-5 stroke-[2]" />
                              <span className="text-[8px] font-bold uppercase font-mono">PDF</span>
                            </div>
                          ) : (
                            <div className="w-full h-full bg-emerald-50 text-emerald-600 flex flex-col items-center justify-center">
                              <ImageIcon className="w-5 h-5 stroke-[2]" />
                              <span className="text-[8px] font-bold uppercase font-mono">{ext || 'IMG'}</span>
                            </div>
                          )}
                        </div>

                        {/* File Details */}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-bold text-slate-800 truncate group-hover:text-emerald-800 transition" title={file.name}>
                            {file.name}
                          </p>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5 truncate">
                            <span className="font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded text-[10px] border border-emerald-200/60 shrink-0">
                              {file.categoryTitle || key}
                            </span>
                            {file.size && (
                              <>
                                <span>•</span>
                                <span className="font-mono text-slate-400">{formatSize(file.size)}</span>
                              </>
                            )}
                            {file.uploadedAt && (
                              <>
                                <span>•</span>
                                <span className="text-slate-400">{file.uploadedAt}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDocPreview(file);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50/50 flex items-center gap-1 text-xs font-semibold transition shrink-0 shadow-2xs"
                        title={isRTL ? 'معاينة الملف' : 'Preview Document'}
                      >
                        <Eye className="w-3.5 h-3.5 stroke-[2.2] text-emerald-600" />
                        <span className="hidden sm:inline">{isRTL ? 'معاينة' : 'Preview'}</span>
                      </button>
                    </div>
                  );
                })}
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
