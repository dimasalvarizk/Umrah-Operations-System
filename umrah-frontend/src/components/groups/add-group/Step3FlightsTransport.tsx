import { useState, useEffect } from 'react';
import { ChevronDown, Calendar, Plane, Bus, User, Phone } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

interface Step3FlightsTransportProps {
  departureAirline?: string;
  setDepartureAirline?: (val: string) => void;
  departureFlightNo: string;
  setDepartureFlightNo: (val: string) => void;
  departureDate: string;
  setDepartureDate: (val: string) => void;
  departureDestination: string;
  setDepartureDestination: (val: string) => void;
  departureAirport: string;
  setDepartureAirport: (val: string) => void;
  arrivalAirline?: string;
  setArrivalAirline?: (val: string) => void;
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
  driverName?: string;
  setDriverName?: (val: string) => void;
  driverPhone?: string;
  setDriverPhone?: (val: string) => void;
  busPlateNo?: string;
  setBusPlateNo?: (val: string) => void;
}

export interface AirlineFlightPreset {
  code: string;
  nameEn: string;
  nameAr: string;
  depFlight: string;
  arrFlight: string;
  destEn: string;
  destAr: string;
  popularFlights: string[];
}

export const AIRLINE_PRESETS: Record<string, AirlineFlightPreset> = {
  'GA': {
    code: 'GA',
    nameEn: 'Garuda Indonesia',
    nameAr: 'جارودا إندونيسيا',
    depFlight: 'GA-981',
    arrFlight: 'GA-980',
    destEn: 'Indonesia, Jakarta (CGK)',
    destAr: 'إندونيسيا, جاكرتا (CGK)',
    popularFlights: ['GA-981', 'GA-980', 'GA-821', 'GA-820', 'GA-982', 'GA-983'],
  },
  'SV': {
    code: 'SV',
    nameEn: 'Saudia',
    nameAr: 'الخطوط السعودية',
    depFlight: 'SV-0379',
    arrFlight: 'SV-0378',
    destEn: 'Morocco, Casablanca (CMN)',
    destAr: 'المغرب, كازابلانكا (CMN)',
    popularFlights: ['SV-0379', 'SV-0378', 'SV-816', 'SV-817', 'SV-340', 'SV-341'],
  },
  'XY': {
    code: 'XY',
    nameEn: 'Flynas',
    nameAr: 'طيران ناس',
    depFlight: 'XY-241',
    arrFlight: 'XY-240',
    destEn: 'UAE, Dubai (DXB)',
    destAr: 'الإمارات, دبي (DXB)',
    popularFlights: ['XY-241', 'XY-240', 'XY-560', 'XY-561', 'XY-780'],
  },
  'MS': {
    code: 'MS',
    nameEn: 'EgyptAir',
    nameAr: 'مصر للطيران',
    depFlight: 'MS-662',
    arrFlight: 'MS-661',
    destEn: 'Egypt, Cairo (CAI)',
    destAr: 'مصر, القاهرة (CAI)',
    popularFlights: ['MS-662', 'MS-661', 'MS-664', 'MS-665', 'MS-670'],
  },
  'QR': {
    code: 'QR',
    nameEn: 'Qatar Airways',
    nameAr: 'الخطوط القطرية',
    depFlight: 'QR-1184',
    arrFlight: 'QR-1185',
    destEn: 'Qatar, Doha (DOH)',
    destAr: 'قطر, الدوحة (DOH)',
    popularFlights: ['QR-1184', 'QR-1185', 'QR-1168', 'QR-1169'],
  },
  'EK': {
    code: 'EK',
    nameEn: 'Emirates Airlines',
    nameAr: 'طيران الإمارات',
    depFlight: 'EK-803',
    arrFlight: 'EK-804',
    destEn: 'UAE, Dubai (DXB)',
    destAr: 'الإمارات, دبي (DXB)',
    popularFlights: ['EK-803', 'EK-804', 'EK-805', 'EK-806'],
  },
  'TK': {
    code: 'TK',
    nameEn: 'Turkish Airlines',
    nameAr: 'الخطوط التركية',
    depFlight: 'TK-108',
    arrFlight: 'TK-107',
    destEn: 'Turkey, Istanbul (IST)',
    destAr: 'تركيا, إسطنبول (IST)',
    popularFlights: ['TK-108', 'TK-107', 'TK-110', 'TK-111'],
  },
  'JT': {
    code: 'JT',
    nameEn: 'Lion Air',
    nameAr: 'ليون إير',
    depFlight: 'JT-081',
    arrFlight: 'JT-080',
    destEn: 'Indonesia, Jakarta (CGK)',
    destAr: 'إندونيسيا, جاكرتا (CGK)',
    popularFlights: ['JT-081', 'JT-080', 'JT-110', 'JT-111'],
  },
  'PK': {
    code: 'PK',
    nameEn: 'PIA Pakistan Intl',
    nameAr: 'الخطوط الباكستانية',
    depFlight: 'PK-741',
    arrFlight: 'PK-740',
    destEn: 'Pakistan, Islamabad (ISB)',
    destAr: 'باكستان, إسلام آباد (ISB)',
    popularFlights: ['PK-741', 'PK-740', 'PK-760', 'PK-761'],
  },
  'WY': {
    code: 'WY',
    nameEn: 'Oman Air',
    nameAr: 'الطيران العماني',
    depFlight: 'WY-672',
    arrFlight: 'WY-671',
    destEn: 'Oman, Muscat (MCT)',
    destAr: 'عُمان, مسقط (MCT)',
    popularFlights: ['WY-672', 'WY-671', 'WY-674', 'WY-675'],
  },
  'GF': {
    code: 'GF',
    nameEn: 'Gulf Air',
    nameAr: 'طيران الخليج',
    depFlight: 'GF-172',
    arrFlight: 'GF-171',
    destEn: 'Bahrain, Manama (BAH)',
    destAr: 'البحرين, المنامة (BAH)',
    popularFlights: ['GF-172', 'GF-171', 'GF-174'],
  },
  'EY': {
    code: 'EY',
    nameEn: 'Etihad Airways',
    nameAr: 'الاتحاد للطيران',
    depFlight: 'EY-311',
    arrFlight: 'EY-312',
    destEn: 'UAE, Abu Dhabi (AUH)',
    destAr: 'الإمارات, أبوظبي (AUH)',
    popularFlights: ['EY-311', 'EY-312', 'EY-315', 'EY-316'],
  },
  'MH': {
    code: 'MH',
    nameEn: 'Malaysia Airlines',
    nameAr: 'الخطوط الماليزية',
    depFlight: 'MH-156',
    arrFlight: 'MH-157',
    destEn: 'Malaysia, Kuala Lumpur (KUL)',
    destAr: 'ماليزيا, كوالالمبور (KUL)',
    popularFlights: ['MH-156', 'MH-157', 'MH-160', 'MH-161'],
  },
  'SQ': {
    code: 'SQ',
    nameEn: 'Singapore Airlines',
    nameAr: 'الخطوط السنغافورية',
    depFlight: 'SQ-468',
    arrFlight: 'SQ-469',
    destEn: 'Singapore (SIN)',
    destAr: 'سنغافورة (SIN)',
    popularFlights: ['SQ-468', 'SQ-469'],
  },
  'AT': {
    code: 'AT',
    nameEn: 'Royal Air Maroc',
    nameAr: 'الخطوط الملكية المغربية',
    depFlight: 'AT-251',
    arrFlight: 'AT-250',
    destEn: 'Morocco, Casablanca (CMN)',
    destAr: 'المغرب, كازابلانكا (CMN)',
    popularFlights: ['AT-251', 'AT-250', 'AT-252'],
  },
};

