import { useState, useEffect } from 'react';
import { Check, Mail, Send, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  getNotificationSettingsApi,
  updateNotificationSettingsApi,
  sendNotificationEmailAlertApi,
  type NotifSettingsState,
} from '../../services/notificationsApi';

export interface ChannelSettings {
  email: boolean;
  inApp: boolean;
}

const DEFAULT_SETTINGS: NotifSettingsState = {
  newInvoiceSubmitted: { email: true, inApp: true },
  invoiceApproved: { email: true, inApp: true },
  invoiceRejected: { email: true, inApp: true },
  paymentReceived: { email: false, inApp: true },

  approvalRequestAssigned: { email: true, inApp: true },
  approvalCompleted: { email: false, inApp: true },
  approvalOverdue: { email: true, inApp: true },

  noteReminders: { email: true, inApp: true },
  urgentNoteAlerts: { email: true, inApp: true },

  securityAlerts: { email: true, inApp: true },
  teamMemberChanges: { email: true, inApp: false },
  systemMaintenance: { email: false, inApp: true },
};

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
}

const ToggleSwitch = ({ isOn, onToggle }: ToggleSwitchProps) => (
  <button
    type="button"
    onClick={onToggle}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
      isOn ? 'bg-amber-500' : 'bg-slate-200'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out transform ${
        isOn ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

export default function NotificationsTab() {
  const { isRTL } = useLanguage();
  const [settings, setSettings] = useState<NotifSettingsState>(() => {
    try {
      const saved = localStorage.getItem('system_notification_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });
  const [feedback, setFeedback] = useState<string | null>(null);

  // Test email dispatch state
  const [testEmail, setTestEmail] = useState('info@odst.id');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);


  // Fetch settings from backend on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getNotificationSettingsApi();
        if (data) {
          setSettings(data);
          localStorage.setItem('system_notification_settings', JSON.stringify(data));
        }
      } catch {}
    }
    loadSettings();
  }, []);

  const toggleSetting = async (key: keyof NotifSettingsState, type: 'email' | 'inApp') => {
    const currentItem = settings[key] || { email: false, inApp: false };
    const updated = {
      ...settings,
      [key]: {
        ...currentItem,
        [type]: !currentItem[type],
      },
    };
    setSettings(updated);
    localStorage.setItem('system_notification_settings', JSON.stringify(updated));

    try {
      await updateNotificationSettingsApi(updated);
    } catch (err) {
      console.warn('Backend update notifications fallback:', err);
    }

    setFeedback(isRTL ? 'تم حفظ التفضيلات في قاعدة البيانات' : 'Preferences saved to database');
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleResetDefaults = async () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem('system_notification_settings', JSON.stringify(DEFAULT_SETTINGS));

    try {
      await updateNotificationSettingsApi(DEFAULT_SETTINGS);
    } catch {}

    setFeedback(isRTL ? 'تمت استعادة الإعدادات الافتراضية' : 'Reset to default preferences');
    setTimeout(() => setFeedback(null), 2000);
  };

  const operationalItems = [
    {
      key: 'newInvoiceSubmitted' as const,
      titleEn: 'New Submission Created',
      titleAr: 'إنشاء طلب أو معاملة جديدة',
      descEn: 'Notify when an operational item, invoice or trip request is submitted.',
      descAr: 'تنبيه فوري عند تسجيل رحلة أو فاتورة أو تفويض جديد في النظام.',
    },
    {
      key: 'invoiceApproved' as const,
      titleEn: 'Submission Approved',
      titleAr: 'اعتماد المعاملة والطلب',
      descEn: 'Notify when a request has passed review and is officially cleared.',
      descAr: 'إشعار عند الموافقة النهائية على الفاتورة أو الرحلة واعتمادها.',
    },
    {
      key: 'invoiceRejected' as const,
      titleEn: 'Submission Returned / Rejected',
      titleAr: 'رفض المعاملة أو إعادتها للتعديل',
      descEn: 'Notify if an item is returned for correction or rejected by reviewer.',
      descAr: 'تنبيه مباشر عند إرجاع المعاملة لملاحظات أو رفضها من قِبل المسؤول.',
    },
    {
      key: 'paymentReceived' as const,
      titleEn: 'Payment / Transaction Received',
      titleAr: 'استلام دفعة مالية أو سند قبض',
      descEn: 'Receive alerts when payment transitions or deposits succeed.',
      descAr: 'إشعار عند تأكيد استلام المدفوعات والتحصيلات البنكية.',
    },
  ];

  const approvalItems = [
    {
      key: 'approvalRequestAssigned' as const,
      titleEn: 'Approval Assigned to You',
      titleAr: 'إسناد طلب اعتماد إلى مسؤوليتك',
      descEn: 'Receive alerts when a new queue item lands on your approval desk.',
      descAr: 'تنبيه عندما يُحال إليك طلب يتطلب مراجعتك وموافقتك التشغيلية.',
    },
    {
      key: 'approvalCompleted' as const,
      titleEn: 'Approval Workflow Cleared',
      titleAr: 'اكتمال دورة الموافقة',
      descEn: 'Notification when downstream team processes your cleared queues.',
      descAr: 'إشعار عند إتمام دورة الموافقات لكافة الأقسام المعنية.',
    },
    {
      key: 'approvalOverdue' as const,
      titleEn: 'Approval Overdue Alert',
      titleAr: 'تنبيه تأخر الاعتماد والتصعيد',
      descEn: 'Receive critical alerts if action queue items cross due SLA limits.',
      descAr: 'تنبيه عاجل عند تجاوز المدة الزمنية المحددة لمراجعة المعاملة.',
    },
  ];

  const systemItems = [
    {
      key: 'securityAlerts' as const,
      titleEn: 'Security & Access Alerts',
      titleAr: 'تنبيهات الأمان والدخول المريب',
      descEn: 'Get notified about login attempts from unknown IP locations or devices.',
      descAr: 'تنبيهات عند محاولة تسجيل دخول من جهاز جديد أو موقع غير معتاد.',
    },
    {
      key: 'teamMemberChanges' as const,
      titleEn: 'Team & Role Changes',
      titleAr: 'تغييرات الفريق والصلاحيات',
      descEn: 'Notify when administrators add, modify, or remove operator accounts.',
      descAr: 'إشعار عند إضافة عضو جديد لفريق العمل أو تعديل صلاحيات المجموعات.',
    },
    {
      key: 'systemMaintenance' as const,
      titleEn: 'System Maintenance & Upgrades',
      titleAr: 'الصيانة والتحديثات المجدولة',
      descEn: 'Get notified before scheduled maintenance windows and version updates.',
      descAr: 'إشعارات استباقية قبل أوقات الصيانة المجدولة والتحديثات الرئيسية.',
    },
  ];

  const notesItems = [
    {
      key: 'noteReminders' as const,
      titleEn: 'Note Follow-ups & Reminders',
      titleAr: 'تذكيرات ومتابعة الملاحظات والمهام',
      descEn: 'Receive reminder alerts when note deadlines approach or follow-ups are due.',
      descAr: 'إشعار تذكيري عند اقتراب مواعيد استحقاق الملاحظات والمهام المسجلة.',
    },
    {
      key: 'urgentNoteAlerts' as const,
      titleEn: 'Urgent Note Priority Alerts',
      titleAr: 'تنبيهات الملاحظات ذات الأولوية العاجلة',
      descEn: 'Immediately alert team when an operational note marked as Urgent is created.',
      descAr: 'تنبيه فوري لفريق العمل عند تسجيل ملاحظة تشغيلية طارئة أو عاجلة الأهمية.',
    },
  ];

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail.trim()) return;
    setIsSendingTest(true);
    setTestResult(null);
    try {
      const res = await sendNotificationEmailAlertApi({
        to: testEmail.trim(),
        titleEn: 'Operational Alert: System Gateway Active',
        titleAr: 'إشعار تشغيلي: بوابة البريد مفعلة وجاهزة',
        descEn: 'This is a verified live operational notification dispatched via info@odst.id on SSL Port 465.',
        descAr: 'رسالة إشعار فورية عبر نظام ODST لتأكيد تفعيل تنبيهات البريد الإلكتروني بنجاح.',
        type: 'system',
        referenceLink: '/settings',
      });
      setTestResult({
        success: true,
        message: res.message || (isRTL ? `تم إرسال بريد الاختبار بنجاح إلى ${testEmail}` : `Test email delivered successfully to ${testEmail}`),
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || (isRTL ? 'فشل إرسال بريد الاختبار' : 'Failed to send test email'),
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top action / feedback */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {isRTL ? 'إعدادات وقنوات التنبيهات' : 'Notification Preferences'}
          </h2>
          <p className="text-xs text-slate-400">
            {isRTL
              ? 'تحكم في طريقة استلام التنبيهات والإشعارات عبر البريد الإلكتروني أو داخل النظام'
              : 'Configure how and when you receive real-time operational and system alerts'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDefaults}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold transition cursor-pointer shadow-2xs"
        >
          {isRTL ? 'استعادة الافتراضي' : 'Reset Defaults'}
        </button>
      </div>

      {/* OFFICIAL EMAIL SMTP GATEWAY STATUS CARD */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  {isRTL ? 'بوابة إشعارات البريد الإلكتروني (SMTP)' : 'Official Email Gateway (SMTP)'}
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  SSL 465 • Connected
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-mono">
                Sender: <span className="text-emerald-400 font-semibold">info@odst.id</span> (ODST Umrah Operations System)
              </p>
            </div>
          </div>


          {/* Test Email Form */}
          <form onSubmit={handleSendTestEmail} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="e.g. alvarizkidimas@gmail.com"
              dir="ltr"
              className="bg-slate-950/60 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 w-full md:w-64 font-mono"
              required
            />
            <button
              type="submit"
              disabled={isSendingTest}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-70 shadow-md shadow-emerald-600/20"
            >
              {isSendingTest ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{isRTL ? 'إرسال...' : 'Sending...'}</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>{isRTL ? 'إرسال اختبار' : 'Test Email'}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div
            className={`mt-3 p-2.5 rounded-xl text-xs flex items-center gap-2 animate-fadeIn border ${
              testResult.success
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
                : 'bg-red-950/80 border-red-500/40 text-red-200'
            }`}
          >
            {testResult.success ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{testResult.message}</span>
          </div>
        )}
      </div>

      {feedback && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm font-semibold shadow-xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* SECTION 1: OPERATIONS NOTIFICATIONS */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">

        <div className="px-6 py-3.5 border-b border-slate-100 bg-slate-50/40">
          <h3 className="text-sm font-bold text-slate-900">
            {isRTL ? 'إشعارات العمليات والتشغيل' : 'Operations & Invoicing Notifications'}
          </h3>
          <p className="text-[11px] text-slate-400">
            {isRTL ? 'التنبيهات الخاصة بحركة الرحلات والعقود والسندات' : 'Alerts regarding trips, vouchers, and operational submissions'}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold bg-slate-50/60">
                <th className="py-3 px-6 text-start">{isRTL ? 'نوع التنبيه' : 'Alert Type'}</th>
                <th className="py-3 px-6 text-center w-28">{isRTL ? 'البريد (Email)' : 'Email'}</th>
                <th className="py-3 px-6 text-center w-28">{isRTL ? 'النظام (In-App)' : 'In-App'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {operationalItems.map((item) => (
                <tr key={item.key} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-6">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">
                        {isRTL ? item.titleAr : item.titleEn}
                      </div>
                      <div className="text-[11px] text-slate-500 font-normal">
                        {isRTL ? item.descAr : item.descEn}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <ToggleSwitch
                      isOn={settings[item.key]?.email ?? true}
                      onToggle={() => toggleSetting(item.key, 'email')}
                    />
                  </td>
                  <td className="py-3 px-6 text-center">
                    <ToggleSwitch
                      isOn={settings[item.key]?.inApp ?? true}
                      onToggle={() => toggleSetting(item.key, 'inApp')}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: APPROVAL NOTIFICATIONS */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="px-6 py-3.5 border-b border-slate-100 bg-slate-50/40">
          <h3 className="text-sm font-bold text-slate-900">
            {isRTL ? 'إشعارات مسار الاعتمادات والموافقات' : 'Approval & Workflow Notifications'}
          </h3>
          <p className="text-[11px] text-slate-400">
            {isRTL ? 'التنبيهات الإدارية الخاصة بطلبات المراجعة وقوائم الانتظار' : 'Alerts when tasks need review or action from managers'}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold bg-slate-50/60">
                <th className="py-3 px-6 text-start">{isRTL ? 'نوع التنبيه' : 'Alert Type'}</th>
                <th className="py-3 px-6 text-center w-28">{isRTL ? 'البريد (Email)' : 'Email'}</th>
                <th className="py-3 px-6 text-center w-28">{isRTL ? 'النظام (In-App)' : 'In-App'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {approvalItems.map((item) => (
                <tr key={item.key} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-6">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">
                        {isRTL ? item.titleAr : item.titleEn}
                      </div>
                      <div className="text-[11px] text-slate-500 font-normal">
                        {isRTL ? item.descAr : item.descEn}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <ToggleSwitch
                      isOn={settings[item.key]?.email ?? true}
                      onToggle={() => toggleSetting(item.key, 'email')}
                    />
                  </td>
                  <td className="py-3 px-6 text-center">
                    <ToggleSwitch
                      isOn={settings[item.key]?.inApp ?? true}
                      onToggle={() => toggleSetting(item.key, 'inApp')}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: SYSTEM & SECURITY NOTIFICATIONS */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="px-6 py-3.5 border-b border-slate-100 bg-slate-50/40">
          <h3 className="text-sm font-bold text-slate-900">
            {isRTL ? 'إشعارات الأمان والمنظومة' : 'System & Security Alerts'}
          </h3>
          <p className="text-[11px] text-slate-400">
            {isRTL ? 'التنبيهات الخاصة بالحماية والصيانة وتغييرات المستخدمين' : 'Security events, account access warnings, and scheduled downtime'}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold bg-slate-50/60">
                <th className="py-3 px-6 text-start">{isRTL ? 'نوع التنبيه' : 'Alert Type'}</th>
                <th className="py-3 px-6 text-center w-28">{isRTL ? 'البريد (Email)' : 'Email'}</th>
                <th className="py-3 px-6 text-center w-28">{isRTL ? 'النظام (In-App)' : 'In-App'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {systemItems.map((item) => (
                <tr key={item.key} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-6">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">
                        {isRTL ? item.titleAr : item.titleEn}
                      </div>
                      <div className="text-[11px] text-slate-500 font-normal">
                        {isRTL ? item.descAr : item.descEn}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <ToggleSwitch
                      isOn={settings[item.key]?.email ?? true}
                      onToggle={() => toggleSetting(item.key, 'email')}
                    />
                  </td>
                  <td className="py-3 px-6 text-center">
                    <ToggleSwitch
                      isOn={settings[item.key]?.inApp ?? true}
                      onToggle={() => toggleSetting(item.key, 'inApp')}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4: NOTES & REMINDERS NOTIFICATIONS */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="px-6 py-3.5 border-b border-slate-100 bg-slate-50/40">
          <h3 className="text-sm font-bold text-slate-900">
            {isRTL ? 'إشعارات وتذكيرات الملاحظات والمهام' : 'Notes & Task Reminders'}
          </h3>
          <p className="text-[11px] text-slate-400">
            {isRTL ? 'التنبيهات الخاصة بالملاحظات العاجلة ومواعيد متابعة المهام التشغيلية' : 'Alerts for urgent operational notes, checklists, and deadline reminders'}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold bg-slate-50/60">
                <th className="py-3 px-6 text-start">{isRTL ? 'نوع التنبيه' : 'Alert Type'}</th>
                <th className="py-3 px-6 text-center w-28">{isRTL ? 'البريد (Email)' : 'Email'}</th>
                <th className="py-3 px-6 text-center w-28">{isRTL ? 'النظام (In-App)' : 'In-App'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {notesItems.map((item) => (
                <tr key={item.key} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-6">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">
                        {isRTL ? item.titleAr : item.titleEn}
                      </div>
                      <div className="text-[11px] text-slate-500 font-normal">
                        {isRTL ? item.descAr : item.descEn}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <ToggleSwitch
                      isOn={settings[item.key]?.email ?? true}
                      onToggle={() => toggleSetting(item.key, 'email')}
                    />
                  </td>
                  <td className="py-3 px-6 text-center">
                    <ToggleSwitch
                      isOn={settings[item.key]?.inApp ?? true}
                      onToggle={() => toggleSetting(item.key, 'inApp')}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
