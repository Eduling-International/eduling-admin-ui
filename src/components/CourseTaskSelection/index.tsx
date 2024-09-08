'use client';

import {
  TaskSelectionProvider,
  TaskSelectionProviderProps,
} from '@/contexts/TaskSelectionContext';
import * as React from 'react';
import SearchTaskLazyLoader from './SearchTaskLazyLoader';
import { Grid, Card } from '@mui/material';
import ListCourseTask from './ListCourseTask';

export interface CourseTaskSelectionProps extends TaskSelectionProviderProps {
  courseId?: string;
}

const CourseTaskSelection: React.FC<CourseTaskSelectionProps> = ({
  children,
  ...props
}) => {
  return (
    <TaskSelectionProvider {...props}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={7} lg={7}>
          <Card sx={{ p: 3 }}>
            <SearchTaskLazyLoader />
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={5} lg={5}>
          <Card sx={{ p: 3 }}>
            <ListCourseTask />
          </Card>
        </Grid>
      </Grid>
    </TaskSelectionProvider>
  );
};

export default CourseTaskSelection;