export const resolveAirlinePreset = (airlineName?: string, airlinesList?: Array<{ code?: string; nameEn?: string; nameAr?: string }>): AirlineFlightPreset => {
  if (!airlineName) return AIRLINE_PRESETS['SV'];
  
  // 1. Direct match by code in parentheses (e.g. "Garuda Indonesia (GA)")
  const parenMatch = airlineName.match(/\(([A-Z0-9]{2,3})\)/i);
  if (parenMatch) {
    const code = parenMatch[1].toUpperCase();
    if (AIRLINE_PRESETS[code]) return AIRLINE_PRESETS[code];
    return {
      code,
      nameEn: airlineName,
      nameAr: airlineName,
      depFlight: `${code}-0379`,
      arrFlight: `${code}-0378`,
      destEn: 'International Port',
      destAr: 'المنفذ الدولي',
      popularFlights: [`${code}-0379`, `${code}-0378`],
    };
  }

  // 2. Search in custom airlinesList
  if (airlinesList) {
    const found = airlinesList.find(
      (a) => a.nameAr === airlineName || a.nameEn === airlineName || (a.code && airlineName.toUpperCase().includes(a.code.toUpperCase()))
    );
    if (found?.code) {
      const code = found.code.toUpperCase();
      if (AIRLINE_PRESETS[code]) return AIRLINE_PRESETS[code];
      return {
        code,
        nameEn: found.nameEn || airlineName,
        nameAr: found.nameAr || airlineName,
        depFlight: `${code}-0379`,
        arrFlight: `${code}-0378`,
        destEn: 'International Port',
        destAr: 'المنفذ الدولي',
        popularFlights: [`${code}-0379`, `${code}-0378`],
      };
    }
  }

  // 3. Search key names in presets
  for (const preset of Object.values(AIRLINE_PRESETS)) {
    if (
      airlineName.toLowerCase().includes(preset.nameEn.toLowerCase()) ||
      airlineName.includes(preset.nameAr) ||
      airlineName.toUpperCase().includes(preset.code)
    ) {
      return preset;
    }
  }

  return {
    code: 'SV',
    nameEn: airlineName,
    nameAr: airlineName,
    depFlight: 'SV-0379',
    arrFlight: 'SV-0378',
    destEn: 'Morocco, Casablanca (CMN)',
    destAr: 'المغرب, كازابلانكا (CMN)',
    popularFlights: ['SV-0379', 'SV-0378'],
  };
};

