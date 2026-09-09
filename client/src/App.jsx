import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    // Check initial pathname or hash
    const path = window.location.pathname;
    const hash = window.location.hash;

    if (path.startsWith('/editor/')) {
      const id = path.replace('/editor/', '');
      return { page: 'editor', siteId: id };
    }
    if (hash.startsWith('#/editor/')) {
      const id = hash.replace('#/editor/', '');
      return { page: 'editor', siteId: id };
    }
    return { page: 'dashboard', siteId: null };
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      if (path.startsWith('/editor/')) {
        const id = path.replace('/editor/', '');
        setCurrentRoute({ page: 'editor', siteId: id });
      } else if (hash.startsWith('#/editor/')) {
        const id = hash.replace('#/editor/', '');
        setCurrentRoute({ page: 'editor', siteId: id });
      } else {
        setCurrentRoute({ page: 'dashboard', siteId: null });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToEditor = (siteId) => {
    const newPath = `/editor/${siteId}`;
    window.history.pushState({}, '', newPath);
    setCurrentRoute({ page: 'editor', siteId });
  };

  const navigateToDashboard = () => {
    window.history.pushState({}, '', '/');
    setCurrentRoute({ page: 'dashboard', siteId: null });
  };

  if (currentRoute.page === 'editor' && currentRoute.siteId) {
    return (
      <Editor
        siteId={currentRoute.siteId}
        onBackToDashboard={navigateToDashboard}
      />
    );
  }

  return (
    <Dashboard
      onOpenEditor={navigateToEditor}
    />
  );
}
