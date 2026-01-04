// context/ToastProvider.jsx
import React, { createContext, useContext, useState } from 'react';
import { Toast } from '../components/Toast.jsx';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ message: '', type: 'info' });

  // This is the function that shows the toast
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // This closes the toast
  const closeToast = () => {
    setToast({ message: '', type: 'info' });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast message={toast.message} type={toast.type} onClose={closeToast} />
    </ToastContext.Provider>
  );
};

// Custom hook to use toast
export const useToast = () => useContext(ToastContext);
