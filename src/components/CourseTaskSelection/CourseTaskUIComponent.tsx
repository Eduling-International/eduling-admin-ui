'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Grid,
  Typography,
  IconButton,
  Tooltip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import TaskLevelComponent from './TaskLevelComponent';
import { ArrowCounterClockwise, Check, Lock, LockOpen, X } from '@phosphor-icons/react';
import { Task } from '@/models';
import { useTaskSelectionContext } from '@/contexts/TaskSelectionContext';

interface CourseTaskUIComponentProps {
  data: Task;
}

const maxLengthDisplay = 30;

const CourseTaskUIComponent: React.FC<CourseTaskUIComponentProps> = React.memo(
  ({ data }) => {
    const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
    const { clickUndoHandler, clickLockHandler, clickUnlockHandler } =
      useTaskSelectionContext();
    const displayName = React.useMemo(() => {
      if (data.name.length > maxLengthDisplay) {
        return data.name.substring(0, maxLengthDisplay) + '...';
      }
      return data.name;
    }, [data.name]);
    const displayCategory = React.useMemo(() => {
      if (data.category.name.length > maxLengthDisplay) {
        return data.category.name.substring(0, maxLengthDisplay) + '...';
      }
      return data.category.name;
    }, [data.category]);

    const handleConfirmUndo = React.useCallback(() => {
      clickUndoHandler(data.key)
      closeDialog();
    }, [clickUndoHandler])
    const onClickUnlock = React.useCallback(
      () => clickUnlockHandler(data.key),
      [clickUnlockHandler],
    );
    const onClickLock = React.useCallback(
      () => clickLockHandler(data.key),
      [clickLockHandler],
    );
    const closeDialog = React.useCallback(
      () => setConfirmDialogOpen(false),
      [],
    );
    const onClickUndo = React.useCallback(() => {
      setConfirmDialogOpen(true);
    }, []);

    return (
      <React.Fragment>
        <Dialog onClose={closeDialog} open={confirmDialogOpen}>
          <DialogTitle>Confirm</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Do you want to undo the task from course?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={closeDialog}
              color="error"
              endIcon={<X />}
            >
              No
            </Button>
            <Button
              onClick={handleConfirmUndo}
              color="info"
              endIcon={<Check />}
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
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
                {displayName}
              </Typography>
            </Grid>
            <Grid container>
              <Grid item>
                <Typography fontSize={14}>{displayCategory}</Typography>
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
                <TaskLevelComponent value={data.level} />
              </Grid>
            </Grid>
          </Grid>
          <Grid xs={3} item>
            <Box display={'flex'} flexDirection={'column'}>
              <Tooltip title="Undo">
                <IconButton
                  sx={{ width: 'fit-content' }}
                  onClick={onClickUndo}
                  color="info"
                >
                  <ArrowCounterClockwise />
                </IconButton>
              </Tooltip>
              {data.locked ? (
                <Tooltip title="Unlock">
                  <IconButton
                    sx={{ width: 'fit-content', mt: 1 }}
                    onClick={onClickUnlock}
                    color="warning"
                  >
                    <Lock />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Lock">
                  <IconButton
                    sx={{ width: 'fit-content', mt: 1 }}
                    onClick={onClickLock}
                    color="success"
                  >
                    <LockOpen />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  },
);

export default CourseTaskUIComponent;
