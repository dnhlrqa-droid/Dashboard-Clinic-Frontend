## Dashboard Clinic


## Features

### Authorization and Authentication System

**Secure login using employee code**
**Role-based permissions (admin, doctor, receptionist)**
**Automated session management**

## Patient Management
**View All Patients**
**Add New Patient**
**Edit Patient Details**
**Deactivate or Suspend Patient**


## Appointment Management
**Add a new patient appointment**
**Update appointment status (Pending, Completed, Cancelled, No-show)**
**View all appointments + View daily appointments**

## Medical Records
**View all medical records**
**Create a new medical record for the patient**
**Only the doctor's daily appointments are displayed**

## Invoices
**View all financial invoices**
**Create a new payment transaction**
**View transactions in a compact table within a "RightBar" pop-up panel, showing details and history for each transaction, along with the total payments and the principal amount**
**View payment transactions for each patient**

## Statistics
**View all data in cards**
**View all data in a chart**

## Employee Management
**Add/Edit Employees**
**Manage Roles and Permissions**
**Activate/Deactivate Accounts**


## Quick Start

### Prerequisites
- Node.js v16+ 
- npm or yarn
- MongoDB (for Backend)


### Installation

**Installation Library Frontend**
```bash
cd fron-tend
npm install
```

**Launch the application**
```bash
npm run dev
```


The application will open automatically on `http://localhost:5173`

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Components React
│   │   ├── Alert.tsx
│   │   ├── Button.tsx
│   │   ├── Chart.tsx
│   │   ├── Carts.tsx
│   │   ├── Lodaing.tsx
│   │   ├── Modal.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProductRoute.tsx
│   │   ├── PublicRoute.tsx
│   │   ├── RightBar.tsx
│   │   └── Search.tsx
│   │   └── Sidebar.tsx
│   │   └── StatusDropdown.tsx
│   │   └── Table.tsx
│   │
│   ├── pages/               # Pages 
│   │   ├── Patients.tsx
│   │   ├── Appointments.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Invoices.tsx
│   │   ├── Login.tsx
│   │   ├── medical.tsx
│   │   ├── Emploees.tsx
│   │   ├── Layout.tsx
│   │   ├── LayoutDoctor.tsx
│   │   ├── LayoutReceptionist.tsx
│   │
│   ├── store/               # Redux Toolkiit  (Administration Status)
│   │   ├── analytics.Store.tsx
│   │   ├── authStore.tsx
│   │   ├── PatientStore.tsx
│   │   └── AppointmentStore.tsx
│   │   └── Medical.Record.Store.tsx
│   │   └── InvoicesStore.tsx
│   │   └── Store.tsx
│   │
│   ├── types/               # Types TypeScript
│   │
│   ├── utils/               # Function help
│   │   ├── errorHelpers.ts
│   │   └── constants.ts
│   │   └── generators.ts
│   │
│   ├── App.tsx            
│   ├── main.tsx            
│   └── index.css         
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── index.html
```

---

## 🔧 التكوين

### متغيرات البيئة (.env)

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000

# App Configuration
VITE_APP_NAME=Dashboard Clinic
VITE_APP_VERSION=1.0.0

---

## Usage

### Login
```
Enter your employee code on the login page
```

### Patients
```
1. Click on Create Patient for add a patient
2. Use the search and filter to find on patients
3. Click the edit icon to change the patient datails
4. Click the lock icon to disable the patient
```

### Appointments
```
1. Click on Create Patient for add a appointments
2. Use the search and filter to find on appointments
4. Toggle status using the buttons
5. Click the "Today" button to view the daily schedule.
```

### Medical records
```
1. Click the "Today" button to view the daily schedule.
2. Click on one of the appointments after the session ends to specify the session type.
```

## Invoices
```
1. Click the payment button to create a new payment.
2. Click the icon to view the payment history.
```

## analytices
```
1.Filter automatically or Filter all data by selecting(year, month, day)
```

### Employee Management (Managers Only)
```
1. Click on create new employee
2. To edit the employee's data, click the edit icon.
3. To disable the employee's account, click the lock icon.


---

## Technologies used 

### Frontend
- **React 18** 
- **TypeScript** 
- **Vite** 
- **Tailwind CSS** 
- **React Router** 
- **Redux Toolkit** 
- **Chart**
- **React Hot Toast** 
- **FontAwesome**

### Additional tools
- **date-fns** 


---

##  Application Security

- Protecting routes with user credentails
- Storing the token in cookies
- Check interface-level permissions.
- Safe error handling

---

2. **Backend:**
   - Make sure the Backend is working on  `http://localhost:5000`
   - Data base MongoDB

3. *Environmental Variables**
   -  Create a `.env` file based on `.env.example`

**last updated** September 2026  
**Version:** 1.0.0