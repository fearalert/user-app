/** @format */

import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { read, write } from '../utils/cookieStorage';
import { UIContextType } from '../types';

const UIContext = createContext<UIContextType | null>(null);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    read('theme', 'light')
  );
  const [itemsPerPage, setItemsPerPage] = useState<number>(() =>
    read('itemsPerPage', 10)
  );
  const [favorites, setFavorites] = useState<number[]>(() =>
    read('favorites', [])
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    write('theme', theme);
  }, [theme]);

  useEffect(() => write('itemsPerPage', itemsPerPage), [itemsPerPage]);
  useEffect(() => write('favorites', favorites), [favorites]);

  const toggleFavorite = (userId: number) => {
    setFavorites((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const resetPreferences = () => {
    setTheme('light');
    setItemsPerPage(10);
    setFavorites([]);
  };

  return (
    <UIContext.Provider
      value={{
        theme,
        setTheme,
        itemsPerPage,
        setItemsPerPage,
        favorites,
        toggleFavorite,
        resetPreferences,
      }}>
      {children}
    </UIContext.Provider>
  );
};

export { UIContext };
