import { useState } from 'react';
import {
  Check,
  X,
  AlertCircle,
  Search,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface ServiceItem {
  id: string;
  name: string;
  nameAr?: string;
  category: string;
  categoryAr?: string;
  price: number;
  currency: 'SAR' | 'USD' | 'IDR';
  status: 'Active' | 'Inactive';
}

const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    name: 'VIP Airport Meet & Assist (Fast-Track)',
    nameAr: 'استقبال وتوديع VIP بالمطار مع المسار السريع',
    category: 'Airport Services',
    categoryAr: 'خدمات المطار',
    price: 450,
    currency: 'SAR',
    status: 'Active',
  },
  {
    id: 'srv-2',
    name: 'Executive GMC Yukon Transfer (JED -> MAK)',
    nameAr: 'نقل تنفيذي سيارة جمس يوكن (مطار جدة إلى مكة)',
    category: 'VIP Transport',
    categoryAr: 'النقل التنفيذي',
    price: 650,
    currency: 'SAR',
    status: 'Active',
  },
  {
    id: 'srv-3',
    name: 'Luxury 50-Seater Mercedes Bus Transfer',
    nameAr: 'نقل حافلة مرسيدس حديثة 50 راكب للمجموعات',
    category: 'Fleet Transport',
    categoryAr: 'نقل الحافلات',
    price: 1800,
    currency: 'SAR',
    status: 'Active',
  },
  {
    id: 'srv-4',
    name: 'Umrah Visa & Nusuk Permit Processing',
    nameAr: 'إصدار تأشيرة العمرة وتصريح نسك الرسمي',
    category: 'Permits & Visas',
    categoryAr: 'التأشيرات والتصاريح',
    price: 320,
    currency: 'SAR',
    status: 'Active',
  },
  {
    id: 'srv-5',
    name: 'Historical Mazarat Guided Tour (Makkah)',
    nameAr: 'جولة مزارات ومعالم تاريخية مع مرشد (مكة المكرمة)',
    category: 'Ziyarah Tours',
    categoryAr: 'المزارات والجولات',
    price: 500,
    currency: 'SAR',
    status: 'Active',
  },
  {
    id: 'srv-6',
    name: 'Wheelchair Assistance & Escort at Haram',
    nameAr: 'خدمة كراسي متحركة ومرافق بالحرم المكي',
    category: 'Special Care',
    categoryAr: 'عناية خاصة',
    price: 180,
    currency: 'SAR',
    status: 'Inactive',
  },
];

