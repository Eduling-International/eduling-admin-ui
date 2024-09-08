'use client';

import { useTaskSelectionContext } from '@/contexts/TaskSelectionContext';
import { Task } from '@/models';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material';
import { Lock, LockOpen } from '@phosphor-icons/react';
import * as React from 'react';
import Image from 'next/image';
import { ListChildComponentProps } from 'react-window';
import TaskLevelComponent from './TaskLevelComponent';
import ToggleChildWrapper from './ToggleChildWrapper';

export interface TaskUIComponentProps extends ListChildComponentProps<Task> {
}

const maxLengthDisplay = 30;

const TaskUIComponent: React.FC<TaskUIComponentProps> = React.memo(
  ({ data, style }) => {
    const { clickAddHandler, enableConfirmDialog } = useTaskSelectionContext();
    const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
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

    const closeDialog = React.useCallback(
      () => setConfirmDialogOpen(false),
      [],
    );
    const onClickAdd = React.useCallback(() => {
      if (enableConfirmDialog) {
        setConfirmDialogOpen(true);
        return;
      }
      clickAddHandler(data.key, true);
      closeDialog();
    }, []);

    const clickLockHandler = React.useCallback(() => {
      clickAddHandler(data.key, true);
      closeDialog();
    }, []);
    const clickUnlockHandler = React.useCallback(() => {
      clickAddHandler(data.key, false);
      closeDialog();
    }, []);

    return (
      <React.Fragment>
        {enableConfirmDialog && (
          <Dialog onClose={closeDialog} open={confirmDialogOpen}>
            <DialogTitle>Confirm</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Do you want make it be premium access only and add to course?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={clickUnlockHandler}
                color="info"
                endIcon={<LockOpen />}
              >
                No, continue
              </Button>
              <Button
                onClick={clickLockHandler}
                color="warning"
                endIcon={<Lock />}
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        )}
        <ToggleChildWrapper isShowChild={!!data}>
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
                <Grid xs={4} sm={2.5} lg={2.5} xl={2.5} item>
                  Level:
                </Grid>
                <Grid item>
                  <TaskLevelComponent value={data.level} />
                </Grid>
              </Grid>
            </Grid>
            <Grid xs={2} container item>
              <Box m={'auto'}>
                <Button onClick={onClickAdd} size="small" variant="outlined">
                  Add
                </Button>
              </Box>
            </Grid>
          </Grid>
        </ToggleChildWrapper>
      </React.Fragment>
    );
  },
);

export default TaskUIComponent;
