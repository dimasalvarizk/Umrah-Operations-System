import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle, Check, ChevronDown, Trash2, SquarePen, Plus, Star, ListFilter, PenLine } from 'lucide-react';
import type { TransportCompany } from './TransportDetailsModal';
import { useLanguage } from '../../context/LanguageContext';

export interface VehiclePriceRow {
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

  // Form Fields - Clean initial state without dummy data
  const [name, setName] = useState('');
  const [region, setRegion] = useState(isRTL ? 'مكة المكرمة' : 'Makkah');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [rating, setRating] = useState<number>(5.0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Clean initial pricing rows
  const [pricingRows, setPricingRows] = useState<VehiclePriceRow[]>([]);

  // Add Vehicle Form State
  const [isAddRowOpen, setIsAddRowOpen] = useState(false);
  const [newRowType, setNewRowType] = useState('');
  const [newRowIsCustomType, setNewRowIsCustomType] = useState(false);
  const [newRowCapacity, setNewRowCapacity] = useState('');
  const [newRowPrice, setNewRowPrice] = useState('300');
  const [newRowStatus, setNewRowStatus] = useState(isRTL ? 'متاح' : 'Available');

  // Edit Vehicle Row State
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editRowType, setEditRowType] = useState('');
  const [editRowIsCustomType, setEditRowIsCustomType] = useState(false);
  const [editRowCapacity, setEditRowCapacity] = useState('');
  const [editRowPrice, setEditRowPrice] = useState('');
  const [editRowStatus, setEditRowStatus] = useState('');

  // Fleet Photos & Drag/Drop State - Starts empty as requested
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  // Reset form whenever modal opens or language changes
  useEffect(() => {
    if (isOpen) {
      setName('');
      setRegion(isRTL ? 'مكة المكرمة' : 'Makkah');
      setPhone('');
      setEmail('');
      setAddress('');
      setRating(5.0);
      setHoverRating(null);
      setPricingRows([]);
      setUploadedImages([]);
      setIsAddRowOpen(false);
      setNewRowType(isRTL ? 'حافلة VIP' : 'VIP Luxury Bus');
      setNewRowIsCustomType(false);
      setNewRowCapacity(isRTL ? '30 راكب' : '30 Passengers');
      setNewRowPrice('600');
      setNewRowStatus(isRTL ? 'متاح' : 'Available');
      setEditingRowId(null);
      setEditRowType('');
      setEditRowIsCustomType(false);
      setEditRowCapacity('');
      setEditRowPrice('');
      setEditRowStatus('');
      setWarningMessage(null);
      setIsSuccessOpen(false);
    }
  }, [isOpen, isRTL]);

  if (!isOpen) return null;

