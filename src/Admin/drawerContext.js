import React, { createContext, useState, useContext } from 'react';

const DrawerContext = createContext();

export function useDrawer() {
    return useContext(DrawerContext);
}

export function DrawerProvider({ children }) {
    const [isOpen, setIsOpen] = useState(true);

    const toggleDrawer = () => {
        setIsOpen(prevState => !prevState);
    };

    return (
        <DrawerContext.Provider value={{ isOpen, toggleDrawer }}>
            {children}
        </DrawerContext.Provider>
    );
}
