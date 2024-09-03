'use client';

import { Task } from '@/models';
import { Box, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import Image from 'next/image';
import React, { useCallback, useMemo } from 'react';
import TaskLevel from './TaskLevel';
import { ArrowCounterClockwise, LockOpen, Lock } from '@phosphor-icons/react';
import { CourseTaskService } from '@/api';

interface SelectedTaskProps {
  data: Task;
  courseId: string;
  undo: (id: string) => void;
  lock: (id: string) => void;
  unlock: (id: string) => void;
}

const SelectedTask: React.FC<SelectedTaskProps> = ({
  data,
  courseId,
  undo,
  lock,
  unlock,
}) => {
  
  const courseTaskService = useMemo(() => new CourseTaskService(courseId), []);
  const taskName = useMemo(() => {
    const MAX_LENGTH = 30;
    const name = data.name;
    const length = name?.length;
    if (length > MAX_LENGTH) {
      return name.slice(0, MAX_LENGTH - 3).concat('...');
    }
    return name;
  }, [data]);
  const categoryName = useMemo(() => {
    const MAX_LENGTH = 30;
    const category = data.category.name;
    const length = category?.length;
    if (length > MAX_LENGTH) {
      return category.slice(0, MAX_LENGTH - 3).concat('...');
    }
    return category;
  }, [data]);

  const handleUndo = useCallback(() => {
    courseTaskService.removeTask(data.key).then(res => {
      if (!res.isError) {
        undo(data.id);
      }
    })
  }, []);
  const handleLock = useCallback(() => {
    lock(data.id);
  }, []);
  const handleUnlock = useCallback(() => {
    unlock(data.id);
  }, []);

  return (
    <Grid
      sx={{
        borderRadius: 1,
        margin: 'auto',
        width: '100%',
        border: '1px solid lightgray',
        height: 'auto',
        pt: 1.2,
        '&:hover': {
          boxShadow: 3,
        },
        mb: 2.5,
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
          <Grid xs={5} sm={2.5} lg={2.5} xl={2.5} item>
            Level:
          </Grid>
          <Grid item ml={1}>
            <TaskLevel level={data.level} />
          </Grid>
        </Grid>
      </Grid>
      <Grid xs={3} item>
        <Box display={"flex"} flexDirection={"column"}>
          <Tooltip title="Undo">
            <IconButton sx={{ width: 'fit-content' }} onClick={handleUndo} color="info">
              <ArrowCounterClockwise />
            </IconButton>
          </Tooltip>
          {data.locked ? (
            <Tooltip title="Unlock">
              <IconButton sx={{ width: 'fit-content', mt: 1 }} onClick={handleUnlock} color="warning">
                <Lock />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Lock">
              <IconButton sx={{ width: 'fit-content', mt: 1 }} onClick={handleLock} color="success">
                <LockOpen />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default SelectedTask;
