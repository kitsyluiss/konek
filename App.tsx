import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import PreviewPage from './components/PreviewPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/p/:slug" element={<PreviewPage />} />
        <Route path="/" element={<Navigate to="/p/demo" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
