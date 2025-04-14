// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './features/dashboard/DashboardPage';

// Import other pages
// You may need to create these if they don't exist yet
import SubjectsPage from './features/subjects/SubjectListPage';
import PaperGeneratorPage from './features/generator/PaperGeneratorPage';
import LibraryPage from './features/library/PaperLibraryPage';
import CorrectionsPage from './features/corrections/CorrectionsPage';
import SettingsPage from './features/settings/SettingsPage';

function App() {
  return (
    // <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/generator" element={<PaperGeneratorPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/corrections" element={<CorrectionsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    // </BrowserRouter>
  );
}

export default App;