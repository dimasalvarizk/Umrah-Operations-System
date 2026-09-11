import { useState, useEffect, useRef, useMemo } from 'react';
import { Camera, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function EditProfileTab() {
  const { isRTL } = useLanguage();

  const [fullName, setFullName] = useState(isRTL ? 'أحمد محمد الشريف' : 'Ahmed Mohammed Al-Sharif');
  const [phone, setPhone] = useState('+966 50 123 4567');
  const [email, setEmail] = useState('ahmed.sharif@odstgroup.com');
  const [employeeId] = useState('EMP-1042');
  const [department, setDepartment] = useState(isRTL ? 'عمليات الحج والعمرة' : 'Hajj & Umrah Operations');
  const [jobTitle, setJobTitle] = useState(isRTL ? 'مشرف العمليات الرئيسي' : 'Lead Operations Supervisor');
  const [defaultBranch, setDefaultBranch] = useState(isRTL ? 'فرع مكة المكرمة' : 'Makkah Branch');
  const [registeredCompany] = useState('ODST Group (Main Services Company)');
  const [avatar, setAvatar] = useState<string | null>(null);

  const availableBranches = useMemo(() => {
    try {
      const saved = localStorage.getItem('system_list_branches');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      { id: '1', nameEn: 'Makkah Main Operations Hub', nameAr: 'فرع مكة المكرمة' },
      { id: '2', nameEn: 'Madinah Central Branch', nameAr: 'فرع المدينة المنورة' },
      { id: '3', nameEn: 'Jeddah Airport Logistics Office', nameAr: 'فرع جدة الرئيسي' },
    ];
  }, []);

  const [feedback, setFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load avatar from localStorage if available
  useEffect(() => {
    const savedAvatar = localStorage.getItem('user_profile_avatar');
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  }, []);

  const getInitials = (name: string) => {
    if (!name) return 'AM';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert(isRTL ? 'حجم الصورة يتجاوز الحد المسموح (5 ميغابايت)' : 'Image size exceeds 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setAvatar(dataUrl);
          localStorage.setItem('user_profile_avatar', dataUrl);
          setFeedback(isRTL ? 'تم تحديث الصورة الشخصية بنجاح' : 'Profile photo updated successfully!');
          setTimeout(() => setFeedback(null), 3000);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePhoto = () => {
    setAvatar(null);
    localStorage.removeItem('user_profile_avatar');
    setFeedback(isRTL ? 'تمت إزالة الصورة الشخصية' : 'Profile photo removed.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(isRTL ? 'تم حفظ التعديلات على الملف الشخصي بنجاح!' : 'Profile details updated successfully!');
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

      {/* Profile Header & Photo Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar Container */}
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-md flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white text-2xl font-bold">
              {avatar ? (
                <img src={avatar} alt={fullName} className="w-full h-full object-cover" />
              ) : (
                <span>{getInitials(fullName)}</span>
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md transition cursor-pointer active:scale-95"
              title={isRTL ? 'تغيير الصورة' : 'Change Photo'}
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Details */}
          <div className="flex-1 text-center sm:text-start space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-slate-900">{fullName}</h2>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">
                {isRTL ? 'نشط ومفعل' : 'Active Account'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">{jobTitle} • {department}</p>
            <p className="text-xs text-slate-400 font-mono">{employeeId} • {registeredCompany}</p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer shadow-2xs"
              >
                {isRTL ? 'رفع صورة جديدة' : 'Upload New Photo'}
              </button>
              {avatar && (
                <button
                  type="button"
                  onClick={handleDeletePhoto}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition cursor-pointer"
                >
                  <span>{isRTL ? 'حذف الصورة' : 'Remove'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form Fields Card */}
      <form onSubmit={handleProfileSubmit} className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">
            {isRTL ? 'المعلومات الشخصية والوظيفية' : 'Personal & Employment Details'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isRTL ? 'البيانات المسجلة في نظام إدارة عمليات الحج والعمرة' : 'Information registered in Umrah Operations System'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs sm:text-sm">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">
              {isRTL ? 'الاسم الكامل' : 'Full Name'}
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">
              {isRTL ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <input
              type="email"
              required
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-medium focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">
              {isRTL ? 'رقم الهاتف / الجوال' : 'Phone Number'}
            </label>
            <input
              type="text"
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-mono focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
            />
          </div>

          {/* Employee ID (Read only) */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">
              {isRTL ? 'الرقم الوظيفي' : 'Employee ID'}
            </label>
            <input
              type="text"
              disabled
              value={employeeId}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-500 font-mono cursor-not-allowed"
            />
          </div>

          {/* Department */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">
              {isRTL ? 'القسم / الإدارة' : 'Department'}
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
            />
          </div>

          {/* Job Title */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">
              {isRTL ? 'المسمى الوظيفي' : 'Job Title'}
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
            />
          </div>

          {/* Default Branch */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">
              {isRTL ? 'الفرع التشغيلي الافتراضي' : 'Default Operating Branch'}
            </label>
            <select
              value={defaultBranch}
              onChange={(e) => setDefaultBranch(e.target.value)}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition cursor-pointer"
            >
              {availableBranches.map((br) => (
                <option key={br.id} value={isRTL ? br.nameAr : br.nameEn}>
                  {isRTL ? br.nameAr : br.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Company (Read only) */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">
              {isRTL ? 'الشركة التابع لها' : 'Registered Organization'}
            </label>
            <input
              type="text"
              disabled
              value={registeredCompany}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm shadow-xs transition cursor-pointer active:scale-95"
          >
            {isRTL ? 'حفظ تعديلات الملف الشخصي' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
