'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertTriangle, Trash2, Info, X } from 'lucide-react';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({
    isOpen: false,
    title: '',
    message: '',
    resolve: null,
    options: {}
  });

  const confirm = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        title: options.title || 'Xác nhận',
        message: message,
        resolve,
        options: {
          confirmLabel: options.confirmLabel || 'Xác nhận',
          cancelLabel: options.cancelLabel || 'Hủy',
          type: options.type || 'warning', // 'warning' | 'danger' | 'info'
          ...options
        }
      });
    });
  }, []);

  const handleClose = () => {
    if (state.resolve) {
      state.resolve(false);
    }
    setState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleConfirm = () => {
    if (state.resolve) {
      state.resolve(true);
    }
    setState((prev) => ({ ...prev, isOpen: false }));
  };

  // Icon selector based on type
  const getIcon = () => {
    switch (state.options.type) {
      case 'danger':
        return (
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <Trash2 className="h-6 w-6" aria-hidden="true" />
          </div>
        );
      case 'info':
        return (
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Info className="h-6 w-6" aria-hidden="true" />
          </div>
        );
      case 'warning':
      default:
        return (
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </div>
        );
    }
  };

  // Button styles based on type
  const getConfirmButtonClass = () => {
    const base = "inline-flex w-full justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 sm:ml-3 sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
    switch (state.options.type) {
      case 'danger':
        return `${base} bg-red-600 hover:bg-red-500 focus-visible:outline-red-600`;
      case 'info':
        return `${base} bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600`;
      case 'warning':
      default:
        return `${base} bg-amber-500 hover:bg-amber-600 text-white focus-visible:outline-amber-500`;
    }
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      {/* Modal Backdrop & Container */}
      {state.isOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity duration-300 ease-out" 
            onClick={handleClose} 
          />

          {/* Centered container */}
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all duration-300 ease-out sm:my-8 sm:w-full sm:max-w-md border border-gray-100 scale-100 opacity-100">
              
              {/* Close icon in top right */}
              <button
                type="button"
                className="absolute right-4 top-4 rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={handleClose}
              >
                <span className="sr-only">Đóng</span>
                <X className="h-5 w-5" aria-hidden="true" />
              </button>

              <div className="bg-white px-4 pb-4 pt-6 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  {/* Icon Wrapper */}
                  <div className="mb-4 sm:mb-0 sm:flex-shrink-0 flex justify-center">
                    {getIcon()}
                  </div>

                  {/* Text Content */}
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      {state.title}
                    </h3>
                    <div className="mt-2">
                      <div className="text-sm text-gray-500 leading-relaxed">
                        {state.message}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-gray-50 px-4 py-3.5 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-100">
                <button
                  type="button"
                  className={getConfirmButtonClass()}
                  onClick={handleConfirm}
                >
                  {state.options.confirmLabel}
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto transition-all duration-200"
                  onClick={handleClose}
                >
                  {state.options.cancelLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
}
