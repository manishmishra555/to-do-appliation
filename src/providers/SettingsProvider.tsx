import React, { createContext, useContext } from 'react';

const SettingsContext = createContext(undefined);

interface SettingsProviderProps {
  children: React.ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  return (
    <SettingsContext.Provider value={undefined}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
