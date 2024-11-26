import React from 'react';
import { NotificationsProvider } from '@toolpad/core';
import { MainRoutes } from './mainRoutes';
import AsyncModalProvider from './sharedComponents/modal/asyncModal/provider';
;

function App() {
  return (
    <NotificationsProvider>
      <AsyncModalProvider>
        <MainRoutes/>
      </AsyncModalProvider>
    </NotificationsProvider>
  );
}

export default App;
