import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Star, Plus, SquarePen, Trash2, Check, Bus, Building2 } from 'lucide-react';
import type { TransportCompany } from './TransportDetailsModal';
import AddVehicleModal from './AddVehicleModal';
import EditCompanyModal from './EditCompanyModal';
import { useLanguage } from '../../context/LanguageContext';
import { usePermissions } from '../../hooks/usePermissions';
import { updateTransportApi } from '../../services/transportApi';

export interface VehicleItem {
  id: string;
  name: string;
  type: string;
  status: 'متاح' | 'تحت الصيانة' | 'محجوز';
  plateNumber: string;
  capacity: string;
  pricePerTrip: number;
  image?: string;
}

interface CompanyFleetViewProps {
  company: TransportCompany;
  onBack: () => void;
}

function mapPricingRowsToVehicles(pricingRows?: any[], photos?: string[]): VehicleItem[] {
  if (!pricingRows || !Array.isArray(pricingRows) || pricingRows.length === 0) {
    return [];
  }

  return pricingRows.map((row, idx) => {
    const rawType = row.type || 'Standard Bus';
    const lowerType = rawType.toLowerCase();
    let typeEnum: VehicleItem['type'] = rawType;
    let prefix = 'VH';

    if (lowerType.includes('vip') || lowerType.includes('فاخر')) {
      typeEnum = 'حافلة VIP';
      prefix = 'VB';
    } else if (lowerType.includes('coaster') || lowerType.includes('كوستر') || lowerType.includes('mini')) {
      typeEnum = 'كوستر';
      prefix = 'CS';
    } else if (lowerType.includes('sedan') || lowerType.includes('سيدان') || lowerType.includes('car')) {
      typeEnum = 'سيدان';
      prefix = 'SD';
    } else if (lowerType.includes('standard') || lowerType.includes('عادية') || lowerType.includes('bus') || lowerType.includes('حافلة')) {
      typeEnum = 'حافلة عادية';
      prefix = 'SB';
    } else {
      typeEnum = rawType;
      const cleanPrefix = rawType.replace(/[^a-zA-Z]/g, '').substring(0, 2).toUpperCase();
      prefix = cleanPrefix.length >= 2 ? cleanPrefix : 'VH';
    }

    let statusEnum: VehicleItem['status'] = 'متاح';
    const rawStatus = (row.status || '').toLowerCase();
    if (rawStatus.includes('mainten') || rawStatus.includes('صيانة')) {
      statusEnum = 'تحت الصيانة';
    } else if (rawStatus.includes('book') || rawStatus.includes('occup') || rawStatus.includes('حجز')) {
      statusEnum = 'محجوز';
    }

    const assignedPhoto = (photos && photos.length > idx && photos[idx]) ? photos[idx] : '';

    return {
      id: row.id ? `v-${row.id}` : `v-${idx + 1}`,
      name: rawType,
      type: typeEnum,
      status: statusEnum,
      plateNumber: `${prefix}-${1000 + (idx + 1) * 101}`,
      capacity: row.capacity || '45 Passengers',
      pricePerTrip: typeof row.price === 'number' ? row.price : parseInt(row.price, 10) || 350,
      image: row.image || assignedPhoto,
    };
  });
}

