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
  const [agreementNumber, setAgreementNumber] = useState('');
  const [subAgent, setSubAgent] = useState('');
  const [mainAgent, setMainAgent] = useState('');
  const [pilgrimsCount, setPilgrimsCount] = useState(0);
  const [nationality, setNationality] = useState('');
  const [packageType, setPackageType] = useState('');

  // Step 2 State (Hotels)
  const [makkahHotel1, setMakkahHotel1] = useState('');
  const [makkah1CheckIn, setMakkah1CheckIn] = useState('');
  const [makkah1CheckOut, setMakkah1CheckOut] = useState('');

  const [madinahHotel, setMadinahHotel] = useState('');
  const [madinahCheckIn, setMadinahCheckIn] = useState('');
  const [madinahCheckOut, setMadinahCheckOut] = useState('');

  const [makkahHotel2, setMakkahHotel2] = useState('');
  const [makkah2CheckIn, setMakkah2CheckIn] = useState('');
  const [makkah2CheckOut, setMakkah2CheckOut] = useState('');

  const [hospitalityNotes, setHospitalityNotes] = useState('');

  // Step 3 State (Flights & Transport)
  const [departureAirline, setDepartureAirline] = useState('');
  const [departureFlightNo, setDepartureFlightNo] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [departureDestination, setDepartureDestination] = useState('');
  const [departureAirport, setDepartureAirport] = useState('');

  const [arrivalAirline, setArrivalAirline] = useState('');
  const [arrivalFlightNo, setArrivalFlightNo] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [arrivalOrigin, setArrivalOrigin] = useState('');
  const [arrivalAirport, setArrivalAirport] = useState('');

  const [transportCompany, setTransportCompany] = useState('');
  const [operationNumber, setOperationNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [busPlateNo, setBusPlateNo] = useState('');

  // Step 4 State (Movements, Agreements & Additional Notes)
  const [arrivalGrouping, setArrivalGrouping] = useState('معلق');
  const [interCityGrouping, setInterCityGrouping] = useState('معلق');
  const [departureGrouping, setDepartureGrouping] = useState('لا يوجد');
  const [makkahZiyarat, setMakkahZiyarat] = useState('');
  const [madinahZiyarat, setMadinahZiyarat] = useState('');

  const [umrahPermitStatus, setUmrahPermitStatus] = useState('قيد المراجعة');
  const [rawdahMenPermitStatus, setRawdahMenPermitStatus] = useState('قيد المراجعة');
  const [rawdahWomenPermitStatus, setRawdahWomenPermitStatus] = useState('لم يقدم');

  const [enrichmentProgram, setEnrichmentProgram] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [missingRequirements, setMissingRequirements] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, any>>({});

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setIsSuccess(false);

      if (initialData) {
        const clean = (val: any) => (val === '-' || val === null || val === undefined ? '' : String(val));

        setGroupName(clean(initialData.name));
        setGroupCode(clean(initialData.groupCodeNumber || initialData.code));
        setAgreementNumber(clean(initialData.agreementNumber));
        setSubAgent(clean(initialData.subAgent));
        setMainAgent(clean(initialData.mainAgent));
        setPilgrimsCount(Number(initialData.pilgrimsCount) || 0);
        setNationality(clean(initialData.nationality));
        setPackageType(clean(initialData.packageType || initialData.package_type));

        const hotels = initialData.hotelsData || {};
        setMakkahHotel1(clean(initialData.makkahHotel || hotels.makkahHotel || hotels.makkahHotel1));
        setMakkah1CheckIn(clean(initialData.makkahCheckIn || hotels.makkahCheckIn || hotels.makkah1CheckIn));
        setMakkah1CheckOut(clean(initialData.makkahCheckOut || hotels.makkahCheckOut || hotels.makkah1CheckOut));
        setMadinahHotel(clean(initialData.madinahHotel || hotels.madinahHotel));
        setMadinahCheckIn(clean(initialData.madinahCheckIn || hotels.madinahCheckIn));
        setMadinahCheckOut(clean(initialData.madinahCheckOut || hotels.madinahCheckOut));
        setMakkahHotel2(clean(initialData.makkahHotel2 || hotels.makkahHotel2));
        setMakkah2CheckIn(clean(initialData.makkah2CheckIn || hotels.makkah2CheckIn));
        setMakkah2CheckOut(clean(initialData.makkah2CheckOut || hotels.makkah2CheckOut));
        setHospitalityNotes(clean(initialData.hospitalityNotes || hotels.hospitalityNotes));

        const flights = initialData.flightTransportData || {};
        setDepartureAirline(clean(initialData.departureAirline || flights.departureAirline));
        setDepartureFlightNo(clean(initialData.departureFlightNo || flights.departureFlightNo));
        setDepartureDate(clean(initialData.departureDate || flights.departureDate));
        setDepartureDestination(clean(initialData.departureDestination || flights.departureDestination));
        setDepartureAirport(clean(initialData.departureAirport || flights.departureAirport));
        setArrivalAirline(clean(initialData.arrivalAirline || flights.arrivalAirline));
        setArrivalFlightNo(clean(initialData.arrivalFlightNo || flights.arrivalFlightNo));
        setArrivalDate(clean(initialData.arrivalDate || flights.arrivalDate));
        setArrivalOrigin(clean(initialData.arrivalOrigin || flights.arrivalOrigin));
        setArrivalAirport(clean(initialData.arrivalAirport || flights.arrivalAirport));
        setTransportCompany(clean(initialData.transportCompany || flights.transportCompany));
        setOperationNumber(clean(initialData.operationNumber || flights.operationNumber));
        setDriverName(clean(initialData.driverName || flights.driverName));
        setDriverPhone(clean(initialData.driverPhone || flights.driverPhone));
        setBusPlateNo(clean(initialData.busPlateNo || initialData.busNumber || flights.busPlateNo));

        const permits = initialData.permitsNotesData || {};
        setArrivalGrouping(clean(initialData.arrivalGrouping || initialData.arrivalGroupingStatus || permits.arrivalGrouping) || 'معلق');
        setInterCityGrouping(clean(initialData.interCityGrouping || initialData.intercityGroupingStatus || permits.interCityGrouping) || 'معلق');
        setDepartureGrouping(clean(initialData.departureGrouping || initialData.departureGroupingStatus || permits.departureGrouping) || 'لا يوجد');
        setMakkahZiyarat(clean(initialData.makkahZiyarat || permits.makkahZiyarat));
        setMadinahZiyarat(clean(initialData.madinahZiyarat || permits.madinahZiyarat));
        setUmrahPermitStatus(clean(initialData.umrahPermitStatus || permits.umrahPermitStatus) || 'قيد المراجعة');
        setRawdahMenPermitStatus(clean(initialData.rawdahMenPermitStatus || permits.rawdahMenPermitStatus) || 'قيد المراجعة');
        setRawdahWomenPermitStatus(clean(initialData.rawdahWomenPermitStatus || permits.rawdahWomenPermitStatus) || 'لم يقدم');
        setEnrichmentProgram(clean(initialData.enrichmentProgram || permits.enrichmentProgram));
        setAdditionalNotes(clean(initialData.additionalNotes || permits.additionalNotes));
        setMissingRequirements(clean(initialData.missingRequirements || permits.missingRequirements));
        setUploadedFiles(initialData.uploadedFiles || permits.uploadedFiles || {});
      } else {
        setGroupName('');
        setGroupCode('');
        setAgreementNumber('');
        setSubAgent('');
        setMainAgent('');
        setPilgrimsCount(0);
        setNationality('');
        setPackageType('');
        setMakkahHotel1('');
        setMakkah1CheckIn('');
        setMakkah1CheckOut('');
        setMadinahHotel('');
        setMadinahCheckIn('');
        setMadinahCheckOut('');
        setMakkahHotel2('');
        setMakkah2CheckIn('');
        setMakkah2CheckOut('');
        setHospitalityNotes('');
        setDepartureAirline('');
        setDepartureFlightNo('');
        setDepartureDate('');
        setDepartureDestination('');
        setDepartureAirport('');
        setArrivalAirline('');
        setArrivalFlightNo('');
        setArrivalDate('');
        setArrivalOrigin('');
        setArrivalAirport('');
        setTransportCompany('');
        setOperationNumber('');
        setDriverName('');
        setDriverPhone('');
        setBusPlateNo('');
        setArrivalGrouping('معلق');
        setInterCityGrouping('معلق');
        setDepartureGrouping('لا يوجد');
        setMakkahZiyarat('');
        setMadinahZiyarat('');
        setUmrahPermitStatus('قيد المراجعة');
        setRawdahMenPermitStatus('قيد المراجعة');
        setRawdahWomenPermitStatus('لم يقدم');
        setEnrichmentProgram('');
        setAdditionalNotes('');
        setMissingRequirements('');
        setUploadedFiles({});
      }
    }
  }, [isOpen, initialData]);

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
      const generatedCode = groupCode.trim() || `GRP-${Math.floor(1000 + Math.random() * 9000)}`;
      const finalName = groupName.trim() || (isRTL ? 'مجموعة جديدة' : 'New Group');

      onSuccess({
        code: generatedCode,
        name: finalName,
        agreementNumber: agreementNumber.trim() || null,
        mainAgent: mainAgent.trim() || null,
        subAgent: subAgent.trim() || null,
        nationality: nationality.trim() || null,
        packageType: packageType.trim() || null,
        pilgrimsCount: Number(pilgrimsCount) || 1,
        status: initialData?.status || 'قيد التجهيز',
        hotelsData: {
          makkahHotel: makkahHotel1 || null,
          makkahHotel1: makkahHotel1 || null,
          makkahCheckIn: makkah1CheckIn || null,
          makkah1CheckIn: makkah1CheckIn || null,
          makkahCheckOut: makkah1CheckOut || null,
          makkah1CheckOut: makkah1CheckOut || null,
          madinahHotel: madinahHotel || null,
          madinahCheckIn: madinahCheckIn || null,
          madinahCheckOut: madinahCheckOut || null,
          makkahHotel2: makkahHotel2 || null,
          makkah2CheckIn: makkah2CheckIn || null,
          makkah2CheckOut: makkah2CheckOut || null,
          hospitalityNotes: hospitalityNotes || null,
        },
        flightTransportData: {
          departureAirline: departureAirline || null,
          departureFlightNo: departureFlightNo || null,
          departureDate: departureDate || null,
          departureDestination: departureDestination || null,
          departureAirport: departureAirport || null,
          arrivalAirline: arrivalAirline || null,
          arrivalFlightNo: arrivalFlightNo || null,
          arrivalDate: arrivalDate || null,
          arrivalOrigin: arrivalOrigin || null,
          arrivalAirport: arrivalAirport || null,
          transportCompany: transportCompany || null,
          operationNumber: operationNumber || null,
          driverName: driverName || null,
          driverPhone: driverPhone || null,
          busPlateNo: busPlateNo || null,
        },
        permitsNotesData: {
          arrivalGrouping: arrivalGrouping || 'معلق',
          interCityGrouping: interCityGrouping || 'معلق',
          departureGrouping: departureGrouping || 'لا يوجد',
          makkahZiyarat: makkahZiyarat || null,
          madinahZiyarat: madinahZiyarat || null,
          umrahPermitStatus: umrahPermitStatus || 'قيد المراجعة',
          rawdahMenPermitStatus: rawdahMenPermitStatus || 'قيد المراجعة',
          rawdahWomenPermitStatus: rawdahWomenPermitStatus || 'لم يقدم',
          enrichmentProgram: enrichmentProgram || null,
          additionalNotes: additionalNotes || null,
          missingRequirements: missingRequirements || null,
          uploadedFiles: uploadedFiles || {},
        },
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
        groupCode={groupCode || `GRP-${Math.floor(1000 + Math.random() * 9000)}`}
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
