import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Printer, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import AgreementPdfView, { type AgreementPdfData } from '../components/contracts/AgreementPdfView';

export default function AgreementPdfPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { direction, t, isRTL } = useLanguage();

  const handlePrint = () => {
    window.print();
  };

  const agreementData: AgreementPdfData | undefined = useMemo(() => {
    try {
      const saved = localStorage.getItem('contracts_agreements_list');
      if (saved) {
        const list = JSON.parse(saved);
        const found = list.find((a: any) => String(a.id) === String(id) || a.agreementNo === id);
        if (found) {
          const roomsSaved = localStorage.getItem(`agreement_rooms_${found.id || found.agreementNo}`);
          const roomsData = roomsSaved ? JSON.parse(roomsSaved) : [];

          return {
            referenceNumber: found.agreementNo || 'AGR-1125900',
            date: found.date || found.created_at || '29/08/2026',
            status: isRTL ? 'رسمي / معتمد' : 'Official / Approved',
            agreementTitle: found.title || found.hotelName,
            hotelName: found.hotelName,
            city: found.location || (isRTL ? 'مكة المكرمة' : 'Makkah'),
            rating: found.rating || 5,
            period: found.period || `${found.startDate || ''} - ${found.endDate || ''}`,
            durationDays: found.duration || '4 Days',
            totalPrice: found.totalAmount ? `${found.totalAmount} SAR` : '19,200 SAR',
            documentNumber: 'CO-AGR-2026-09',
            agentName: found.agent || 'Hasoob Technology Trading',
            packageTier: found.packageTier || 'VIP Executive 14 Days',
            rooms: roomsData.length > 0 ? roomsData.map((r: any) => ({
              type: r.type,
              capacity: r.capacity,
              size: r.size,
              count: `${r.count} ${isRTL ? 'غرف' : 'Rooms'}`,
            })) : undefined,
          };
        }
      }
    } catch (e) {
      console.error('Error loading agreement for PDF:', e);
    }
    return undefined;
  }, [id, isRTL]);

  return (
    <div
      className="min-h-screen bg-[#334155] py-4 sm:py-8 px-2 sm:px-4 flex flex-col items-center justify-start print:bg-white print:p-0 print:m-0"
      dir={direction}
    >
      {/* Top Toolbar (Hidden when printing) */}
      <header className="max-w-[794px] w-full mb-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3 sm:px-5 flex items-center justify-between shadow-xl text-white print:hidden">
        {/* Back button & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition cursor-pointer"
            title={t('nav.back', 'الرجوع')}
          >
            {isRTL ? (
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>
          <div>
            <h1 className="text-xs sm:text-sm font-bold text-white tracking-tight">
              {t('contracts.preview_pdf', 'معاينة وثيقة الاتفاقية (PDF)')}
            </h1>
            <p className="text-[10px] text-slate-400 font-mono">
              {agreementData?.referenceNumber || 'CO-AGR-2026-09'} • {t('contracts.official_certified', 'معتمد')}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="bg-[#10b981] hover:bg-[#059669] text-white font-bold py-2 px-3.5 sm:px-5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>{t('contracts.print_save_pdf', 'طباعة / حفظ PDF')}</span>
          </button>
        </div>
      </header>

      {/* Printable Sheet View */}
      <main className="w-full flex justify-center print:w-full print:m-0 print:p-0">
        <AgreementPdfView data={agreementData} />
      </main>
    </div>
  );
}
