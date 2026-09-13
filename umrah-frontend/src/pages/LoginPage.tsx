import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import heroLogin from '../assets/hero-login.jpg';
import logoLogin from '../assets/logo-login.png';
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  KeyRound,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/layout/LanguageSwitcher';
import { forgotPasswordApi, verifyResetCodeApi, resetPasswordApi } from '../services/authApi';

export default function LoginPage() {
  const navigate = useNavigate();
  const { t, direction, isRTL } = useLanguage();
  const { login } = useAuth();

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage(t('login.error_required', 'يرجى ملء جميع الحقول المطلوبة'));
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password, rememberMe);
      setSuccessMessage(t('login.success_redirect', 'تم تسجيل الدخول بنجاح! جاري تحويلك...'));
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password Flow Handlers
  const handleOpenForgotModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setForgotStep(1);
    setForgotEmail(email || '');
    setOtpCode('');
    setNewPassword('');
    setConfirmPassword('');
    setForgotError('');
    setForgotSuccess('');
    setIsForgotModalOpen(true);
  };

  const handleCloseForgotModal = () => {
    setIsForgotModalOpen(false);
    setForgotError('');
    setForgotSuccess('');
  };

  // Step 1: Send OTP to Email
  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!forgotEmail.trim()) {
      setForgotError(isRTL ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter your email address');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await forgotPasswordApi(forgotEmail.trim());
      setForgotSuccess(res.message || (isRTL ? 'تم إرسال رمز التحقق إلى بريدك الإلكتروني' : 'Verification code sent to your email'));
      setTimeout(() => {
        setForgotStep(2);
        setForgotSuccess('');
      }, 1000);
    } catch (err: any) {
      setForgotError(err.message || (isRTL ? 'فشل إرسال رمز التحقق' : 'Failed to send reset code'));
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 2: Verify 6-digit Code
  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!otpCode.trim() || otpCode.trim().length < 4) {
      setForgotError(isRTL ? 'يرجى إدخال رمز التحقق المكون من 6 أرقام' : 'Please enter the 6-digit code');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await verifyResetCodeApi(forgotEmail.trim(), otpCode.trim());
      setForgotSuccess(res.message || (isRTL ? 'تم التحقق من الرمز بنجاح' : 'Code verified successfully'));
      setTimeout(() => {
        setForgotStep(3);
        setForgotSuccess('');
      }, 800);
    } catch (err: any) {
      setForgotError(err.message || (isRTL ? 'رمز التحقق غير صالح أو منتهي الصلاحية' : 'Invalid or expired code'));
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 3: Reset to New Password
  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!newPassword || newPassword.length < 6) {
      setForgotError(isRTL ? 'كلمة المرور يجب أن لا تقل عن 6 خانات' : 'Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError(isRTL ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await resetPasswordApi({
        email: forgotEmail.trim(),
        code: otpCode.trim(),
        newPassword,
      });

      setForgotSuccess(res.message || (isRTL ? 'تم تغيير كلمة المرور بنجاح!' : 'Password reset successfully!'));
      setEmail(forgotEmail.trim());
      setPassword('');

      setTimeout(() => {
        setIsForgotModalOpen(false);
        setSuccessMessage(isRTL ? 'تم تحديث كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.' : 'Password updated successfully. Please log in.');
      }, 1500);
    } catch (err: any) {
      setForgotError(err.message || (isRTL ? 'فشل إعادة تعيين كلمة المرور' : 'Failed to reset password'));
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col md:flex-row bg-slate-950 relative"
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
                  className="absolute top-1/2 -translate-y-1/2 right-3.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition px-1 py-0.5 cursor-pointer"
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

              <button
                type="button"
                onClick={handleOpenForgotModal}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition cursor-pointer"
              >
                {t('login.forgot_password', 'نسيت كلمة المرور؟')}
              </button>
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

      {/* ========================================================================= */}
      {/* MODAL: 3-STEP FORGOT PASSWORD / EMAIL OTP VERIFICATION */}
      {/* ========================================================================= */}
      {isForgotModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fadeIn"
          dir={direction}
        >
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transition-all duration-300">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isRTL ? 'استعادة كلمة المرور' : 'Password Recovery'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isRTL ? 'التحقق الآمن عبر رمز البريد الإلكتروني (OTP)' : 'Secure 6-digit email OTP verification'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseForgotModal}
                className="w-8 h-8 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stepper Progress Indicator */}
            <div className="px-6 pt-4 pb-2">
              <div className="flex items-center justify-between relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
                <div
                  className="absolute top-1/2 left-0 h-0.5 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-300"
                  style={{ width: forgotStep === 1 ? '15%' : forgotStep === 2 ? '50%' : '100%' }}
                />

                {/* Step 1 Node */}
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      forgotStep >= 1
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 ring-4 ring-emerald-50'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    1
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 mt-1">
                    {isRTL ? 'البريد' : 'Email'}
                  </span>
                </div>

                {/* Step 2 Node */}
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      forgotStep >= 2
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 ring-4 ring-emerald-50'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    2
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 mt-1">
                    {isRTL ? 'الرمز (OTP)' : 'Code (OTP)'}
                  </span>
                </div>

                {/* Step 3 Node */}
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      forgotStep === 3
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 ring-4 ring-emerald-50'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    3
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 mt-1">
                    {isRTL ? 'كلمة المرور' : 'Reset'}
                  </span>
                </div>
              </div>
            </div>

            {/* Error / Success Feedback in Modal */}
            <div className="px-6 pt-2">
              {forgotError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{forgotError}</span>
                </div>
              )}
              {forgotSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{forgotSuccess}</span>
                </div>
              )}
            </div>

            {/* Modal Body: STEP 1 (Input Email) */}
            {forgotStep === 1 && (
              <form onSubmit={handleSendOtp} className="p-6 space-y-4">
                <div className="text-start">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                    {isRTL ? 'أدخل بريدك الإلكتروني المسجل' : 'Enter your registered email'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {isRTL
                      ? 'سنقوم بإرسال رمز تحقق مكوّن من 6 أرقام إلى بريدك الإلكتروني لتأكيد هويتك.'
                      : 'We will send a 6-digit verification code to your registered email address.'}
                  </p>
                </div>


                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    {isRTL ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="e.g. info@odst.id or ali@odst.id"
                      dir="ltr"
                      className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                      required
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 left-3.5 pointer-events-none" />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2.5">
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {forgotLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{isRTL ? 'جاري الإرسال...' : 'Sending Code...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{isRTL ? 'إرسال رمز التحقق' : 'Send Verification Code'}</span>
                        {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Modal Body: STEP 2 (Verify OTP) */}
            {forgotStep === 2 && (
              <form onSubmit={handleVerifyOtp} className="p-6 space-y-4">
                <div className="text-start">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                    {isRTL ? 'أدخل رمز التحقق (OTP)' : 'Enter 6-Digit OTP Code'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {isRTL
                      ? `تم إرسال رمز التحقق إلى: ${forgotEmail}. يرجى التحقق من صندوق الوارد.`
                      : `A 6-digit OTP has been sent to: ${forgotEmail}. Check your inbox or spam folder.`}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    {isRTL ? 'رمز التحقق (6 أرقام)' : 'Verification Code'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      dir="ltr"
                      className="w-full text-center tracking-[0.5em] text-lg font-mono font-bold bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 placeholder:text-slate-300 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition"
                      required
                    />
                    <ShieldCheck className="w-4 h-4 text-emerald-500 absolute top-1/2 -translate-y-1/2 left-3.5 pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="text-slate-500 hover:text-slate-700 underline cursor-pointer"
                  >
                    {isRTL ? 'تغيير البريد' : 'Change email'}
                  </button>

                  <button
                    type="button"
                    disabled={forgotLoading}
                    onClick={handleSendOtp}
                    className="text-emerald-600 font-bold hover:underline cursor-pointer"
                  >
                    {isRTL ? 'إعادة إرسال الرمز' : 'Resend code'}
                  </button>
                </div>

                <div className="pt-2 flex items-center gap-2.5">
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {forgotLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{isRTL ? 'جاري التحقق...' : 'Verifying...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{isRTL ? 'تأكيد الرمز والمتابعة' : 'Verify & Continue'}</span>
                        {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Modal Body: STEP 3 (Set New Password) */}
            {forgotStep === 3 && (
              <form onSubmit={handleResetPassword} className="p-6 space-y-4">
                <div className="text-start">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                    {isRTL ? 'تعيين كلمة المرور الجديدة' : 'Set New Password'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {isRTL
                      ? 'الرجاء إدخال كلمة مرور قوية لا تقل عن 6 خانات لحماية حسابك.'
                      : 'Please create a new strong password with at least 6 characters.'}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    {isRTL ? 'كلمة المرور الجديدة' : 'New Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      dir="ltr"
                      className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl pl-10 pr-16 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition text-left"
                      required
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 left-3.5 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute top-1/2 -translate-y-1/2 right-3 text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                    >
                      {showNewPassword ? (isRTL ? 'إخفاء' : 'Hide') : (isRTL ? 'إظهار' : 'Show')}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    {isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      dir="ltr"
                      className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl pl-10 pr-16 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition text-left"
                      required
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 left-3.5 pointer-events-none" />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2.5">
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {forgotLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{isRTL ? 'جاري الحفظ...' : 'Updating Password...'}</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{isRTL ? 'حفظ كلمة المرور وتسجيل الدخول' : 'Save & Continue'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

