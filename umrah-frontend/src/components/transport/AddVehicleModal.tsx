import { useState, useEffect } from 'react';
import { X, AlertTriangle, Check, ChevronDown } from 'lucide-react';
import type { VehicleItem } from './CompanyFleetView';
import { useLanguage } from '../../context/LanguageContext';

// Default images for vehicles
import v1Vip from '../../assets/fleet_vehicles/vehicle_1_vip.png';
import v2Regular from '../../assets/fleet_vehicles/vehicle_2_regular.png';
import v4Sedan from '../../assets/fleet_vehicles/vehicle_4_sedan.png';
import v5Coaster from '../../assets/fleet_vehicles/vehicle_5_coaster.png';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (vehicle: VehicleItem) => void;
  initialData?: VehicleItem | null;
}

export default function AddVehicleModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: AddVehicleModalProps) {
  const { t, isRTL, direction } = useLanguage();

  const [name, setName] = useState(isRTL ? 'حافلة VIP' : 'VIP Luxury Bus');
  const [type, setType] = useState<VehicleItem['type']>('حافلة VIP');
  const [plateNumber, setPlateNumber] = useState('VB-');
  const [capacity, setCapacity] = useState(isRTL ? '30 راكب' : '30 Passengers');
  const [pricePerTrip, setPricePerTrip] = useState('600');
  const [status, setStatus] = useState<VehicleItem['status']>('متاح');

  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setType(initialData.type);
      setPlateNumber(initialData.plateNumber);
      setCapacity(initialData.capacity);
      setPricePerTrip(String(initialData.pricePerTrip));
      setStatus(initialData.status);
    } else {
      setName(isRTL ? 'حافلة VIP' : 'VIP Luxury Bus');
      setType('حافلة VIP');
      setPlateNumber('VB-');
      setCapacity(isRTL ? '30 راكب' : '30 Passengers');
      setPricePerTrip('600');
      setStatus('متاح');
    }
    setWarningMessage(null);
  }, [initialData, isOpen, isRTL]);

  if (!isOpen) return null;

  const handleTypeChange = (selectedType: VehicleItem['type']) => {
    setType(selectedType);
    if (selectedType === 'حافلة VIP') {
      setName(isRTL ? 'حافلة VIP' : 'VIP Luxury Bus');
      if (!initialData) setPlateNumber('VB-');
      setCapacity(isRTL ? '30 راكب' : '30 Passengers');
      setPricePerTrip('600');
    } else if (selectedType === 'حافلة عادية') {
      setName(isRTL ? 'حافلة عادية' : 'Standard Bus');
      if (!initialData) setPlateNumber('SB-');
      setCapacity(isRTL ? '45 راكب' : '45 Passengers');
      setPricePerTrip('350');
    } else if (selectedType === 'سيدان') {
      setName(isRTL ? 'سيدان' : 'Sedan Car');
      if (!initialData) setPlateNumber('SD-');
      setCapacity(isRTL ? '4 ركاب' : '4 Passengers');
      setPricePerTrip('150');
    } else if (selectedType === 'كوستر') {
      setName(isRTL ? 'كوستر' : 'Coaster Mini Bus');
      if (!initialData) setPlateNumber('CS-');
      setCapacity(isRTL ? '25 راكب' : '25 Passengers');
      setPricePerTrip('250');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber.trim()) {
      setWarningMessage(isRTL ? 'يرجى إدخال رقم اللوحة' : 'Please enter the plate number');
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleConfirmSave = () => {
    let img = initialData?.image || v1Vip;
    if (!initialData) {
      if (type === 'حافلة عادية') img = v2Regular;
      else if (type === 'سيدان') img = v4Sedan;
      else if (type === 'كوستر') img = v5Coaster;
    }

    const savedVehicle: VehicleItem = {
      id: initialData?.id || Date.now().toString(),
      name,
      type,
      status,
      plateNumber,
      capacity,
      pricePerTrip: parseFloat(pricePerTrip) || 350,
      image: img,
    };

    onSuccess(savedVehicle);
    setIsConfirmOpen(false);
    setIsSuccessOpen(true);
  };

  const handleDoneSuccess = () => {
    setIsSuccessOpen(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl relative border border-slate-100 flex flex-col justify-between max-h-[92vh] overflow-hidden"
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
          {/* Vehicle Type */}
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700">
              {t('transport.vehicle_type', 'نوع وتصنيف المركبة')} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={type}
                onChange={(e) => handleTypeChange(e.target.value as VehicleItem['type'])}
                className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 bg-white focus:outline-hidden focus:border-[#00c48c] transition cursor-pointer"
              >
                <option value="حافلة VIP">{t('transport.vip_bus', 'حافلة VIP')}</option>
                <option value="حافلة عادية">{t('transport.regular_bus', 'حافلة عادية')}</option>
                <option value="كوستر">{t('transport.coaster', 'كوستر')}</option>
                <option value="سيدان">{t('transport.sedan', 'سيدان')}</option>
              </select>
              <ChevronDown className={`w-4 h-4 text-slate-400 absolute ${isRTL ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 pointer-events-none`} />
            </div>
          </div>

          {/* Plate Number & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                placeholder="VB-3001"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono text-left text-slate-800 focus:outline-hidden focus:border-[#00c48c] transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                {t('transport.capacity_label', 'السعة الاستيعابية للركاب')}
              </label>
              <input
                type="text"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder={isRTL ? '30 راكب' : '30 Passengers'}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-[#00c48c] transition"
              />
            </div>
          </div>

          {/* Price per trip & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                {t('transport.price_per_trip_label', 'السعر لكل رحلة (ر.س)')}
              </label>
              <input
                type="number"
                min="50"
                step="10"
                value={pricePerTrip}
                onChange={(e) => setPricePerTrip(e.target.value)}
                placeholder="600"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-[#00c48c] transition"
              />
            </div>

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
                ? (isRTL ? 'حفظ التعديلات' : 'Save Changes')
                : t('transport.add_vehicle', 'إضافة مركبة')}
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Dialog */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-[370px] sm:max-w-[400px] w-full shadow-2xl text-center space-y-5 border border-slate-100"
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
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
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
                className="w-full bg-[#00c48c] hover:bg-[#00b07d] text-white font-bold py-3 px-8 rounded-xl transition shadow-xs text-sm sm:text-base cursor-pointer active:scale-95"
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

