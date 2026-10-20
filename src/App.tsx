
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'

import Patients from './pages/Patients'
import Doctors  from './pages/Employees'
import Dashboard from './pages/Dashboard'
import Appointments from './pages/Appointments'
import Login from './pages/Login'

import PublicRoute from './components/PublicRoute'
import Layout from './pages/layout'
import { ROUTES, ROUTES_ROLES_PATH } from './utils/constants'
import { InvoicesPage } from './pages/Invoices'
import { MedicalRecords } from './pages/medical'
import LayOutReceptionist from './pages/LayoutReceptionist'
import LayOutDoctor from './pages/LayoutDoctor'
import NetworkError from './components/NetworkError'
import { UseAuthState } from './components/useAuthState'



function App() {

  return (
    <>
          <Routes>
                  <Route element={<PublicRoute />}>
                        <Route path='/' element={<Navigate to={ROUTES.LOGIN} replace/>}/>
                        <Route path={ROUTES.LOGIN} element={<Login />}/>
                  </Route>

                  {/* ====== admin ====== */}
                  <Route
                    path={ROUTES_ROLES_PATH.ADMIN}
                    element={
                      <UseAuthState requiredRole={['admin']}>
                        <Layout />
                      </UseAuthState>
                    }
                  >
                    <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                    <Route path={ROUTES.PATIENTS} element={<Patients />} />
                    <Route path={ROUTES.BILLING} element={<InvoicesPage />}/>
                    <Route path={ROUTES.DOCTORS} element={<Doctors />}/>
                    <Route path={ROUTES.MEDICAL_RECORDS} element={<MedicalRecords />} />
                    <Route path={ROUTES.APPOINTMENTS} element={<Appointments />} />
                  </Route>

                  {/* ====== doctor ====== */}
                  <Route
                    path={ROUTES_ROLES_PATH.DOCTOR}
                    element={
                      <UseAuthState requiredRole={['doctor']}>
                        <LayOutDoctor />
                      </UseAuthState>
                    }
                  >
                    <Route path={ROUTES.MEDICAL_RECORDS} element={<MedicalRecords />} />
                  </Route>

                  {/* ===== receptionist ===== */}
                  <Route
                    path={ROUTES_ROLES_PATH.RECEPTIONIST}
                    element={
                      <UseAuthState requiredRole={['receptionist']}>
                        <LayOutReceptionist />
                      </UseAuthState>
                    }
                  >
                    <Route path={ROUTES.APPOINTMENTS} element={<Appointments />} />
                    <Route path={ROUTES.PATIENTS} element={<Patients />} />
                    <Route path={ROUTES.BILLING} element={<InvoicesPage />}/>
                  </Route>

                      <Route path={ROUTES.ERROR_NETWORK} element={<NetworkError />} />
                    <Route
                      path="*"
                      element={
                        <div className="flex items-center justify-center h-screen bg-gray-50">
                          <div className="text-center">
                            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                            <p className="text-xl text-gray-600 mb-8">
                            The page you are looking does't exist.
                            </p>
                          </div>
                        </div>
                      }
                    />
          </Routes>
    </>
  )
}

export default App