export default function ServicesTab() {
  const { isRTL } = useLanguage();

  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Inactive'>('All');

  // Feedback state
  const [feedback, setFeedback] = useState<string | null>(null);

  // Tax settings state
  const [taxPercentage, setTaxPercentage] = useState('15.00');
  const [isSavingTax, setIsSavingTax] = useState(false);

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [deletingService, setDeletingService] = useState<ServiceItem | null>(null);

  // Form inputs state
  const [nameInput, setNameInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('VIP Transport');
  const [priceInput, setPriceInput] = useState('');
  const [currencyInput, setCurrencyInput] = useState<'SAR' | 'USD' | 'IDR'>('SAR');
  const [statusInput, setStatusInput] = useState<'Active' | 'Inactive'>('Active');
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Filtered list
  const filteredServices = services.filter((srv) => {
    const matchesSearch =
      srv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (srv.nameAr && srv.nameAr.includes(searchTerm)) ||
      srv.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || srv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setNameInput('');
    setCategoryInput('VIP Transport');
    setPriceInput('');
    setCurrencyInput('SAR');
    setStatusInput('Active');
    setFormErrors([]);
    setIsAddOpen(true);
  };

  const handleOpenEdit = (service: ServiceItem) => {
    setEditingService(service);
    setNameInput(service.name);
    setCategoryInput(service.category);
    setPriceInput(service.price.toString());
    setCurrencyInput(service.currency);
    setStatusInput(service.status);
    setFormErrors([]);
  };

  const validateForm = () => {
    const errors: string[] = [];
    if (!nameInput.trim()) {
      errors.push(isRTL ? 'يرجى إدخال اسم الخدمة' : 'Service name is required');
    }
    if (!priceInput || Number(priceInput) <= 0) {
      errors.push(isRTL ? 'يرجى إدخال سعر صحيح أكبر من صفر' : 'Valid price greater than 0 is required');
    }
    return errors;
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      name: nameInput.trim(),
      category: categoryInput,
      price: Number(priceInput),
      currency: currencyInput,
      status: statusInput,
    };

    setServices((prev) => [newService, ...prev]);
    setIsAddOpen(false);
    setFeedback(isRTL ? 'تمت إضافة الخدمة بنجاح إلى القائمة!' : 'Service added successfully to catalog!');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleUpdateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    const errors = validateForm();
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setServices((prev) =>
      prev.map((s) =>
        s.id === editingService.id
          ? {
              ...s,
              name: nameInput.trim(),
              category: categoryInput,
              price: Number(priceInput),
              currency: currencyInput,
              status: statusInput,
            }
          : s
      )
    );
    setEditingService(null);
    setFeedback(isRTL ? 'تم تحديث بيانات الخدمة بنجاح!' : 'Service details updated successfully!');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDeleteConfirm = () => {
    if (!deletingService) return;
    setServices((prev) => prev.filter((s) => s.id !== deletingService.id));
    setDeletingService(null);
    setFeedback(isRTL ? 'تم حذف الخدمة من القائمة' : 'Service removed from catalog');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSaveTax = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingTax(true);
    setTimeout(() => {
      setIsSavingTax(false);
      setFeedback(
        isRTL
          ? `تم تحديث نسبة ضريبة القيمة المضافة إلى ${taxPercentage}%`
          : `VAT / Tax rate updated to ${taxPercentage}%`
      );
      setTimeout(() => setFeedback(null), 3000);
    }, 400);
  };

  const formatPrice = (price: number, currency: string) => {
    if (currency === 'SAR') return `${price.toLocaleString()} SAR`;
    if (currency === 'IDR') return `Rp ${price.toLocaleString('id-ID')}`;
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {isRTL ? 'كتالوج الخدمات والأسعار' : 'Services & Tariff Catalog'}
          </h2>
          <p className="text-xs text-slate-400">
            {isRTL
              ? 'إدارة الخدمات الإضافية، باقات النقل، وبنود التسعير وضريبة القيمة المضافة'
              : 'Manage Umrah operational services, transfers, add-ons, and VAT rates'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-xs transition cursor-pointer active:scale-95 flex items-center gap-1.5"
        >
          <span>{isRTL ? '+ إضافة خدمة جديدة' : '+ Add Service'}</span>
        </button>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm font-semibold shadow-xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* CARD 1: SERVICES CATALOG TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-50/40">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${
                isRTL ? 'right-3' : 'left-3'
              }`}
            />
            <input
              type="text"
              placeholder={isRTL ? 'البحث عن خدمة بالاسم أو الفئة...' : 'Search service name or category...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full bg-white border border-slate-200 rounded-xl py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-amber-500 transition ${
                isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'
              }`}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">{isRTL ? 'الحالة:' : 'Status:'}</span>
            <div className="flex bg-slate-100 p-0.5 rounded-xl text-xs">
              {(['All', 'Active', 'Inactive'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    filterStatus === st
                      ? 'bg-white text-slate-800 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {st === 'All'
                    ? isRTL
                      ? 'الكل'
                      : 'All'
                    : st === 'Active'
                    ? isRTL
                      ? 'نشط'
                      : 'Active'
                    : isRTL
                    ? 'غير نشط'
                    : 'Inactive'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold bg-slate-50/60">
                <th className="py-3 px-6 text-start">{isRTL ? 'الخدمة والفئة' : 'Service & Category'}</th>
                <th className="py-3 px-6 text-start">{isRTL ? 'السعر الافتراضي' : 'Unit Price'}</th>
                <th className="py-3 px-6 text-center">{isRTL ? 'الحالة' : 'Status'}</th>
                <th className="py-3 px-6 text-end">{isRTL ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    <AlertCircle className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                    <span>{isRTL ? 'لا توجد خدمات مطابقة لخيارات البحث' : 'No services found matching your criteria'}</span>
                  </td>
                </tr>
              ) : (
                filteredServices.map((srv) => (
                  <tr key={srv.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-6">
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">
                          {isRTL && srv.nameAr ? srv.nameAr : srv.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          <span>{isRTL && srv.categoryAr ? srv.categoryAr : srv.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-slate-800 font-mono text-xs sm:text-sm">
                        {formatPrice(srv.price, srv.currency)}
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          srv.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {srv.status === 'Active'
                          ? isRTL
                            ? 'مفعل'
                            : 'Active'
                          : isRTL
                          ? 'غير نشط'
                          : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(srv)}
                          className="px-2.5 py-1 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 font-semibold transition cursor-pointer text-xs"
                        >
                          {isRTL ? 'تعديل' : 'Edit'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingService(srv)}
                          className="px-2.5 py-1 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 font-semibold transition cursor-pointer text-xs"
                        >
                          {isRTL ? 'حذف' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between bg-slate-50/30">
          <span>
            {isRTL ? 'إجمالي الخدمات المعروضة:' : 'Total services shown:'} {filteredServices.length}
          </span>
          <span>{isRTL ? 'نظام تشغيل وإدارة العمرة' : 'Umrah Operations System'}</span>
        </div>
      </div>

      {/* CARD 2: TAX / VAT CONFIGURATION */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">
            {isRTL ? 'إعدادات ضريبة القيمة المضافة (VAT)' : 'Tax / VAT Configuration'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isRTL
              ? 'تحديد نسبة الضريبة المطبقة تلقائياً على بنود الفواتير والعقود (افتراضي 15% بالمملكة)'
              : 'Set default tax percentage applied to contracts, invoices, and quotations'}
          </p>
        </div>

        <form onSubmit={handleSaveTax} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-md text-xs sm:text-sm">
          <div className="relative flex-1">
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              required
              value={taxPercentage}
              onChange={(e) => setTaxPercentage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-bold focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs pointer-events-none">
              %
            </span>
          </div>

          <button
            type="submit"
            disabled={isSavingTax}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            {isSavingTax ? (isRTL ? 'جاري الحفظ...' : 'Saving...') : (isRTL ? 'حفظ الضريبة' : 'Save Tax')}
          </button>
        </form>
      </div>

      {/* MODAL: ADD SERVICE */}
      {isAddOpen && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setIsAddOpen(false); }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-transparent p-4 animate-fadeIn"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isRTL ? 'إضافة خدمة جديدة إلى الكتالوج' : 'Add New Service to Catalog'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isRTL ? 'أدخل تفاصيل وبنود تسعير الخدمة الجديدة' : 'Configure tariff details, price, and category'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddService} className="p-6 space-y-4 text-xs sm:text-sm">
              {formErrors.length > 0 && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl space-y-1">
                  {formErrors.map((err, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 font-semibold text-xs">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>{err}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Service Name */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">
                  {isRTL ? 'اسم الخدمة' : 'Service Name'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={isRTL ? 'مثال: باقة استقبال كبار الشخصيات' : 'e.g., VIP Meet & Assist Package'}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">
                  {isRTL ? 'الفئة والتصنيف' : 'Category'}
                </label>
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold focus:outline-hidden focus:border-emerald-500 transition cursor-pointer"
                >
                  <option value="VIP Transport">{isRTL ? 'نقل تنفيذي وخاص' : 'VIP Transport'}</option>
                  <option value="Fleet Transport">{isRTL ? 'نقل الحافلات والمجموعات' : 'Fleet Transport'}</option>
                  <option value="Airport Services">{isRTL ? 'خدمات المطار والاستقبال' : 'Airport Services'}</option>
                  <option value="Permits & Visas">{isRTL ? 'تأشيرات وتصاريح نسك' : 'Permits & Visas'}</option>
                  <option value="Ziyarah Tours">{isRTL ? 'المزارات والجولات' : 'Ziyarah Tours'}</option>
                  <option value="Special Care">{isRTL ? 'عناية خاصة وكراسي' : 'Special Care'}</option>
                </select>
              </div>

              {/* Price & Currency */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <label className="font-semibold text-slate-700 block">
                    {isRTL ? 'السعر' : 'Unit Price'} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      placeholder="0.00"
                      value={priceInput}
                      onChange={(e) => setPriceInput(e.target.value)}
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-bold focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">
                    {isRTL ? 'العملة' : 'Currency'}
                  </label>
                  <select
                    value={currencyInput}
                    onChange={(e) => setCurrencyInput(e.target.value as any)}
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-bold focus:outline-hidden focus:border-emerald-500 transition cursor-pointer"
                  >
                    <option value="SAR">SAR (ريال)</option>
                    <option value="USD">USD ($)</option>
                    <option value="IDR">IDR (Rp)</option>
                  </select>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <div>
                  <div className="font-bold text-slate-800">{isRTL ? 'حالة التفعيل' : 'Active Status'}</div>
                  <div className="text-[11px] text-slate-400">
                    {statusInput === 'Active'
                      ? isRTL
                        ? 'تظهر في قوائم العقود والرحلات'
                        : 'Visible in quotes and contract creation'
                      : isRTL
                      ? 'مخفية مؤقتاً من الكتالوج'
                      : 'Hidden from new selections'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStatusInput(statusInput === 'Active' ? 'Inactive' : 'Active')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    statusInput === 'Active' ? 'bg-emerald-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out transform ${
                      statusInput === 'Active' ? (isRTL ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold transition cursor-pointer shadow-2xs text-xs sm:text-sm"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs transition cursor-pointer active:scale-95 text-xs sm:text-sm"
                >
                  {isRTL ? 'إضافة الخدمة' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT SERVICE */}
      {editingService && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setEditingService(null); }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-transparent p-4 animate-fadeIn"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isRTL ? 'تعديل بيانات الخدمة' : 'Edit Service'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isRTL ? 'تحديث تفاصيل وبنود تسعير الخدمة' : 'Update tariff details and pricing'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateService} className="p-6 space-y-4 text-xs sm:text-sm">
              {formErrors.length > 0 && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl space-y-1">
                  {formErrors.map((err, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 font-semibold text-xs">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>{err}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Service Name */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">
                  {isRTL ? 'اسم الخدمة' : 'Service Name'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">
                  {isRTL ? 'الفئة والتصنيف' : 'Category'}
                </label>
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold focus:outline-hidden focus:border-emerald-500 transition cursor-pointer"
                >
                  <option value="VIP Transport">{isRTL ? 'نقل تنفيذي وخاص' : 'VIP Transport'}</option>
                  <option value="Fleet Transport">{isRTL ? 'نقل الحافلات والمجموعات' : 'Fleet Transport'}</option>
                  <option value="Airport Services">{isRTL ? 'خدمات المطار والاستقبال' : 'Airport Services'}</option>
                  <option value="Permits & Visas">{isRTL ? 'تأشيرات وتصاريح نسك' : 'Permits & Visas'}</option>
                  <option value="Ziyarah Tours">{isRTL ? 'المزارات والجولات' : 'Ziyarah Tours'}</option>
                  <option value="Special Care">{isRTL ? 'عناية خاصة وكراسي' : 'Special Care'}</option>
                </select>
              </div>

              {/* Price & Currency */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <label className="font-semibold text-slate-700 block">
                    {isRTL ? 'السعر' : 'Unit Price'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-bold focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">
                    {isRTL ? 'العملة' : 'Currency'}
                  </label>
                  <select
                    value={currencyInput}
                    onChange={(e) => setCurrencyInput(e.target.value as any)}
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-bold focus:outline-hidden focus:border-emerald-500 transition cursor-pointer"
                  >
                    <option value="SAR">SAR (ريال)</option>
                    <option value="USD">USD ($)</option>
                    <option value="IDR">IDR (Rp)</option>
                  </select>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <div>
                  <div className="font-bold text-slate-800">{isRTL ? 'حالة التفعيل' : 'Active Status'}</div>
                  <div className="text-[11px] text-slate-400">
                    {statusInput === 'Active'
                      ? isRTL
                        ? 'تظهر في قوائم العقود والرحلات'
                        : 'Visible in quotes and contract creation'
                      : isRTL
                      ? 'مخفية مؤقتاً من الكتالوج'
                      : 'Hidden from new selections'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStatusInput(statusInput === 'Active' ? 'Inactive' : 'Active')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    statusInput === 'Active' ? 'bg-emerald-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out transform ${
                      statusInput === 'Active' ? (isRTL ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold transition cursor-pointer shadow-2xs text-xs sm:text-sm"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs transition cursor-pointer active:scale-95 text-xs sm:text-sm"
                >
                  {isRTL ? 'حفظ التعديلات' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deletingService && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setDeletingService(null); }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-transparent p-4 animate-fadeIn"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden p-6 space-y-4 text-center">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                {isRTL ? 'حذف الخدمة من الكتالوج' : 'Remove Service'}
              </h3>
              <p className="text-xs text-slate-500">
                {isRTL
                  ? `هل أنت متأكد من رغبتك في حذف "${deletingService.name}"؟ لن تظهر مجدداً في خيارات التسعير.`
                  : `Are you sure you want to remove "${deletingService.name}"? This item will no longer appear in new orders.`}
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingService(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition cursor-pointer shadow-2xs"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer active:scale-95"
              >
                {isRTL ? 'نعم، احذف الخدمة' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
