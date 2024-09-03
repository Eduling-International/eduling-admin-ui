'use client';

import { useAPILoadingStore } from '@/core/store';
import React from 'react';
import { LinearProgress, Box } from '@mui/material';

const LoadingProvider: React.FC = () => {
  const { isOpen } = useAPILoadingStore();

  return (
    <>
      {isOpen && (
        <Box
          sx={{
            width: '100%',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 1301,
          }}
        >
          <LinearProgress />
        </Box>
      )}
    </>
  );
};

export default LoadingProvider;
