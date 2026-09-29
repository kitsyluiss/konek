import React from 'react';
import { BrowserRouter, Routes, Route, useParams, Navigate } from 'react-router-dom';
import PreviewPage from './components/PreviewPage';

// Wrapper to pass the slug into window.location format if needed
// Actually, PreviewPage reads window.location.pathname, so react-router handles the route,
// and PreviewPage will see the correct pathname.

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/p/:slug" element={<PreviewPage />} />
        <Route path="/" element={<Navigate to="/p/demo" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