export default function CompanyFleetView({ company }: CompanyFleetViewProps) {
  const { t, isRTL, direction } = useLanguage();
  const { isReadOnly } = usePermissions();
  const [currentCompany, setCurrentCompany] = useState<TransportCompany>(company);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [selectedVehicleForEdit, setSelectedVehicleForEdit] = useState<VehicleItem | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<VehicleItem | null>(null);
  const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false);
  const [isEditCompanyOpen, setIsEditCompanyOpen] = useState(false);

  const [vehicles, setVehicles] = useState<VehicleItem[]>(() =>
    mapPricingRowsToVehicles(company.pricingRows, company.photos)
  );

  // Keep state in sync if parent company prop updates
  useEffect(() => {
    setCurrentCompany(company);
    setVehicles(mapPricingRowsToVehicles(company.pricingRows, company.photos));
  }, [company]);

  const renderStars = (rating: number = 0) => {
    return (
      <div className="flex items-center gap-1" dir="ltr">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = rating >= starIndex;

          return (
            <div key={starIndex} className="relative">
              <Star
                className={`w-3.5 h-3.5 ${
                  isFilled
                    ? 'text-amber-500 stroke-amber-500 fill-none stroke-[2.2]'
                    : 'text-slate-300 stroke-slate-300 fill-none stroke-[2]'
                }`}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const getVehicleStatusBadge = (status: VehicleItem['status']) => {
    switch (status) {
      case 'متاح':
        return (
          <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-[#dcfce7] text-[#15803d]">
            {t('common.available', 'Available')}
          </span>
        );
      case 'تحت الصيانة':
        return (
          <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-[#fef3c7] text-[#b45309]">
            {t('common.maintenance', 'Maintenance')}
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

  const handleConfirmDelete = async () => {
    if (vehicleToDelete) {
      const newVehicles = vehicles.filter((v) => v.id !== vehicleToDelete.id);
      setVehicles(newVehicles);
      setVehicleToDelete(null);
      setIsDeleteSuccessOpen(true);

      const updatedPricingRows = newVehicles.map((v, i) => ({
        id: String(i + 1),
        type: v.name,
        capacity: v.capacity,
        price: v.pricePerTrip,
        status: v.status,
      }));

      try {
        await updateTransportApi(currentCompany.id, {
          pricingRows: updatedPricingRows,
          fleetSize: updatedPricingRows.length * 5,
          fleetLabel: isRTL ? `${updatedPricingRows.length * 5} مركبة` : `${updatedPricingRows.length * 5} Vehicles`,
        });
        window.dispatchEvent(new CustomEvent('umrah_notification_refresh'));
      } catch (err) {
        console.error('Failed to sync deleted vehicle:', err);
      }
    }
  };

  const handleSaveVehicle = async (savedVehicle: VehicleItem) => {
    const exists = vehicles.some((v) => v.id === savedVehicle.id);
    const newVehicles = exists
      ? vehicles.map((v) => (v.id === savedVehicle.id ? savedVehicle : v))
      : [savedVehicle, ...vehicles];

    setVehicles(newVehicles);
    setIsAddVehicleOpen(false);
    setSelectedVehicleForEdit(null);

    const updatedPricingRows = newVehicles.map((v, i) => ({
      id: String(i + 1),
      type: v.name,
      capacity: v.capacity,
      price: v.pricePerTrip,
      status: v.status,
    }));

    try {
      await updateTransportApi(currentCompany.id, {
        pricingRows: updatedPricingRows,
        fleetSize: updatedPricingRows.length * 5,
        fleetLabel: isRTL ? `${updatedPricingRows.length * 5} مركبة` : `${updatedPricingRows.length * 5} Vehicles`,
      });
      window.dispatchEvent(new CustomEvent('umrah_notification_refresh'));
    } catch (err) {
      console.error('Failed to sync saved vehicle:', err);
    }
  };

  const handleSaveCompany = async (updated: TransportCompany) => {
    setCurrentCompany(updated);
    try {
      await updateTransportApi(updated.id, {
        name: updated.name,
        nameEn: updated.name,
        region: updated.region,
        status: updated.status,
        phone: updated.phone,
        email: updated.email,
        address: updated.address,
        rating: updated.rating,
      });
      window.dispatchEvent(new CustomEvent('umrah_notification_refresh'));
    } catch (err) {
      console.error('Failed to sync company update:', err);
    }
  };

  const mainCompanyImage = currentCompany.image || currentCompany.photos?.[0];

  return (
    <div className="space-y-6 animate-fadeIn" dir={direction}>
      {/* Top Action Row */}
      {!isReadOnly && (
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
      )}

      {/* 1. Top Company Summary Card */}
      <div
        className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6"
      >
        {/* Company Image or Icon */}
        <div className="shrink-0">
          {mainCompanyImage ? (
            <img
              src={mainCompanyImage}
              alt={currentCompany.name}
              className="w-28 sm:w-36 h-20 sm:h-22 object-cover rounded-xl border border-slate-100 shadow-2xs"
            />
          ) : (
            <div className="w-28 sm:w-36 h-20 sm:h-22 rounded-xl bg-slate-100 border border-slate-200/80 flex flex-col items-center justify-center text-slate-400 gap-1 shadow-2xs">
              <Building2 className="w-7 h-7 text-slate-400" />
              <span className="text-[10px] font-semibold text-slate-400">{isRTL ? 'بدون صورة' : 'No Photo'}</span>
            </div>
          )}
        </div>

        {/* Details immediately next to the image */}
        <div className="space-y-2 flex-1">
          {/* Header Row: Name, Location Badge, Status Badge */}
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight">
              {currentCompany.name || '-'}
            </h2>

            {/* Location Badge */}
            {currentCompany.region && (
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#fef3c7] text-[#b45309]">
                {currentCompany.region}
              </span>
            )}

            {/* Status Badge */}
            {currentCompany.status && (
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#dcfce7] text-[#16a34a]">
                {currentCompany.status}
              </span>
            )}
          </div>

          {/* Contact Row: Stars, Phone, Email & Address */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-600 font-normal">
            {/* Stars */}
            <div className="flex items-center gap-1.5">
              {renderStars(Number(currentCompany.rating) || 0)}
              <span className="font-bold text-slate-800 text-xs">
                {currentCompany.rating ? `${currentCompany.rating} / 5.0` : '-'}
              </span>
            </div>

            {currentCompany.phone && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">{t('common.phone', 'الهاتف')}:</span>
                <span dir="ltr" className="font-mono font-bold text-slate-800">
                  {currentCompany.phone}
                </span>
              </div>
            )}

            {currentCompany.email && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">{t('common.email', 'البريد الإلكتروني')}:</span>
                <span dir="ltr" className="font-mono font-medium text-slate-700">
                  {currentCompany.email}
                </span>
              </div>
            )}

            {currentCompany.address && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">{t('common.address', 'العنوان')}:</span>
                <span className="font-medium text-slate-700">
                  {currentCompany.address}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Section Heading: Fleet & Vehicles */}
      <div className="pt-2 flex items-center justify-between">
        <h3 className="text-lg sm:text-xl font-bold text-[#0f172a] tracking-tight">
          {t('transport.fleet_and_vehicles', 'الأسطول والمركبات')}
        </h3>
        <span className="text-xs font-semibold text-slate-500">
          {vehicles.length} {isRTL ? 'مركبات في الأسطول' : 'Vehicles in Fleet'}
        </span>
      </div>

      {/* 3. Grid of Vehicles or Empty State */}
      {vehicles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-4 shadow-2xs">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Bus className="w-8 h-8 text-slate-400" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800 text-base">
              {isRTL ? 'لا توجد مركبات مسجلة في أسطول هذه الشركة' : 'No vehicles registered in fleet for this company'}
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              {isRTL
                ? 'يمكنك إضافة مركبات جديدة وتسجيل أسعارها بالضغط على زر "إضافة مركبة".'
                : 'You can add new vehicles and set their trip rates by clicking "+ Add Vehicle" above.'}
            </p>
          </div>
          {!isReadOnly && (
            <button
              onClick={() => {
                setSelectedVehicleForEdit(null);
                setIsAddVehicleOpen(true);
              }}
              className="inline-flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-2xs cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{t('transport.add_vehicle', 'إضافة مركبة')}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              {/* Vehicle Image or Clean Icon Container */}
              {vehicle.image ? (
                <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="relative h-36 w-full overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100/90 border-b border-slate-100 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-2xs border border-slate-100 flex items-center justify-center text-emerald-600">
                    <Bus className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <span className="text-xs font-semibold text-slate-600">{vehicle.name}</span>
                </div>
              )}

              {/* Card Content */}
              <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                {/* Header Row: Vehicle Type & Status Badge */}
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight truncate">
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
                {!isReadOnly && (
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
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Vehicle Modal */}
      <AddVehicleModal
        isOpen={isAddVehicleOpen}
        initialData={selectedVehicleForEdit}
        companyPhotos={currentCompany.photos}
        companyPricingRows={currentCompany.pricingRows}
        existingVehicles={vehicles}
        onClose={() => {
          setIsAddVehicleOpen(false);
          setSelectedVehicleForEdit(null);
        }}
        onSuccess={handleSaveVehicle}
      />

      {/* Delete Confirmation Modal */}
      {vehicleToDelete && createPortal(
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-fadeIn">
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
        </div>,
        document.body
      )}

      {/* Delete Success Alert */}
      {isDeleteSuccessOpen && createPortal(
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-fadeIn">
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
        </div>,
        document.body
      )}

      {/* Edit Company Modal */}
      <EditCompanyModal
        isOpen={isEditCompanyOpen}
        onClose={() => setIsEditCompanyOpen(false)}
        company={currentCompany}
        onSuccess={handleSaveCompany}
      />
    </div>
  );
}
