'use client';

import { AdminTableProvider } from '@/contexts/AdminTableContext';
import { Stack, Typography } from '@mui/material';
import React from 'react';
import AdminTable from './Table';
import AdminTableFilter from './Filter';

export const AdminTableContainer = React.memo(() => {
  return (
    <AdminTableProvider>
      <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
        <Typography variant="h4">Admin users</Typography>
        </Stack>
        <AdminTableFilter />
        <AdminTable />
      </Stack>
    </AdminTableProvider>
  );
});