  // Process selected or dropped image files
  const processFiles = (files: FileList | File[]) => {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setWarningMessage(isRTL ? 'يرجى تحميل ملفات صور بصيغة PNG أو JPG فقط' : 'Please upload PNG or JPG images only');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setWarningMessage(isRTL ? 'حجم الصورة يتجاوز الحد الأقصى (5 ميجابايت)' : 'Image file size exceeds 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedImages((prev) => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    if (e.target) e.target.value = '';
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Add Vehicle Handlers
  const handleOpenAddRow = () => {
    setIsAddRowOpen(true);
    setEditingRowId(null);
    setNewRowIsCustomType(false);
    const defaultType = isRTL ? 'حافلة VIP' : 'VIP Luxury Bus';
    setNewRowType(defaultType);
    setNewRowCapacity(isRTL ? '30 راكب' : '30 Passengers');
    setNewRowPrice('600');
    setNewRowStatus(isRTL ? 'متاح' : 'Available');
  };

  const handleSelectVehicleType = (typeVal: string) => {
    if (typeVal === '__CUSTOM__') {
      setNewRowIsCustomType(true);
      setNewRowType('');
      return;
    }
    setNewRowIsCustomType(false);
    setNewRowType(typeVal);
    if (typeVal === 'حافلة VIP' || typeVal === 'VIP Luxury Bus') {
      setNewRowCapacity(isRTL ? '30 راكب' : '30 Passengers');
      setNewRowPrice('600');
    } else if (typeVal === 'حافلة عادية' || typeVal === 'Standard Bus') {
      setNewRowCapacity(isRTL ? '49 راكب' : '49 Passengers');
      setNewRowPrice('450');
    } else if (typeVal === 'كوستر' || typeVal === 'Coaster Mini Bus') {
      setNewRowCapacity(isRTL ? '22 راكب' : '22 Passengers');
      setNewRowPrice('350');
    } else if (typeVal === 'سيدان' || typeVal === 'Sedan Car') {
      setNewRowCapacity(isRTL ? '4 ركاب' : '4 Passengers');
      setNewRowPrice('150');
    }
  };

  const handleSaveNewRow = () => {
    if (!newRowType.trim()) {
      setWarningMessage(isRTL ? 'يرجى تحديد أو كتابة نوع المركبة' : 'Please select or type vehicle type');
      return;
    }
    const newRow: VehiclePriceRow = {
      id: Date.now().toString(),
      type: newRowType.trim(),
      capacity: newRowCapacity.trim() || (isRTL ? '30 راكب' : '30 Passengers'),
      price: parseInt(newRowPrice, 10) || 300,
      status: newRowStatus || (isRTL ? 'متاح' : 'Available'),
    };
    setPricingRows((prev) => [...prev, newRow]);
    setIsAddRowOpen(false);
  };

  // Edit Vehicle Handlers
  const handleStartEditRow = (row: VehiclePriceRow) => {
    setEditingRowId(row.id);
    setEditRowType(row.type);
    setEditRowCapacity(row.capacity);
    setEditRowPrice(row.price.toString());
    setEditRowStatus(row.status);
    const standardTypes = isRTL
      ? ['حافلة VIP', 'حافلة عادية', 'كوستر', 'سيدان']
      : ['VIP Luxury Bus', 'Standard Bus', 'Coaster Mini Bus', 'Sedan Car'];
    setEditRowIsCustomType(!standardTypes.includes(row.type));
    setIsAddRowOpen(false);
  };

  const handleSaveEditRow = (rowId: string) => {
    if (!editRowType.trim()) {
      setWarningMessage(isRTL ? 'يرجى كتابة أو تحديد نوع المركبة' : 'Please enter or select vehicle type');
      return;
    }
    setPricingRows((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? {
              ...row,
              type: editRowType.trim(),
              capacity: editRowCapacity.trim() || row.capacity,
              price: parseInt(editRowPrice, 10) || row.price,
              status: editRowStatus || row.status,
            }
          : row
      )
    );
    setEditingRowId(null);
  };

  const handleCancelEditRow = () => {
    setEditingRowId(null);
  };

  // Delete Vehicle Handler
  const handleDeleteRow = (rowId: string) => {
    setPricingRows((prev) => prev.filter((row) => row.id !== rowId));
    if (editingRowId === rowId) {
      setEditingRowId(null);
    }
  };

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setWarningMessage(isRTL ? 'يرجى إدخال اسم شركة النقل' : 'Please enter the company name');
      return;
    }
    const finalName = name.trim();
    const finalPhone = phone.trim();
    const finalEmail = email.trim();
    const finalAddress = address.trim();

    const totalFleet = pricingRows.length > 0 ? pricingRows.length * 5 : 0;

    const newCompany: TransportCompany = {
      id: Date.now().toString(),
      name: finalName,
      nameEn: finalName,
      region: region || (isRTL ? 'مكة المكرمة' : 'Makkah'),
      status: 'متاح',
      fleetSize: totalFleet,
      fleetLabel: isRTL ? `${totalFleet} مركبة` : `${totalFleet} Vehicles`,
      phone: finalPhone,
      email: finalEmail,
      address: finalAddress,
      rating: Number(rating) || 5.0,
      vehicleCategory: isRTL ? 'حافلات وفانات نقل معتمرين وحجاج' : 'Pilgrim Buses & Transport Vans',
      image: uploadedImages[0] || '',
      photos: uploadedImages,
      pricingRows: pricingRows,
    };

    onSuccess(newCompany);
    setIsSuccessOpen(true);
  };

  const handleDoneSuccess = () => {
    setIsSuccessOpen(false);
    onClose();
  };

