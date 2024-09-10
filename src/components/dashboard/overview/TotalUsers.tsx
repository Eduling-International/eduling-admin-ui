/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { UserService } from '@/api';
import { Card, CardContent, Stack, Typography, Avatar, CardActionArea } from '@mui/material';
import type { SxProps } from '@mui/material/styles';
import React, { useCallback, useMemo } from 'react';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { useImmediateApi } from '@/core/hooks/useApi';

interface TotalCategoryProps {
    sx?: SxProps;
}

const TotalUsers: React.FC<TotalCategoryProps> = ({ sx }) => {
    const userService = useMemo(() => new UserService(), []);

    const countUsers = useCallback(() => {
        return userService.count();
    }, []);
    const { data } = useImmediateApi(countUsers);

    const onClickCard = useCallback(() => {
        window.alert("This feature is coming soon !");
    }, []);

    return (
        <Card sx={sx}>
            <CardActionArea onClick={onClickCard}>
                <CardContent>
                    <Stack spacing={2}>
                        <Stack
                            direction="row"
                            sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}
                            spacing={3}
                        >
                            <Stack spacing={1}>
                                <Typography color="text.secondary" variant="overline">
                                    Total Users
                                </Typography>
                                <Typography variant="h4">{data?.total ?? '-/-'}</Typography>
                            </Stack>
                            <Avatar
                                sx={{
                                    backgroundColor: 'var(--mui-palette-info-main)',
                                    height: '56px',
                                    width: '56px',
                                }}
                            >
                                <UserIcon fontSize="var(--icon-fontSize-lg)" />
                            </Avatar>
                        </Stack>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default React.memo(TotalUsers);
