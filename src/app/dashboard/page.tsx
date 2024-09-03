import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';

import { config } from '@/config';
import { Budget } from '@/components/dashboard/overview/budget';
import { LatestOrders } from '@/components/dashboard/overview/latest-orders';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';
import { Sales } from '@/components/dashboard/overview/sales';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';
import { Traffic } from '@/components/dashboard/overview/traffic';
import { getSession } from 'next-auth/react';
import { getServerAuthSession, nextAuthOptions } from '@/auth/next-auth-config';
import { getServerSession } from 'next-auth';
import { useAuthStore } from '@/store';
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
      {/* <Grid lg={8} xs={12}>
        <Sales
          chartSeries={[
            { name: 'This year', data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20] },
            { name: 'Last year', data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13] },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        <Traffic chartSeries={[63, 15, 22]} labels={['Desktop', 'Tablet', 'Phone']} sx={{ height: '100%' }} />
      </Grid> */}
    </Grid>
  );
}
