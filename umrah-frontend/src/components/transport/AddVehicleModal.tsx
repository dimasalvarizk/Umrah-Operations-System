import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle, Check, ChevronDown, Plus, ListFilter, PenLine } from 'lucide-react';
import type { VehicleItem } from './CompanyFleetView';
import { useLanguage } from '../../context/LanguageContext';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: VehicleItem | null;
  companyPhotos?: string[];
  companyPricingRows?: any[];
  existingVehicles?: VehicleItem[];
  onSuccess: (vehicle: VehicleItem) => void;
}

export default function AddVehicleModal({
  isOpen,
  onClose,
  initialData,
  companyPhotos = [],
  companyPricingRows = [],
  existingVehicles = [],
  onSuccess,
}: AddVehicleModalProps) {
  const { t, isRTL, direction } = useLanguage();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(initialData?.name || (isRTL ? 'حافلة VIP' : 'VIP Luxury Bus'));
  const [isCustomType, setIsCustomType] = useState(false);
  const [capacity, setCapacity] = useState(initialData?.capacity || (isRTL ? '30 راكب' : '30 Passengers'));
  const [plateNumber, setPlateNumber] = useState(initialData?.plateNumber || '');
  const [status, setStatus] = useState(initialData?.status || 'متاح');
  const [pricePerTrip, setPricePerTrip] = useState(initialData?.pricePerTrip?.toString() || '350');
  const [selectedPhoto, setSelectedPhoto] = useState<string>(initialData?.image || companyPhotos[0] || '');
  const [customPhotos, setCustomPhotos] = useState<string[]>([]);

  // Predefined Standard Vehicle Types
  const standardTypes = isRTL
    ? ['حافلة VIP', 'حافلة عادية', 'كوستر', 'سيدان']
    : ['VIP Luxury Bus', 'Standard Bus', 'Coaster Mini Bus', 'Sedan Car'];

  // Collect custom types from pricing rows and existing fleet
  const customOptionsFromCompany = Array.from(
    new Set([
      ...(companyPricingRows || []).map((r) => r?.type),
      ...(existingVehicles || []).flatMap((v) => [v?.name, v?.type]),
    ].filter(Boolean))
  ).filter(
    (item) =>
      !standardTypes.includes(item) &&
      !['حافلة VIP', 'حافلة عادية', 'كوستر', 'سيدان', 'VIP Luxury Bus', 'Standard Bus', 'Coaster Mini Bus', 'Sedan Car'].includes(item)
  );

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCapacity(initialData.capacity);
      setPlateNumber(initialData.plateNumber);
      setStatus(initialData.status);
      setPricePerTrip(initialData.pricePerTrip?.toString() || '350');
      setSelectedPhoto(initialData.image || companyPhotos[0] || '');
      setCustomPhotos([]);
      const isKnown = [...standardTypes, ...customOptionsFromCompany].includes(initialData.name);
      setIsCustomType(!isKnown && !!initialData.name);
    } else {
      const defaultName = isRTL ? 'حافلة VIP' : 'VIP Luxury Bus';
      setName(defaultName);
      setCapacity(isRTL ? '30 راكب' : '30 Passengers');
      setPlateNumber('');
      setStatus('متاح');
      setPricePerTrip('600');
      setSelectedPhoto(companyPhotos[0] || '');
      setCustomPhotos([]);
      setIsCustomType(false);
    }
  }, [initialData, companyPhotos, isRTL, isOpen]);

  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  if (!isOpen) return null;

  const handleSelectVehicleType = (typeName: string) => {
    if (typeName === '__CUSTOM__') {
      setIsCustomType(true);
      setName('');
      return;
    }

    setIsCustomType(false);
    setName(typeName);

    // Auto-fill standard capacities & prices
    if (typeName === 'حافلة VIP' || typeName === 'VIP Luxury Bus') {
      setCapacity(isRTL ? '30 راكب' : '30 Passengers');
      setPricePerTrip('600');
    } else if (typeName === 'حافلة عادية' || typeName === 'Standard Bus') {
      setCapacity(isRTL ? '49 راكب' : '49 Passengers');
      setPricePerTrip('450');
    } else if (typeName === 'كوستر' || typeName === 'Coaster Mini Bus') {
      setCapacity(isRTL ? '22 راكب' : '22 Passengers');
      setPricePerTrip('350');
    } else if (typeName === 'سيدان' || typeName === 'Sedan Car') {
      setCapacity(isRTL ? '4 ركاب' : '4 Passengers');
      setPricePerTrip('150');
    } else {
      // Check if found in companyPricingRows or existingVehicles to auto fill its configured capacity/price
      const matchedRow = companyPricingRows?.find((r) => r.type === typeName);
      if (matchedRow) {
        if (matchedRow.capacity) setCapacity(matchedRow.capacity);
        if (matchedRow.price) setPricePerTrip(matchedRow.price.toString());
      } else {
        const matchedVehicle = existingVehicles?.find((v) => v.name === typeName || v.type === typeName);
        if (matchedVehicle) {
          if (matchedVehicle.capacity) setCapacity(matchedVehicle.capacity);
          if (matchedVehicle.pricePerTrip) setPricePerTrip(matchedVehicle.pricePerTrip.toString());
        }
      }
    }
  };

  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setWarningMessage(isRTL ? 'يرجى اختيار ملف صورة صالح (PNG, JPG)' : 'Please select a valid image file (PNG, JPG)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setWarningMessage(isRTL ? 'حجم الصورة يتجاوز الحد الأقصى (5 ميجابايت)' : 'Image file size exceeds 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        const dataUrl = ev.target.result as string;
        setCustomPhotos((prev) => [dataUrl, ...prev.filter((p) => p !== dataUrl)]);
        setSelectedPhoto(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    if (e.target) e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setWarningMessage(isRTL ? 'يرجى إدخال أو تحديد نوع المركبة' : 'Please enter or select vehicle type');
      return;
    }
    if (!plateNumber.trim()) {
      setWarningMessage(isRTL ? 'يرجى إدخال رقم اللوحة للمركبة' : 'Please enter vehicle plate number');
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleConfirmSave = () => {
    const savedVehicle: VehicleItem = {
      id: initialData?.id || Date.now().toString(),
      name: name.trim(),
      type: name.trim(),
      capacity: capacity.trim(),
      plateNumber: plateNumber.trim(),
      status: status as VehicleItem['status'],
      pricePerTrip: parseFloat(pricePerTrip) || 350,
      image: selectedPhoto || initialData?.image || '',
    };

    onSuccess(savedVehicle);
    setIsConfirmOpen(false);
    setIsSuccessOpen(true);
  };

  const handleDoneSuccess = () => {
    setIsSuccessOpen(false);
    onClose();
  };

  // Combine company photos and newly uploaded photos without duplicates
  const allPhotoOptions = Array.from(
    new Set([
      ...customPhotos,
      ...(companyPhotos || []),
      ...(initialData?.image ? [initialData.image] : []),
    ].filter(Boolean))
  );

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/30 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl relative border border-slate-100 flex flex-col justify-between max-h-[92vh] overflow-hidden animate-scaleUp"
        dir={direction}
      >
        {/* Header */}
        <div className="px-6 sm:px-8 py-4 border-b border-slate-200/80 flex items-center justify-between bg-white shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] tracking-tight">
            {initialData
              ? (isRTL ? 'تعديل بيانات المركبة ورقم اللوحة' : 'Edit Vehicle & Plate Number')
              : t('transport.add_vehicle_btn', 'إضافة مركبة للأسطول')}
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
          {/* Vehicle Type (Dropdown or Custom Input) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                {t('transport.vehicle_type', 'نوع وتصنيف المركبة')} <span className="text-rose-500">*</span>
              </label>
              {isCustomType ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomType(false);
                    setName(standardTypes[0]);
                    handleSelectVehicleType(standardTypes[0]);
                  }}
                  className="text-xs text-[#00c48c] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  <span>{isRTL ? 'اختر من القائمة' : 'Select from List'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomType(true);
                    setName('');
                  }}
                  className="text-xs text-slate-500 hover:text-[#00c48c] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <PenLine className="w-3.5 h-3.5" />
                  <span>{isRTL ? 'كتابة نوع مخصص...' : 'Type custom type...'}</span>
                </button>
              )}
            </div>

            {isCustomType ? (
              <div className="relative">
                <input
                  type="text"
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isRTL ? 'اكتب نوع المركبة (مثال: جي إم سي يوكن / تويوتا هايس)' : 'Enter vehicle type (e.g. GMC Yukon, HiAce)'}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-[#00c48c] transition shadow-2xs"
                />
              </div>
            ) : (
              <div className="relative">
                <select
                  value={name}
                  onChange={(e) => handleSelectVehicleType(e.target.value)}
                  className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 bg-white focus:outline-hidden focus:border-[#00c48c] transition cursor-pointer"
                >
                  {/* Standard Categories */}
                  <optgroup label={isRTL ? 'الفئات الرئيسية' : 'Standard Categories'}>
                    <option value={isRTL ? 'حافلة VIP' : 'VIP Luxury Bus'}>{t('transport.vip_bus', 'حافلة VIP')}</option>
                    <option value={isRTL ? 'حافلة عادية' : 'Standard Bus'}>{t('transport.regular_bus', 'حافلة عادية')}</option>
                    <option value={isRTL ? 'كوستر' : 'Coaster Mini Bus'}>{t('transport.coaster', 'كوستر')}</option>
                    <option value={isRTL ? 'سيدان' : 'Sedan Car'}>{t('transport.sedan', 'سيدان')}</option>
                  </optgroup>

                  {/* Custom Vehicle Types from Company's Pricing/Fleet */}
                  {customOptionsFromCompany.length > 0 && (
                    <optgroup label={isRTL ? 'أنواع إضافية مسجلة للشركة' : 'Registered Company Vehicle Types'}>
                      {customOptionsFromCompany.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </optgroup>
                  )}

                  {/* Option to enter custom */}
                  <optgroup label={isRTL ? 'إدخال مخصص' : 'Custom Input'}>
                    <option value="__CUSTOM__">
                      {isRTL ? '+ نوع مخصص (كتابة يدوية)...' : '+ Custom / Type Custom...'}
                    </option>
                  </optgroup>
                </select>
                <ChevronDown className={`w-4 h-4 text-slate-400 absolute ${isRTL ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 pointer-events-none`} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Plate Number */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                {t('transport.plate_number', 'رقم اللوحة')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                dir="ltr"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                placeholder={isRTL ? 'أ ب ج - ١٢٣٤' : 'ABC - 1234'}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono text-slate-800 text-left focus:outline-hidden focus:border-[#00c48c] transition"
              />
            </div>

            {/* Passenger Capacity */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                {t('transport.capacity_label', 'السعة الاستيعابية للركاب')}
              </label>
              <input
                type="text"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder={isRTL ? '٣٠ راكب' : '30 Passengers'}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-[#00c48c] transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Price Per Trip */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                {t('transport.price_per_trip_label', 'السعر لكل رحلة (ر.س)')}
              </label>
              <div className="relative">
                <input
                  type="number"
                  dir="ltr"
                  value={pricePerTrip}
                  onChange={(e) => setPricePerTrip(e.target.value)}
                  placeholder="350"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono text-slate-800 text-left focus:outline-hidden focus:border-[#00c48c] transition"
                />
              </div>
            </div>

            {/* Vehicle Status */}
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                {t('transport.vehicle_status', 'حالة المركبة')}
              </label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as VehicleItem['status'])}
                  className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 bg-white focus:outline-hidden focus:border-[#00c48c] transition cursor-pointer"
                >
                  <option value="متاح">{t('common.available', 'متاح')}</option>
                  <option value="تحت الصيانة">{t('common.maintenance', 'تحت الصيانة')}</option>
                  <option value="محجوز">{isRTL ? 'محجوز' : 'Reserved'}</option>
                </select>
                <ChevronDown className={`w-4 h-4 text-slate-400 absolute ${isRTL ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 pointer-events-none`} />
              </div>
            </div>
          </div>

          {/* Photo Selection / Upload */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                {isRTL ? 'صورة المركبة' : 'Select or Upload Vehicle Photo'}
              </label>
              {selectedPhoto && (
                <span className="text-[11px] font-medium text-emerald-600">
                  {isRTL ? '✓ تم تحديد صورة' : '✓ Photo Selected'}
                </span>
              )}
            </div>

            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/jpg"
              onChange={handleUploadPhoto}
              className="hidden"
            />

            <div className="grid grid-cols-4 gap-2.5">
              {/* Upload New Custom Photo Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-16 rounded-xl border-2 border-dashed border-emerald-400 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50/80 transition flex flex-col items-center justify-center gap-1 text-emerald-700 cursor-pointer group shadow-2xs"
              >
                <Plus className="w-5 h-5 text-emerald-600 group-hover:scale-115 transition-transform stroke-[2.5]" />
                <span className="text-[10px] font-bold">
                  {isRTL ? 'رفع صورة' : 'Upload'}
                </span>
              </button>

              {/* Existing & Uploaded Photos */}
              {allPhotoOptions.map((photoUrl, idx) => {
                const isSelected = selectedPhoto === photoUrl;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedPhoto(photoUrl)}
                    className={`relative rounded-xl overflow-hidden h-16 border-2 cursor-pointer transition group ${
                      isSelected
                        ? 'border-[#00c48c] ring-2 ring-[#00c48c]/30 scale-102 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={photoUrl} alt="Vehicle" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-[#00c48c] rounded-full flex items-center justify-center shadow-xs">
                        <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
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
              {initialData
                ? t('common.save', 'حفظ التعديلات')
                : t('transport.add_vehicle', 'إضافة مركبة')}
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
                {isRTL ? 'هل أنت متأكد؟' : 'Are you sure?'}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                {initialData
                  ? (isRTL ? 'هل تريد حفظ التعديلات على هذه المركبة؟' : 'Do you want to save changes to this vehicle?')
                  : (isRTL ? 'هل تريد إضافة وحفظ هذه المركبة في الأسطول؟' : 'Do you want to add and save this vehicle to the fleet?')}
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
                {initialData
                  ? (isRTL ? 'تم حفظ وتحديث بيانات المركبة ورقم اللوحة بنجاح.' : 'Vehicle details and plate number updated successfully.')
                  : t('transport.save_vehicle_success', 'تمت إضافة المركبة إلى الأسطول بنجاح')}
              </p>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={handleDoneSuccess}
                className="w-full bg-[#00c48c] hover:bg-[#00b07d] text-white font-bold py-3 px-8 rounded-xl transition shadow-xs text-sm sm:text-base cursor-pointer active:scale-95"
              >
                {t('common.close', 'حسناً')}
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
