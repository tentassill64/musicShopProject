import React from 'react';
import { NotificationsProvider } from '@toolpad/core';
import { MainRoutes } from './mainRoutes';
;

function App() {
  return (
    <NotificationsProvider>
      <MainRoutes/>
    </NotificationsProvider>
  );
}

export default App;
