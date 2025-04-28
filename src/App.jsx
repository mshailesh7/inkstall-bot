import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './components/LoginPage';
import DashboardPage from './features/dashboard/DashboardPage';
import SubjectsPage from './features/subjects/SubjectListPage';
import PaperGeneratorPage from './features/generator/PaperGeneratorPage';
import LibraryPage from './features/library/PaperLibraryPage';
import CorrectionsPage from './features/corrections/CorrectionsPage';
import SettingsPage from './features/settings/SettingsPage';
import PrivateRoute from './components/PrivateRoute';

import TextbookListPage from './features/textbooks/TextbookListPage';
import ForgetPasswordPage from './components/Forget';
import RegistrationPage from './components/RegistrationPage';
import EnrollmentPage from './components/EnrollmentPage';


function App() {
  return (
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/RegistrationPage" element={<RegistrationPage />} />
        <Route path="/forgot" element={<ForgetPasswordPage />} />
        {/* <Route path="/enrollment" element={
          <PrivateRoute>
            <EnrollmentPage />
          </PrivateRoute>
        } /> */}
        <Route path="/enrollment" element={<EnrollmentPage />} />        
        {/* Protected routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="subjects" element={<SubjectsPage />} />
          <Route path="/subjects/:subjectId/textbooks" element={<TextbookListPage />} />
          <Route path="generator" element={<PaperGeneratorPage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="corrections" element={<CorrectionsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        
        {/* Redirect any unknown route to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
  );
}

export default App;