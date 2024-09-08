import { create } from 'zustand';
import { AlertColor, AlertPropsColorOverrides } from '@mui/material';
import { OverridableStringUnion } from '@mui/types';

interface PopupStoreValue {
  message?: string;
  type?: OverridableStringUnion<AlertColor, AlertPropsColorOverrides>;
  toast: (
    message: string,
    type?: OverridableStringUnion<AlertColor, AlertPropsColorOverrides>,
  ) => void;
  toastError: (message: string) => void;
  toastSuccess: (message: string) => void;
  clear: () => void;
}

interface APILoadingStoreValue {
  isOpen: boolean;
  show: () => void;
  hidden: () => void;
}

const usePopupStore = create<PopupStoreValue>((set) => ({
  message: undefined,
  toast: function (message, type = 'info') {
    set(() => ({ message, type }));
  },
  toastError: function (message) {
    set(() => ({ message, type: 'error' }));
  },
  toastSuccess: function (message) {
    set(() => ({ message, type: 'success' }));
  },
  clear: function () {
    set(() => ({ message: undefined, type: undefined }));
  },
}));

const useAPILoadingStore = create<APILoadingStoreValue>((set) => ({
  isOpen: false,
  show() {
    set(() => ({ isOpen: true }));
  },
  hidden() {
    set(() => ({ isOpen: false }));
  },
}));

export { usePopupStore, useAPILoadingStore };
