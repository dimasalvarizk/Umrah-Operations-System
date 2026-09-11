import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import heroLogin from '../assets/hero-login.jpg';
import logoLogin from '../assets/logo-login.png';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/layout/LanguageSwitcher';

export default function LoginPage() {
  const navigate = useNavigate();
  const { t, direction } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage(t('login.error_required', 'يرجى ملء جميع الحقول المطلوبة'));
      return;
    }

    setIsLoading(true);

    // Mock login simulation & navigation
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage(t('login.success_redirect', 'تم تسجيل الدخول بنجاح! جاري تحويلك...'));
      setTimeout(() => {
        navigate('/dashboard');
      }, 600);
    }, 1000);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col md:flex-row bg-slate-950"
      dir="ltr"
    >
      {/* Form Section (Always on the Left) */}
      <div
        className="w-full md:w-[45%] lg:w-[38%] min-h-screen bg-white flex flex-col justify-between px-6 sm:px-12 lg:px-16 py-10 shadow-2xl z-20"
        dir={direction}
      >
        {/* Top bar with Language Switcher (Always on the Right) */}
        <div className="flex items-center justify-end pb-6 border-b border-slate-100" dir="ltr">
          <LanguageSwitcher variant="login" />
        </div>

        <div className="my-auto max-w-md w-full mx-auto py-8 text-right">
          {/* Welcome Header */}
          <div className="mb-8 text-right">
            <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">
              {t('login.welcome', 'مرحباً بك')}
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              {t('login.subtitle', 'الرجاء تسجيل الدخول لمتابعة العمليات')}
            </p>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center justify-end gap-2.5 animate-fadeIn text-right">
              <span>{errorMessage}</span>
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center justify-end gap-2.5 animate-fadeIn text-right">
              <span>{successMessage}</span>
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5 text-right">
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 text-right"
              >
                {t('login.email', 'البريد الإلكتروني')}
              </label>
              <div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('login.email_placeholder', 'name@company.com')}
                  dir="ltr"
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 text-right placeholder:text-right"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-right">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 text-right"
              >
                {t('login.password', 'كلمة المرور')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  dir="ltr"
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 tracking-wider focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 pr-16 pl-4 placeholder:text-left text-left"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 right-3.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition px-1 py-0.5"
                >
                  {showPassword ? t('login.hide_password', 'إخفاء') : t('login.show_password', 'إظهار')}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1" dir="ltr">
              <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-[18px] h-[18px] rounded-[5px] border-[1.5px] flex items-center justify-center transition-all duration-150 bg-white ${rememberMe ? 'border-slate-400' : 'border-slate-300 group-hover:border-slate-400'
                    }`}
                >
                  {rememberMe && (
                    <div className="w-[10px] h-[10px] rounded-[2.5px] bg-[#10b981]" />
                  )}
                </div>
                <span className="text-xs text-slate-600 font-medium">
                  {t('login.remember_me', 'تذكرني على هذا الجهاز')}
                </span>
              </label>

              <a
                href="#forgot-password"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition"
              >
                {t('login.forgot_password', 'نسيت كلمة المرور؟')}
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t('login.submitting', 'جاري تسجيل الدخول...')}</span>
                </>
              ) : (
                <span>{t('login.submit', 'تسجيل الدخول')}</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Hero Section (Always on the Right) */}
      <div
        className="hidden md:flex flex-1 relative flex-col justify-between p-8 lg:p-14 overflow-hidden"
        dir={direction}
      >
        {/* Background Image with Dark Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105"
          style={{ backgroundImage: `url(${heroLogin})` }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(225deg, rgba(27, 42, 74, 0.75) 25%, rgba(15, 23, 42, 0.75) 75%)' }}
        />

        {/* Top Branding Section */}
        <div className="relative z-10 flex flex-col items-center justify-center pt-10 text-center">
          <img
            src={logoLogin}
            alt="Logo"
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-[0_10px_25px_rgba(16,185,129,0.35)] transition-transform duration-300 hover:scale-105"
          />
          <h2 className="text-[rgba(16,185,129,1)] font-bold text-lg sm:text-xl lg:text-2xl tracking-wide mt-5 drop-shadow-sm">
            {t('nav.system_title_full', 'نظام عمليات الحج والعمرة الرئيسي')}
          </h2>
        </div>

        {/* Bottom Floating Glass Card */}
        <div className="relative z-10 flex justify-center w-full pb-4 px-4 sm:px-6">
          <div className="bg-slate-900/60 backdrop-blur-md border border-white/20 rounded-2xl py-4 sm:py-5 px-6 sm:px-8 shadow-2xl max-w-2xl w-full flex items-center justify-center text-center">
            <p className="text-slate-200 text-xs sm:text-sm font-normal leading-relaxed text-center">
              {t('login.hero_desc', 'تكامل تقني يربط بين الفنادق، النقل، التصاريح والمسار الإلكتروني لخدمة ضيوف الرحمن بأعلى كفاءة تشغيلية.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
