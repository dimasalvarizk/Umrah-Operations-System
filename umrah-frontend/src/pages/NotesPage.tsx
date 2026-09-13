import { useState, useMemo, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { useLanguage } from '../context/LanguageContext';
import {
  Search,
  Plus,
  Pin,
  CheckCircle2,
  Clock,
  AlertCircle,
  Tag,
  Building2,
  Bus,
  Plane,
  FileCheck2,
  HeartPulse,
  Trash2,
  Edit3,
  Copy,
  Check,
  LayoutGrid,
  List,
  X,
  BellRing,
} from 'lucide-react';
import {
  getNotesApi,
  createNoteApi,
  updateNoteApi,
  togglePinNoteApi,
  deleteNoteApi,
} from '../services/notesApi';
import { createNotificationApi } from '../services/notificationsApi';

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  category: 'فنادق' | 'نقل' | 'طيران' | 'جوازات' | 'رعاية صحية' | 'عام';
  priority: 'عاجل' | 'هام' | 'عادي';
  status: 'نشط' | 'مكتمل';
  isPinned: boolean;
  relatedEntity?: string;
  author: string;
  date: string;
  tags: string[];
  checklist?: { id: string; text: string; done: boolean }[];
}

export default function NotesPage() {
  const { direction, t, isRTL } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [selectedPriority, setSelectedPriority] = useState<string>('الكل');
  const [selectedStatus, setSelectedStatus] = useState<'الكل' | 'نشط' | 'مكتمل' | 'مثبت'>('الكل');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal States
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [viewingNote, setViewingNote] = useState<NoteItem | null>(null);
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Notes State with backend synchronization
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    try {
      const saved = localStorage.getItem('umrah_notes_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const fetchNotes = async () => {
    try {
      const { notes: fetched } = await getNotesApi({
        search: searchQuery,
        category: selectedCategory,
        priority: selectedPriority,
        status: selectedStatus,
      });
      if (Array.isArray(fetched)) {
        setNotes(fetched);
      }
    } catch {
      // Offline fallback
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [searchQuery, selectedCategory, selectedPriority, selectedStatus]);

  useEffect(() => {
    localStorage.setItem('umrah_notes_list', JSON.stringify(notes));
  }, [notes]);

  // Form State for Add / Edit
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState<NoteItem['category']>('عام');
  const [formPriority, setFormPriority] = useState<NoteItem['priority']>('عادي');
  const [formEntity, setFormEntity] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formIsPinned, setFormIsPinned] = useState(false);
  const [formSendNotif, setFormSendNotif] = useState(false);

  // Category Configuration with translations
  const categories: {
    id: NoteItem['category'] | 'الكل';
    label: string;
    icon: any;
    color: string;
  }[] = [
    { id: 'الكل', label: t('notes.cat_all', 'جميع الملاحظات'), icon: LayoutGrid, color: 'text-slate-700' },
    { id: 'فنادق', label: t('notes.cat_hotels', 'الفنادق والتسكين'), icon: Building2, color: 'text-amber-600' },
    { id: 'نقل', label: t('notes.cat_transport', 'التفويج والنقل'), icon: Bus, color: 'text-emerald-600' },
    { id: 'طيران', label: t('notes.cat_flights', 'الطيران والمطارات'), icon: Plane, color: 'text-blue-600' },
    { id: 'جوازات', label: t('notes.cat_passports', 'المسار والجوازات'), icon: FileCheck2, color: 'text-purple-600' },
    { id: 'رعاية صحية', label: t('notes.cat_healthcare', 'رعاية واحتياجات خاصة'), icon: HeartPulse, color: 'text-rose-600' },
    { id: 'عام', label: t('notes.cat_general', 'ملاحظات عامة'), icon: Tag, color: 'text-slate-600' },
  ];

  // Filtering Logic
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        note.title.toLowerCase().includes(q) ||
        note.content.toLowerCase().includes(q) ||
        note.author.toLowerCase().includes(q) ||
        (note.relatedEntity && note.relatedEntity.toLowerCase().includes(q)) ||
        note.tags.some((tItem) => tItem.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === 'الكل' || note.category === selectedCategory;

      const matchesPriority =
        selectedPriority === 'الكل' || note.priority === selectedPriority;

      const matchesStatus =
        selectedStatus === 'الكل'
          ? true
          : selectedStatus === 'مثبت'
          ? note.isPinned
          : note.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });
  }, [notes, searchQuery, selectedCategory, selectedPriority, selectedStatus]);

  // Statistics Calculation
  const stats = useMemo(() => {
    return {
      total: notes.length,
      pinned: notes.filter((n) => n.isPinned).length,
      urgent: notes.filter((n) => n.priority === 'عاجل' && n.status === 'نشط').length,
      completed: notes.filter((n) => n.status === 'مكتمل').length,
    };
  }, [notes]);

  // Actions
  const handleTogglePin = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const target = notes.find((n) => n.id === id);
    if (!target) return;

    const nextPin = !target.isPinned;
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: nextPin } : n))
    );

    try {
      await togglePinNoteApi(id);
    } catch {}
  };

  const handleToggleStatus = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const target = notes.find((n) => n.id === id);
    if (!target) return;

    const nextStatus: NoteItem['status'] =
      target.status === 'نشط' ? 'مكتمل' : 'نشط';

    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: nextStatus } : n))
    );

    try {
      await updateNoteApi(id, { status: nextStatus });
    } catch {}
  };

  const handleCopyContent = (note: NoteItem) => {
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenAdd = () => {
    setEditingNote(null);
    setFormTitle('');
    setFormContent('');
    setFormCategory('عام');
    setFormPriority('عادي');
    setFormEntity('');
    setFormTags('');
    setFormIsPinned(false);
    setFormSendNotif(false);
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (note: NoteItem) => {
    setEditingNote(note);
    setFormTitle(note.title);
    setFormContent(note.content);
    setFormCategory(note.category);
    setFormPriority(note.priority);
    setFormEntity(note.relatedEntity || '');
    setFormTags(note.tags.join(', '));
    setFormIsPinned(note.isPinned);
    setFormSendNotif(false);
    setIsAddEditOpen(true);
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const parsedTags = formTags
      .split(',')
      .map((tItem) => tItem.trim())
      .filter(Boolean);

    let savedId = editingNote?.id || Date.now().toString();

    if (editingNote) {
      const payload: Partial<NoteItem> = {
        title: formTitle,
        content: formContent,
        category: formCategory,
        priority: formPriority,
        relatedEntity: formEntity || undefined,
        tags: parsedTags.length ? parsedTags : editingNote.tags,
        isPinned: formIsPinned,
      };

      try {
        const updated = await updateNoteApi(editingNote.id, payload);
        savedId = updated?.id ? String(updated.id) : savedId;
        setNotes((prev) =>
          prev.map((n) => (n.id === editingNote.id ? { ...n, ...updated } : n))
        );
      } catch {
        setNotes((prev) =>
          prev.map((n) =>
            n.id === editingNote.id ? { ...n, ...payload } : n
          )
        );
      }
    } else {
      const newNotePayload: Partial<NoteItem> = {
        title: formTitle,
        content: formContent,
        category: formCategory,
        priority: formPriority,
        status: 'نشط',
        isPinned: formIsPinned,
        relatedEntity: formEntity || undefined,
        author: isRTL ? 'مشرف العمليات' : 'Operations Supervisor',
        date: isRTL ? 'الآن' : 'Just now',
        tags: parsedTags.length ? parsedTags : [isRTL ? 'ملاحظة تشغيلية' : 'Operations Note'],
      };

      try {
        const created = await createNoteApi(newNotePayload);
        if (created?.id) savedId = String(created.id);
        setNotes((prev) => [created, ...prev]);
      } catch {
        setNotes((prev) => [
          {
            title: formTitle,
            content: formContent,
            category: formCategory,
            priority: formPriority,
            status: 'نشط',
            isPinned: formIsPinned,
            relatedEntity: formEntity || undefined,
            author: isRTL ? 'مشرف العمليات' : 'Operations Supervisor',
            date: isRTL ? 'الآن' : 'Just now',
            tags: parsedTags.length ? parsedTags : [isRTL ? 'ملاحظة تشغيلية' : 'Operations Note'],
            id: savedId,
          },
          ...prev,
        ]);
      }
    }

    // Trigger Notification if reminder alert enabled or urgent priority
    if (formSendNotif || formPriority === 'عاجل') {
      try {
        const notifTitleEn = formPriority === 'عاجل'
          ? `[Urgent Note] ${formTitle.trim()}`
          : `[Note Reminder] ${formTitle.trim()}`;
        const notifTitleAr = formPriority === 'عاجل'
          ? `[ملاحظة عاجلة] ${formTitle.trim()}`
          : `[تذكير ملاحظة] ${formTitle.trim()}`;

        await createNotificationApi({
          titleEn: notifTitleEn,
          titleAr: notifTitleAr,
          descEn: formContent.trim().slice(0, 120) || 'Operational note logged in system',
          descAr: formContent.trim().slice(0, 120) || 'تم تسجيل ملاحظة تشغيلية في النظام',
          type: 'note',
          referenceId: savedId,
          referenceLink: '/notes',
        });
        window.dispatchEvent(new CustomEvent('umrah_notification_refresh'));
      } catch (notifErr) {
        console.warn('Note notification dispatch fallback:', notifErr);
      }
    }

    setIsAddEditOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (deleteNoteId) {
      const id = deleteNoteId;
      setNotes((prev) => prev.filter((n) => n.id !== id));
      setDeleteNoteId(null);
      if (viewingNote?.id === id) {
        setViewingNote(null);
      }
      try {
        await deleteNoteApi(id);
      } catch {}
    }
  };

  const getPriorityBadge = (priority: NoteItem['priority']) => {
    switch (priority) {
      case 'عاجل':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#fee2e2] text-[#ef4444]">
            <AlertCircle className="w-3 h-3" />
            {t('notes.prio_urgent', 'عاجل جداً')}
          </span>
        );
      case 'هام':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#fef3c7] text-[#d97706]">
            <Clock className="w-3 h-3" />
            {t('notes.prio_high', 'هام')}
          </span>
        );
      case 'عادي':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600">
            {t('notes.prio_normal', 'عادي')}
          </span>
        );
    }
  };

  const getCategoryBadge = (category: NoteItem['category']) => {
    switch (category) {
      case 'فنادق':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
            {t('notes.cat_hotels', 'فنادق وتسكين')}
          </span>
        );
      case 'نقل':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            {t('notes.cat_transport', 'تفويج ونقل')}
          </span>
        );
      case 'طيران':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
            {t('notes.cat_flights', 'طيران ومطارات')}
          </span>
        );
      case 'جوازات':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
            {t('notes.cat_passports', 'المسار والجوازات')}
          </span>
        );
      case 'رعاية صحية':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
            {t('notes.cat_healthcare', 'رعاية واحتياجات')}
          </span>
        );
      case 'عام':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {t('notes.cat_general', 'عام')}
          </span>
        );
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-row"
      dir={direction}
    >
      {/* 1. Sidebar (Right in RTL, Left in LTR) */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeTab="notes"
      />

      {/* 2. Main Page Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar
          title={t('notes.title', 'الملاحظات والمهام التشغيلية')}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        {/* Main Content Area */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto flex-1 max-w-[1600px] w-full mx-auto">
          {/* Top 4 Stat Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1">
                  {t('notes.total_notes_stat', 'إجمالي الملاحظات')}
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-[#0f172a] tracking-tight">
                  {stats.total}
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                <Tag className="w-5 h-5" />
              </div>
            </div>

            {/* Card 2: Pinned */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1">
                  {t('notes.pinned_notes_stat', 'المثبتة في الأعلى')}
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-amber-600 tracking-tight">
                  {stats.pinned}
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Pin className="w-5 h-5 fill-amber-500" />
              </div>
            </div>

            {/* Card 3: Urgent */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1">
                  {t('notes.urgent_notes_stat', 'تنبيهات عاجلة نشطة')}
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-red-600 tracking-tight">
                  {stats.urgent}
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>

            {/* Card 4: Completed */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1">
                  {t('notes.completed_notes_stat', 'تمت معالجتها')}
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-emerald-600 tracking-tight">
                  {stats.completed}
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Action / Search / Filters Bar */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative flex-1 min-w-[260px]">
                <input
                  type="text"
                  placeholder={t('notes.search_placeholder', 'ابحث في عنوان الملاحظة، المحتوى، الوسوم، أو اسم الفوج...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full bg-white border border-slate-200/90 rounded-xl py-2.5 ${isRTL ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'} text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition shadow-2xs`}
                />
                <Search className={`w-4 h-4 text-slate-400 absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 pointer-events-none`} />
              </div>

              {/* Priority & Status Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Status selector */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
                  {(['الكل', 'نشط', 'مثبت', 'مكتمل'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedStatus(st)}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                        selectedStatus === st
                          ? 'bg-white text-slate-900 font-bold shadow-2xs'
                          : 'hover:text-slate-900'
                      }`}
                    >
                      {st === 'الكل'
                        ? t('notes.filter_all', 'الكل')
                        : st === 'نشط'
                        ? t('notes.filter_active', 'قيد المتابعة')
                        : st === 'مثبت'
                        ? t('notes.filter_pinned', 'المثبتة')
                        : t('notes.filter_completed', 'المكتملة')}
                    </button>
                  ))}
                </div>

                {/* Priority Selector */}
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer shadow-2xs"
                >
                  <option value="الكل">{t('notes.prio_all', 'جميع درجات الأهمية')}</option>
                  <option value="عاجل">{t('notes.prio_urgent', 'عاجل جداً')}</option>
                  <option value="هام">{t('notes.prio_high', 'هام')}</option>
                  <option value="عادي">{t('notes.prio_normal', 'عادي')}</option>
                </select>

                {/* Grid / List View Toggle */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title={t('notes.grid_view', 'عرض شبكي')}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title={t('notes.list_view', 'عرض قائمة')}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Add New Note Button */}
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="inline-flex items-center gap-2 bg-[#00dc82] hover:bg-[#00c574] text-[#0d0f14] font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>{t('notes.add_note', 'إضافة ملاحظة')}</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer font-medium border ${
                      isSelected
                        ? 'bg-[#0f172a] text-white border-[#0f172a] shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#00dc82]' : cat.color}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes Content Display */}
          {filteredNotes.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-2xs">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
                <Tag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-[#0f172a] mb-1">
                {t('notes.no_notes_found', 'لا توجد ملاحظات مطابقة')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
                {t('notes.no_notes_desc', 'لم نتمكن من العثور على أي ملاحظة تطابق معايير البحث والفلترة المحددة.')}
              </p>
              <button
                type="button"
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 bg-[#0f172a] text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-800 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t('notes.add_first_note', 'إضافة ملاحظة جديدة الآن')}</span>
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredNotes.map((note) => {
                const isCompleted = note.status === 'مكتمل';
                return (
                  <div
                    key={note.id}
                    className={`bg-white border rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group relative ${
                      note.isPinned
                        ? 'border-amber-300 ring-1 ring-amber-200/70 bg-gradient-to-b from-amber-50/20 to-white'
                        : isCompleted
                        ? 'border-slate-200/70 bg-slate-50/50 opacity-80'
                        : 'border-slate-200/90'
                    }`}
                  >
                    {/* Card Top: Badges & Pin Action */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {getCategoryBadge(note.category)}
                          {getPriorityBadge(note.priority)}
                        </div>

                        <div className="flex items-center gap-1">
                          {/* Pin Button */}
                          <button
                            type="button"
                            onClick={() => handleTogglePin(note.id)}
                            className={`p-1.5 rounded-lg transition cursor-pointer ${
                              note.isPinned
                                ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                            }`}
                            title={note.isPinned ? t('notes.unpin_note', 'إلغاء التثبيت') : t('notes.pin_note', 'تثبيت في الأعلى')}
                          >
                            <Pin
                              className={`w-3.5 h-3.5 ${
                                note.isPinned ? 'fill-amber-500' : ''
                              }`}
                            />
                          </button>

                          {/* Complete Status Checkbox */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(note.id)}
                            className={`p-1.5 rounded-lg transition cursor-pointer ${
                              isCompleted
                                ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                                : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-100'
                            }`}
                            title={isCompleted ? t('notes.mark_active', 'إعادة كملاحظة نشطة') : t('notes.mark_resolved', 'تعيين كمكتمل')}
                          >
                            <CheckCircle2
                              className={`w-4 h-4 ${
                                isCompleted ? 'fill-emerald-100 stroke-emerald-600' : ''
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h4
                        onClick={() => setViewingNote(note)}
                        className={`text-sm sm:text-base font-bold mb-2 cursor-pointer hover:text-emerald-700 transition leading-snug ${
                          isCompleted
                            ? 'line-through text-slate-400'
                            : 'text-[#0f172a]'
                        }`}
                      >
                        {note.title}
                      </h4>

                      {/* Content Preview */}
                      <p
                        onClick={() => setViewingNote(note)}
                        className={`text-xs sm:text-[13px] leading-relaxed line-clamp-3 mb-3 cursor-pointer ${
                          isCompleted ? 'text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        {note.content}
                      </p>

                      {/* Related Entity Pill if any */}
                      {note.relatedEntity && (
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-200/70 px-2.5 py-1 rounded-lg mb-3 w-fit">
                          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[240px]">
                            {note.relatedEntity}
                          </span>
                        </div>
                      )}

                      {/* Checklist Summary if available */}
                      {note.checklist && note.checklist.length > 0 && (
                        <div className="mb-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                          <span>{t('notes.checklist', 'المهام الفرعية:')}</span>
                          <span className="font-bold text-slate-700">
                            {note.checklist.filter((c) => c.done).length} /{' '}
                            {note.checklist.length}
                          </span>
                        </div>
                      )}

                      {/* Tags */}
                      {note.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap mb-4">
                          {note.tags.map((tItem, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                            >
                              #{tItem}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Footer: Metadata & Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-500">
                          {note.author}
                        </span>
                        <span>•</span>
                        <span>{note.date}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Copy Button */}
                        <button
                          type="button"
                          onClick={() => handleCopyContent(note)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title={t('notes.copy_note', 'نسخ نص الملاحظة')}
                        >
                          {copiedId === note.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(note)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title={t('common.edit', 'تعديل')}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => setDeleteNoteId(note.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title={t('common.delete', 'حذف')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* LIST VIEW */
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className={`w-full ${isRTL ? 'text-right' : 'text-left'} text-xs sm:text-sm`}>
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="py-3.5 px-4 w-12 text-center">{t('notes.col_status', 'الحالة')}</th>
                      <th className="py-3.5 px-4">{t('notes.col_title', 'عنوان الملاحظة والتفاصيل')}</th>
                      <th className="py-3.5 px-4">{t('notes.col_category', 'التصنيف')}</th>
                      <th className="py-3.5 px-4">{t('notes.col_priority', 'الأهمية')}</th>
                      <th className="py-3.5 px-4">{t('notes.col_entity', 'الجهة المرتبطة')}</th>
                      <th className="py-3.5 px-4">{t('notes.col_author_date', 'المشرف / التاريخ')}</th>
                      <th className="py-3.5 px-4 w-28 text-center">{t('notes.col_actions', 'الإجراءات')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredNotes.map((note) => {
                      const isCompleted = note.status === 'مكتمل';
                      return (
                        <tr
                          key={note.id}
                          className={`hover:bg-slate-50/70 transition ${
                            note.isPinned ? 'bg-amber-50/20' : ''
                          }`}
                        >
                          {/* Checkbox Column */}
                          <td className="py-3.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(note.id)}
                              className="cursor-pointer text-slate-400 hover:text-emerald-600 transition"
                            >
                              <CheckCircle2
                                className={`w-4 h-4 mx-auto ${
                                  isCompleted ? 'text-emerald-600 fill-emerald-100' : ''
                                }`}
                              />
                            </button>
                          </td>

                          {/* Title & Preview */}
                          <td className="py-3.5 px-4 max-w-sm">
                            <div className="flex items-center gap-2">
                              {note.isPinned && (
                                <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                              )}
                              <span
                                onClick={() => setViewingNote(note)}
                                className={`font-bold hover:text-emerald-600 cursor-pointer ${
                                  isCompleted
                                    ? 'line-through text-slate-400'
                                    : 'text-[#0f172a]'
                                }`}
                              >
                                {note.title}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 truncate mt-0.5">
                              {note.content}
                            </p>
                          </td>

                          {/* Category */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {getCategoryBadge(note.category)}
                          </td>

                          {/* Priority */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {getPriorityBadge(note.priority)}
                          </td>

                          {/* Related Entity */}
                          <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap text-xs">
                            {note.relatedEntity || '—'}
                          </td>

                          {/* Author & Date */}
                          <td className="py-3.5 px-4 text-slate-500 text-xs whitespace-nowrap">
                            <div>{note.author}</div>
                            <div className="text-[11px] text-slate-400">{note.date}</div>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleTogglePin(note.id)}
                                className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                                title={t('notes.pin_note', 'تثبيت')}
                              >
                                <Pin
                                  className={`w-3.5 h-3.5 ${
                                    note.isPinned ? 'fill-amber-500 text-amber-500' : ''
                                  }`}
                                />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(note)}
                                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                                title={t('common.edit', 'تعديل')}
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteNoteId(note.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                                title={t('common.delete', 'حذف')}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. Add / Edit Note Modal */}
      {isAddEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div
            className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            dir={direction}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#0f172a]">
                {editingNote ? t('notes.edit_note', 'تعديل الملاحظة التشغيلية') : t('notes.add_note_modal_title', 'إضافة ملاحظة تشغيلية جديدة')}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddEditOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveNote} className="space-y-4 text-xs sm:text-sm">
              {/* Note Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  {t('notes.note_title', 'عنوان الملاحظة')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={t('notes.note_title_placeholder', 'مثال: تأكيد وصول حافلات الفوج الباكستاني')}
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 transition"
                />
              </div>

              {/* Category & Priority Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    {t('notes.category', 'التصنيف')}
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) =>
                      setFormCategory(e.target.value as NoteItem['category'])
                    }
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="عام">{t('notes.cat_general', 'عام')}</option>
                    <option value="فنادق">{t('notes.cat_hotels', 'فنادق وتسكين')}</option>
                    <option value="نقل">{t('notes.cat_transport', 'تفويج ونقل')}</option>
                    <option value="طيران">{t('notes.cat_flights', 'طيران ومطارات')}</option>
                    <option value="جوازات">{t('notes.cat_passports', 'المسار والجوازات')}</option>
                    <option value="رعاية صحية">{t('notes.cat_healthcare', 'رعاية واحتياجات خاصة')}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    {t('notes.priority', 'درجة الأهمية')}
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) =>
                      setFormPriority(e.target.value as NoteItem['priority'])
                    }
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="عادي">{t('notes.prio_normal', 'عادي')}</option>
                    <option value="هام">{t('notes.prio_high', 'هام')}</option>
                    <option value="عاجل">{t('notes.prio_urgent', 'عاجل جداً')}</option>
                  </select>
                </div>
              </div>

              {/* Related Entity */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  {t('notes.related_entity', 'الجهة أو الفوج المرتبط (اختياري)')}
                </label>
                <input
                  type="text"
                  placeholder={t('notes.related_entity_placeholder', 'مثال: مجموعة الأنوار 1 • فندق برج جوار الحرم')}
                  value={formEntity}
                  onChange={(e) => setFormEntity(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 transition"
                />
              </div>

              {/* Note Content */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  {t('notes.note_content', 'نص وتفاصيل الملاحظة')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={t('notes.note_content_placeholder', 'اكتب التعليمات أو التوجيهات التشغيلية هنا بالتفصيل...')}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 transition resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  {t('notes.tags', 'الوسوم والكلمات الدلالية (مفصولة بفواصل)')}
                </label>
                <input
                  type="text"
                  placeholder={t('notes.tags_placeholder', 'مثال: مطار جدة, كبار السن, VIP')}
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 transition"
                />
              </div>

              {/* Pinned & Notification Checkboxes */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pinNoteCheck"
                    checked={formIsPinned}
                    onChange={(e) => setFormIsPinned(e.target.checked)}
                    className="w-4 h-4 text-[#00dc82] rounded border-slate-300 focus:ring-0 cursor-pointer"
                  />
                  <label
                    htmlFor="pinNoteCheck"
                    className="text-xs font-semibold text-slate-700 cursor-pointer"
                  >
                    {t('notes.pin_always', 'تثبيت هذه الملاحظة في أعلى الصفحة دائماً')}
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sendNotifCheck"
                    checked={formSendNotif || formPriority === 'عاجل'}
                    onChange={(e) => setFormSendNotif(e.target.checked)}
                    className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-0 cursor-pointer"
                  />
                  <label
                    htmlFor="sendNotifCheck"
                    className="text-xs font-semibold text-slate-700 cursor-pointer flex items-center gap-1.5"
                  >
                    <BellRing className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>
                      {isRTL
                        ? 'إرسال تنبيه فوري في مركز الإشعارات (Notification Center)'
                        : 'Send instant alert to Notification Center'}
                    </span>
                    {formPriority === 'عاجل' && (
                      <span className="text-[10px] text-red-500 font-bold">
                        ({isRTL ? 'تلقائي لأن الأولوية عاجلة' : 'Auto for Urgent'})
                      </span>
                    )}
                  </label>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddEditOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  {t('common.cancel', 'إلغاء')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#00dc82] text-[#0d0f14] font-bold hover:bg-[#00c574] transition shadow-xs cursor-pointer"
                >
                  {editingNote ? t('common.save', 'حفظ التعديلات') : t('notes.add_note', 'إضافة الملاحظة')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. View Detail Modal */}
      {viewingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div
            className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            dir={direction}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {getCategoryBadge(viewingNote.category)}
                  {getPriorityBadge(viewingNote.priority)}
                  {viewingNote.isPinned && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                      <Pin className="w-3 h-3 fill-amber-500" />
                      {t('notes.stat_pinned', 'مثبتة')}
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#0f172a]">
                  {viewingNote.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingNote(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-slate-700 leading-relaxed whitespace-pre-line">
                {viewingNote.content}
              </div>

              {viewingNote.relatedEntity && (
                <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-600">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-semibold">{t('notes.related_entity', 'الجهة المرتبطة:')}</span>
                  <span>{viewingNote.relatedEntity}</span>
                </div>
              )}

              {/* Checklist if available */}
              {viewingNote.checklist && viewingNote.checklist.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h5 className="font-bold text-slate-800 text-xs">
                    {t('notes.checklist_title', 'قائمة المهام الفرعية:')}
                  </h5>
                  <div className="space-y-1.5">
                    {viewingNote.checklist.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                      >
                        <CheckCircle2
                          className={`w-4 h-4 ${
                            item.done
                              ? 'text-emerald-600 fill-emerald-100'
                              : 'text-slate-300'
                          }`}
                        />
                        <span
                          className={
                            item.done
                              ? 'line-through text-slate-400'
                              : 'text-slate-700'
                          }
                        >
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {viewingNote.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap pt-2">
                  {viewingNote.tags.map((tItem, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg"
                    >
                      #{tItem}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer Meta */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>{t('notes.author', 'المشرف:')} {viewingNote.author}</span>
                <span>{t('common.date', 'التاريخ:')} {viewingNote.date}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  handleCopyContent(viewingNote);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                {copiedId === viewingNote.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t('notes.copied', 'تم النسخ!')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t('notes.copy_note', 'نسخ المحتوى')}</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const n = viewingNote;
                    setViewingNote(null);
                    handleOpenEdit(n);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
                >
                  {t('common.edit', 'تعديل')}
                </button>
                <button
                  type="button"
                  onClick={() => setViewingNote(null)}
                  className="px-4 py-2 rounded-xl bg-[#0f172a] text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
                >
                  {t('common.close', 'إغلاق')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Delete Confirmation Modal */}
      {deleteNoteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div
            className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4"
            dir={direction}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="text-base font-bold text-[#0f172a] mb-1">
                {t('notes.delete_note_confirm', 'تأكيد حذف الملاحظة')}
              </h4>
              <p className="text-xs text-slate-500">
                {t('notes.delete_note_desc', 'هل أنت متأكد من رغبتك في حذف هذه الملاحظة التشغيلية نهائياً؟ لا يمكن التراجع عن هذا الإجراء.')}
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteNoteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
              >
                {t('common.cancel', 'إلغاء')}
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition cursor-pointer"
              >
                {t('notes.delete_confirm_btn', 'حذف الملاحظة')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
