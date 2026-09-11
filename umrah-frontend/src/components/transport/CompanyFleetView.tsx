import { useState } from 'react';
import { Star, Plus, SquarePen, Trash2, Check } from 'lucide-react';
import type { TransportCompany } from './TransportDetailsModal';
import AddVehicleModal from './AddVehicleModal';
import EditCompanyModal from './EditCompanyModal';
import { useLanguage } from '../../context/LanguageContext';

// Vehicle Images cropped directly from user mockup
import companyThumb from '../../assets/fleet_vehicles/company_thumb.png';
import v1Vip from '../../assets/fleet_vehicles/vehicle_1_vip.png';
import v2Regular from '../../assets/fleet_vehicles/vehicle_2_regular.png';
import v3Regular from '../../assets/fleet_vehicles/vehicle_3_regular.png';
import v4Sedan from '../../assets/fleet_vehicles/vehicle_4_sedan.png';
import v5Coaster from '../../assets/fleet_vehicles/vehicle_5_coaster.png';
import v6VipMaintenance from '../../assets/fleet_vehicles/vehicle_6_vip_maintenance.png';

export interface VehicleItem {
  id: string;
  name: string;
  type: 'حافلة VIP' | 'حافلة عادية' | 'سيدان' | 'كوستر';
  status: 'متاح' | 'تحت الصيانة' | 'محجوز';
  plateNumber: string;
  capacity: string;
  pricePerTrip: number;
  image: string;
}

interface CompanyFleetViewProps {
  company: TransportCompany;
  onBack: () => void;
}

