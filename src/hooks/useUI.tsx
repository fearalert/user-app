/** @format */

import { useContext } from 'react';
import { UIContext } from '../contexts/UIContext';
import { UIContextType } from '../types';

export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within a UIProvider');
  return context;
};
