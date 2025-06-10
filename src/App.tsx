import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/theme-provider';
import { SettingsProvider } from './contexts/SettingsContext';
import Index from './pages/index';
import Dashboard from './pages/Dashboard';
import PatientSearch from './pages/PatientSearch';
import Appointments from './pages/Appointments';
import RegisterPatient from './pages/RegisterPatient';
import Prescriptions from './pages/Prescriptions';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import PatientRecord from './pages/PatientRecord';
import TreatmentFlow from './pages/TreatmentFlow';
import PatientTreatment from './pages/PatientTreatment';

function App() {
  const location = useLocation();
  const [showToaster, setShowToaster] = useState(true);

  useEffect(() => {
    // Conditionally show the Toaster based on the current route
    setShowToaster(location.pathname !== '/patient-record');
  }, [location.pathname]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-react-theme">
      <SettingsProvider>
        {showToaster && <Toaster position="top-center" richColors />}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<PatientSearch />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/register" element={<RegisterPatient />} />
          <Route path="/prescriptions" element={<Prescriptions />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/patient-record" element={<PatientRecord />} />
          <Route path="/treatment-flow" element={<TreatmentFlow />} />
          <Route path="/patient-treatment" element={<PatientTreatment />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