const DEFAULT_AIRLINES = [
  { id: '1', nameEn: 'Saudia', nameAr: 'الخطوط السعودية', code: 'SV' },
  { id: '2', nameEn: 'Flynas', nameAr: 'طيران ناس', code: 'XY' },
  { id: '3', nameEn: 'Garuda Indonesia', nameAr: 'جارودا إندونيسيا', code: 'GA' },
  { id: '4', nameEn: 'EgyptAir', nameAr: 'مصر للطيران', code: 'MS' },
  { id: '5', nameEn: 'Qatar Airways', nameAr: 'الخطوط القطرية', code: 'QR' },
  { id: '6', nameEn: 'Emirates Airlines', nameAr: 'طيران الإمارات', code: 'EK' },
  { id: '7', nameEn: 'Turkish Airlines', nameAr: 'الخطوط التركية', code: 'TK' },
  { id: '8', nameEn: 'Lion Air', nameAr: 'ليون إير', code: 'JT' },
];

const DEFAULT_TRANSPORT = [
  { id: '1', nameEn: 'SAPTO Transport Company', nameAr: 'شركة سابتكو للنقل (SAPTO)', driverNameEn: 'Abdullah Al-Harbi', driverNameAr: 'عبدالله الحربي', phone: '+966 50 123 4567', plate: '4821 BDA' },
  { id: '2', nameEn: 'Dallah Transport Fleet', nameAr: 'أسطول دله للنقل (Dallah)', driverNameEn: 'Mohammed Al-Omari', driverNameAr: 'محمد العمري', phone: '+966 55 987 6543', plate: '9912 KSA' },
  { id: '3', nameEn: 'Rawahel Al-Mashaer', nameAr: 'شركة رواحل المشاعر (Rawahel)', driverNameEn: 'Tariq Al-Ghamdi', driverNameAr: 'طارق الغامدي', phone: '+966 54 333 2211', plate: '3104 HTA' },
  { id: '4', nameEn: 'Qawafil International', nameAr: 'شركة قوافل الدولية (Qawafil)', driverNameEn: 'Saleh Al-Otaibi', driverNameAr: 'صالح العتيبي', phone: '+966 56 777 8899', plate: '5561 RBA' },
  { id: '5', nameEn: 'Al-Qaid Transport', nameAr: 'شركة القائد لخدمات النقل (Al-Qaid)', driverNameEn: 'Ahmed Al-Shehri', driverNameAr: 'أحمد الشهري', phone: '+966 53 444 5566', plate: '7289 UMA' },
  { id: '6', nameEn: 'Haramain Express Transport', nameAr: 'نقل الحرمين السريع', driverNameEn: 'Faisal Al-Zahrani', driverNameAr: 'فيصل الزهراني', phone: '+966 59 111 2233', plate: '1092 MDN' },
  { id: '7', nameEn: 'Al Rajhi Transport', nameAr: 'شركة الراجحي للنقل', driverNameEn: 'Khalid Al-Dossari', driverNameAr: 'خالد الدوسري', phone: '+966 50 888 9900', plate: '8401 MKH' },
  { id: '8', nameEn: 'Royal Transport Co.', nameAr: 'الشركة الملكية للنقل', driverNameEn: 'Yasser Al-Qahtani', driverNameAr: 'ياسر القحطاني', phone: '+966 55 444 3322', plate: '6203 JED' },
  { id: '9', nameEn: 'Hafil Transport Company', nameAr: 'شركة حافل لنقل الحجاج', driverNameEn: 'Sami Al-Sulami', driverNameAr: 'سامي السلمي', phone: '+966 51 234 5678', plate: '9312 HFL' },
];

