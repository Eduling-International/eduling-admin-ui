'use client';

import { useAdminTableContext } from '@/contexts/AdminTableContext';
import { useDebounce } from '@/core/hooks';
import { Card, OutlinedInput, InputAdornment } from '@mui/material';
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr';
import * as React from 'react';

const debounceTime = 1000;

const AdminTableFilter: React.FC = React.memo(() => {
  const { onUsernameChange, searchParams, search } = useAdminTableContext();
  // デバウンスを実行する
  useDebounce(searchParams, debounceTime, search);

  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        fullWidth
        placeholder="Search by username"
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlass fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
        onChange={onUsernameChange}
        value={searchParams.username}
        sx={{ maxWidth: '500px' }}
      />
    </Card>
  );
});

export default AdminTableFilter;
