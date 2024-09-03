'use client';

import { CourseService } from '@/api';
import { Card, CardContent, Stack, Typography, Avatar } from '@mui/material';
import type { SxProps } from '@mui/material/styles';
import React, { useCallback, useMemo } from 'react';
import { BookOpen as CourseIcon } from '@phosphor-icons/react/dist/ssr/BookOpen';
import { useImmediateApi } from '@/core/hooks/useApi';

interface TotalCoursesProps {
    sx?: SxProps;
}

const TotalCourses: React.FC<TotalCoursesProps> = ({ sx }) => {
    const courseService = useMemo(() => new CourseService(), []);
    const countCourses = useCallback(() => {
        return courseService.count();
    }, []);
    const { data } = useImmediateApi(countCourses);

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
                                Total Courses
                            </Typography>
                            <Typography variant="h4">{data?.total ?? "-/-"}</Typography>
                        </Stack>
                        <Avatar
                            sx={{
                                backgroundColor: 'var(--mui-palette-primary-main)',
                                height: '56px',
                                width: '56px',
                            }}
                        >
                            <CourseIcon fontSize="var(--icon-fontSize-lg)" />
                        </Avatar>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default React.memo(TotalCourses);
