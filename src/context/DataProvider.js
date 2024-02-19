import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [dataStore, setDataStore] = useState(null);

  return (
    <DataContext.Provider value={{ dataStore, setDataStore }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