export default function CompanyFleetView({ company }: CompanyFleetViewProps) {
  const { t, isRTL, direction } = useLanguage();
  const [currentCompany, setCurrentCompany] = useState<TransportCompany>(company);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [selectedVehicleForEdit, setSelectedVehicleForEdit] = useState<VehicleItem | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<VehicleItem | null>(null);
  const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false);
  const [isEditCompanyOpen, setIsEditCompanyOpen] = useState(false);

  // 6 vehicles exactly from the user mockup
  const [vehicles, setVehicles] = useState<VehicleItem[]>([
    {
      id: 'v1',
      name: isRTL ? 'حافلة VIP' : 'VIP Luxury Bus',
      type: 'حافلة VIP',
      status: 'متاح',
      plateNumber: 'VB-3001',
      capacity: isRTL ? '30 راكب' : '30 Passengers',
      pricePerTrip: 600,
      image: v1Vip,
    },
    {
      id: 'v2',
      name: isRTL ? 'حافلة عادية' : 'Standard Bus',
      type: 'حافلة عادية',
      status: 'متاح',
      plateNumber: 'SB-1002',
      capacity: isRTL ? '45 راكب' : '45 Passengers',
      pricePerTrip: 350,
      image: v2Regular,
    },
    {
      id: 'v3',
      name: isRTL ? 'حافلة عادية' : 'Standard Bus',
      type: 'حافلة عادية',
      status: 'متاح',
      plateNumber: 'SB-1001',
      capacity: isRTL ? '45 راكب' : '45 Passengers',
      pricePerTrip: 350,
      image: v3Regular,
    },
    {
      id: 'v4',
      name: isRTL ? 'سيدان' : 'Sedan Car',
      type: 'سيدان',
      status: 'متاح',
      plateNumber: 'SD-4001',
      capacity: isRTL ? '4 ركاب' : '4 Passengers',
      pricePerTrip: 150,
      image: v4Sedan,
    },
    {
      id: 'v5',
      name: isRTL ? 'كوستر' : 'Coaster Mini Bus',
      type: 'كوستر',
      status: 'متاح',
      plateNumber: 'CS-3001',
      capacity: isRTL ? '25 راكب' : '25 Passengers',
      pricePerTrip: 250,
      image: v5Coaster,
    },
    {
      id: 'v6',
      name: isRTL ? 'حافلة VIP' : 'VIP Luxury Bus',
      type: 'حافلة VIP',
      status: 'تحت الصيانة',
      plateNumber: 'VB-2002',
      capacity: isRTL ? '30 راكب' : '30 Passengers',
      pricePerTrip: 600,
      image: v6VipMaintenance,
    },
  ]);

  const getVehicleStatusBadge = (status: VehicleItem['status']) => {
    switch (status) {
      case 'متاح':
        return (
          <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-[#dcfce7] text-[#15803d]">
            {t('common.available', 'متاح')}
          </span>
        );
      case 'تحت الصيانة':
        return (
          <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-[#fef3c7] text-[#b45309]">
            {t('common.maintenance', 'تحت الصيانة')}
          </span>
        );
      case 'محجوز':
        return (
          <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-[#fee2e2] text-[#e11d48]">
            {isRTL ? 'محجوز' : 'Reserved'}
          </span>
        );
    }
  };

  const handleConfirmDelete = () => {
    if (vehicleToDelete) {
      setVehicles((prev) => prev.filter((v) => v.id !== vehicleToDelete.id));
      setVehicleToDelete(null);
      setIsDeleteSuccessOpen(true);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn" dir={direction}>
      {/* Top Action Row */}
      <div className="flex items-center justify-start gap-2.5">
        {/* Edit Company */}
        <button
          onClick={() => setIsEditCompanyOpen(true)}
          className="border border-[#1e293b] bg-white hover:bg-slate-50 text-[#1e293b] px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition shadow-2xs cursor-pointer active:scale-95"
        >
          {t('transport.edit_company', 'تعديل الشركة')}
        </button>

        {/* Add Vehicle Button */}
        <button
          onClick={() => {
            setSelectedVehicleForEdit(null);
            setIsAddVehicleOpen(true);
          }}
          className="bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{t('transport.add_vehicle', 'إضافة مركبة')}</span>
        </button>
      </div>

      {/* 1. Top Company Summary Card */}
      <div
        className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-2xs flex items-center gap-5 sm:gap-6"
      >
        {/* Operations Center Image */}
        <div className="shrink-0">
          <img
            src={companyThumb}
            alt={currentCompany.name}
            className="w-28 sm:w-36 h-20 sm:h-22 object-cover rounded-xl border border-slate-100 shadow-2xs"
          />
        </div>

        {/* Details immediately next to the image */}
        <div className="space-y-2.5">
          {/* Header Row: Name, Location Badge, Status Badge */}
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight">
              {currentCompany.name || (isRTL ? 'نقل الحرمين السريع' : 'Haramain Express Transport')}
            </h2>

            {/* Location Badge */}
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#fef3c7] text-[#b45309]">
              {currentCompany.region || (isRTL ? 'مكة المكرمة' : 'Makkah')}
            </span>

            {/* Status Badge */}
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#dcfce7] text-[#16a34a]">
              {currentCompany.status || (isRTL ? 'متاح' : 'Available')}
            </span>
          </div>

          {/* Contact Row: Stars, Phone & Email */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-5 text-xs sm:text-sm text-slate-600 font-normal">
            {/* 5 Stars */}
            <div className="flex items-center gap-1" dir="ltr">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className="w-3.5 h-3.5 text-[#f59e0b] stroke-[#f59e0b] fill-none stroke-[2.2]"
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">{t('common.phone', 'الهاتف')}:</span>
              <span dir="ltr" className="font-mono font-bold text-slate-800">
                {currentCompany.phone || '+966 50 123 4567'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">{t('common.email', 'البريد الإلكتروني')}:</span>
              <span dir="ltr" className="font-mono font-medium text-slate-700">
                support@haramainexpress.com
              </span>
            </div>
          </div>
        </div>

        {/* Spacious area */}
        <div className="hidden md:block flex-1" />
      </div>

      {/* 2. Section Heading: Fleet & Vehicles */}
      <div className="pt-2">
        <h3 className="text-lg sm:text-xl font-bold text-[#0f172a] tracking-tight">
          {t('transport.fleet_and_vehicles', 'الأسطول والمركبات')}
        </h3>
      </div>

      {/* 3. Grid of Vehicles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
          >
            {/* Vehicle Image */}
            <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Card Content */}
            <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
              {/* Header Row: Vehicle Type & Status Badge */}
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">
                  {vehicle.name}
                </h4>
                {getVehicleStatusBadge(vehicle.status)}
              </div>

              {/* Vehicle Specifications */}
              <div className="space-y-1.5 text-xs text-slate-500 font-normal">
                <div className="flex items-center justify-between bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                  <span className="text-slate-500">{t('transport.plate_number', 'رقم اللوحة')}:</span>
                  <span className="font-mono font-bold text-slate-800 tracking-wide text-xs sm:text-sm">{vehicle.plateNumber}</span>
                </div>
                <div className="flex items-center justify-between px-1">
                  <span className="text-slate-400">{t('common.capacity', 'السعة')}:</span>
                  <span className="font-bold text-slate-700">{vehicle.capacity}</span>
                </div>
              </div>

              {/* Price Row */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-normal">{t('transport.price_per_trip', 'السعر لكل رحلة')}:</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-base sm:text-lg font-extrabold text-[#00c48c]">
                    {vehicle.pricePerTrip}
                  </span>
                  <span className="text-xs font-bold text-[#00c48c]">{t('common.currency', 'ر.س')}</span>
                </div>
              </div>

              {/* Actions Row: Edit & Delete Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedVehicleForEdit(vehicle);
                    setIsAddVehicleOpen(true);
                  }}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/90 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs active:scale-95"
                >
                  <SquarePen className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t('common.edit', 'تعديل')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVehicleToDelete(vehicle)}
                  className="border border-rose-200/80 bg-rose-50 hover:bg-rose-100 text-rose-600 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs active:scale-95"
                  title={isRTL ? 'حذف المركبة' : 'Delete Vehicle'}
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>{t('common.delete', 'حذف')}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Vehicle Modal */}
      <AddVehicleModal
        isOpen={isAddVehicleOpen}
        initialData={selectedVehicleForEdit}
        onClose={() => {
          setIsAddVehicleOpen(false);
          setSelectedVehicleForEdit(null);
        }}
        onSuccess={(savedVehicle) => {
          setVehicles((prev) => {
            const exists = prev.some((v) => v.id === savedVehicle.id);
            if (exists) {
              return prev.map((v) => (v.id === savedVehicle.id ? savedVehicle : v));
            }
            return [savedVehicle, ...prev];
          });
          setIsAddVehicleOpen(false);
          setSelectedVehicleForEdit(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      {vehicleToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-[370px] sm:max-w-[400px] w-full shadow-2xl text-center space-y-5 border border-slate-100 animate-scaleUp"
            dir={direction}
          >
            <div className="w-16 h-16 rounded-full bg-rose-50 mx-auto flex items-center justify-center text-rose-600">
              <Trash2 className="w-8 h-8 stroke-[2.2]" />
            </div>

            <div className="space-y-1.5 pt-1">
              <h3 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight">
                {isRTL ? 'تأكيد حذف المركبة' : 'Confirm Delete Vehicle'}
              </h3>
              <p className="text-sm text-slate-600 font-normal leading-relaxed">
                {isRTL
                  ? `هل أنت متأكد من حذف ${vehicleToDelete.name} (${vehicleToDelete.plateNumber})؟`
                  : `Are you sure you want to delete ${vehicleToDelete.name} (${vehicleToDelete.plateNumber})?`}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 w-full pt-2">
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 sm:py-3 px-5 rounded-xl transition shadow-xs text-xs sm:text-sm cursor-pointer active:scale-95"
              >
                {isRTL ? 'نعم، حذف' : 'Yes, Delete'}
              </button>

              <button
                type="button"
                onClick={() => setVehicleToDelete(null)}
                className="flex-1 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 sm:py-3 px-5 rounded-xl transition shadow-2xs text-xs sm:text-sm cursor-pointer active:scale-95"
              >
                {t('common.cancel', 'إلغاء')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Success Alert */}
      {isDeleteSuccessOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-[370px] sm:max-w-[400px] w-full shadow-2xl text-center space-y-5 border border-slate-100 animate-scaleUp"
            dir={direction}
          >
            <div className="w-16 h-16 rounded-full bg-[#cbf7df]/80 mx-auto flex items-center justify-center text-[#00c48c]">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="space-y-1.5 pt-1">
              <h3 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight">
                {t('common.success', 'تم بنجاح!')}
              </h3>
              <p className="text-sm text-slate-600 font-normal leading-relaxed">
                {isRTL ? 'تم حذف المركبة بنجاح من أسطول الشركة.' : 'Vehicle has been successfully deleted from the fleet.'}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteSuccessOpen(false)}
                className="w-full bg-[#00c48c] hover:bg-[#00b07d] text-white font-bold py-2.5 sm:py-3 px-8 rounded-xl transition shadow-xs text-sm cursor-pointer active:scale-95"
              >
                {isRTL ? 'حسناً' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Company Modal */}
      <EditCompanyModal
        isOpen={isEditCompanyOpen}
        onClose={() => setIsEditCompanyOpen(false)}
        company={currentCompany}
        onSuccess={(updated) => {
          setCurrentCompany(updated);
        }}
      />
    </div>
  );
}

