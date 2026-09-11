import { useState } from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface ChannelSettings {
  email: boolean;
  inApp: boolean;
}

export interface NotifSettingsState {
  newInvoiceSubmitted: ChannelSettings;
  invoiceApproved: ChannelSettings;
  invoiceRejected: ChannelSettings;
  paymentReceived: ChannelSettings;
  approvalRequestAssigned: ChannelSettings;
  approvalCompleted: ChannelSettings;
  approvalOverdue: ChannelSettings;
  securityAlerts: ChannelSettings;
  teamMemberChanges: ChannelSettings;
  systemMaintenance: ChannelSettings;
}

const DEFAULT_SETTINGS: NotifSettingsState = {
  newInvoiceSubmitted: { email: true, inApp: true },
  invoiceApproved: { email: true, inApp: true },
  invoiceRejected: { email: true, inApp: true },
  paymentReceived: { email: false, inApp: true },

  approvalRequestAssigned: { email: true, inApp: true },
  approvalCompleted: { email: false, inApp: true },
  approvalOverdue: { email: true, inApp: true },

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
  const [settings, setSettings] = useState<NotifSettingsState>(DEFAULT_SETTINGS);
  const [feedback, setFeedback] = useState<string | null>(null);

  const toggleSetting = (key: keyof NotifSettingsState, type: 'email' | 'inApp') => {
    const currentItem = settings[key] || { email: false, inApp: false };
    const updated = {
      ...settings,
      [key]: {
        ...currentItem,
        [type]: !currentItem[type],
      },
    };
    setSettings(updated);
    setFeedback(isRTL ? 'تم حفظ التفضيلات' : 'Preferences saved');
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleResetDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
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
    </div>
  );
}
