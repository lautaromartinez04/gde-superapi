import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useIsMobile } from './hooks/useIsMobile'
import './App.css'
import { About } from './components/About'
import { DonEmilio } from './components/DonEmilio'
import { DuyAmis } from './components/DuyAmis'
import { Mharnes } from './components/Mharnes'

function Landing() {
  const isMobile = useIsMobile();
  const [activeCompany, setActiveCompany] = useState(null);

  const handleBack = () => {
    setActiveCompany(null);
  };

  if (isMobile) {
    return (
      <div className="app-container">
        <div className="snap-section">
          <About onCompanySelect={(company) => {
            if (company === 'mharnes') {
              window.location.href = '/mharnes/';
            }
            else if (company === 'donemilio') {
              window.location.href = '/donemilio/';
            }
            else if (company === 'duyamis') {
              window.location.href = '/duyamis/';
            }
          }} />
        </div>
        <div className="snap-section">
          <DonEmilio />
        </div>
        <div className="snap-section">
          <DuyAmis />
        </div>
        <div className="snap-section">
          <Mharnes />
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      {activeCompany === null && (
        <About onCompanySelect={(company) => {
          if (company === 'mharnes') {
            window.location.href = '/mharnes/';
          }
          else if (company === 'donemilio') {
            window.location.href = '/donemilio/';
          }
          else if (company === 'duyamis') {
            window.location.href = '/duyamis/';
          }
          else {
            setActiveCompany(company);
          }
        }} />
      )}

      {activeCompany === 'donemilio' && (
        <DonEmilio onBack={handleBack} />
      )}

      {activeCompany === 'duyamis' && (
        <DuyAmis onBack={handleBack} />
      )}
    </div>
  )
}

import AdminLayout from './components/admin/AdminLayout'
import AdminContacts from './components/admin/AdminContacts'
import AdminComments from './components/admin/AdminComments'
import AdminCategories from './components/admin/AdminCategories'
import AdminProducts from './components/admin/AdminProducts'
import EditCategory from './components/admin/EditCategory'
import EditProduct from './components/admin/EditProduct'
import AdminSellpoints from './components/admin/AdminSellpoints'
import AdminCorporateAllies from './components/admin/AdminCorporateAllies'
import AdminMharnesStats from './components/admin/AdminMharnesStats'
import AdminDonEmilioSchedules from './components/admin/AdminDonEmilioSchedules'
import ProtectedRoute from './components/admin/ProtectedRoute'

import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="contacts" />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="comments" element={<AdminComments />} />
          
          {/* Grupo Don Emilio Admin */}
          <Route path="grupo/allies" element={<AdminCorporateAllies />} />
          
          {/* Don Emilio Centralized Admin */}
          <Route path="donemilio/schedules" element={<AdminDonEmilioSchedules />} />

          {/* Mharnes Centralized Admin */}
          <Route path="mharnes/stats" element={<AdminMharnesStats />} />

          {/* DuyAmis Centralized Admin */}
          <Route path="duyamis/categories" element={<AdminCategories />} />
          <Route path="duyamis/categories/new" element={<EditCategory />} />
          <Route path="duyamis/categories/edit/:id" element={<EditCategory />} />
          <Route path="duyamis/products" element={<AdminProducts />} />
          <Route path="duyamis/products/new" element={<EditProduct />} />
          <Route path="duyamis/products/edit/:id" element={<EditProduct />} />
          <Route path="duyamis/sellpoints" element={<AdminSellpoints />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
