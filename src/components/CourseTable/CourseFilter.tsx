'use client';

import * as React from 'react';

import { Card, InputAdornment, OutlinedInput } from '@mui/material';
import { useDebounce } from '@/core/hooks';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { useCourseTableContext } from '@/contexts/CourseTableContext';

const debounceTime = 1000;

const CoursesFilter: React.FC = () => {
  const { params, search, onChangeInputName } = useCourseTableContext();
  useDebounce(params, debounceTime, search);

  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        fullWidth
        placeholder="Search courses"
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlass fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
        onChange={onChangeInputName}
        value={params.name}
        sx={{ maxWidth: '500px' }}
      />
    </Card>
  );
};

export default React.memo(CoursesFilter);
