'use client';

import { CourseTableProvider } from '@/contexts/CourseTableContext';
import * as React from 'react';
import CourseTable from './CourseTable';

export const CourseTableContainer = React.memo(() => {
  return (
    <CourseTableProvider>
      <CourseTable />
    </CourseTableProvider>
  )
})
