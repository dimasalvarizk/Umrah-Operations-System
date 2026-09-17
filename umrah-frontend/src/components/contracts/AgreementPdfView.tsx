import { FileText, Building, Star } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import logoIcon from '../../assets/logo-icon.png';

export interface AgreementPdfData {
  referenceNumber?: string;
  date?: string;
  status?: string;
  agreementTitle?: string;
  hotelName?: string;
  city?: string;
  rating?: number;
  period?: string;
  durationDays?: string;
  totalPrice?: string;
  documentNumber?: string;
  agentName?: string;
  packageTier?: string;
  serviceDetails?: string;
  rooms?: {
    type: string;
    capacity: string;
    size: string;
    count: string;
  }[];
}

interface AgreementPdfViewProps {
  data?: AgreementPdfData;
}

export default function AgreementPdfView({ data }: AgreementPdfViewProps) {
  const { direction, t, isRTL } = useLanguage();

  const toEasternArabic = (val: string | number) => {
    if (!isRTL) return String(val);
    const easternDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(val).replace(/[0-9]/g, (w) => easternDigits[+w]);
  };

  const referenceNumber = data?.referenceNumber || 'AGR-1125900';
  const date = data?.date || '29/08/2026';
  const status = data?.status || (isRTL ? 'رسمي / معتمد' : 'Official / Certified');
  const agreementTitle =
    data?.agreementTitle || (isRTL ? 'اتفاقية فندق جراند زوار للضيافة السياحي' : 'Grand Zuwar Hospitality Hotel Agreement');
  const hotelName = data?.hotelName || (isRTL ? 'فندق جراند زوار للضيافة' : 'Grand Zuwar Hospitality Hotel');
  const city = data?.city || (isRTL ? 'مكة المكرمة' : 'Makkah Al-Mukarramah');
  const rating = data?.rating ?? 5;
  const period = data?.period || '02/09/2026 - 06/09/2026';
  const durationDays = data?.durationDays || (isRTL ? '٤ أيام' : '4 Days');
  const totalPrice = data?.totalPrice || (isRTL ? '١٩,٢٠٠ ر.س' : '19,200 SAR');
  const documentNumber = data?.documentNumber || 'CO-AGR-2026-09';
  const agentName = data?.agentName || (isRTL ? 'حاسوب لتجارة التقنية - 2067' : 'Hasoob Technology Trading - 2067');
  const packageTier = data?.packageTier || (isRTL ? 'باقة كبار الشخصيات التنفيذية (١٤ يوم)' : 'VIP Executive 14 Days');

  const rooms = data?.rooms || [
    {
      type: isRTL ? 'غرفة ثلاثية' : 'Triple Room',
      capacity: isRTL ? '٣ أشخاص' : '3 Persons',
      size: isRTL ? '٢٥ م²' : '25 m²',
      count: isRTL ? '٦ غرف' : '6 Rooms',
    },
    {
      type: isRTL ? 'غرفة ثنائية' : 'Double Room',
      capacity: isRTL ? 'شخصين' : '2 Persons',
      size: isRTL ? '٢٨ م²' : '28 m²',
      count: isRTL ? '٨ غرف' : '8 Rooms',
    },
    {
      type: isRTL ? 'غرفة خماسية' : 'Quintuple Room',
      capacity: isRTL ? '٥ أشخاص' : '5 Persons',
      size: isRTL ? '٤٥ م²' : '45 m²',
      count: isRTL ? '٣ غرف' : '3 Rooms',
    },
  ];

  return (
    <div
      className="bg-white text-slate-800 max-w-[794px] w-full mx-auto p-6 sm:p-9 rounded-2xl shadow-xl border border-slate-200/80 print:border-none print:shadow-none print:p-6 print:max-w-none print:w-full print:rounded-none selection:bg-emerald-100"
      dir={direction}
      id="agreement-pdf-document"
    >
      {/* 1. Top Decorative Triple-Color Stripe */}
      <div className="h-1.5 w-full flex rounded-t-md overflow-hidden mb-6" dir="ltr">
        <div className="bg-[#2e7d32] h-full" style={{ width: '40.7%' }} />
        <div className="bg-[#f59e0b] h-full" style={{ width: '18.8%' }} />
        <div className="bg-[#1b2a4a] h-full" style={{ width: '40.5%' }} />
      </div>

      {/* 2. Header Area */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
        {/* Logo & System Title */}
        <div className="flex items-center gap-3">
          <img
            src={logoIcon}
            alt="Logo"
            className="w-10 h-10 sm:w-11 sm:h-11 object-contain shrink-0"
          />
          <h1 className="text-base sm:text-xl font-bold text-[#2e7d32] tracking-tight leading-snug">
            {t('nav.system_title', 'نظام عمليات الحج والعمرة')}
          </h1>
        </div>

        {/* Metadata (Reference, Date, Status) */}
        <div className={`text-[11px] sm:text-xs space-y-1 ${isRTL ? 'text-left' : 'text-right'} leading-relaxed`}>
          <div className="text-slate-600">
            <span className="text-slate-400 font-medium">{t('contracts.reference_no', 'الرقم المرجعي')}: </span>
            <span className="font-mono font-bold text-slate-800 tracking-tight">
              {referenceNumber}
            </span>
          </div>
          <div className="text-slate-600">
            <span className="text-slate-400 font-medium">{t('common.date', 'التاريخ')}: </span>
            <span className="font-mono font-bold text-slate-800">
              {date}
            </span>
          </div>
          <div className="text-slate-600">
            <span className="text-slate-400 font-medium">{t('common.status', 'الحالة')}: </span>
            <span className="font-bold text-[#2e7d32]">
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Agreement Title Box */}
      <div className="my-5 border border-slate-200/90 bg-slate-50/50 rounded-xl py-3 px-4 text-center">
        <h2 className="text-base sm:text-lg font-bold text-[#0f172a] tracking-tight">
          {agreementTitle}
        </h2>
      </div>

      {/* 4. Two Side-by-Side Cards (Grid 2 cols) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5">
        {/* Card 1: بيانات وثيقة الاتفاقية */}
        <div className="border border-slate-200/90 rounded-2xl p-5 bg-white shadow-2xs text-xs sm:text-sm">
          <div className="flex items-center justify-between border-b border-slate-100/90 pb-3">
            <span className="font-bold text-[#2e7d32] text-sm sm:text-base">
              {t('contracts.doc_info_title', 'بيانات وثيقة الاتفاقية')}
            </span>
            <FileText className="w-5 h-5 text-[#2e7d32] stroke-[2.2]" />
          </div>

          <div className="text-xs sm:text-sm">
            <div className="flex items-center justify-between py-3 border-b border-slate-100/80">
              <span className="text-slate-500 font-medium">{t('contracts.agreement_period', 'فترة الاتفاقية')}</span>
              <span className="font-mono font-bold text-slate-800" dir="ltr">
                {period}
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-slate-100/80">
              <span className="text-slate-500 font-medium">{t('contracts.duration_days', 'عدد أيام الاتفاقية')}</span>
              <span className="font-bold text-slate-800">
                {toEasternArabic(durationDays)}
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-slate-100/80">
              <span className="text-slate-500 font-medium">{isRTL ? 'فئة باقة وبرنامج الخدمة' : 'Service Package Tier'}</span>
              <span className="font-bold text-[#1b2a4a] text-xs bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                {packageTier}
              </span>
            </div>

            <div className="flex items-center justify-between pt-3 pb-1 border-b border-slate-100/80">
              <span className="text-slate-500 font-medium">{t('contracts.total_price', 'إجمالي السعر')}</span>
              <span className="font-bold text-[#2e7d32] text-sm sm:text-base">
                {toEasternArabic(totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: البيانات الأساسية للفندق */}
        <div className="border border-slate-200/90 rounded-2xl p-5 bg-white shadow-2xs text-xs sm:text-sm">
          <div className="flex items-center justify-between border-b border-slate-100/90 pb-3">
            <span className="font-bold text-[#2e7d32] text-sm sm:text-base">
              {t('contracts.hotel_basic_info_title', 'البيانات الأساسية للفندق')}
            </span>
            <Building className="w-5 h-5 text-[#2e7d32] stroke-[2.2]" />
          </div>

          <div className="text-xs sm:text-sm">
            <div className="flex items-center justify-between py-3 border-b border-slate-100/80">
              <span className="text-slate-500 font-medium">{t('contracts.hotel_name', 'اسم الفندق')}</span>
              <span className="font-bold text-slate-900 text-xs sm:text-sm">
                {hotelName}
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-slate-500 font-medium">{t('contracts.hotel_classification', 'التصنيف')}</span>
              <div className="flex items-center gap-1" dir="ltr">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="w-4 h-4"
                    stroke={s <= rating ? '#f59e0b' : '#cbd5e1'}
                    fill="none"
                    strokeWidth={2.2}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-slate-100/80">
              <span className="text-slate-500 font-medium">{t('contracts.city', 'المدينة')}</span>
              <span className="font-bold text-slate-900 text-xs sm:text-sm">
                {city}
              </span>
            </div>

            <div className="flex items-center justify-between pt-3 pb-1 border-b border-slate-100/80">
              <span className="text-slate-500 font-medium">{isRTL ? 'الوكيل والشريك الخارجي' : 'External Agent & Partner'}</span>
              <span className="font-bold text-[#2e7d32] text-xs sm:text-sm bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {agentName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Table: تفاصيل وتوزيع الغرف المطلوبة */}
      <div className="border border-slate-200/90 rounded-xl overflow-hidden my-5 bg-white">
        <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-200/90">
          <h3 className="text-xs sm:text-sm font-bold text-slate-800">
            {t('contracts.rooms_distribution_title', 'تفاصيل وتوزيع الغرف المطلوبة')}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/30 text-slate-500 font-semibold text-[11px]">
                <th className={`py-3 px-5 ${isRTL ? 'text-right' : 'text-left'} whitespace-nowrap`}>
                  {t('contracts.room_type', 'نوع الغرفة')}
                </th>
                <th className="py-3 px-4 text-center whitespace-nowrap">
                  {t('contracts.room_capacity', 'سعة الغرفة')}
                </th>
                <th className="py-3 px-4 text-center whitespace-nowrap">
                  {t('contracts.room_size', 'حجم الغرفة')}
                </th>
                <th className={`py-3 px-5 ${isRTL ? 'text-left' : 'text-right'} whitespace-nowrap`}>
                  {t('contracts.room_count', 'العدد المطلوب')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {rooms.map((room, idx) => (
                <tr key={idx} className="hover:bg-slate-50/40 transition">
                  <td className={`py-3.5 px-5 font-bold text-slate-900 ${isRTL ? 'text-right' : 'text-left'} whitespace-nowrap`}>
                    {room.type}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-center whitespace-nowrap">
                    {toEasternArabic(room.capacity)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-center whitespace-nowrap">
                    {toEasternArabic(room.size)}
                  </td>
                  <td className={`py-3.5 px-5 font-bold text-slate-900 ${isRTL ? 'text-left' : 'text-right'} whitespace-nowrap`}>
                    {toEasternArabic(room.count)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Terms & Conditions */}
      <div className="my-5 space-y-1.5">
        <h4 className="text-xs font-bold text-slate-900">
          {t('contracts.terms_title', 'الشروط والأحكام العامة للاتفاقية:')}
        </h4>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          {t('contracts.terms_text', 'يقر الطرفان بصحة البيانات المذكورة أعلاه والالتزام الكامل ببنود العقد التشغيلي لخدمات الإسكان والضيافة، تشمل هذه الاتفاقية توفير الخدمات المتفق عليها طوال فترة الإقامة المحددة دون أي تعديل في الأسعار إلا بموافقة خطية مسبقة من الطرفين.')}
        </p>
      </div>

      {/* 7. Signatures Section (2 Boxes) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {/* Box 1: الطرف الأول */}
        <div className="border border-slate-200/90 rounded-xl p-4 bg-white shadow-2xs space-y-3">
          <div className="text-center font-bold text-xs sm:text-sm text-slate-900 border-b border-slate-100 pb-2">
            {t('contracts.party_first', 'الطرف الأول (الشركة الرئيسية للخدمات)')}
          </div>
          <div className="space-y-2.5 text-xs text-slate-600 pt-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-500">{t('contracts.sig_name', 'الاسم:')}</span>
              <span className="text-slate-300 font-mono tracking-widest text-[10px]">
                ....................................
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-500">{t('contracts.sig_signature', 'التوقيع:')}</span>
              <span className="text-slate-300 font-mono tracking-widest text-[10px]">
                ....................................
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-500">{t('contracts.sig_date', 'التاريخ:')}</span>
              <span className="text-slate-400 text-xs font-medium whitespace-pre" dir="ltr">
                /   /   2026
              </span>
            </div>
          </div>
        </div>

        {/* Box 2: الطرف الثاني */}
        <div className="border border-slate-200/90 rounded-xl p-4 bg-white shadow-2xs space-y-3">
          <div className="text-center font-bold text-xs sm:text-sm text-slate-900 border-b border-slate-100 pb-2">
            {t('contracts.party_second', 'الطرف الثاني (إدارة الفندق والمفوض بالتوقيع)')}
          </div>
          <div className="space-y-2.5 text-xs text-slate-600 pt-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-500">{t('contracts.sig_name', 'الاسم:')}</span>
              <span className="text-slate-300 font-mono tracking-widest text-[10px]">
                ....................................
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-500">{t('contracts.sig_signature', 'التوقيع:')}</span>
              <span className="text-slate-300 font-mono tracking-widest text-[10px]">
                ....................................
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-500">{t('contracts.sig_date', 'التاريخ:')}</span>
              <span className="text-slate-400 text-xs font-medium whitespace-pre" dir="ltr">
                /   /   2026
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 8. Footer Meta Bar */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
        <div>{t('contracts.doc_number_label', 'وثيقة رقم:')} {documentNumber}</div>
        <div>2026 - {t('contracts.all_rights_reserved', 'جميع الحقوق محفوظة © ODST Group')}</div>
        <div>{t('contracts.page_number_label', 'الصفحة ١ من ١')}</div>
      </div>
    </div>
  );
}
