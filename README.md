# SAKTHIMURUGAN MEDICAL AGENCY
### Professional B2B Wholesale Medicine E-Commerce, Inventory, Order & Delivery Management Platform

> **Address:** 50, 1st Floor, Kamaraj Street, Erode, Tamil Nadu - 638001  
> **Direct Booking Helplines:** 9994446994 | 9865730150  
> **Business Model:** B2B Wholesale Medicine Supply & Logistics Distribution  
> **Proposed Service Regions:** Erode, Karur, Namakkal, Salem  
> **Regulatory Approvals:** Form 20B & 21B Wholesale Drug Licenses & GST Compliant  

---

## 1. Project Overview

**Sakthimurugan Medical Agency** is an enterprise-grade, full-stack **MERN (MongoDB, Express.js, React.js, Node.js)** platform engineered from scratch for commercial pharmaceutical distribution.

It provides retail pharmacies, hospital dispensaries, and authorized healthcare clinics with a wholesale purchasing experience with real-time stock allocation, multi-tier pricing, strict drug licensing verification workflows, GST tax invoicing, and regional cold-chain delivery management.

---

## 2. Core Architecture & Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | **React 18** + **Vite** | Modern SPA with component hierarchy, hooks, and responsive layout |
| **Styling & Theme** | **Tailwind CSS** | Medical color palette (`#0e8ee9`), persistent Dark/Light themes |
| **Icons & UI** | **Lucide React** | Medical, logistics, and dashboard icons |
| **Routing** | **React Router DOM v7** | SPA routing with server catch-all fallback (zero 404 on refresh) |
| **Backend API** | **Node.js** + **Express.js** | RESTful modular micro-controllers with JWT authorization |
| **Database** | **MongoDB** + **Mongoose** | Schemas, aggregation pipelines, indexed search, embedded fallback |
| **Authentication** | **JWT** + **bcryptjs** | Role-based authorization & account verification checks |

---

## 3. Client Verification & Approval Workflow

In compliance with the **Drugs and Cosmetics Act, 1940 (Form 20B & 21B)**:

```
CLIENT REGISTRATION
       │
       ▼
SUBMIT BUSINESS & DRUG LICENSE (Form 20B/21B, GSTIN, Address)
       │
       ▼
ACCOUNT STATUS = "PENDING"
       │
       ▼
ADMINISTRATIVE COMPLIANCE REVIEW (Admin Control Hub)
       ├──> [REJECTED] ──> Account marked "REJECTED" with reason. Wholesale ordering blocked.
       │
       └──> [APPROVED] ──> Account marked "APPROVED".
                                │
                                ▼
CLIENT LOGS IN ──> GAINS WHOLESALE CATALOG ACCESS ──> PLACES ORDERS
```

* Unapproved/Pending clients receive clear status notifications upon login.
* Only verified accounts can access wholesale net prices, add items to cart, and place orders.

---

## 4. Pre-Seeded Demo Accounts

| Role | Email | Password | Access Level & Purpose |
| :--- | :--- | :--- | :--- |
| **Executive Admin** | `admin@sakthimurugan.com` | `Admin@123` | Full access: Client approvals, stock additions, all orders, regions |
| **Warehouse Staff** | `staff@sakthimurugan.com` | `Staff@123` | Operations: Packing queue, stock adjustments, dispatch handovers |
| **Approved Pharmacy** | `client@muruganpharmacy.com` | `Client@123` | Active client (Murugan Pharmacy, Erode): Full wholesale ordering |
| **Pending Client** | `pending@kaverimedicals.com` | `Pending@123` | Tests approval gate (Kaveri Medicals, Karur) |
| **Rejected Client** | `rejected@apexclinic.com` | `Rejected@123` | Tests rejection notification (Apex Dispensary, Salem) |

---

## 5. Key Features

1. **Wholesale Marketplace & Catalog:**
   - Multi-field indexed search (brand name, chemical salt composition, manufacturer, batch).
   - Filter by Therapeutic Category, Manufacturer, Dosage Form, and In-Stock availability.
   - Live wholesale net pricing, MRP, retailer margin %, and pack size details.

