
import { Route, Routes } from 'react-router-dom'
import './App.css'

import Patients from './pages/Patients'
import Doctors  from './pages/Doctors'
import Dashboard from './pages/Employees'
import Appointments from './pages/Appointments'
import Login from './pages/Login'
import ProtectedRoute from './components/ProductRouters'
import PublicRoute from './components/PublicRoute'
import Layout from './pages/layout'
import { ROUTES, ROUTES_ROLES_PATH } from './utils/constants'
import { InvoicesPage } from './pages/Invoices'
import { MedicalRecords } from './pages/medical'
import LayOutReceptionist from './pages/LayoutReceptionist'
import LayOutDoctor from './pages/LayoutDoctor'
import NetworkError from './components/NetworkError'
import { RootRedirect } from './components/RootRedirect'



function App() {

  return (
    <>
          <Routes>
                   <Route path='/' element={<RootRedirect />}/>
                  <Route element={<PublicRoute />}>
                        <Route path={ROUTES.LOGIN} element={<Login />}/>
                  </Route>

                  {/* ====== admin ====== */}
                  <Route
                    path={ROUTES_ROLES_PATH.ADMIN}
                    element={
                      <ProtectedRoute requiredRole={['admin']}>
                        <Layout />
                      </ProtectedRoute>
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
                      <ProtectedRoute requiredRole={['doctor']}>
                        <LayOutDoctor />
                      </ProtectedRoute>
                    }
                  >
                    <Route path={ROUTES.MEDICAL_RECORDS} element={<MedicalRecords />} />
                  </Route>

                  {/* ===== receptionist ===== */}
                  <Route
                    path={ROUTES_ROLES_PATH.RECEPTIONIST}
                    element={
                      <ProtectedRoute requiredRole={['receptionist']}>
                        <LayOutReceptionist />
                      </ProtectedRoute>
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
