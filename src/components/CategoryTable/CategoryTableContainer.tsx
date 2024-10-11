'use client';

import { CategoryTableProvider } from '@/contexts/CategoryTableContext';
import { Stack, Typography } from '@mui/material';
import * as React from 'react';
import { CategoryTable } from './CategoryTable';

export const CategoryTableContainer: React.FC = React.memo(() => {
    return <CategoryTableProvider>
        <Stack spacing={3}>
            <Typography variant="h4" component="div">Categories</Typography>
            <CategoryTable />
        </Stack>
    </CategoryTableProvider>
})
