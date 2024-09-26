//drawerContextT.js
import React, { createContext, useState, useContext } from 'react';

const DrawerContext = createContext();

export function useDrawer() {
  return useContext(DrawerContext);
}

export function DrawerProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <DrawerContext.Provider value={{ isOpen, toggleDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
}
