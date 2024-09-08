import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';
import TotalCategory from '@/components/dashboard/overview/TotalCategory';
import TotalCourses from '@/components/dashboard/overview/TotalCourses';
import TotalTasks from '@/components/dashboard/overview/TotalTasks';
import TotalUsers from '@/components/dashboard/overview/TotalUsers';

export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;


export default async function Page() {
  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
        <TotalCourses sx={{ height: '100%' }} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalCategory sx={{ height: '100%' }} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalTasks sx={{ height: '100%' }} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalUsers sx={{ height: '100%' }} />
      </Grid>
    </Grid>
  );
}
