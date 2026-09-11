import { useState, useRef } from 'react';
import { X, AlertTriangle, Check, ChevronDown } from 'lucide-react';
import type { TransportCompany } from './TransportDetailsModal';
import { useLanguage } from '../../context/LanguageContext';

// Fleet sample thumbnails cropped directly from user mockup
import fleetThumb1 from '../../assets/fleet_vehicles/fleet_thumb_1.png';
import fleetThumb2 from '../../assets/fleet_vehicles/fleet_thumb_2.png';
import fleetThumb3 from '../../assets/fleet_vehicles/fleet_thumb_3.png';

interface VehiclePriceRow {
  id: string;
  type: string;
  capacity: string;
  price: number;
  status: string;
}

interface AddTransportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newCompany: TransportCompany) => void;
}

export default function AddTransportModal({
  isOpen,
  onClose,
  onSuccess,
}: AddTransportModalProps) {
  const { t, isRTL, direction } = useLanguage();

  // Form Fields matching user mockup 1:1 with realistic pre-filled values
  const [name, setName] = useState('');
  const [region, setRegion] = useState(isRTL ? 'مكة المكرمة' : 'Makkah');
  const [phone, setPhone] = useState('+966 50 4567 123');
  const [email, setEmail] = useState('info@alharmain.com');
  const [address, setAddress] = useState('');

  // Default pricing rows
  const [pricingRows, setPricingRows] = useState<VehiclePriceRow[]>([
    { id: '1', type: isRTL ? 'حافلة عادية' : 'Standard Bus', capacity: isRTL ? '45 راكب' : '45 Passengers', price: 350, status: isRTL ? 'متاح' : 'Available' },
    { id: '2', type: isRTL ? 'حافلة VIP' : 'VIP Luxury Bus', capacity: isRTL ? '30 راكب' : '30 Passengers', price: 600, status: isRTL ? 'متاح' : 'Available' },
    { id: '3', type: isRTL ? 'كوستر (حافلة صغيرة)' : 'Coaster Mini Bus', capacity: isRTL ? '25 راكب' : '25 Passengers', price: 250, status: isRTL ? 'متاح' : 'Available' },
    { id: '4', type: isRTL ? 'سيدان' : 'Sedan Car', capacity: isRTL ? '4 ركاب' : '4 Passengers', price: 150, status: isRTL ? 'متاح' : 'Available' },
  ]);

  const [isAddRowOpen, setIsAddRowOpen] = useState(false);
  const [newRowType, setNewRowType] = useState('');
  const [newRowCapacity, setNewRowCapacity] = useState('');
  const [newRowPrice, setNewRowPrice] = useState('400');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    fleetThumb1,
    fleetThumb2,
    fleetThumb3,
  ]);

  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const urls = Array.from(e.target.files).map((f) => URL.createObjectURL(f));
      setUploadedImages((prev) => [...prev, ...urls]);
    }
  };

  const handleAddVehicleRow = () => {
    setIsAddRowOpen(true);
  };

  const handleSaveNewRow = () => {
    if (!newRowType.trim()) return;
    const newRow: VehiclePriceRow = {
      id: Date.now().toString(),
      type: newRowType.trim(),
      capacity: newRowCapacity.trim() || (isRTL ? '30 راكب' : '30 Passengers'),
      price: parseInt(newRowPrice) || 300,
      status: isRTL ? 'متاح' : 'Available',
    };
    setPricingRows((prev) => [...prev, newRow]);
    setIsAddRowOpen(false);
    setNewRowType('');
    setNewRowCapacity('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || (isRTL ? 'نقل الحرمين السريع' : 'Haramain Express Transport');
    const finalPhone = phone.trim() || '+966 50 4567 123';

    const newCompany: TransportCompany = {
      id: Date.now().toString(),
      name: finalName,
      region: region || (isRTL ? 'مكة المكرمة' : 'Makkah'),
      status: 'متاح',
      fleetSize: pricingRows.length * 5,
      fleetLabel: isRTL ? `${pricingRows.length * 5} مركبة` : `${pricingRows.length * 5} Vehicles`,
      phone: finalPhone,
      rating: 5.0,
      vehicleCategory: isRTL ? 'حافلات وفانات نقل معتمرين وحجاج' : 'Pilgrim Buses & Transport Vans',
      image: uploadedImages[0] || fleetThumb1,
    };

    onSuccess(newCompany);
    setIsSuccessOpen(true);
  };

  const handleDoneSuccess = () => {
    setIsSuccessOpen(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white rounded-2xl max-w-[620px] w-full shadow-2xl relative border border-slate-100 flex flex-col justify-between max-h-[96vh] overflow-hidden"
        dir={direction}
      >
        {/* Header */}
        <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <h2 className="text-base sm:text-lg font-bold text-[#0f172a] tracking-tight">
            {t('transport.add_company_btn', 'إضافة شركة جديدة')}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* ١. معلومات الشركة */}
          <div className="space-y-2.5">
            <h3 className="text-xs sm:text-sm font-bold text-[#0f172a] tracking-tight">
              {t('transport.step_company_info', '١. معلومات الشركة')}
            </h3>

            {/* Row 1: اسم الشركة & منطقة الخدمة */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Company Name */}
              <div className="space-y-1">
                <label className="block text-[11px] sm:text-xs font-semibold text-slate-700">
                  {t('transport.company_name', 'اسم الشركة')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isRTL ? 'مثال: نقل الحرمين السريع' : 'e.g. Haramain Express Transport'}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-slate-800 placeholder-slate-300 focus:outline-hidden focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] transition shadow-2xs"
                />
              </div>

              {/* Service Region */}
              <div className="space-y-1">
                <label className="block text-[11px] sm:text-xs font-semibold text-slate-700">
                  {t('transport.service_region', 'منطقة الخدمة')} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] transition cursor-pointer shadow-2xs"
                  >
                    <option value={isRTL ? 'مكة المكرمة' : 'Makkah'}>{isRTL ? 'مكة المكرمة' : 'Makkah'}</option>
                    <option value={isRTL ? 'المدينة المنورة' : 'Madinah'}>{isRTL ? 'المدينة المنورة' : 'Madinah'}</option>
                    <option value={isRTL ? 'جدة' : 'Jeddah'}>{isRTL ? 'جدة' : 'Jeddah'}</option>
                    <option value={isRTL ? 'الرياض' : 'Riyadh'}>{isRTL ? 'الرياض' : 'Riyadh'}</option>
                  </select>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 absolute ${isRTL ? 'left-2.5' : 'right-2.5'} top-1/2 -translate-y-1/2 pointer-events-none`} />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="block text-[11px] sm:text-xs font-semibold text-slate-700">
                  {t('common.phone', 'رقم الهاتف')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+966 50 4567 123"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-slate-800 placeholder-slate-300 focus:outline-hidden focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] transition shadow-2xs font-mono"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-[11px] sm:text-xs font-semibold text-slate-700">
                  {t('common.email', 'البريد الإلكتروني')}
                </label>
                <input
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@example.com"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-slate-800 placeholder-slate-300 focus:outline-hidden focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] transition shadow-2xs font-mono"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1">
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-700">
                {t('common.address', 'العنوان / الموقع')}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={isRTL ? 'مثال: حي المعابدة، مكة المكرمة' : 'e.g. Al-Maabda District, Makkah'}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-slate-800 placeholder-slate-300 focus:outline-hidden focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] transition shadow-2xs"
              />
            </div>
          </div>

          {/* ٢. صور الأسطول */}
          <div className="space-y-2.5">
            <h3 className="text-xs sm:text-sm font-bold text-[#0f172a] tracking-tight">
              {t('transport.step_fleet_images', '٢. صور الأسطول')}
            </h3>

            {/* Dashed Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-[#10b981] hover:border-[#059669] bg-white rounded-xl py-3.5 px-4 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1 group"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept="image/png, image/jpeg"
                className="hidden"
              />
              <svg
                className="w-6 h-6 text-[#16a34a] group-hover:scale-105 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
              <p className="text-xs font-bold text-[#16a34a]">
                {t('transport.dropzone_title', 'اسحب الصور هنا أو انقر للتحميل')}
              </p>
              <p className="text-[10px] text-slate-400 font-normal">
                {t('transport.dropzone_sub', 'الصيغ المدعومة: PNG, JPG (الحد الأقصى 5 ميجابايت)')}
              </p>
            </div>

            {/* Uploaded Thumbnail previews */}
            <div className="flex items-center justify-start gap-2 pt-1">
              {uploadedImages.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Fleet thumb ${idx + 1}`}
                  className="w-12 h-9 object-cover rounded-md border border-slate-200/90 shadow-2xs"
                />
              ))}
            </div>
          </div>

          {/* ٣. أسعار الرحلات لكل رحلة */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-bold text-[#0f172a] tracking-tight">
              {t('transport.step_pricing', '٣. أسعار الرحلات لكل رحلة')}
            </h3>

            <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white shadow-2xs">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/70 text-slate-700 font-semibold">
                    <th className="py-2 px-3.5 font-bold text-start">{t('transport.pricing_table_type', 'نوع المركبة')}</th>
                    <th className="py-2 px-3 text-center font-bold">{t('transport.pricing_table_cap', 'السعة')}</th>
                    <th className="py-2 px-3 text-center font-bold">{t('transport.pricing_table_price', 'السعر لكل رحلة (ر.س)')}</th>
                    <th className="py-2 px-3.5 text-center font-bold">{t('transport.pricing_table_status', 'الحالة')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {pricingRows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/40 transition">
                      <td className="py-2 px-3.5 font-bold text-slate-900">{row.type}</td>
                      <td className="py-2 px-3 text-center text-slate-600 font-medium">
                        {row.capacity}
                      </td>
                      <td className="py-2 px-3 text-center font-bold text-[#16a34a]">
                        {row.price} {t('common.currency', 'ر.س')}
                      </td>
                      <td className="py-2 px-3.5 text-center font-medium text-[#16a34a]">
                        {row.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {isAddRowOpen ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-wrap items-center gap-2 animate-fadeIn text-xs">
                <input
                  type="text"
                  placeholder={isRTL ? 'نوع المركبة' : 'Vehicle Type'}
                  value={newRowType}
                  onChange={(e) => setNewRowType(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 flex-1 min-w-[110px]"
                />
                <input
                  type="text"
                  placeholder={isRTL ? 'السعة (مثال: 30 راكب)' : 'Capacity (e.g. 30 Pax)'}
                  value={newRowCapacity}
                  onChange={(e) => setNewRowCapacity(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 w-32"
                />
                <input
                  type="number"
                  placeholder={isRTL ? 'السعر ر.س' : 'Price SAR'}
                  value={newRowPrice}
                  onChange={(e) => setNewRowPrice(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 w-24"
                />
                <button
                  type="button"
                  onClick={handleSaveNewRow}
                  className="bg-[#16a34a] hover:bg-[#15803d] text-white font-bold px-3 py-1 rounded-lg text-xs cursor-pointer"
                >
                  {t('common.add', 'إضافة')}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddRowOpen(false)}
                  className="border border-slate-200 bg-white text-slate-600 px-3 py-1 rounded-lg text-xs cursor-pointer"
                >
                  {t('common.cancel', 'إلغاء')}
                </button>
              </div>
            ) : (
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleAddVehicleRow}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#16a34a] hover:text-[#15803d] transition cursor-pointer"
                >
                  <span>{t('transport.add_row_btn', '+ اضافة مركبة')}</span>
                </button>
              </div>
            )}
          </div>
        </form>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between bg-white shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium px-5 py-1.5 rounded-lg text-xs sm:text-sm transition shadow-2xs cursor-pointer"
          >
            {t('common.cancel', 'إلغاء')}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="bg-[#16a34a] hover:bg-[#15803d] text-white font-bold px-5 py-1.5 rounded-lg text-xs sm:text-sm transition shadow-xs cursor-pointer active:scale-95"
          >
            {t('transport.save_add_company', 'حفظ وإضافة الشركة')}
          </button>
        </div>
      </div>

      {/* Success Dialog */}
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
                {t('common.success', 'تم بنجاح!')}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                {t('transport.save_company_success', 'تم حفظ وإدراج شركة النقل بنجاح')}
              </p>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={handleDoneSuccess}
                className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-bold py-3 px-8 rounded-xl transition shadow-xs text-sm sm:text-base cursor-pointer active:scale-95"
              >
                {t('common.close', 'حسناً')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warning Dialog */}
      {warningMessage && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-[370px] sm:max-w-[400px] w-full shadow-2xl text-center space-y-5 border border-slate-100 animate-scaleUp"
            dir={direction}
          >
            <div className="w-20 h-20 rounded-full bg-[#fef3c7] mx-auto flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-[#f59e0b] stroke-[2.2]" />
            </div>

            <div className="space-y-1.5 pt-1">
              <h3 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight">
                {isRTL ? 'تنبيه' : 'Warning'}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                {warningMessage}
              </p>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={() => setWarningMessage(null)}
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

