'use client';

import { Box, Stack } from '@mui/material';
import React from 'react';

const LEVEL_COLORS = ['#E4E4E4', '#FFC149', '#FF8B49', '#EC362A'];

interface TaskLevelProps {
  level: number;
}

const TaskLevel: React.FC<TaskLevelProps> = ({ level }) => {
  return (
    <Stack direction="column-reverse">
      {LEVEL_COLORS.map((item, index) => {
        if (index !== 0) {
          if (index <= level) {
            return (
              <Box
                key={index}
                sx={{
                  width: 20,
                  height: 6,
                  borderRadius: 5,
                  backgroundColor: item,
                  mb: '2px',
                }}
              />
            );
          } else {
            return (
              <Box
                key={index}
                sx={{
                  width: 20,
                  height: 6,
                  borderRadius: 5,
                  backgroundColor: LEVEL_COLORS[0],
                  mb: '2px',
                }}
              />
            );
          }
        }
      })}
    </Stack>
  );
};

export default React.memo(TaskLevel);
