import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import StepperHeader from './add-group/StepperHeader';
import Step1BasicInfo from './add-group/Step1BasicInfo';
import Step2Hotels from './add-group/Step2Hotels';
import Step3FlightsTransport from './add-group/Step3FlightsTransport';
import Step4PermitsNotes from './add-group/Step4PermitsNotes';
import StepSuccessDialog from './add-group/StepSuccessDialog';
import { useLanguage } from '../../context/LanguageContext';

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newGroup: any) => void;
  initialData?: any;
}

export default function AddGroupModal({ isOpen, onClose, onSuccess, initialData }: AddGroupModalProps) {
  const { t, isRTL, direction } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);

  // Step 1 State (Basic Info)
  const [groupName, setGroupName] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [agreementNumber, setAgreementNumber] = useState('AGR-1125900');
  const [subAgent, setSubAgent] = useState('');
  const [mainAgent, setMainAgent] = useState('');
  const [pilgrimsCount, setPilgrimsCount] = useState(150);
  const [nationality, setNationality] = useState('');
  const [packageType, setPackageType] = useState('باقة كبار الشخصيات التنفيذية (١٤ يوم)');

  // Step 2 State (Hotels)
  const [makkahHotel1, setMakkahHotel1] = useState('');
  const [makkah1CheckIn, setMakkah1CheckIn] = useState('2024-08-15');
  const [makkah1CheckOut, setMakkah1CheckOut] = useState('2024-08-20');

  const [madinahHotel, setMadinahHotel] = useState('');
  const [madinahCheckIn, setMadinahCheckIn] = useState('2024-08-20');
  const [madinahCheckOut, setMadinahCheckOut] = useState('2024-08-25');

  const [makkahHotel2, setMakkahHotel2] = useState('');
  const [makkah2CheckIn, setMakkah2CheckIn] = useState('');
  const [makkah2CheckOut, setMakkah2CheckOut] = useState('');

  const [hospitalityNotes, setHospitalityNotes] = useState('');

  // Step 3 State (Flights & Transport)
  const [departureAirline, setDepartureAirline] = useState('الخطوط السعودية');
  const [departureFlightNo, setDepartureFlightNo] = useState('SV-0379');
  const [departureDate, setDepartureDate] = useState('2024-08-25');
  const [departureDestination, setDepartureDestination] = useState(isRTL ? 'المغرب, كازابلانكا' : 'Morocco, Casablanca');
  const [departureAirport, setDepartureAirport] = useState('مطار الأمير محمد بن عبدالعزيز - المدينة (MED)');

  const [arrivalAirline, setArrivalAirline] = useState('الخطوط السعودية');
  const [arrivalFlightNo, setArrivalFlightNo] = useState('SV-0378');
  const [arrivalDate, setArrivalDate] = useState('2024-08-15');
  const [arrivalOrigin, setArrivalOrigin] = useState(isRTL ? 'المغرب, كازابلانكا' : 'Morocco, Casablanca');
  const [arrivalAirport, setArrivalAirport] = useState('مطار الملك عبد العزيز - جدة (JED)');

  const [transportCompany, setTransportCompany] = useState('');
  const [operationNumber, setOperationNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [busPlateNo, setBusPlateNo] = useState('');

  // Step 4 State (Movements, Agreements & Additional Notes)
  const [arrivalGrouping, setArrivalGrouping] = useState('مكتمل');
  const [interCityGrouping, setInterCityGrouping] = useState('معلق');
  const [departureGrouping, setDepartureGrouping] = useState('لا يوجد');
  const [makkahZiyarat, setMakkahZiyarat] = useState('');
  const [madinahZiyarat, setMadinahZiyarat] = useState('');

  const [umrahPermitStatus, setUmrahPermitStatus] = useState('مقبول');
  const [rawdahMenPermitStatus, setRawdahMenPermitStatus] = useState('قيد المراجعة');
  const [rawdahWomenPermitStatus, setRawdahWomenPermitStatus] = useState('لم يقدم');

  const [enrichmentProgram, setEnrichmentProgram] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [missingRequirements, setMissingRequirements] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, { name: string; size?: number; url?: string; type?: string; uploadedAt?: string; categoryTitle?: string }>>({
    arrivalGrouping: {
      name: 'Frame 82717156.png',
      size: 348120,
      uploadedAt: new Date().toLocaleDateString('en-GB'),
      categoryTitle: isRTL ? 'تفويج الوصول' : 'Arrival Grouping',
    },
  });

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setIsSuccess(false);

      if (initialData) {
        setGroupName(initialData.name || '');
        setGroupCode(initialData.groupCodeNumber || initialData.code || '');
        setAgreementNumber(initialData.agreementNumber || 'AGR-1125900');
        setSubAgent(initialData.subAgent || '');
        setMainAgent(initialData.mainAgent || '');
        setPilgrimsCount(initialData.pilgrimsCount || 150);
        setNationality(initialData.nationality || '');
        setPackageType(initialData.packageType || (isRTL ? 'باقة كبار الشخصيات التنفيذية (١٤ يوم)' : 'VIP Executive 14 Days'));
        setMakkahHotel1(initialData.makkahHotel || '');
        setMakkah1CheckIn(initialData.makkahCheckIn || '2024-08-15');
        setMakkah1CheckOut(initialData.makkahCheckOut || '2024-08-20');
        setMadinahHotel(initialData.madinahHotel || '');
        setMadinahCheckIn(initialData.madinahCheckIn || '2024-08-20');
        setMadinahCheckOut(initialData.madinahCheckOut || '2024-08-25');
        setDepartureFlightNo(initialData.departureFlightNo || '');
        setDepartureDate(initialData.departureDate || '2024-08-25');
        setDepartureAirport(initialData.departureAirport || 'مطار الأمير محمد بن عبدالعزيز - المدينة');
        setArrivalFlightNo(initialData.arrivalFlightNo || 'SV-0378');
        setArrivalDate(initialData.arrivalDate || '2024-08-15');
        setArrivalAirport(initialData.arrivalAirport || 'مطار الملك عبد العزيز - جدة');
        setTransportCompany(initialData.transportCompany || '');
        setOperationNumber(initialData.operationNumber || '');
        setDriverName(initialData.driverName || '');
        setDriverPhone(initialData.driverPhone || '');
        setBusPlateNo(initialData.busPlateNo || initialData.busNumber || '');
        setArrivalGrouping(initialData.arrivalGrouping || 'مكتمل');
        setInterCityGrouping(initialData.interCityGrouping || 'معلق');
        setDepartureGrouping(initialData.departureGrouping || 'لا يوجد');
        setUmrahPermitStatus(initialData.umrahPermitStatus || 'مقبول');
        setRawdahMenPermitStatus(initialData.rawdahMenPermitStatus || 'قيد المراجعة');
        setRawdahWomenPermitStatus(initialData.rawdahWomenPermitStatus || 'لم يقدم');
        setUploadedFiles(initialData.uploadedFiles || {
          arrivalGrouping: {
            name: 'Frame 82717156.png',
            size: 348120,
            uploadedAt: new Date().toLocaleDateString('en-GB'),
            categoryTitle: isRTL ? 'تفويج الوصول' : 'Arrival Grouping',
          },
        });
      } else {
        setGroupName('');
        setGroupCode('');
        setSubAgent('');
        setMainAgent('');
        setPilgrimsCount(150);
        setNationality('');
        setPackageType(isRTL ? 'باقة كبار الشخصيات التنفيذية (١٤ يوم)' : 'VIP Executive 14 Days');
        setMakkahHotel1('');
        setMakkah1CheckIn('2024-08-15');
        setMakkah1CheckOut('2024-08-20');
        setMadinahHotel('');
        setMadinahCheckIn('2024-08-20');
        setMadinahCheckOut('2024-08-25');
        setMakkahHotel2('');
        setMakkah2CheckIn('');
        setMakkah2CheckOut('');
        setHospitalityNotes('');
        setDepartureFlightNo('');
        setDepartureDate('2024-08-25');
        setDepartureDestination(isRTL ? 'المغرب, كازابلانكا' : 'Morocco, Casablanca');
        setDepartureAirport('مطار الأمير محمد بن عبدالعزيز - المدينة');
        setArrivalFlightNo('SV-0378');
        setArrivalDate('2024-08-15');
        setArrivalOrigin(isRTL ? 'المغرب, كازابلانكا' : 'Morocco, Casablanca');
        setArrivalAirport('مطار الملك عبد العزيز - جدة');
        setTransportCompany('');
        setOperationNumber('');
        setDriverName('');
        setDriverPhone('');
        setBusPlateNo('');
        setArrivalGrouping('مكتمل');
        setInterCityGrouping('معلق');
        setDepartureGrouping('لا يوجد');
        setMakkahZiyarat('');
        setMadinahZiyarat('');
        setUmrahPermitStatus('مقبول');
        setRawdahMenPermitStatus('قيد المراجعة');
        setRawdahWomenPermitStatus('لم يقدم');
        setEnrichmentProgram('');
        setAdditionalNotes('');
        setMissingRequirements('');
        setUploadedFiles({
          arrivalGrouping: {
            name: 'Frame 82717156.png',
            size: 348120,
            uploadedAt: new Date().toLocaleDateString('en-GB'),
            categoryTitle: isRTL ? 'تفويج الوصول' : 'Arrival Grouping',
          },
        });
      }
    }
  }, [isOpen, initialData, isRTL]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsSuccess(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    if (onSuccess) {
      onSuccess({
        code: groupCode || '#GRP-2401',
        name: groupName || (isRTL ? 'مجموعة جديدة' : 'New Group'),
        agreementNumber: agreementNumber || 'AGR-1125900',
        mainAgent: mainAgent || (isRTL ? 'وكالة مكة للطيران' : 'Makkah Aviation Agency'),
        subAgent: subAgent || (isRTL ? 'شركة تسهيل' : 'Tasheel Tours'),
        nationality: nationality || (isRTL ? 'إندونيسيا' : 'Indonesia'),
        packageType: packageType || (isRTL ? 'باقة كبار الشخصيات التنفيذية (١٤ يوم)' : 'VIP Executive 14 Days'),
        pilgrimsCount: pilgrimsCount,
        transportCompany: transportCompany,
        operationNumber: operationNumber,
        driverName: driverName,
        driverPhone: driverPhone,
        busPlateNo: busPlateNo,
        uploadedFiles: uploadedFiles,
        status: 'قيد التجهيز',
      });
    }
    setIsSuccess(false);
    setCurrentStep(1);
    onClose();
  };

  // SUCCESS DIALOG VIEW
  if (isSuccess) {
    return (
      <StepSuccessDialog
        groupCode={groupCode}
        pilgrimsCount={pilgrimsCount}
        onFinish={handleFinish}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Modal Card */}
      <div
        className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl relative border border-slate-100 flex flex-col justify-between max-h-[92vh] overflow-hidden"
        dir={direction}
      >
        {/* Modal Header */}
        <div className="px-6 sm:px-8 py-4 border-b border-slate-200/80 flex items-center justify-between bg-white shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
            {initialData ? (isRTL ? 'تعديل بيانات المجموعة' : 'Edit Group Details') : t('groups.add_new', 'إضافة مجموعة جديدة')}
          </h2>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100/80 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Stepper */}
        <StepperHeader currentStep={currentStep} />

        {/* Modal Form Body */}
        <div className="px-6 sm:px-8 py-5 space-y-4 overflow-y-auto flex-1 bg-[#f8fafc]">
          {currentStep === 1 && (
            <Step1BasicInfo
              groupName={groupName}
              setGroupName={setGroupName}
              groupCode={groupCode}
              setGroupCode={setGroupCode}
              agreementNumber={agreementNumber}
              setAgreementNumber={setAgreementNumber}
              subAgent={subAgent}
              setSubAgent={setSubAgent}
              mainAgent={mainAgent}
              setMainAgent={setMainAgent}
              pilgrimsCount={pilgrimsCount}
              setPilgrimsCount={setPilgrimsCount}
              nationality={nationality}
              setNationality={setNationality}
              packageType={packageType}
              setPackageType={setPackageType}
            />
          )}

          {currentStep === 2 && (
            <Step2Hotels
              makkahHotel1={makkahHotel1}
              setMakkahHotel1={setMakkahHotel1}
              makkah1CheckIn={makkah1CheckIn}
              setMakkah1CheckIn={setMakkah1CheckIn}
              makkah1CheckOut={makkah1CheckOut}
              setMakkah1CheckOut={setMakkah1CheckOut}
              madinahHotel={madinahHotel}
              setMadinahHotel={setMadinahHotel}
              madinahCheckIn={madinahCheckIn}
              setMadinahCheckIn={setMadinahCheckIn}
              madinahCheckOut={madinahCheckOut}
              setMadinahCheckOut={setMadinahCheckOut}
              makkahHotel2={makkahHotel2}
              setMakkahHotel2={setMakkahHotel2}
              makkah2CheckIn={makkah2CheckIn}
              setMakkah2CheckIn={setMakkah2CheckIn}
              makkah2CheckOut={makkah2CheckOut}
              setMakkah2CheckOut={setMakkah2CheckOut}
              hospitalityNotes={hospitalityNotes}
              setHospitalityNotes={setHospitalityNotes}
            />
          )}

          {currentStep === 3 && (
            <Step3FlightsTransport
              departureAirline={departureAirline}
              setDepartureAirline={setDepartureAirline}
              departureFlightNo={departureFlightNo}
              setDepartureFlightNo={setDepartureFlightNo}
              departureDate={departureDate}
              setDepartureDate={setDepartureDate}
              departureDestination={departureDestination}
              setDepartureDestination={setDepartureDestination}
              departureAirport={departureAirport}
              setDepartureAirport={setDepartureAirport}
              arrivalAirline={arrivalAirline}
              setArrivalAirline={setArrivalAirline}
              arrivalFlightNo={arrivalFlightNo}
              setArrivalFlightNo={setArrivalFlightNo}
              arrivalDate={arrivalDate}
              setArrivalDate={setArrivalDate}
              arrivalOrigin={arrivalOrigin}
              setArrivalOrigin={setArrivalOrigin}
              arrivalAirport={arrivalAirport}
              setArrivalAirport={setArrivalAirport}
              transportCompany={transportCompany}
              setTransportCompany={setTransportCompany}
              operationNumber={operationNumber}
              setOperationNumber={setOperationNumber}
              driverName={driverName}
              setDriverName={setDriverName}
              driverPhone={driverPhone}
              setDriverPhone={setDriverPhone}
              busPlateNo={busPlateNo}
              setBusPlateNo={setBusPlateNo}
            />
          )}

          {currentStep === 4 && (
            <Step4PermitsNotes
              arrivalGrouping={arrivalGrouping}
              setArrivalGrouping={setArrivalGrouping}
              interCityGrouping={interCityGrouping}
              setInterCityGrouping={setInterCityGrouping}
              departureGrouping={departureGrouping}
              setDepartureGrouping={setDepartureGrouping}
              makkahZiyarat={makkahZiyarat}
              setMakkahZiyarat={setMakkahZiyarat}
              madinahZiyarat={madinahZiyarat}
              setMadinahZiyarat={setMadinahZiyarat}
              umrahPermitStatus={umrahPermitStatus}
              setUmrahPermitStatus={setUmrahPermitStatus}
              rawdahMenPermitStatus={rawdahMenPermitStatus}
              setRawdahMenPermitStatus={setRawdahMenPermitStatus}
              rawdahWomenPermitStatus={rawdahWomenPermitStatus}
              setRawdahWomenPermitStatus={setRawdahWomenPermitStatus}
              enrichmentProgram={enrichmentProgram}
              setEnrichmentProgram={setEnrichmentProgram}
              additionalNotes={additionalNotes}
              setAdditionalNotes={setAdditionalNotes}
              missingRequirements={missingRequirements}
              setMissingRequirements={setMissingRequirements}
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
            />
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 sm:px-8 py-4 border-t border-slate-200/80 flex items-center justify-between bg-white shrink-0">
          {currentStep > 1 ? (
            <button
              onClick={handlePrev}
              className="border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 px-8 py-2 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer active:scale-[0.99]"
            >
              {t('common.previous', 'السابق')}
            </button>
          ) : (
            <button
              onClick={onClose}
              className="border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 px-8 py-2 rounded-lg text-xs sm:text-sm font-medium transition cursor-pointer active:scale-[0.99]"
            >
              {t('common.cancel', 'إلغاء')}
            </button>
          )}

          {/* Step Number Indicator */}
          <div className="text-xs sm:text-sm text-slate-400 font-normal">
            {isRTL
              ? `الخطوة ${currentStep === 1 ? '١' : currentStep === 2 ? '٢' : currentStep === 3 ? '٣' : '٤'} من ٤`
              : `Step ${currentStep} of 4`}
          </div>

          {currentStep === 4 ? (
            <button
              onClick={handleNext}
              className="bg-[#00c48c] hover:bg-[#00b07d] text-white px-7 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition shadow-2xs cursor-pointer active:scale-[0.99]"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{isRTL ? 'انشاء المجموعة' : 'Create Group'}</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="bg-[#00c48c] hover:bg-[#00b07d] text-white px-8 py-2 rounded-lg text-xs sm:text-sm font-medium transition shadow-2xs cursor-pointer active:scale-[0.99]"
            >
              {t('common.next', 'التالي')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
