import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { CourseTableContainer } from '@/components/CourseTable';

export default function Page() {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Courses</Typography>
        </Stack>
        <div>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            href='/dashboard/courses/create'
          >
            New
          </Button>
        </div>
      </Stack>
      <CourseTableContainer />
    </Stack>
  );
}
