// components/Toast.jsx
import React, { useEffect } from 'react';

export function Toast({ message, type, onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000); // auto close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message) return null;

  return (
    <div
      className={`fixed bottom-5 right-5 px-4 py-3 rounded shadow-md text-white ${
        type === 'success'
          ? 'bg-green-500'
          : type === 'error'
          ? 'bg-red-500'
          : type === 'warning'
          ? 'bg-yellow-500'
          : 'bg-blue-500'
      }`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-3 font-bold">X</button>
    </div>
  );
}
