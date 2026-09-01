import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientProfile from './pages/PatientProfile';
import AddPatient from './pages/AddPatient';
import Prescriptions from './pages/Prescriptions';
import NewPrescription from './pages/NewPrescription';
import PrescriptionDetail from './pages/PrescriptionDetail';
import PrescriptionPreview from './pages/PrescriptionPreview';
import Medicines from './pages/Medicines';
import Doctors from './pages/Doctors';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* App Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/new" element={<AddPatient />} />
          <Route path="/patients/:id" element={<PatientProfile />} />
          <Route path="/prescriptions" element={<Prescriptions />} />
          <Route path="/prescriptions/new" element={<NewPrescription />} />
          <Route path="/prescriptions/:id" element={<PrescriptionDetail />} />
          <Route path="/prescriptions/:id/preview" element={<PrescriptionPreview />} />
          <Route path="/medicines" element={<Medicines />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