  const getStatusColor = (status: string) => {
    if (status === 'متاح' || status === 'Available') {
      return 'text-[#16a34a] bg-emerald-50 border border-emerald-200';
    }
    if (status === 'تحت الصيانة' || status === 'Maintenance' || status === 'Under Maintenance') {
      return 'text-[#b45309] bg-amber-50 border border-amber-200';
    }
    return 'text-[#e11d48] bg-rose-50 border border-rose-200';
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/30 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl relative border border-slate-100 flex flex-col justify-between max-h-[92vh] overflow-hidden animate-scaleUp"
        dir={direction}
      >
        {/* Header */}
        <div className="px-6 sm:px-8 py-4 border-b border-slate-200/80 flex items-center justify-between bg-white shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] tracking-tight">
            {t('transport.add_company_title', 'إضافة شركة نقل جديدة')}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          {/* ١. معلومات الشركة */}
          <div className="space-y-3">
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
                  placeholder={isRTL ? 'أدخل اسم الشركة' : 'Enter company name'}
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
                  placeholder="+966 5x xxx xxxx"
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
                  placeholder="company@domain.com"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-slate-800 placeholder-slate-300 focus:outline-hidden focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] transition shadow-2xs font-mono"
                />
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
                  placeholder={isRTL ? 'أدخل عنوان الشركة' : 'Enter company address'}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-slate-800 placeholder-slate-300 focus:outline-hidden focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] transition shadow-2xs"
                />
              </div>

              {/* Company Rating (Stars) */}
              <div className="space-y-1">
                <label className="block text-[11px] sm:text-xs font-semibold text-slate-700">
                  {t('transport.company_rating', 'تقييم الشركة (النجوم)')}
                </label>
                <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5 h-[34px]">
                  <div className="flex items-center gap-1.5" dir="ltr">
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
                          className="p-0.5 hover:scale-120 transition-transform cursor-pointer focus:outline-hidden group"
                          title={`${starVal}.0 / 5.0`}
                        >
                          <Star
                            className={`w-4 h-4 transition-colors ${
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
          </div>

          {/* ٢. صور الأسطول */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-[#0f172a] tracking-tight">
                {t('transport.step_fleet_images', '٢. صور الأسطول')}
              </h3>
              {uploadedImages.length > 0 && (
                <span className="text-[11px] font-medium text-slate-400">
                  {uploadedImages.length} {isRTL ? 'صور محملة' : 'photos uploaded'}
                </span>
              )}
            </div>

            {/* Dashed Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl py-4 px-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 group ${
                isDragging
                  ? 'border-[#16a34a] bg-emerald-50/70 scale-[1.01]'
                  : 'border-[#10b981] hover:border-[#059669] bg-white hover:bg-slate-50/50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
              />
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-[#16a34a] group-hover:scale-110 transition-transform">
                <svg
                  className="w-5 h-5 text-[#16a34a]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <line x1="10" y1="9" x2="8" y2="9" />
                </svg>
              </div>
              <p className="text-xs font-bold text-[#16a34a]">
                {t('transport.dropzone_title', 'اسحب الصور هنا أو انقر للتحميل')}
              </p>
              <p className="text-[10px] text-slate-400 font-normal">
                {t('transport.dropzone_sub', 'الصيغ المدعومة: PNG, JPG (الحد الأقصى 5 ميجابايت)')}
              </p>
            </div>

            {/* Uploaded Thumbnail previews with Delete action */}
            {uploadedImages.length > 0 && (
              <div className="flex flex-wrap items-center justify-start gap-2.5 pt-1">
                {uploadedImages.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative group/thumb rounded-lg overflow-hidden border border-slate-200 shadow-2xs bg-slate-100"
                  >
                    <img
                      src={src}
                      alt={`Fleet thumb ${idx + 1}`}
                      className="w-14 h-10 object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePhoto(idx);
                      }}
                      className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center transition opacity-80 hover:opacity-100 cursor-pointer shadow-xs"
                      title={isRTL ? 'حذف الصورة' : 'Remove photo'}
                    >
                      <X className="w-2.5 h-2.5 stroke-[2.5]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ٣. أسعار الرحلات لكل رحلة */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-[#0f172a] tracking-tight">
                {t('transport.step_pricing', '٣. أسعار الرحلات لكل رحلة')}
              </h3>
              <span className="text-[11px] font-medium text-slate-400">
                {pricingRows.length} {isRTL ? 'مركبات مضافة' : 'vehicles added'}
              </span>
            </div>

            <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white shadow-2xs">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/80 text-slate-700 font-semibold">
                    <th className="py-2.5 px-3 font-bold text-start">{t('transport.pricing_table_type', 'نوع المركبة')}</th>
                    <th className="py-2.5 px-3 text-center font-bold">{t('transport.pricing_table_cap', 'السعة')}</th>
                    <th className="py-2.5 px-3 text-center font-bold">{t('transport.pricing_table_price', 'السعر لكل رحلة (ر.س)')}</th>
                    <th className="py-2.5 px-3 text-center font-bold">{t('transport.pricing_table_status', 'الحالة')}</th>
                    <th className="py-2.5 px-3 text-center font-bold w-16">{isRTL ? 'إجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {pricingRows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-400 text-xs">
                        {isRTL ? 'لا توجد أسعار مركبات مضافة بعد.' : 'No vehicle pricing rates added yet.'}
                      </td>
                    </tr>
                  ) : (
                    pricingRows.map((row) =>
                      editingRowId === row.id ? (
                        <tr key={row.id} className="bg-emerald-50/40">
                          <td className="p-2">
                            {editRowIsCustomType ? (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  autoFocus
                                  value={editRowType}
                                  onChange={(e) => setEditRowType(e.target.value)}
                                  placeholder={isRTL ? 'نوع المركبة المخصص' : 'Custom vehicle type'}
                                  className="w-full bg-white border border-emerald-400 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-bold focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditRowIsCustomType(false);
                                    setEditRowType(isRTL ? 'حافلة VIP' : 'VIP Luxury Bus');
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-emerald-600 bg-white border border-slate-200 rounded-lg hover:bg-emerald-50 transition cursor-pointer shrink-0"
                                  title={isRTL ? 'اختيار من القائمة' : 'Select from list'}
                                >
                                  <ListFilter className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <div className="relative flex-1">
                                  <select
                                    value={editRowType}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      if (val === '__CUSTOM__') {
                                        setEditRowIsCustomType(true);
                                        setEditRowType('');
                                        return;
                                      }
                                      setEditRowType(val);
                                      if (val === 'حافلة VIP' || val === 'VIP Luxury Bus') {
                                        setEditRowCapacity(isRTL ? '30 راكب' : '30 Passengers');
                                        setEditRowPrice('600');
                                      } else if (val === 'حافلة عادية' || val === 'Standard Bus') {
                                        setEditRowCapacity(isRTL ? '49 راكب' : '49 Passengers');
                                        setEditRowPrice('450');
                                      } else if (val === 'كوستر' || val === 'Coaster Mini Bus') {
                                        setEditRowCapacity(isRTL ? '22 راكب' : '22 Passengers');
                                        setEditRowPrice('350');
                                      } else if (val === 'سيدان' || val === 'Sedan Car') {
                                        setEditRowCapacity(isRTL ? '4 ركاب' : '4 Passengers');
                                        setEditRowPrice('150');
                                      }
                                    }}
                                    className="w-full appearance-none bg-white border border-emerald-400 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-bold focus:outline-hidden focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                                  >
                                    <option value={isRTL ? 'حافلة VIP' : 'VIP Luxury Bus'}>{t('transport.vip_bus', 'حافلة VIP')}</option>
                                    <option value={isRTL ? 'حافلة عادية' : 'Standard Bus'}>{t('transport.regular_bus', 'حافلة عادية')}</option>
                                    <option value={isRTL ? 'كوستر' : 'Coaster Mini Bus'}>{t('transport.coaster', 'كوستر')}</option>
                                    <option value={isRTL ? 'سيدان' : 'Sedan Car'}>{t('transport.sedan', 'سيدان')}</option>
                                    <option value="__CUSTOM__">{isRTL ? '+ نوع مخصص (كتابة)...' : '+ Custom / Type Custom...'}</option>
                                  </select>
                                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 absolute ${isRTL ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 pointer-events-none`} />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditRowIsCustomType(true);
                                    setEditRowType('');
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-emerald-600 bg-white border border-slate-200 rounded-lg hover:bg-emerald-50 transition cursor-pointer shrink-0"
                                  title={isRTL ? 'كتابة نوع مخصص' : 'Type custom type'}
                                >
                                  <PenLine className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="p-2 text-center">
                            <input
                              type="text"
                              value={editRowCapacity}
                              onChange={(e) => setEditRowCapacity(e.target.value)}
                              className="w-full bg-white border border-emerald-400 rounded-lg px-2 py-1.5 text-xs text-center text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                              placeholder={isRTL ? 'مثال: 45 راكب' : 'e.g. 45 Pax'}
                            />
                          </td>
                          <td className="p-2 text-center">
                            <input
                              type="number"
                              value={editRowPrice}
                              onChange={(e) => setEditRowPrice(e.target.value)}
                              className="w-24 mx-auto bg-white border border-emerald-400 rounded-lg px-2 py-1.5 text-xs text-center font-bold text-[#16a34a] focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                              placeholder="350"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <div className="relative">
                              <select
                                value={editRowStatus}
                                onChange={(e) => setEditRowStatus(e.target.value)}
                                className="w-full appearance-none bg-white border border-emerald-400 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                              >
                                <option value={isRTL ? 'متاح' : 'Available'}>{isRTL ? 'متاح' : 'Available'}</option>
                                <option value={isRTL ? 'تحت الصيانة' : 'Under Maintenance'}>{isRTL ? 'تحت الصيانة' : 'Under Maintenance'}</option>
                                <option value={isRTL ? 'محجوز' : 'Booked'}>{isRTL ? 'محجوز' : 'Booked'}</option>
                              </select>
                              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 absolute ${isRTL ? 'left-1.5' : 'right-1.5'} top-1/2 -translate-y-1/2 pointer-events-none`} />
                            </div>
                          </td>
                          <td className="p-2 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleSaveEditRow(row.id)}
                                className="w-7 h-7 rounded-lg bg-[#16a34a] text-white flex items-center justify-center hover:bg-[#15803d] transition cursor-pointer shadow-2xs active:scale-95"
                                title={isRTL ? 'حفظ' : 'Save'}
                              >
                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                              </button>
                              <button
                                type="button"
                                onClick={handleCancelEditRow}
                                className="w-7 h-7 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-300 transition cursor-pointer active:scale-95"
                                title={isRTL ? 'إلغاء' : 'Cancel'}
                              >
                                <X className="w-3.5 h-3.5 stroke-[2.5]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <tr key={row.id} className="hover:bg-slate-50/60 transition group/row">
                          <td className="py-2.5 px-3 font-bold text-slate-900">{row.type}</td>
                          <td className="py-2.5 px-3 text-center text-slate-600 font-medium">{row.capacity}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-[#16a34a]">
                            {row.price} {t('common.currency', 'SAR')}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getStatusColor(row.status)}`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleStartEditRow(row)}
                                className="p-1 text-slate-400 hover:text-[#16a34a] rounded-md hover:bg-emerald-50 transition cursor-pointer"
                                title={isRTL ? 'تعديل' : 'Edit'}
                              >
                                <SquarePen className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteRow(row.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition cursor-pointer"
                                title={isRTL ? 'حذف' : 'Delete'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Add Vehicle Inline Form */}
            {isAddRowOpen ? (
              <div className="bg-emerald-50/40 border border-emerald-200 rounded-2xl p-4 space-y-3 animate-fadeIn text-xs shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
                  <div className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#16a34a] flex items-center justify-center">
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span>{isRTL ? 'إضافة تسعيرة مركبة جديدة' : 'Add New Vehicle Pricing'}</span>
                  </div>

                  {newRowIsCustomType ? (
                    <button
                      type="button"
                      onClick={() => {
                        setNewRowIsCustomType(false);
                        const defaultType = isRTL ? 'حافلة VIP' : 'VIP Luxury Bus';
                        setNewRowType(defaultType);
                        setNewRowCapacity(isRTL ? '30 راكب' : '30 Passengers');
                        setNewRowPrice('600');
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16a34a] hover:text-[#15803d] bg-white border border-emerald-200 px-2.5 py-1 rounded-lg hover:bg-emerald-50 transition cursor-pointer shadow-2xs"
                    >
                      <ListFilter className="w-3 h-3" />
                      <span>{isRTL ? 'اختر من القائمة' : 'Select from List'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setNewRowIsCustomType(true);
                        setNewRowType('');
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-[#16a34a] bg-white border border-slate-200 px-2.5 py-1 rounded-lg hover:border-emerald-200 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
                    >
                      <PenLine className="w-3 h-3" />
                      <span>{isRTL ? 'كتابة نوع مخصص' : 'Type Custom'}</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  {/* Vehicle Type & Category */}
                  <div className="sm:col-span-4 space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      {isRTL ? 'نوع وتصنيف المركبة' : 'Vehicle Type & Category'}
                    </label>
                    {newRowIsCustomType ? (
                      <input
                        type="text"
                        autoFocus
                        placeholder={isRTL ? 'مثال: جي إم سي يوكن / تويوتا هايس' : 'e.g. GMC Yukon / HiAce'}
                        value={newRowType}
                        onChange={(e) => setNewRowType(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 h-[34px] text-xs sm:text-sm text-slate-800 placeholder-slate-300 focus:outline-hidden focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] transition shadow-2xs"
                      />
                    ) : (
                      <div className="relative">
                        <select
                          value={newRowType}
                          onChange={(e) => handleSelectVehicleType(e.target.value)}
                          className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-1.5 h-[34px] text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] cursor-pointer transition shadow-2xs"
                        >
                          <option value={isRTL ? 'حافلة VIP' : 'VIP Luxury Bus'}>{t('transport.vip_bus', 'حافلة VIP')}</option>
                          <option value={isRTL ? 'حافلة عادية' : 'Standard Bus'}>{t('transport.regular_bus', 'حافلة عادية')}</option>
                          <option value={isRTL ? 'كوستر' : 'Coaster Mini Bus'}>{t('transport.coaster', 'كوستر')}</option>
                          <option value={isRTL ? 'سيدان' : 'Sedan Car'}>{t('transport.sedan', 'سيدان')}</option>
                          <option value="__CUSTOM__">{isRTL ? '+ نوع مخصص (كتابة يدوية)...' : '+ Custom / Type Custom...'}</option>
                        </select>
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 absolute ${isRTL ? 'left-2.5' : 'right-2.5'} top-1/2 -translate-y-1/2 pointer-events-none`} />
                      </div>
                    )}
                  </div>

                  {/* Capacity */}
                  <div className="sm:col-span-3 space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      {isRTL ? 'السعة' : 'Capacity'}
                    </label>
                    <input
                      type="text"
                      placeholder={isRTL ? 'مثال: 30 راكب' : 'e.g. 30 Passengers'}
                      value={newRowCapacity}
                      onChange={(e) => setNewRowCapacity(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 h-[34px] text-xs sm:text-sm text-slate-800 placeholder-slate-300 focus:outline-hidden focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] transition shadow-2xs"
                    />
                  </div>

                  {/* Price */}
                  <div className="sm:col-span-2 space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      {isRTL ? 'السعر (ر.س)' : 'Price (SAR)'}
                    </label>
                    <input
                      type="number"
                      placeholder="350"
                      value={newRowPrice}
                      onChange={(e) => setNewRowPrice(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 h-[34px] text-xs sm:text-sm font-bold text-[#16a34a] focus:outline-hidden focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] transition shadow-2xs"
                    />
                  </div>

                  {/* Status */}
                  <div className="sm:col-span-3 space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      {isRTL ? 'الحالة' : 'Status'}
                    </label>
                    <div className="relative">
                      <select
                        value={newRowStatus}
                        onChange={(e) => setNewRowStatus(e.target.value)}
                        className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-1.5 h-[34px] text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] cursor-pointer transition shadow-2xs"
                      >
                        <option value={isRTL ? 'متاح' : 'Available'}>{isRTL ? 'متاح' : 'Available'}</option>
                        <option value={isRTL ? 'تحت الصيانة' : 'Under Maintenance'}>{isRTL ? 'تحت الصيانة' : 'Under Maintenance'}</option>
                        <option value={isRTL ? 'محجوز' : 'Booked'}>{isRTL ? 'محجوز' : 'Booked'}</option>
                      </select>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 absolute ${isRTL ? 'left-2.5' : 'right-2.5'} top-1/2 -translate-y-1/2 pointer-events-none`} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-100/60">
                  <button
                    type="button"
                    onClick={() => setIsAddRowOpen(false)}
                    className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition shadow-2xs active:scale-95"
                  >
                    {t('common.cancel', 'إلغاء')}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNewRow}
                    className="bg-[#16a34a] hover:bg-[#15803d] text-white font-bold px-5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition shadow-xs active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{t('common.add', 'إضافة')}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={handleOpenAddRow}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16a34a] hover:text-[#15803d] bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 px-3.5 py-1.5 rounded-lg transition cursor-pointer shadow-2xs active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{t('transport.add_row_btn', 'Add Vehicle')}</span>
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
            {t('common.cancel', 'Cancel')}
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
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-fadeIn">
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
                className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-bold py-3 px-8 rounded-xl transition shadow-xs text-sm sm:text-base cursor-pointer active:scale-95"
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
