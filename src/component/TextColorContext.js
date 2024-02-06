
import React, { createContext, useContext } from 'react';

const TextColorContext = createContext('black');

export const useTextColor = () => {
  return useContext(TextColorContext);
};

export const TextColorProvider = ({ children }) => {
  return (
    <TextColorContext.Provider value="red">
      {children}
    </TextColorContext.Provider>
  );
};
