
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import PatientSearch from './pages/PatientSearch';
import Prescriptions from './pages/Prescriptions';
import RegisterPatient from './pages/RegisterPatient';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { Toaster } from '@/components/ui/toaster';
import PatientRecord from './pages/PatientRecord';
import { SettingsProvider } from './contexts/SettingsContext';
import TreatmentFlow from './pages/TreatmentFlow';
import InPatientTreatmentPage from './pages/InPatientTreatment';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="search" element={<PatientSearch />} />
              <Route path="patient-record" element={<PatientRecord />} />
              <Route path="treatment-flow" element={<TreatmentFlow />} />
              <Route path="in-patient-treatment" element={<InPatientTreatmentPage />} />
              <Route path="prescriptions" element={<Prescriptions />} />
              <Route path="register" element={<RegisterPatient />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Toaster />
        </Router>
      </SettingsProvider>
    </QueryClientProvider>
  );
}

export default App;
