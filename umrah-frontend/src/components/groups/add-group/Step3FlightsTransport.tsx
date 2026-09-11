import { ChevronDown, Calendar, Plane, Bus } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

interface Step3FlightsTransportProps {
  departureFlightNo: string;
  setDepartureFlightNo: (val: string) => void;
  departureDate: string;
  setDepartureDate: (val: string) => void;
  departureDestination: string;
  setDepartureDestination: (val: string) => void;
  departureAirport: string;
  setDepartureAirport: (val: string) => void;
  arrivalFlightNo: string;
  setArrivalFlightNo: (val: string) => void;
  arrivalDate: string;
  setArrivalDate: (val: string) => void;
  arrivalOrigin: string;
  setArrivalOrigin: (val: string) => void;
  arrivalAirport: string;
  setArrivalAirport: (val: string) => void;
  transportCompany: string;
  setTransportCompany: (val: string) => void;
  operationNumber: string;
  setOperationNumber: (val: string) => void;
}

export default function Step3FlightsTransport({
  departureFlightNo,
  setDepartureFlightNo,
  departureDate,
  setDepartureDate,
  departureDestination,
  setDepartureDestination,
  departureAirport,
  setDepartureAirport,
  arrivalFlightNo,
  setArrivalFlightNo,
  arrivalDate,
  setArrivalDate,
  arrivalOrigin,
  setArrivalOrigin,
  arrivalAirport,
  setArrivalAirport,
  transportCompany,
  setTransportCompany,
  operationNumber,
  setOperationNumber,
}: Step3FlightsTransportProps) {
  const { t, isRTL } = useLanguage();

  return (
    <div className="space-y-4">
      {/* Air Flights Header */}
      <div className="flex items-center gap-1.5 text-slate-900 font-bold text-sm">
        <Plane className="w-4 h-4 text-emerald-600" />
        <span>{isRTL ? 'الرحلات الجوية' : 'Flights & Air Travel'}</span>
      </div>

      {/* Two Flight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Departure Flight Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {t('groups.departure_flight', 'رحلة المغادرة')}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-normal text-slate-600 flex items-center gap-1">
                <span>{isRTL ? 'رقم الرحلة' : 'Flight Number'}</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder={isRTL ? 'مثال: SV-0379' : 'e.g. SV-0379'}
                value={departureFlightNo}
                onChange={(e) => setDepartureFlightNo(e.target.value)}
                className="w-full bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-300 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-normal text-slate-600 block">
                {isRTL ? 'تاريخ المغادرة' : 'Departure Date'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className={`w-full bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-normal focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                    isRTL ? 'pr-3.5 pl-9 text-right' : 'pl-3.5 pr-9 text-left'
                  }`}
                />
                <Calendar className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                  isRTL ? 'left-3' : 'right-3'
                }`} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-normal text-slate-600 flex items-center gap-1">
                <span>{isRTL ? 'جهة المغادرة' : 'Destination'}</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={departureDestination}
                onChange={(e) => setDepartureDestination(e.target.value)}
                className="w-full bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-700 font-normal shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-300 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-normal text-slate-600 block">
                {t('groups.departure_airport', 'مطار المغادرة')}
              </label>
              <div className="relative">
                <select
                  value={departureAirport}
                  onChange={(e) => setDepartureAirport(e.target.value)}
                  className={`w-full appearance-none bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-normal cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                    isRTL ? 'pr-3.5 pl-9 text-right' : 'pl-3.5 pr-9 text-left'
                  }`}
                >
                  <option value="مطار الأمير محمد بن عبدالعزيز - المدينة">
                    {isRTL ? 'مطار الأمير محمد بن عبدالعزيز - المدينة' : 'Prince Mohammad Bin Abdulaziz Airport - Madinah'}
                  </option>
                  <option value="مطار الملك عبد العزيز - جدة">
                    {isRTL ? 'مطار الملك عبد العزيز - جدة' : 'King Abdulaziz Airport - Jeddah'}
                  </option>
                  <option value="مطار الطائف الدولي">
                    {isRTL ? 'مطار الطائف الدولي' : 'Taif International Airport'}
                  </option>
                </select>
                <ChevronDown className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                  isRTL ? 'left-3' : 'right-3'
                }`} />
              </div>
            </div>
          </div>
        </div>

        {/* Arrival Flight Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {t('groups.arrival_flight', 'رحلة القدوم')}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-normal text-slate-600 flex items-center gap-1">
                <span>{isRTL ? 'رقم الرحلة' : 'Flight Number'}</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={arrivalFlightNo}
                onChange={(e) => setArrivalFlightNo(e.target.value)}
                className="w-full bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-700 font-normal shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-300 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-normal text-slate-600 block">
                {isRTL ? 'تاريخ الوصول' : 'Arrival Date'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  className={`w-full bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-normal focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                    isRTL ? 'pr-3.5 pl-9 text-right' : 'pl-3.5 pr-9 text-left'
                  }`}
                />
                <Calendar className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                  isRTL ? 'left-3' : 'right-3'
                }`} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-normal text-slate-600 flex items-center gap-1">
                <span>{isRTL ? 'جهة القدوم' : 'Origin / Port'}</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={arrivalOrigin}
                onChange={(e) => setArrivalOrigin(e.target.value)}
                className="w-full bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-700 font-normal shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-300 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-normal text-slate-600 block">
                {t('groups.arrival_airport', 'مطار القدوم')}
              </label>
              <div className="relative">
                <select
                  value={arrivalAirport}
                  onChange={(e) => setArrivalAirport(e.target.value)}
                  className={`w-full appearance-none bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-normal cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                    isRTL ? 'pr-3.5 pl-9 text-right' : 'pl-3.5 pr-9 text-left'
                  }`}
                >
                  <option value="مطار الملك عبد العزيز - جدة">
                    {isRTL ? 'مطار الملك عبد العزيز - جدة' : 'King Abdulaziz Airport - Jeddah'}
                  </option>
                  <option value="مطار الأمير محمد بن عبدالعزيز - المدينة">
                    {isRTL ? 'مطار الأمير محمد بن عبدالعزيز - المدينة' : 'Prince Mohammad Bin Abdulaziz Airport - Madinah'}
                  </option>
                  <option value="مطار الطائف الدولي">
                    {isRTL ? 'مطار الطائف الدولي' : 'Taif International Airport'}
                  </option>
                </select>
                <ChevronDown className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                  isRTL ? 'left-3' : 'right-3'
                }`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Land Transportation Header */}
      <div className="flex items-center gap-1.5 text-slate-900 font-bold text-sm pt-2">
        <Bus className="w-4 h-4 text-emerald-600" />
        <span>{isRTL ? 'النقل البري' : 'Land Transport'}</span>
      </div>

      {/* Land Transportation Card */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
          <div className="md:col-span-7 space-y-1.5">
            <label className="text-xs font-normal text-slate-600 flex items-center gap-1">
              <span>{t('groups.transport_company', 'شركة النقل')}</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={transportCompany}
                onChange={(e) => setTransportCompany(e.target.value)}
                className={`w-full appearance-none bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-normal cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                  isRTL ? 'pr-3.5 pl-9 text-right' : 'pl-3.5 pr-9 text-left'
                }`}
              >
                <option value="">{isRTL ? 'اختر شركة النقل البري' : 'Select Transport Company'}</option>
                <option value="شركة حافل للنقل">{isRTL ? 'شركة حافل للنقل' : 'Hafil Transport Company'}</option>
                <option value="شركة سابتكو (SAPTCO)">{isRTL ? 'شركة سابتكو (SAPTCO)' : 'SAPTCO Bus Co.'}</option>
                <option value="شركة رواحل المشاعر">{isRTL ? 'شركة رواحل المشاعر' : 'Rawahel Al-Mashaer'}</option>
                <option value="شركة دروب النور">{isRTL ? 'شركة دروب النور' : 'Duroob Al-Noor Fleet'}</option>
              </select>
              <ChevronDown className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                isRTL ? 'left-3' : 'right-3'
              }`} />
            </div>
          </div>

          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-normal text-slate-600 flex items-center gap-1">
              <span>{isRTL ? 'رقم التشغيل' : 'Operation Code'}</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder={isRTL ? 'أدخل رقم التشغيل' : 'e.g. OPS-7489'}
              value={operationNumber}
              onChange={(e) => setOperationNumber(e.target.value)}
              className="w-full bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-300 transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
