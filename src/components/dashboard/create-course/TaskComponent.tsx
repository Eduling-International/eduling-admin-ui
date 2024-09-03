'use client';

import { Task } from '@/models';
import { Box, Button, Grid, Typography } from '@mui/material';
import Image from 'next/image';
import React, { useCallback, useMemo } from 'react';
import { ListChildComponentProps } from 'react-window';
import TaskLevel from './TaskLevel';

interface TaskComponentProps extends ListChildComponentProps<Task> {
  onSelectTask: (value: string) => void;
}

const TaskComponent: React.FC<TaskComponentProps> = ({
  data,
  style,
  onSelectTask,
}) => {
  const taskName = useMemo(() => {
    const MAX_LENGTH = 30;
    if (data) {
      const name = data.name;
      const length = name?.length;
      if (length > MAX_LENGTH) {
        return name.slice(0, MAX_LENGTH - 3).concat('...');
      }
      return name;
    }
    return '';
  }, [data]);

  const categoryName = useMemo(() => {
    const MAX_LENGTH = 30;
    if (data) {
      const category = data.category.name;
      const length = category?.length;
      if (length > MAX_LENGTH) {
        return category.slice(0, MAX_LENGTH - 3).concat('...');
      }
      return category;
    }
    return '';
  }, [data]);

  const onClick = useCallback(() => {
    if (data) {
      onSelectTask(data.id)
    }
  }, [])

  return (
    <>
      {data && (
        <Grid
          sx={{
            ...style,
            borderRadius: 1,
            margin: 'auto',
            width: '100%',
            border: '1px solid lightgray',
            height: 'auto',
            pt: 1.2,
            '&:hover': {
              boxShadow: 3,
            },
          }}
          container
          columnSpacing={2}
        >
          <Grid item xs={3}>
            <Image
              style={{
                borderRadius: 8,
              }}
              width={80}
              height={80}
              src={data.coverPicture}
              alt={`${data.name}-Cover Picture`}
            />
          </Grid>
          <Grid item p={2} xs={6} sm={6} rowSpacing={2} container>
            <Grid container>
              <Typography fontSize={14} fontWeight={'bold'}>
                {taskName}
              </Typography>
            </Grid>
            <Grid container>
              <Grid item>
                <Typography fontSize={14}>{categoryName}</Typography>
              </Grid>
            </Grid>
            <Grid
              container
              sx={{
                fontSize: 14,
                alignItems: 'flex-end',
              }}
            >
              <Grid xs={4} sm={2.5} lg={2.5} xl={2.5} item>
                Level:
              </Grid>
              <Grid item>
                <TaskLevel level={data.level} />
              </Grid>
            </Grid>
          </Grid>
          <Grid xs={2} container item>
            <Box m={'auto'}>
              <Button onClick={onClick} size="small" variant="outlined">
                Add
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default React.memo(TaskComponent);
