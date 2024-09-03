/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { TaskService } from '@/api';
import { Card, CardContent, Stack, Typography, Avatar } from '@mui/material';
import type { SxProps } from '@mui/material/styles';
import React, { useCallback, useMemo } from 'react';
import { ListBullets as TaskIcon } from '@phosphor-icons/react/dist/ssr/ListBullets';
import { useImmediateApi } from '@/core/hooks/useApi';

interface TotalCategoryProps {
    sx?: SxProps;
}

const TotalTasks: React.FC<TotalCategoryProps> = ({ sx }) => {
    const taskService = useMemo(() => new TaskService(), []);

    const countTasks = useCallback(() => {
        return taskService.count();
    }, []);
    const { data } = useImmediateApi(countTasks);

    return (
        <Card sx={sx}>
            <CardContent>
                <Stack spacing={2}>
                    <Stack
                        direction="row"
                        sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}
                        spacing={3}
                    >
                        <Stack spacing={1}>
                            <Typography color="text.secondary" variant="overline">
                                Total Tasks
                            </Typography>
                            <Typography variant="h4">{data?.total ?? '-/-'}</Typography>
                        </Stack>
                        <Avatar
                            sx={{
                                backgroundColor: 'var(--mui-palette-warning-main)',
                                height: '56px',
                                width: '56px',
                            }}
                        >
                            <TaskIcon fontSize="var(--icon-fontSize-lg)" />
                        </Avatar>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default React.memo(TotalTasks);
