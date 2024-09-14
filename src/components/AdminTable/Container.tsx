'use client';

import { AdminTableProvider } from '@/contexts/AdminTableContext';
import { Stack, Typography } from '@mui/material';
import React from 'react';
import AdminTable from './Table';
import CreateAdminUserForm from './CreateForm';

export const AdminTableContainer = React.memo(() => {
  return (
    <AdminTableProvider>
      <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
          <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Admin users</Typography>
          </Stack>
          <div>
            <CreateAdminUserForm />
          </div>
        </Stack>
        <AdminTable />
      </Stack>
    </AdminTableProvider>
  );
});