2. **Cart & Stock Integrity:**
   - Real-time stock validation preventing overselling.
   - Itemized GST tax calculations (CGST 6% + SGST 6% / 12% total).

3. **Multi-Step B2B Checkout:**
   - Verified Drug License & GSTIN review.
   - PIN code delivery route check against MongoDB service areas.
   - Wholesale payment options (Direct RTGS/NEFT, 30-Day Revolving Credit, COD/Cheque).

4. **Order Tracking & Fulfillment Pipeline:**
   - Step-by-step progress tracking: `Placed` → `Confirmed` → `Processing` → `Dispatched` → `Delivered`.
   - Dispatch details: Delivery van number, route, and handling executive.

5. **Formal GST Tax Invoices:**
   - Form 20B/21B invoice sheet with Seller & Buyer details, HSN codes, Batch numbers, Expiry dates, GST breakdown, and print-ready format.

6. **Logistics & Service Regions:**
   - Coverage across **Erode, Karur, Namakkal, and Salem**.
   - Live PIN code serviceability checking widget with delivery estimates.

7. **Executive Admin & Staff Dashboards:**
   - Live metrics calculated from MongoDB.
   - 1-click Client Approval / Rejection with compliance notes.
   - Inventory batch management, stock alerts, and PIN code routes.

---

## 6. Project Structure

```
sakthimurugan-medical-agency/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection & embedded engine fallback
│   ├── controllers/
│   │   ├── admin.controller.js
│   │   ├── auth.controller.js
│   │   ├── businessApplication.controller.js
│   │   ├── cart.controller.js
│   │   ├── category.controller.js
│   │   ├── deliveryArea.controller.js
│   │   ├── invoice.controller.js
│   │   ├── medicine.controller.js
│   │   ├── order.controller.js
│   │   └── pincode.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js     # JWT & role / client approval validation
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── BusinessApplication.js
│   │   ├── Cart.js
│   │   ├── Category.js
│   │   ├── DeliveryArea.js
│   │   ├── DeliveryAssignment.js
│   │   ├── Invoice.js
│   │   ├── Medicine.js
│   │   ├── Order.js
│   │   ├── Pincode.js
│   │   └── User.js
│   ├── routes/
│   │   ├── admin.routes.js
│   │   ├── auth.routes.js
│   │   ├── businessApplication.routes.js
│   │   ├── cart.routes.js
│   │   ├── category.routes.js
│   │   ├── deliveryArea.routes.js
│   │   ├── invoice.routes.js
│   │   ├── medicine.routes.js
│   │   ├── order.routes.js
│   │   └── pincode.routes.js
│   ├── seedData.js               # Initial wholesale pharmaceutical data
│   ├── server.js                 # Express app & production SPA static server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js          # Axios client with JWT interceptor
│   │   ├── components/
│   │   │   ├── Footer.jsx
│   │   │   ├── MedicineCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PincodeCheckerModal.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Toast.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── AboutContactPage.jsx
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── ClientDashboardPage.jsx
│   │   │   ├── DeliveryAreasPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── InvoicePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── MedicineDetailsPage.jsx
│   │   │   ├── MedicinesPage.jsx
│   │   │   ├── OrderSuccessPage.jsx
│   │   │   ├── OrderTrackingPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── StaffDashboardPage.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 7. How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Step 1: Start Backend API Server
```bash
cd backend
npm install
npm start
```
*Backend will connect, seed the database, and serve API at `http://localhost:5000`.*

### Step 2: Start Frontend Development Server
```bash
cd frontend
npm install
npm run dev
```
*Frontend will launch at `http://localhost:5173`.*

### Step 3: Production Build & Deployment
```bash
# Build React static distribution
cd frontend
npm run build

# Start combined production server (serves frontend + backend + API)
cd ../backend
node server.js
```
*Open `http://localhost:5000` in any browser to access the entire application.*
