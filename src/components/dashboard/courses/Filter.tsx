'use client';

import React, { useCallback, useState } from 'react';

import { Card, InputAdornment, OutlinedInput } from '@mui/material';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Course } from '@/models';
import { useDebounce } from '@/core/hooks';

interface CoursesFilterProps {
  executeSearch: (...params: any) => Promise<void>;
}

const CoursesFilter: React.FC<CoursesFilterProps> = ({
  executeSearch,
}) => {
  const [inputName, setInputName] = useState('');
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setInputName(e.target.value);
    },
    [],
  );
  useDebounce(inputName, 1000, async (value) => {
    executeSearch(value);
  });
  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        defaultValue=""
        fullWidth
        placeholder="Search courses"
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
        onChange={onChange}
        sx={{ maxWidth: '500px' }}
      />
    </Card>
  );
};

export default CoursesFilter;
