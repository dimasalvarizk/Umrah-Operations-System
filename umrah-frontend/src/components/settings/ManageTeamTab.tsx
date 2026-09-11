import { useState, useMemo } from 'react';
import {
  Search,
  Check,
  X,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  employeeId: string;
  role: 'Super Admin' | 'Director' | 'Operations Supervisor' | 'Housing Specialist' | 'Transport Coordinator' | 'Staff';
  branch: string;
  department: string;
  jobTitle: string;
  status: 'Active' | 'Inactive';
  lastActive: string;
}

export default function ManageTeamTab() {
  const { isRTL } = useLanguage();

  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: isRTL ? 'أحمد محمد الشريف' : 'Ahmed Mohammed Al-Sharif',
      email: 'ahmed.sharif@odstgroup.com',
      phone: '+966 50 123 4567',
      employeeId: 'EMP-1042',
      role: 'Super Admin',
      branch: isRTL ? 'مكة المكرمة' : 'Makkah Branch',
      department: isRTL ? 'إدارة العمليات' : 'Operations Management',
      jobTitle: isRTL ? 'مشرف العمليات الرئيسي' : 'Lead Operations Supervisor',
      status: 'Active',
      lastActive: isRTL ? 'نشط الآن' : 'Active now',
    },
    {
      id: '2',
      name: isRTL ? 'سارة فهد القحطاني' : 'Sarah Fahad Al-Qahtani',
      email: 'sarah.q@odstgroup.com',
      phone: '+966 55 987 6543',
      employeeId: 'EMP-1088',
      role: 'Housing Specialist',
      branch: isRTL ? 'مكة المكرمة' : 'Makkah Branch',
      department: isRTL ? 'إسكان وفنادق' : 'Housing & Hotels',
      jobTitle: isRTL ? 'أخصائي تسكين وفنادق' : 'Housing Specialist',
      status: 'Active',
      lastActive: isRTL ? 'منذ ١٥ دقيقة' : '15 mins ago',
    },
    {
      id: '3',
      name: isRTL ? 'عبدالله سالم الحربي' : 'Abdullah Salem Al-Harbi',
      email: 'abdullah.h@odstgroup.com',
      phone: '+966 54 222 3344',
      employeeId: 'EMP-1095',
      role: 'Transport Coordinator',
      branch: isRTL ? 'المدينة المنورة' : 'Madinah Branch',
      department: isRTL ? 'النقل واللوجستيات' : 'Transport & Logistics',
      jobTitle: isRTL ? 'منسق أسطول وحافلات' : 'Fleet Coordinator',
      status: 'Active',
      lastActive: isRTL ? 'منذ ساعة' : '1 hour ago',
    },
    {
      id: '4',
      name: isRTL ? 'يوسف إبراهيم باوزير' : 'Youssef Ibrahim Bawazir',
      email: 'youssef.b@odstgroup.com',
      phone: '+966 56 444 8899',
      employeeId: 'EMP-1102',
      role: 'Operations Supervisor',
      branch: isRTL ? 'جدة' : 'Jeddah Main Office',
      department: isRTL ? 'الاستقبال والمطار' : 'Airport & Reception',
      jobTitle: isRTL ? 'مشرف استقبال بالمطار' : 'Airport Supervisor',
      status: 'Active',
      lastActive: isRTL ? 'منذ ساعتين' : '2 hours ago',
    },
    {
      id: '5',
      name: isRTL ? 'مها خالد السعيد' : 'Maha Khaled Al-Saeed',
      email: 'maha.s@odstgroup.com',
      phone: '+966 53 777 1122',
      employeeId: 'EMP-1115',
      role: 'Staff',
      branch: isRTL ? 'مكة المكرمة' : 'Makkah Branch',
      department: isRTL ? 'خدمة العملاء' : 'Customer Service',
      jobTitle: isRTL ? 'أخصائي خدمة معتمرين' : 'Pilgrim Care Agent',
      status: 'Inactive',
      lastActive: isRTL ? 'منذ ٣ أيام' : '3 days ago',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addStep, setAddStep] = useState<1 | 2 | 3>(1);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);

  // Form State
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [empIdInput, setEmpIdInput] = useState('');
  const [roleInput, setRoleInput] = useState<TeamMember['role']>('Operations Supervisor');
  const [branchInput, setBranchInput] = useState(isRTL ? 'مكة المكرمة' : 'Makkah Branch');
  const [deptInput, setDeptInput] = useState(isRTL ? 'إدارة العمليات' : 'Operations');
  const [jobTitleInput, setJobTitleInput] = useState(isRTL ? 'مشرف تشغيلي' : 'Operations Officer');
  const [statusInput, setStatusInput] = useState<'Active' | 'Inactive'>('Active');

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        !searchQuery ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'All' || m.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [members, searchQuery, roleFilter]);

  const handleOpenAdd = () => {
    setNameInput('');
    setEmailInput('');
    setPhoneInput('');
    setEmpIdInput(`EMP-${Math.floor(1000 + Math.random() * 900)}`);
    setRoleInput('Operations Supervisor');
    setBranchInput(isRTL ? 'مكة المكرمة' : 'Makkah Branch');
    setDeptInput(isRTL ? 'إدارة العمليات' : 'Operations');
    setJobTitleInput(isRTL ? 'مشرف تشغيلي' : 'Operations Officer');
    setStatusInput('Active');
    setAddStep(1);
    setIsAddOpen(true);
  };

  const handleOpenEdit = (m: TeamMember) => {
    setSelectedMember(m);
    setNameInput(m.name);
    setEmailInput(m.email);
    setPhoneInput(m.phone);
    setEmpIdInput(m.employeeId);
    setRoleInput(m.role);
    setBranchInput(m.branch);
    setDeptInput(m.department);
    setJobTitleInput(m.jobTitle);
    setStatusInput(m.status);
    setIsEditOpen(true);
  };

  const handleConfirmAdd = () => {
    const newM: TeamMember = {
      id: Date.now().toString(),
      name: nameInput.trim(),
      email: emailInput.trim(),
      phone: phoneInput.trim() || '+966 50 000 0000',
      employeeId: empIdInput.trim(),
      role: roleInput,
      branch: branchInput,
      department: deptInput,
      jobTitle: jobTitleInput,
      status: statusInput,
      lastActive: isRTL ? 'تمت إضافته للتو' : 'Just added',
    };
    setMembers((prev) => [newM, ...prev]);
    setAddStep(3);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMember) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === selectedMember.id
            ? {
                ...m,
                name: nameInput.trim(),
                email: emailInput.trim(),
                phone: phoneInput.trim(),
                role: roleInput,
                branch: branchInput,
                department: deptInput,
                jobTitle: jobTitleInput,
                status: statusInput,
              }
            : m
        )
      );
      setIsEditOpen(false);
      setSelectedMember(null);
      setFeedback(isRTL ? 'تم تحديث بيانات العضو بنجاح' : 'Team member details updated successfully!');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleDeleteMember = () => {
    if (memberToDelete) {
      setMembers((prev) => prev.filter((m) => m.id !== memberToDelete.id));
      setMemberToDelete(null);
      setFeedback(isRTL ? 'تم حذف العضو من الفريق' : 'Team member removed from team.');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const getRoleBadge = (role: TeamMember['role']) => {
    switch (role) {
      case 'Super Admin':
        return <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">Super Admin</span>;
      case 'Director':
        return <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Director</span>;
      case 'Operations Supervisor':
        return <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">{isRTL ? 'مشرف عمليات' : 'Ops Supervisor'}</span>;
      case 'Housing Specialist':
        return <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">{isRTL ? 'أخصائي تسكين' : 'Housing Spec.'}</span>;
      case 'Transport Coordinator':
        return <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">{isRTL ? 'منسق نقل' : 'Transport Coord.'}</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">{isRTL ? 'فريق العمل' : 'Staff'}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {feedback && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm font-semibold shadow-xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Top Action & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-1 items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRTL ? 'بحث بالاسم، البريد، أو الرقم الوظيفي...' : 'Search by name, email, or ID...'}
              className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-2 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition ${
                isRTL ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'
              }`}
            />
            <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
              isRTL ? 'right-3' : 'left-3'
            }`} />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-700 font-medium focus:outline-hidden focus:border-emerald-500 cursor-pointer"
          >
            <option value="All">{isRTL ? 'جميع الأدوار' : 'All Roles'}</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Operations Supervisor">{isRTL ? 'مشرف عمليات' : 'Ops Supervisor'}</option>
            <option value="Housing Specialist">{isRTL ? 'أخصائي تسكين' : 'Housing Specialist'}</option>
            <option value="Transport Coordinator">{isRTL ? 'منسق نقل' : 'Transport Coordinator'}</option>
            <option value="Staff">{isRTL ? 'موظف عام' : 'Staff'}</option>
          </select>
        </div>

        {/* Add Member Button */}
        <button
          type="button"
          onClick={handleOpenAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer active:scale-95"
        >
          <span>{isRTL ? '+ إضافة عضو جديد' : '+ Add Team Member'}</span>
        </button>
      </div>

      {/* Team Members Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-slate-600 font-bold text-[11px] sm:text-xs">
                <th className="py-3.5 px-4 text-start">{isRTL ? 'العضو' : 'Member'}</th>
                <th className="py-3.5 px-4 text-start">{isRTL ? 'الدور والصلاحية' : 'Role & Permission'}</th>
                <th className="py-3.5 px-4 text-start">{isRTL ? 'الفرع / الإدارة' : 'Branch / Department'}</th>
                <th className="py-3.5 px-4 text-start">{isRTL ? 'معلومات الاتصال' : 'Contact'}</th>
                <th className="py-3.5 px-4 text-center">{isRTL ? 'الحالة' : 'Status'}</th>
                <th className="py-3.5 px-4 text-center">{isRTL ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    {isRTL ? 'لم يتم العثور على أعضاء مطابقين للبحث' : 'No team members matching your search.'}
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition">
                    {/* Member Name & Avatar */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                          {m.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{m.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{m.employeeId}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div>{getRoleBadge(m.role)}</div>
                      <div className="text-[11px] text-slate-400 mt-1">{m.jobTitle}</div>
                    </td>

                    {/* Branch / Dept */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">
                        {m.branch}
                      </div>
                      <div className="text-[11px] text-slate-400">{m.department}</div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-xs text-slate-700 font-mono">
                        {m.email}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {m.phone}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        m.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${m.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        <span>{m.status === 'Active' ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'غير نشط' : 'Inactive')}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(m)}
                          className="px-2.5 py-1 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 font-semibold transition cursor-pointer text-xs"
                        >
                          {isRTL ? 'تعديل' : 'Edit'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setMemberToDelete(m)}
                          className="px-2.5 py-1 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 font-semibold transition cursor-pointer text-xs"
                        >
                          {isRTL ? 'حذف' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions & Roles Matrix Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">
            {isRTL ? 'مصفوفة الأدوار والصلاحيات التشغيلية' : 'Roles & Operational Permissions Matrix'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isRTL ? 'مستويات الوصول لنظام عمليات المجموعات والفنادق والنقل والعقود' : 'Access levels for groups, hotels, transport, and contracts'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-purple-100 bg-purple-50/40 space-y-2">
            <div className="font-bold text-purple-900 text-sm">
              Super Admin / Director
            </div>
            <p className="text-slate-600 leading-relaxed">
              {isRTL ? 'وصول شامل لكافة العمليات، إدارة الاتفاقيات والعقود، الفوترة، إدارة الفريق، وإعدادات النظام الكاملة.' : 'Full access to all modules, contract generation, invoicing, team management, and system configs.'}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 space-y-2">
            <div className="font-bold text-emerald-900 text-sm">
              Operations Supervisor
            </div>
            <p className="text-slate-600 leading-relaxed">
              {isRTL ? 'إنشاء وتعديل المجموعات، متابعة رحلات الطيران، تنسيق الفنادق والحافلات، وتحديث بيانات المعتمرين.' : 'Create/edit pilgrim groups, track flight schedules, coordinate hotels and buses, and update lists.'}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/40 space-y-2">
            <div className="font-bold text-amber-900 text-sm">
              Specialist / Staff
            </div>
            <p className="text-slate-600 leading-relaxed">
              {isRTL ? 'تسجيل التسكين، متابعة حركة الحافلات في الميدان، وتحديث الملاحظات التشغيلية اليومية.' : 'Hotel room check-in allocation, field bus dispatch tracking, and daily operational notes.'}
            </p>
          </div>
        </div>
      </div>

      {/* MODAL 1: ADD TEAM MEMBER (Multi-Step) */}
      {isAddOpen && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setIsAddOpen(false); }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent animate-fadeIn"
        >
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {addStep === 1 && (isRTL ? 'إضافة عضو جديد للفريق' : 'Add New Team Member')}
                  {addStep === 2 && (isRTL ? 'تأكيد بيانات العضو' : 'Confirm Member Details')}
                  {addStep === 3 && (isRTL ? 'تم بنجاح!' : 'Successfully Added!')}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {addStep === 1 && (isRTL ? 'أدخل البيانات الشخصية والوظيفية للمستخدم' : 'Enter personal and operational credentials')}
                  {addStep === 2 && (isRTL ? 'يرجى مراجعة البيانات قبل إنشاء الحساب' : 'Review details before finalizing registration')}
                  {addStep === 3 && (isRTL ? 'تم تفعيل الحساب في النظام' : 'User account has been activated')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* STEP 1: FORM */}
            {addStep === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); if (nameInput && emailInput) setAddStep(2); }} className="p-6 space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-semibold text-slate-700 block">
                      {isRTL ? 'الاسم الكامل' : 'Full Name'} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isRTL ? 'مثال: أحمد محمد الشريف' : 'e.g., Ahmed Mohammed Al-Sharif'}
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 block">
                      {isRTL ? 'البريد الإلكتروني' : 'Email Address'} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      dir="ltr"
                      placeholder="user@odstgroup.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 block">
                      {isRTL ? 'رقم الجوال' : 'Phone Number'} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      dir="ltr"
                      placeholder="+966 50 123 4567"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-mono focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
                    />
                  </div>

                  {/* Role */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 block">
                      {isRTL ? 'الدور والصلاحية' : 'Role & Permission'}
                    </label>
                    <select
                      value={roleInput}
                      onChange={(e) => setRoleInput(e.target.value as TeamMember['role'])}
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold focus:outline-hidden focus:border-emerald-500 transition cursor-pointer"
                    >
                      <option value="Operations Supervisor">{isRTL ? 'مشرف عمليات' : 'Operations Supervisor'}</option>
                      <option value="Housing Specialist">{isRTL ? 'أخصائي تسكين وفنادق' : 'Housing Specialist'}</option>
                      <option value="Transport Coordinator">{isRTL ? 'منسق نقل وحافلات' : 'Transport Coordinator'}</option>
                      <option value="Staff">{isRTL ? 'موظف عام' : 'Staff'}</option>
                      <option value="Director">Director</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 block">
                      {isRTL ? 'حالة الحساب' : 'Initial Status'}
                    </label>
                    <select
                      value={statusInput}
                      onChange={(e) => setStatusInput(e.target.value as 'Active' | 'Inactive')}
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold focus:outline-hidden focus:border-emerald-500 transition cursor-pointer"
                    >
                      <option value="Active">{isRTL ? 'نشط (مفعل)' : 'Active'}</option>
                      <option value="Inactive">{isRTL ? 'غير نشط' : 'Inactive'}</option>
                    </select>
                  </div>

                  {/* Branch */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 block">
                      {isRTL ? 'الفرع التشغيلي' : 'Branch'}
                    </label>
                    <select
                      value={branchInput}
                      onChange={(e) => setBranchInput(e.target.value)}
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold focus:outline-hidden focus:border-emerald-500 transition cursor-pointer"
                    >
                      <option value={isRTL ? 'مكة المكرمة' : 'Makkah Branch'}>{isRTL ? 'مكة المكرمة' : 'Makkah Branch'}</option>
                      <option value={isRTL ? 'المدينة المنورة' : 'Madinah Branch'}>{isRTL ? 'المدينة المنورة' : 'Madinah Branch'}</option>
                      <option value={isRTL ? 'جدة' : 'Jeddah Main Office'}>{isRTL ? 'جدة' : 'Jeddah Main Office'}</option>
                    </select>
                  </div>

                  {/* Department */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 block">
                      {isRTL ? 'القسم / الإدارة' : 'Department'}
                    </label>
                    <input
                      type="text"
                      placeholder={isRTL ? 'مثال: إدارة العمليات الميدانية' : 'e.g., Operations Management'}
                      value={deptInput}
                      onChange={(e) => setDeptInput(e.target.value)}
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="px-4 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition cursor-pointer shadow-2xs text-xs sm:text-sm"
                  >
                    {isRTL ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition cursor-pointer active:scale-95 text-xs sm:text-sm"
                  >
                    {isRTL ? 'التالي: مراجعة البيانات' : 'Next: Review'}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: REVIEW / CONFIRMATION */}
            {addStep === 2 && (
              <div className="p-6 space-y-5 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">{isRTL ? 'الاسم الكامل:' : 'Full Name:'}</span>
                    <span className="font-bold text-slate-900">{nameInput}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">{isRTL ? 'البريد الإلكتروني:' : 'Email:'}</span>
                    <span className="font-mono text-slate-800">{emailInput}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">{isRTL ? 'رقم الهاتف:' : 'Phone Number:'}</span>
                    <span className="font-mono text-slate-800">{phoneInput || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">{isRTL ? 'الدور والصلاحية:' : 'Role:'}</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">{roleInput}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500 font-medium">{isRTL ? 'الفرع والإدارة:' : 'Branch & Dept:'}</span>
                    <span className="font-semibold text-slate-800">{branchInput} • {deptInput}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setAddStep(1)}
                    className="px-4 py-2.5 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 rounded-xl font-bold transition cursor-pointer shadow-2xs text-xs sm:text-sm"
                  >
                    {isRTL ? 'رجوع للتعديل' : 'Back'}
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmAdd}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition cursor-pointer active:scale-95 text-xs sm:text-sm"
                  >
                    {isRTL ? 'تأكيد وحفظ العضو' : 'Confirm & Save'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SUCCESS */}
            {addStep === 3 && (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-slate-900">{isRTL ? 'تمت إضافة العضو بنجاح!' : 'Member Added Successfully!'}</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {isRTL ? 'تم تسجيل بيانات العضو وإتاحة الوصول للنظام حسب الصلاحيات المحددة.' : 'The team member is now active in the system with configured permissions.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm transition cursor-pointer shadow-xs"
                >
                  {isRTL ? 'تم الإغلاق' : 'Done'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT TEAM MEMBER */}
      {isEditOpen && selectedMember && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setIsEditOpen(false); }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent animate-fadeIn"
        >
          <form onSubmit={handleSaveEdit} className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isRTL ? 'تعديل بيانات العضو' : 'Edit Member Details'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isRTL ? 'تحديث المعلومات والصلاحيات التشغيلية للعضو' : 'Update account info, department, and operational role'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-semibold text-slate-700 block">
                    {isRTL ? 'الاسم الكامل' : 'Full Name'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">
                    {isRTL ? 'البريد الإلكتروني' : 'Email Address'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    dir="ltr"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-medium focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">
                    {isRTL ? 'رقم الهاتف' : 'Phone Number'}
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-mono focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
                  />
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">
                    {isRTL ? 'الدور والصلاحية' : 'Role'}
                  </label>
                  <select
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value as TeamMember['role'])}
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold focus:outline-hidden focus:border-emerald-500 transition cursor-pointer"
                  >
                    <option value="Operations Supervisor">{isRTL ? 'مشرف عمليات' : 'Operations Supervisor'}</option>
                    <option value="Housing Specialist">{isRTL ? 'أخصائي تسكين' : 'Housing Specialist'}</option>
                    <option value="Transport Coordinator">{isRTL ? 'منسق نقل' : 'Transport Coordinator'}</option>
                    <option value="Staff">{isRTL ? 'موظف عام' : 'Staff'}</option>
                    <option value="Director">Director</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">
                    {isRTL ? 'الحالة' : 'Status'}
                  </label>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value as 'Active' | 'Inactive')}
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold focus:outline-hidden focus:border-emerald-500 transition cursor-pointer"
                  >
                    <option value="Active">{isRTL ? 'نشط' : 'Active'}</option>
                    <option value="Inactive">{isRTL ? 'غير نشط' : 'Inactive'}</option>
                  </select>
                </div>

                {/* Branch */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">
                    {isRTL ? 'الفرع التشغيلي' : 'Branch'}
                  </label>
                  <select
                    value={branchInput}
                    onChange={(e) => setBranchInput(e.target.value)}
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold focus:outline-hidden focus:border-emerald-500 transition cursor-pointer"
                  >
                    <option value={isRTL ? 'مكة المكرمة' : 'Makkah Branch'}>{isRTL ? 'مكة المكرمة' : 'Makkah Branch'}</option>
                    <option value={isRTL ? 'المدينة المنورة' : 'Madinah Branch'}>{isRTL ? 'المدينة المنورة' : 'Madinah Branch'}</option>
                    <option value={isRTL ? 'جدة' : 'Jeddah Main Office'}>{isRTL ? 'جدة' : 'Jeddah Main Office'}</option>
                  </select>
                </div>

                {/* Department */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">
                    {isRTL ? 'القسم / الإدارة' : 'Department'}
                  </label>
                  <input
                    type="text"
                    value={deptInput}
                    onChange={(e) => setDeptInput(e.target.value)}
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50/60 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2.5 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 rounded-xl font-bold transition cursor-pointer shadow-2xs text-xs sm:text-sm"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition cursor-pointer active:scale-95 text-xs sm:text-sm"
              >
                {isRTL ? 'حفظ التعديلات' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: DELETE CONFIRMATION */}
      {memberToDelete && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setMemberToDelete(null); }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent animate-fadeIn"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-4 border border-slate-200 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">{isRTL ? 'تأكيد حذف العضو' : 'Delete Member?'}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isRTL
                  ? `هل أنت متأكد من رغبتك في حذف ${memberToDelete.name} من فريق العمل؟ لن يتمكن من تسجيل الدخول للنظام.`
                  : `Are you sure you want to remove ${memberToDelete.name} from the team? They will no longer have access to the operations platform.`}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                className="flex-1 py-2.5 border border-slate-200 bg-white hover:bg-slate-100 rounded-xl text-xs sm:text-sm font-bold text-slate-700 transition cursor-pointer shadow-2xs"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleDeleteMember}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer active:scale-95"
              >
                {isRTL ? 'نعم، حذف' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
