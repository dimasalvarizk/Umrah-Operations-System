# 🕋 نظام عمليات الحج والعمرة (Umrah & Hajj Operations Management System)

A modern, high-performance web application designed for Hajj and Umrah travel agencies and tour operators to streamline end-to-end pilgrim management, hotel bookings, flight schedules, land transportation fleets, and contract agreements.

---

## 🌟 Key Features & Modules

### 1. 📊 لوحة التحكم (Dashboard)
- Real-time statistics on active pilgrim groups, total travelers, hotels, trips, and contracts.
- Visual breakdown of pilgrim nationalities and daily activity logs.
- Quick navigation and quick action shortcuts for adding groups, hotels, and trips.

### 2. 👥 إدارة المجموعات (Groups Management)
- Complete lifecycle management for pilgrim delegations and tour groups.
- Interactive 4-step wizard modal (`AddGroupModal`):
  - **Step 1: Basic Information** (Group Code, Name, Main Agent, Sub Agent, Pilgrim Count, Nationality).
  - **Step 2: Hotels & Accommodation** (Makkah & Madinah hotel assignments, check-in/out dates, hosting details).
  - **Step 3: Flights & Land Transport** (Arrival & departure flights, airports, bus companies, operational numbers).
  - **Step 4: Permits, Ziyarat & Grouping** (Umrah permit, Rawdah men/women permits, inter-city grouping status, custom notes).
- Comprehensive detail inspection modal (`GroupDetailsModal`).

### 3. 🏨 إدارة الفنادق والإسكان (Hotels Management)
- Hotel directory with star ratings, locations (Makkah / Madinah), capacity tracking, and pricing.
- Add Hotel dialog (`AddHotelModal`) and in-depth details viewer (`HotelDetailsModal`).

### 4. ✈️ إدارة الرحلات والتفويج (Trips & Logistics)
- Management of transit routes (Makkah ⇄ Madinah ⇄ Jeddah), flight scheduling, and pilgrim guide allocations.
- Real-time status tracking (Completed, In Progress, Pending).
- Create and edit trip routes (`AddTripModal` & `TripDetailsModal`).

### 5. 🚌 إدارة النقل والأسطول (Transportation & Fleet Management)
- Transportation company profiles with ratings, fleet counts, and contact information.
- Dedicated Fleet View (`CompanyFleetView`) showing vehicle types (VIP Bus, Regular Bus, Sedan, Coaster), plate numbers, capacity, pricing, and maintenance status.
- Add Vehicle (`AddVehicleModal`), Edit Company (`EditCompanyModal`), and Add Transport Company (`AddTransportModal`).

### 6. 📑 الاتفاقيات والعقود (Contracts & Agreements)
- Contract creation with external agents, hotel packages, and transport services.
- Detailed agreement viewer with financial totals and status tracking (`AgreementDetailsModal`).
- Official print-ready PDF export preview matching Saudi ministerial document layouts (`AgreementPdfView` & `AgreementPdfModal`).

### 7. 📝 سجل الملاحظات التشغيلية (Operations Notes)
- Filterable note cards categorized by Groups, Hotels, Transportation, and Flights.
- Priority tagging (Urgent, High, Normal) and resolved/pending status tracking.

---

## 🏗️ Clean Modular Architecture

The frontend components are organized by domain under `src/components/`:

```text
src/
├── assets/                       # Images, logos, and vehicle artwork
├── components/
│   ├── index.ts                  # Centralized export hub for all components
│   ├── layout/                   # Navbar, Sidebar, Navigation
│   ├── hotels/                   # AddHotelModal, HotelDetailsModal
│   ├── trips/                    # AddTripModal, TripDetailsModal
│   ├── transport/                # TransportDetailsModal, AddTransportModal, 
│   │                             # AddVehicleModal, EditCompanyModal, CompanyFleetView
│   ├── contracts/                # AddAgreementModal, AgreementDetailsModal, 
│   │                             # AgreementPdfModal, AgreementPdfView, DeleteAgreementModal
│   └── groups/                   # AddGroupModal, GroupDetailsModal,
│       └── add-group/            # StepperHeader, Step1BasicInfo, Step2Hotels, 
│                                 # Step3FlightsTransport, Step4PermitsNotes, StepSuccessDialog
├── pages/                        # Page views (Dashboard, Groups, Hotels, Trips, Transport, Contracts, Notes, Login)
├── App.tsx                       # React Router configuration
├── main.tsx                      # Application bootstrap
└── index.css                     # Design tokens, typography (Cairo, Inter) & global styles
```

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Typography**: Cairo (Arabic) & Inter (Latin)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm / yarn / pnpm

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd umrah-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 🌐 Localization & Design Standards

- **RTL-First Design**: Native Arabic Right-to-Left user experience.
- **Responsive Layout**: Designed for mobile, tablet, and desktop viewports.
- **Print Optimization**: Dedicated CSS print rules for exporting agreements to PDF.
