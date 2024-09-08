import { Box, Stack } from '@mui/material';
import * as React from 'react';

interface TaskLevelComponentProps {
  value: number;
}

const levelColor = ['#E4E4E4', '#FFC149', '#FF8B49', '#EC362A'];

const TaskLevelComponent: React.FC<TaskLevelComponentProps> = React.memo(
  ({ value }) => (
    <Stack direction="column-reverse">
      {levelColor.map((item, index) => {
        if (index !== 0) {
          if (index <= value) {
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
                  backgroundColor: levelColor[0],
                  mb: '2px',
                }}
              />
            );
          }
        }
      })}
    </Stack>
  ),
);

export default TaskLevelComponent;
