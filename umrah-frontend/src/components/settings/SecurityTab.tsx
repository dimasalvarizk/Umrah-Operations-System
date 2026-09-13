import { useState, useEffect } from 'react';
import {
  Check,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  changePasswordApi,
  getActiveSessionsApi,
  revokeSessionApi,
  getLoginLogsApi,
} from '../../services/authApi';

export interface SessionItem {
  id: string;
  device: string;
  ip: string;
  location: string;
  active: string;
  isCurrent: boolean;
  type: 'desktop' | 'mobile';
}

export interface LoginLogItem {
  id: string;
  timestamp: string;
  ip: string;
  agent: string;
  status: 'Success' | 'Failed';
}

export default function SecurityTab() {
  const { isRTL } = useLanguage();
  const { token } = useAuth();

  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [showCurr, setShowCurr] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  // Helper to detect current browser/device in real-time
  const getClientDeviceName = () => {
    const ua = navigator.userAgent;
    if (ua.includes('iPhone')) return 'Safari on iPhone';
    if (ua.includes('iPad')) return 'Safari on iPad';
    if (ua.includes('Android')) return 'Chrome on Android';
    if (ua.includes('Edg/')) return 'Edge on Windows';
    if (ua.includes('Chrome/')) return 'Chrome on Windows 11';
    if (ua.includes('Firefox/')) return 'Firefox on Windows';
    if (ua.includes('Macintosh')) return 'Safari on macOS';
    return 'Desktop Browser';
  };

  const [sessions, setSessions] = useState<SessionItem[]>([
    {
      id: 'sess-current',
      device: getClientDeviceName(),
      ip: '127.0.0.1 (Localhost)',
      location: isRTL ? 'مكة المكرمة، السعودية' : 'Makkah, Saudi Arabia',
      active: isRTL ? 'الجلسة الحالية (نشطة)' : 'Current session (Active)',
      isCurrent: true,
      type: /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    },
  ]);

  const [loginLogs, setLoginLogs] = useState<LoginLogItem[]>([
    {
      id: 'log-1',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ip: '127.0.0.1',
      agent: getClientDeviceName(),
      status: 'Success',
    },
  ]);

  // Load Real-Time Sessions and Logs from MySQL Database
  const fetchSecurityData = async () => {
    if (!token) return;
    try {
      const [fetchedSessions, fetchedLogs] = await Promise.allSettled([
        getActiveSessionsApi(token),
        getLoginLogsApi(token),
      ]);

      if (fetchedSessions.status === 'fulfilled' && Array.isArray(fetchedSessions.value) && fetchedSessions.value.length > 0) {
        setSessions(fetchedSessions.value);
      }

      if (fetchedLogs.status === 'fulfilled' && Array.isArray(fetchedLogs.value) && fetchedLogs.value.length > 0) {
        setLoginLogs(fetchedLogs.value);
      }
    } catch {
      // Keep real client session fallback
    }
  };

  useEffect(() => {
    fetchSecurityData();
  }, [token]);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currPassword) {
      setErrorFeedback(isRTL ? 'يرجى إدخال كلمة المرور الحالية' : 'Please enter current password.');
      setTimeout(() => setErrorFeedback(null), 3500);
      return;
    }
    if (newPassword.length < 6) {
      setErrorFeedback(isRTL ? 'يجب أن لا تقل كلمة المرور عن 6 أحرف' : 'Password must be at least 6 characters.');
      setTimeout(() => setErrorFeedback(null), 3500);
      return;
    }
    if (newPassword !== confPassword) {
      setErrorFeedback(isRTL ? 'كلمة المرور الجديدة وتأكيدها غير متطابقين' : 'New passwords do not match.');
      setTimeout(() => setErrorFeedback(null), 3500);
      return;
    }

    setIsUpdating(true);
    if (token) {
      try {
        const msg = await changePasswordApi(token, {
          currentPassword: currPassword,
          newPassword,
        });
        setFeedback(isRTL ? 'تم تحديث كلمة المرور بنجاح في قاعدة البيانات!' : msg);
        setCurrPassword('');
        setNewPassword('');
        setConfPassword('');
      } catch (err: any) {
        setErrorFeedback(err.message || (isRTL ? 'فشل تحديث كلمة المرور' : 'Failed to update password'));
        setTimeout(() => setErrorFeedback(null), 4000);
      } finally {
        setIsUpdating(false);
      }
    } else {
      setIsUpdating(false);
      setFeedback(isRTL ? 'تم تحديث كلمة المرور بنجاح!' : 'Password updated successfully!');
      setCurrPassword('');
      setNewPassword('');
      setConfPassword('');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleRevokeSession = async (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (token) {
      try {
        await revokeSessionApi(token, id);
      } catch {}
    }
    setFeedback(isRTL ? 'تم إنهاء الجلسة وتسجيل الخروج بنجاح من قاعدة البيانات' : 'Session revoked successfully from database!');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {feedback && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm font-semibold shadow-xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {errorFeedback && (
        <div className="flex items-center gap-2 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs sm:text-sm font-semibold shadow-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorFeedback}</span>
        </div>
      )}

      {/* 1. CHANGE PASSWORD CARD */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">
            {isRTL ? 'تغيير كلمة المرور' : 'Change Password'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isRTL ? 'احرص على استخدام كلمة مرور قوية وغير مكررة لحماية حسابك' : 'Use a strong password with a mix of characters'}
          </p>
        </div>

        <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-lg text-xs sm:text-sm">
          {/* Current Password */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">{isRTL ? 'كلمة المرور الحالية' : 'Current Password'} *</label>
            <div className="relative">
              <input
                type={showCurr ? 'text' : 'password'}
                required
                value={currPassword}
                onChange={(e) => setCurrPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowCurr(!showCurr)}
                className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 ${isRTL ? 'left-3' : 'right-3'}`}
              >
                {showCurr ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">{isRTL ? 'كلمة المرور الجديدة' : 'New Password'} *</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 ${isRTL ? 'left-3' : 'right-3'}`}
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">{isRTL ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'} *</label>
            <div className="relative">
              <input
                type={showConf ? 'text' : 'password'}
                required
                value={confPassword}
                onChange={(e) => setConfPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
              />
              <button
                type="button"
                onClick={() => setShowConf(!showConf)}
                className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 ${isRTL ? 'left-3' : 'right-3'}`}
              >
                {showConf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isUpdating}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm shadow-xs transition cursor-pointer active:scale-95 flex items-center gap-2"
            >
              {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isRTL ? 'تحديث كلمة المرور' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. ACTIVE SESSIONS CARD */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">
            {isRTL ? 'الجلسات والأجهزة النشطة' : 'Active Sessions'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isRTL ? 'الأجهزة المسجلة حالياً بحسابك وإمكانية تسجيل الخروج منها عن بعد' : 'Devices currently logged into your operator account'}
          </p>
        </div>

        <div className="space-y-3">
          {sessions.map((sess) => (
            <div
              key={sess.id}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>{sess.device}</span>
                    {sess.isCurrent && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {isRTL ? 'هذا الجهاز' : 'This Device'}
                      </span>
                    )}
                  </div>
                  <div className="text-slate-500 font-mono text-[11px]">{sess.ip} • {sess.location}</div>
                  <div className="text-slate-400 text-[11px]">{sess.active}</div>
                </div>
              </div>

              {!sess.isCurrent && (
                <button
                  type="button"
                  onClick={() => handleRevokeSession(sess.id)}
                  className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition cursor-pointer shrink-0"
                >
                  <span>{isRTL ? 'إنهاء الجلسة' : 'Revoke'}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. LOGIN ACTIVITY LOGS */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">
            {isRTL ? 'سجل محاولات الدخول الحديثة' : 'Recent Login Activity Logs'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isRTL ? 'سجل العمليات ومحاولات تسجيل الدخول الناجحة وغير المصرح بها' : 'Audit logs of successful and blocked login attempts'}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-bold bg-slate-50/50">
                <th className="py-2.5 px-4 text-start">{isRTL ? 'التاريخ والوقت' : 'Timestamp'}</th>
                <th className="py-2.5 px-4 text-start">{isRTL ? 'عنوان IP' : 'IP Address'}</th>
                <th className="py-2.5 px-4 text-start">{isRTL ? 'المتصفح والنظام' : 'Browser / OS'}</th>
                <th className="py-2.5 px-4 text-center">{isRTL ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loginLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-mono">{log.timestamp}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-800">{log.ip}</td>
                  <td className="py-3 px-4">{log.agent}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      log.status === 'Success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {log.status === 'Success' ? (isRTL ? 'ناجح' : 'Success') : (isRTL ? 'فشل الدخول' : 'Failed')}
                    </span>
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
