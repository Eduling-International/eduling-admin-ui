'use client';

import { TaskTableProvider } from '@/contexts/TaskTableContext/Provider';
import * as React from 'react';
import { TaskTable } from './TaskTable';
import { Stack, Typography } from '@mui/material';
import { ImportTaskDialog } from './ImportTaskDialog';

export const TaskTableContainer: React.FC = React.memo(() => {
  return (
    <TaskTableProvider>
      <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
          <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Tasks</Typography>
          </Stack>
          <div>
            <ImportTaskDialog />
          </div>
        </Stack>
        <TaskTable />
      </Stack>
    </TaskTableProvider>
  );
});
