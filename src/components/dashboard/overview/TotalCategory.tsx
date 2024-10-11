/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { CategoryService } from '@/api';
import { Card, CardContent, Stack, Typography, Avatar, CardActionArea } from '@mui/material';
import type { SxProps } from '@mui/material/styles';
import React, { useCallback, useMemo } from 'react';
import { useImmediateApi } from '@/core/hooks/useApi';
import { ReplitLogo } from '@phosphor-icons/react/dist/ssr';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';

interface TotalCategoryProps {
    sx?: SxProps;
}

const TotalCategory: React.FC<TotalCategoryProps> = ({ sx }) => {
    const categoryService = useMemo(() => new CategoryService(), []);
    const router = useRouter();

    const countCategories = useCallback(() => {
        return categoryService.count();
    }, [])
    const { data } = useImmediateApi(countCategories);

    const onClickCard = useCallback(() => {
        router.push(paths.dashboard.categories);
    }, [])

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
                                    Total Categories
                                </Typography>
                                <Typography variant="h4">{data?.total ?? "-/-"}</Typography>
                            </Stack>
                            <Avatar
                                sx={{
                                    backgroundColor: 'var(--mui-palette-success-main)',
                                    height: '56px',
                                    width: '56px',
                                }}
                            >
                                <ReplitLogo fontSize="var(--icon-fontSize-lg)" />
                            </Avatar>
                        </Stack>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default React.memo(TotalCategory);
