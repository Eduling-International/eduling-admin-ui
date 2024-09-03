'use client';

import { Alert, Snackbar, SnackbarCloseReason } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { usePopupStore } from '@/core/store';

interface ToastProviderProps {
  autoHideDuration?: number;
}

const ToastProvider: React.FC<ToastProviderProps> = ({
  autoHideDuration = 5000,
}) => {
  const { message, type, clear } = usePopupStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = useCallback(
    (_?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
      if (reason === 'clickaway') {
        return;
      }
      setIsOpen(false);
      clear();
    },
    [],
  );

  useEffect(() => {
    if (message) {
      setIsOpen(true);
    }
  }, [message]);

  return (
    <React.Fragment>
      {isOpen && (
        <Snackbar
          open={true}
          autoHideDuration={autoHideDuration}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity={type}>
            {message ?? ''}
          </Alert>
        </Snackbar>
      )}
    </React.Fragment>
  );
};

export default ToastProvider;
