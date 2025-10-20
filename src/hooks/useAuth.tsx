/** @format */

import { useContext } from 'react';
import { AuthContextType } from '../types';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('auth must be used within a AuthProvider');
  return context;
};