export default function Step3FlightsTransport({
  departureAirline = 'الخطوط السعودية',
  setDepartureAirline,
  departureFlightNo,
  setDepartureFlightNo,
  departureDate,
  setDepartureDate,
  departureDestination,
  setDepartureDestination,
  departureAirport,
  setDepartureAirport,
  arrivalAirline = 'الخطوط السعودية',
  setArrivalAirline,
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
  driverName,
  setDriverName,
  driverPhone,
  setDriverPhone,
  busPlateNo,
  setBusPlateNo,
}: Step3FlightsTransportProps) {
  const { t, isRTL } = useLanguage();

  const [airlines, setAirlines] = useState(DEFAULT_AIRLINES);
  const [transportCompanies, setTransportCompanies] = useState(DEFAULT_TRANSPORT);

  useEffect(() => {
    try {
      const savedAirlines = localStorage.getItem('system_list_airlines');
      if (savedAirlines) {
        const parsed = JSON.parse(savedAirlines);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAirlines(parsed);
        }
      }
      const savedTransport = localStorage.getItem('system_list_transport');
      if (savedTransport) {
        const parsedT = JSON.parse(savedTransport);
        if (Array.isArray(parsedT) && parsedT.length > 0) {
          setTransportCompanies(parsedT);
        }
      }
    } catch {
      // Fallback to defaults
    }
  }, []);

  // Auto-sync initial flight numbers if empty or unaligned with selected airline
  useEffect(() => {
    if (departureAirline) {
      const p = resolveAirlinePreset(departureAirline, airlines);
      if (!departureFlightNo || (departureFlightNo === 'SV-0379' && p.code !== 'SV')) {
        if (setDepartureFlightNo) setDepartureFlightNo(p.depFlight);
        if (setDepartureDestination && (!departureDestination || departureDestination.includes('Casablanca') || departureDestination.includes('كازابلانكا'))) {
          setDepartureDestination(isRTL ? p.destAr : p.destEn);
        }
      }
    }
  }, [departureAirline, airlines]);

  useEffect(() => {
    if (arrivalAirline) {
      const p = resolveAirlinePreset(arrivalAirline, airlines);
      if (!arrivalFlightNo || (arrivalFlightNo === 'SV-0378' && p.code !== 'SV')) {
        if (setArrivalFlightNo) setArrivalFlightNo(p.arrFlight);
        if (setArrivalOrigin && (!arrivalOrigin || arrivalOrigin.includes('Casablanca') || arrivalOrigin.includes('كازابلانكا'))) {
          setArrivalOrigin(isRTL ? p.destAr : p.destEn);
        }
      }
    }
  }, [arrivalAirline, airlines]);

  const handleDepartureAirlineChange = (airlineVal: string) => {
    if (setDepartureAirline) setDepartureAirline(airlineVal);
    const p = resolveAirlinePreset(airlineVal, airlines);
    if (setDepartureFlightNo) {
      setDepartureFlightNo(p.depFlight);
    }
    if (
      setDepartureDestination &&
      (!departureDestination ||
        departureDestination.includes('Casablanca') ||
        departureDestination.includes('كازابلانكا') ||
        departureDestination.trim() === '')
    ) {
      setDepartureDestination(isRTL ? p.destAr : p.destEn);
    }
  };

  const handleArrivalAirlineChange = (airlineVal: string) => {
    if (setArrivalAirline) setArrivalAirline(airlineVal);
    const p = resolveAirlinePreset(airlineVal, airlines);
    if (setArrivalFlightNo) {
      setArrivalFlightNo(p.arrFlight);
    }
    if (
      setArrivalOrigin &&
      (!arrivalOrigin ||
        arrivalOrigin.includes('Casablanca') ||
        arrivalOrigin.includes('كازابلانكا') ||
        arrivalOrigin.trim() === '')
    ) {
      setArrivalOrigin(isRTL ? p.destAr : p.destEn);
    }
  };

  const handleCompanyChange = (companyVal: string) => {
    setTransportCompany(companyVal);
    const matched = transportCompanies.find(
      (tc: any) => tc.nameAr === companyVal || tc.nameEn === companyVal
    );
    if (matched) {
      if (setDriverName && (!driverName || driverName.trim() === '')) {
        setDriverName(isRTL ? (matched.driverNameAr || 'سائق معتمد') : (matched.driverNameEn || 'Certified Driver'));
      }
      if (setDriverPhone && (!driverPhone || driverPhone.trim() === '')) {
        setDriverPhone(matched.phone || '+966 50 123 4567');
      }
      if (setBusPlateNo && (!busPlateNo || busPlateNo.trim() === '')) {
        setBusPlateNo(matched.plate || '4821 BDA');
      }
    }
  };

  const currentDepPreset = resolveAirlinePreset(departureAirline, airlines);
  const currentArrPreset = resolveAirlinePreset(arrivalAirline, airlines);

  return (
    <div className="space-y-4">
      {/* Air Flights Header */}
      <div className="flex items-center gap-1.5 text-slate-900 font-bold text-sm">
        <Plane className="w-4 h-4 text-emerald-600" />
        <span>{isRTL ? 'الرحلات الجوية ومطارات الوصول' : 'Flights & Airport Arrivals'}</span>
      </div>

      {/* Two Flight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Departure Flight Card */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              {t('groups.departure_flight', 'رحلة المغادرة')}
            </h3>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {isRTL ? 'مغادرة المملكة' : 'Outbound Flight'}
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <span>{isRTL ? 'شركة الطيران (الناقل)' : 'Airline / Carrier'}</span>
                <span className="text-red-500">*</span>
              </span>
              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                {currentDepPreset.code}
              </span>
            </label>
            <div className="relative">
              <select
                value={departureAirline}
                onChange={(e) => handleDepartureAirlineChange(e.target.value)}
                className={`w-full appearance-none bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 transition shadow-2xs ${
                  isRTL ? 'pr-3.5 pl-9 text-right' : 'pl-3.5 pr-9 text-left'
                }`}
              >
                {airlines.map((al) => (
                  <option key={al.id} value={isRTL ? al.nameAr : al.nameEn}>
                    {isRTL ? al.nameAr : al.nameEn} ({al.code})
                  </option>
                ))}
              </select>
              <ChevronDown className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                isRTL ? 'left-3' : 'right-3'
              }`} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <span>{isRTL ? 'رقم الرحلة' : 'Flight Number'}</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder={isRTL ? `مثال: ${currentDepPreset.depFlight}` : `e.g. ${currentDepPreset.depFlight}`}
                value={departureFlightNo}
                onChange={(e) => setDepartureFlightNo(e.target.value)}
                className="w-full bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 font-bold placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-1 focus:ring-emerald-500 transition font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                {isRTL ? 'تاريخ المغادرة' : 'Departure Date'}
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className={`w-full bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
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
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <span>{isRTL ? 'وجهة المغادرة (المدينة)' : 'Destination City'}</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={departureDestination}
                onChange={(e) => setDepartureDestination(e.target.value)}
                className="w-full bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-700 font-medium shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-300 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
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
                  <option value="مطار الملك عبد العزيز - جدة (JED)">
                    {isRTL ? 'مطار الملك عبد العزيز الدولي - جدة (JED)' : 'King Abdulaziz Int. Airport - Jeddah (JED)'}
                  </option>
                  <option value="مطار الأمير محمد بن عبدالعزيز - المدينة (MED)">
                    {isRTL ? 'مطار الأمير محمد بن عبدالعزيز الدولي - المدينة (MED)' : 'Prince Mohammad Bin Abdulaziz Int. Airport - Madinah (MED)'}
                  </option>
                  <option value="مطار الطائف الدولي (TIF)">
                    {isRTL ? 'مطار الطائف الدولي (TIF)' : 'Taif International Airport (TIF)'}
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
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              {t('groups.arrival_flight', 'رحلة القدوم')}
            </h3>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {isRTL ? 'الوصول للمملكة' : 'Inbound Arrival'}
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <span>{isRTL ? 'شركة الطيران (الناقل)' : 'Airline / Carrier'}</span>
                <span className="text-red-500">*</span>
              </span>
              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                {currentArrPreset.code}
              </span>
            </label>
            <div className="relative">
              <select
                value={arrivalAirline}
                onChange={(e) => handleArrivalAirlineChange(e.target.value)}
                className={`w-full appearance-none bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 transition shadow-2xs ${
                  isRTL ? 'pr-3.5 pl-9 text-right' : 'pl-3.5 pr-9 text-left'
                }`}
              >
                {airlines.map((al) => (
                  <option key={al.id} value={isRTL ? al.nameAr : al.nameEn}>
                    {isRTL ? al.nameAr : al.nameEn} ({al.code})
                  </option>
                ))}
              </select>
              <ChevronDown className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                isRTL ? 'left-3' : 'right-3'
              }`} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <span>{isRTL ? 'رقم الرحلة' : 'Flight Number'}</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder={isRTL ? `مثال: ${currentArrPreset.arrFlight}` : `e.g. ${currentArrPreset.arrFlight}`}
                value={arrivalFlightNo}
                onChange={(e) => setArrivalFlightNo(e.target.value)}
                className="w-full bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 font-bold placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-1 focus:ring-emerald-500 transition font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                {isRTL ? 'تاريخ الوصول' : 'Arrival Date'}
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  className={`w-full bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
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
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <span>{isRTL ? 'جهة القدوم (البلد / المدينة)' : 'Origin City / Port'}</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={arrivalOrigin}
                onChange={(e) => setArrivalOrigin(e.target.value)}
                className="w-full bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-700 font-medium shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-300 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
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
                  <option value="مطار الملك عبد العزيز - جدة (JED)">
                    {isRTL ? 'مطار الملك عبد العزيز الدولي - جدة (JED)' : 'King Abdulaziz Int. Airport - Jeddah (JED)'}
                  </option>
                  <option value="مطار الأمير محمد بن عبدالعزيز - المدينة (MED)">
                    {isRTL ? 'مطار الأمير محمد بن عبدالعزيز الدولي - المدينة (MED)' : 'Prince Mohammad Bin Abdulaziz Int. Airport - Madinah (MED)'}
                  </option>
                  <option value="مطار الطائف الدولي (TIF)">
                    {isRTL ? 'مطار الطائف الدولي (TIF)' : 'Taif International Airport (TIF)'}
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
        <span>{isRTL ? 'النقل البري وتفويج الحافلات' : 'Land Transport & Bus Operations'}</span>
      </div>

      {/* Land Transportation Card */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs space-y-4">
        {/* Row 1: Transport Company & Operation Code */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
          <div className="md:col-span-7 space-y-1.5">
            <label className="text-xs font-normal text-slate-600 flex items-center gap-1">
              <span>{t('groups.transport_company', 'شركة النقل')}</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={transportCompany}
                onChange={(e) => handleCompanyChange(e.target.value)}
                className={`w-full appearance-none bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 font-normal cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-300 transition shadow-2xs ${
                  isRTL ? 'pr-3.5 pl-9 text-right' : 'pl-3.5 pr-9 text-left'
                }`}
              >
                <option value="">{isRTL ? 'اختر شركة النقل البري' : 'Select Transport Company'}</option>
                {transportCompanies.map((tc) => (
                  <option key={tc.id} value={isRTL ? tc.nameAr : tc.nameEn}>
                    {isRTL ? tc.nameAr : tc.nameEn}
                  </option>
                ))}
              </select>
              <ChevronDown className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                isRTL ? 'left-3' : 'right-3'
              }`} />
            </div>
          </div>

          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-normal text-slate-600 flex items-center gap-1">
              <span>{isRTL ? 'رقم التشغيل والتفويج' : 'Operation Code'}</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder={isRTL ? 'أدخل رقم التشغيل (مثال: OPS-7489)' : 'e.g. OPS-7489'}
              value={operationNumber}
              onChange={(e) => setOperationNumber(e.target.value)}
              className="w-full bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-300 transition font-mono"
            />
          </div>
        </div>

        {/* Row 2: Driver Details & Vehicle Info */}
        <div className="pt-3 border-t border-slate-100">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isRTL ? 'بيانات السائق والحافلة' : "Driver & Vehicle Details"}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Driver Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-normal text-slate-600 flex items-center gap-1">
                <span>{isRTL ? 'اسم السائق' : 'Driver Name'}</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={isRTL ? 'مثال: عبدالله الحربي' : 'e.g. Abdullah Al-Harbi'}
                  value={driverName || ''}
                  onChange={(e) => setDriverName && setDriverName(e.target.value)}
                  className={`w-full bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-300 transition ${
                    isRTL ? 'pr-8 pl-3 text-right' : 'pl-8 pr-3 text-left'
                  }`}
                />
                <User className={`w-3.5 h-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                  isRTL ? 'right-2.5' : 'left-2.5'
                }`} />
              </div>
            </div>

            {/* Driver Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-normal text-slate-600 flex items-center gap-1">
                <span>{isRTL ? 'رقم جوال السائق' : 'Driver Phone Number'}</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  dir="ltr"
                  placeholder="+966 5x xxx xxxx"
                  value={driverPhone || ''}
                  onChange={(e) => setDriverPhone && setDriverPhone(e.target.value)}
                  className={`w-full bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-300 transition font-mono ${
                    isRTL ? 'pr-8 pl-3 text-left' : 'pl-8 pr-3 text-left'
                  }`}
                />
                <Phone className={`w-3.5 h-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                  isRTL ? 'right-2.5' : 'left-2.5'
                }`} />
              </div>
            </div>

            {/* Bus / Vehicle Plate Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-normal text-slate-600 flex items-center gap-1">
                <span>{isRTL ? 'رقم لوحة الحافلة' : 'Bus Plate Number'}</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={isRTL ? 'مثال: ٤٨٢١ ب د أ' : 'e.g. 4821 BDA'}
                  value={busPlateNo || ''}
                  onChange={(e) => setBusPlateNo && setBusPlateNo(e.target.value)}
                  className={`w-full bg-white border border-slate-200/90 rounded-lg py-2.5 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-300 transition font-mono ${
                    isRTL ? 'pr-8 pl-3 text-right' : 'pl-8 pr-3 text-left'
                  }`}
                />
                <Bus className={`w-3.5 h-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                  isRTL ? 'right-2.5' : 'left-2.5'
                }`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


