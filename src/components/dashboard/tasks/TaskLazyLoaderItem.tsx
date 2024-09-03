'use client';

import { Task } from '@/models';
import { Box, Grid, Typography } from '@mui/material';
import Image from 'next/image';
import React, { useMemo } from 'react';
import { ListChildComponentProps } from 'react-window';
import TaskLevel from './TaskLevel';

interface TaskLazyLoaderItemProps extends ListChildComponentProps<Task> {
  rightComponent?: React.ReactNode;
}

const TaskLazyLoaderItem: React.FC<TaskLazyLoaderItemProps> = ({
  rightComponent,
  data,
  style,
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
            mt: 3,
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
          {rightComponent && (
            <Grid xs={2} container item>
              <Box m={'auto'}>{rightComponent}</Box>
            </Grid>
          )}
        </Grid>
      )}
    </>
  );
};

export default React.memo(TaskLazyLoaderItem);
