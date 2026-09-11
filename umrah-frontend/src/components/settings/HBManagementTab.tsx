import { useState } from 'react';
import {
  Check,
  X,
  AlertCircle,
  Search,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface RoomTypeItem {
  id: string;
  name: string;
  nameAr?: string;
  capacity: number;
  status: 'Active' | 'Inactive';
}

export interface MealTypeItem {
  id: string;
  name: string;
  nameAr?: string;
  code: string;
  status: 'Active' | 'Inactive';
}

const INITIAL_ROOMS: RoomTypeItem[] = [
  { id: 'room-1', name: 'Single Room', nameAr: 'غرفة مفردة (شخص واحد)', capacity: 1, status: 'Active' },
  { id: 'room-2', name: 'Double / Twin Room', nameAr: 'غرفة ثنائية (سريرين منفصلين)', capacity: 2, status: 'Active' },
  { id: 'room-3', name: 'Triple Room', nameAr: 'غرفة ثلاثية (3 أسرة)', capacity: 3, status: 'Active' },
  { id: 'room-4', name: 'Quad Room', nameAr: 'غرفة رباعية (4 أسرة)', capacity: 4, status: 'Active' },
  { id: 'room-5', name: 'Quint Room (5 Beds)', nameAr: 'غرفة خماسية (5 أسرة عائلية)', capacity: 5, status: 'Active' },
  { id: 'room-6', name: 'Executive Haram View Suite', nameAr: 'جناح ملكي تنفيذي بإطلالة مباشرة على الحرم', capacity: 4, status: 'Active' },
];

const INITIAL_MEALS: MealTypeItem[] = [
  { id: 'meal-1', name: 'Room Only (RO)', nameAr: 'إقامة فقط بدون وجبات', code: 'RO', status: 'Active' },
  { id: 'meal-2', name: 'Bed & Breakfast (BB)', nameAr: 'إقامة مع وجبة الإفطار (بوفيه)', code: 'BB', status: 'Active' },
  { id: 'meal-3', name: 'Half Board (HB - Breakfast & Dinner)', nameAr: 'نصف إقامة (إفطار + عشاء)', code: 'HB', status: 'Active' },
  { id: 'meal-4', name: 'Full Board (FB - 3 Meals)', nameAr: 'إقامة كاملة (إفطار + غداء + عشاء)', code: 'FB', status: 'Active' },
  { id: 'meal-5', name: 'Full Board + Open VIP Buffet & Beverages', nameAr: 'إقامة كاملة مع بوفيه VIP ومشروبات مفتوحة', code: 'FB+', status: 'Active' },
];

export default function HBManagementTab() {
  const { isRTL } = useLanguage();

  const [activeSubTab, setActiveSubTab] = useState<'rooms' | 'meals'>('rooms');
  const [rooms, setRooms] = useState<RoomTypeItem[]>(INITIAL_ROOMS);
  const [meals, setMeals] = useState<MealTypeItem[]>(INITIAL_MEALS);
  const [searchQuery, setSearchQuery] = useState('');

  const [feedback, setFeedback] = useState<string | null>(null);

  // Room Modals
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomTypeItem | null>(null);
  const [roomNameInput, setRoomNameInput] = useState('');
  const [roomCapacityInput, setRoomCapacityInput] = useState(2);
  const [roomStatusInput, setRoomStatusInput] = useState<'Active' | 'Inactive'>('Active');
  const [deletingRoom, setDeletingRoom] = useState<RoomTypeItem | null>(null);

  // Meal Modals
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealTypeItem | null>(null);
  const [mealNameInput, setMealNameInput] = useState('');
  const [mealCodeInput, setMealCodeInput] = useState('BB');
  const [mealStatusInput, setMealStatusInput] = useState<'Active' | 'Inactive'>('Active');
  const [deletingMeal, setDeletingMeal] = useState<MealTypeItem | null>(null);

  // Filtering
  const filteredRooms = rooms.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.nameAr && r.nameAr.includes(searchQuery))
  );

  const filteredMeals = meals.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.nameAr && m.nameAr.includes(searchQuery)) ||
    m.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ROOM HANDLERS
  const handleOpenAddRoom = () => {
    setEditingRoom(null);
    setRoomNameInput('');
    setRoomCapacityInput(2);
    setRoomStatusInput('Active');
    setIsRoomModalOpen(true);
  };

  const handleOpenEditRoom = (room: RoomTypeItem) => {
    setEditingRoom(room);
    setRoomNameInput(room.name);
    setRoomCapacityInput(room.capacity || 2);
    setRoomStatusInput(room.status);
    setIsRoomModalOpen(true);
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNameInput.trim()) return;

    if (editingRoom) {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === editingRoom.id
            ? { ...r, name: roomNameInput.trim(), capacity: Number(roomCapacityInput) || 1, status: roomStatusInput }
            : r
        )
      );
      setFeedback(isRTL ? 'تم تحديث نوع الغرفة بنجاح!' : 'Room type updated successfully!');
    } else {
      const newRoom: RoomTypeItem = {
        id: `room-${Date.now()}`,
        name: roomNameInput.trim(),
        capacity: Number(roomCapacityInput) || 1,
        status: roomStatusInput,
      };
      setRooms((prev) => [...prev, newRoom]);
      setFeedback(isRTL ? 'تمت إضافة نوع الغرفة بنجاح!' : 'Room type added successfully!');
    }
    setIsRoomModalOpen(false);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDeleteRoomConfirm = () => {
    if (!deletingRoom) return;
    setRooms((prev) => prev.filter((r) => r.id !== deletingRoom.id));
    setDeletingRoom(null);
    setFeedback(isRTL ? 'تم حذف نوع الغرفة' : 'Room type removed');
    setTimeout(() => setFeedback(null), 3000);
  };

  // MEAL HANDLERS
  const handleOpenAddMeal = () => {
    setEditingMeal(null);
    setMealNameInput('');
    setMealCodeInput('HB');
    setMealStatusInput('Active');
    setIsMealModalOpen(true);
  };

  const handleOpenEditMeal = (meal: MealTypeItem) => {
    setEditingMeal(meal);
    setMealNameInput(meal.name);
    setMealCodeInput(meal.code);
    setMealStatusInput(meal.status);
    setIsMealModalOpen(true);
  };

  const handleSaveMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealNameInput.trim()) return;

    if (editingMeal) {
      setMeals((prev) =>
        prev.map((m) =>
          m.id === editingMeal.id
            ? { ...m, name: mealNameInput.trim(), code: mealCodeInput.toUpperCase(), status: mealStatusInput }
            : m
        )
      );
      setFeedback(isRTL ? 'تم تحديث خطة الوجبات بنجاح!' : 'Meal plan updated successfully!');
    } else {
      const newMeal: MealTypeItem = {
        id: `meal-${Date.now()}`,
        name: mealNameInput.trim(),
        code: mealCodeInput.toUpperCase(),
        status: mealStatusInput,
      };
      setMeals((prev) => [...prev, newMeal]);
      setFeedback(isRTL ? 'تمت إضافة خطة الوجبات بنجاح!' : 'Meal plan added successfully!');
    }
    setIsMealModalOpen(false);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDeleteMealConfirm = () => {
    if (!deletingMeal) return;
    setMeals((prev) => prev.filter((m) => m.id !== deletingMeal.id));
    setDeletingMeal(null);
    setFeedback(isRTL ? 'تم حذف خطة الوجبات' : 'Meal plan removed');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {isRTL ? 'إدارة الإيواء والغرف والوجبات (HB)' : 'Hospitality, Bed & Board (HB)'}
          </h2>
          <p className="text-xs text-slate-400">
            {isRTL
              ? 'تكوين أنواع الغرف الفندقية وسعتها، وباقات الوجبات المعتمدة لحجوزات مكة والمدينة'
              : 'Configure hotel room occupancy types and meal plan boards for packages'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'rooms' ? (
            <button
              type="button"
              onClick={handleOpenAddRoom}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-xs transition cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <span>{isRTL ? '+ إضافة نوع غرفة' : '+ Add Room Type'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenAddMeal}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-xs transition cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <span>{isRTL ? '+ إضافة خطة وجبات' : '+ Add Meal Plan'}</span>
            </button>
          )}
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm font-semibold shadow-xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* SUB-TABS SELECTOR */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveSubTab('rooms');
              setSearchQuery('');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'rooms'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{isRTL ? 'أنواع الغرف الفندقية' : 'Room Types'}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeSubTab === 'rooms' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {rooms.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveSubTab('meals');
              setSearchQuery('');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'meals'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{isRTL ? 'خطط وباقات الوجبات' : 'Meal Plans (Boards)'}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeSubTab === 'meals' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {meals.length}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-48 sm:w-64">
          <Search
            className={`w-3.5 h-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2 ${
              isRTL ? 'right-3' : 'left-3'
            }`}
          />
          <input
            type="text"
            placeholder={isRTL ? 'بحث سريع...' : 'Quick search...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-white border border-slate-200 rounded-xl py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-amber-500 transition ${
              isRTL ? 'pr-8 pl-3' : 'pl-8 pr-3'
            }`}
          />
        </div>
      </div>

      {/* CONTENT: ROOM TYPES */}
      {activeSubTab === 'rooms' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold bg-slate-50/60">
                  <th className="py-3 px-6 text-start">{isRTL ? 'نوع وتصنيف الغرفة' : 'Room Type Name'}</th>
                  <th className="py-3 px-6 text-center">{isRTL ? 'سعة الأشخاص' : 'Pax Capacity'}</th>
                  <th className="py-3 px-6 text-center">{isRTL ? 'الحالة' : 'Status'}</th>
                  <th className="py-3 px-6 text-end">{isRTL ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRooms.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      <AlertCircle className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                      <span>{isRTL ? 'لا توجد أنواع غرف مطابقة' : 'No room types found'}</span>
                    </td>
                  </tr>
                ) : (
                  filteredRooms.map((room) => (
                    <tr key={room.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-6">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">
                            {isRTL && room.nameAr ? room.nameAr : room.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {room.name}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-bold text-xs">
                          {room.capacity} {isRTL ? 'أفراد' : 'Pax'}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            room.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {room.status === 'Active'
                            ? isRTL
                              ? 'مفعل'
                              : 'Active'
                            : isRTL
                            ? 'غير نشط'
                            : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-end">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditRoom(room)}
                            className="px-2.5 py-1 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 font-semibold transition cursor-pointer text-xs"
                          >
                            {isRTL ? 'تعديل' : 'Edit'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingRoom(room)}
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
      )}

      {/* CONTENT: MEAL PLANS */}
      {activeSubTab === 'meals' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold bg-slate-50/60">
                  <th className="py-3 px-6 text-start">{isRTL ? 'خطة الوجبات والفندق' : 'Meal Plan Name'}</th>
                  <th className="py-3 px-6 text-center">{isRTL ? 'رمز الباقة' : 'Code'}</th>
                  <th className="py-3 px-6 text-center">{isRTL ? 'الحالة' : 'Status'}</th>
                  <th className="py-3 px-6 text-end">{isRTL ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMeals.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      <AlertCircle className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                      <span>{isRTL ? 'لا توجد باقات وجبات مطابقة' : 'No meal plans found'}</span>
                    </td>
                  </tr>
                ) : (
                  filteredMeals.map((meal) => (
                    <tr key={meal.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-6">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">
                            {isRTL && meal.nameAr ? meal.nameAr : meal.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {meal.name}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-mono font-bold rounded-lg border border-amber-200 text-xs">
                          {meal.code}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            meal.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {meal.status === 'Active'
                            ? isRTL
                              ? 'مفعل'
                              : 'Active'
                            : isRTL
                            ? 'غير نشط'
                            : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-end">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditMeal(meal)}
                            className="px-2.5 py-1 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 font-semibold transition cursor-pointer text-xs"
                          >
                            {isRTL ? 'تعديل' : 'Edit'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingMeal(meal)}
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
      )}

      {/* MODAL: ADD / EDIT ROOM TYPE */}
      {isRoomModalOpen && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setIsRoomModalOpen(false); }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-transparent p-4 animate-fadeIn"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingRoom
                    ? isRTL
                      ? 'تعديل نوع الغرفة'
                      : 'Edit Room Type'
                    : isRTL
                    ? 'إضافة نوع غرفة فندقية'
                    : 'Add New Room Type'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isRTL ? 'تحديد اسم الغرفة وسعة استيعاب النزلاء' : 'Configure room occupancy and capacity'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsRoomModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRoom} className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">
                  {isRTL ? 'اسم نوع الغرفة' : 'Room Type Name'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={isRTL ? 'مثال: غرفة ثلاثية (Triple)' : 'e.g., Triple Room'}
                  value={roomNameInput}
                  onChange={(e) => setRoomNameInput(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">
                  {isRTL ? 'سعة النزلاء (أفراد)' : 'Capacity (Pax)'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={roomCapacityInput}
                  onChange={(e) => setRoomCapacityInput(Number(e.target.value))}
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-bold focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
                />
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="font-bold text-slate-800">{isRTL ? 'حالة التفعيل' : 'Active Status'}</span>
                <button
                  type="button"
                  onClick={() => setRoomStatusInput(roomStatusInput === 'Active' ? 'Inactive' : 'Active')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    roomStatusInput === 'Active' ? 'bg-emerald-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out transform ${
                      roomStatusInput === 'Active' ? (isRTL ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRoomModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold transition cursor-pointer shadow-2xs text-xs sm:text-sm"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs transition cursor-pointer active:scale-95 text-xs sm:text-sm"
                >
                  {editingRoom ? (isRTL ? 'حفظ التعديل' : 'Save Changes') : (isRTL ? 'إضافة' : 'Add Room')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT MEAL PLAN */}
      {isMealModalOpen && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setIsMealModalOpen(false); }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-transparent p-4 animate-fadeIn"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingMeal
                    ? isRTL
                      ? 'تعديل خطة الوجبات'
                      : 'Edit Meal Plan'
                    : isRTL
                    ? 'إضافة خطة وجبات جديدة'
                    : 'Add New Meal Plan'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isRTL ? 'تحديد باقة الإعاشة والرمز المختصر' : 'Configure board name and code'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMealModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMeal} className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">
                  {isRTL ? 'اسم خطة الوجبات' : 'Meal Plan Name'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={isRTL ? 'مثال: Half Board (إفطار + عشاء)' : 'e.g., Half Board (HB)'}
                  value={mealNameInput}
                  onChange={(e) => setMealNameInput(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">
                  {isRTL ? 'رمز الباقة المختصر (Code)' : 'Plan Code'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RO, BB, HB, FB"
                  value={mealCodeInput}
                  onChange={(e) => setMealCodeInput(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 uppercase font-mono font-bold focus:outline-hidden focus:border-emerald-500 focus:bg-white transition"
                />
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="font-bold text-slate-800">{isRTL ? 'حالة التفعيل' : 'Active Status'}</span>
                <button
                  type="button"
                  onClick={() => setMealStatusInput(mealStatusInput === 'Active' ? 'Inactive' : 'Active')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    mealStatusInput === 'Active' ? 'bg-emerald-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out transform ${
                      mealStatusInput === 'Active' ? (isRTL ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMealModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold transition cursor-pointer shadow-2xs text-xs sm:text-sm"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs transition cursor-pointer active:scale-95 text-xs sm:text-sm"
                >
                  {editingMeal ? (isRTL ? 'حفظ التعديل' : 'Save Changes') : (isRTL ? 'إضافة' : 'Add Plan')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE ROOM MODAL */}
      {deletingRoom && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setDeletingRoom(null); }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-transparent p-4 animate-fadeIn"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden p-6 space-y-4 text-center">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                {isRTL ? 'حذف نوع الغرفة' : 'Delete Room Type'}
              </h3>
              <p className="text-xs text-slate-500">
                {isRTL
                  ? `هل أنت متأكد من رغبتك في حذف "${deletingRoom.name}"؟`
                  : `Are you sure you want to remove "${deletingRoom.name}"?`}
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingRoom(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition cursor-pointer shadow-2xs"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleDeleteRoomConfirm}
                className="flex-1 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer active:scale-95"
              >
                {isRTL ? 'نعم، احذف' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MEAL MODAL */}
      {deletingMeal && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setDeletingMeal(null); }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-transparent p-4 animate-fadeIn"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden p-6 space-y-4 text-center">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                {isRTL ? 'حذف خطة الوجبات' : 'Delete Meal Plan'}
              </h3>
              <p className="text-xs text-slate-500">
                {isRTL
                  ? `هل أنت متأكد من رغبتك في حذف "${deletingMeal.name}"؟`
                  : `Are you sure you want to remove "${deletingMeal.name}"?`}
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingMeal(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition cursor-pointer shadow-2xs"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleDeleteMealConfirm}
                className="flex-1 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer active:scale-95"
              >
                {isRTL ? 'نعم، احذف' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
