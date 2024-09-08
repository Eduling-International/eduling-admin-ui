'use client';

import { CourseService } from '@/api';
import { CreateCourseBody, Task } from '@/models';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { formSchema } from './formSchema';
import { Logger } from '@/logger/Logger';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  IconButton,
  Stack,
  Typography,
  Grid,
  Card,
  Box,
  Button,
} from '@mui/material';
import { Check, X as Cancel } from '@phosphor-icons/react';
import useLazyFetch from '@/fetch/useLazyFetch';
import { GeneralInfoForm } from '@/components/CourseCommon';
import { CourseCoverPicker } from '@/components/CourseCoverPicker';
import CourseTaskSelection from '@/components/CourseTaskSelection';

const courseService = new CourseService();
const logService = new Logger();

export const CreateCourseContainer: React.FC = React.memo(() => {
  const router = useRouter();
  const methods = useForm<CreateCourseBody>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      coverPicture: '',
      levels: [],
      visible: true,
      tasks: [],
    } satisfies CreateCourseBody,
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);

  const openDialog = React.useCallback(() => setConfirmDialogOpen(true), []);
  const closeDialog = React.useCallback(() => setConfirmDialogOpen(false), []);
  const onSubmit = React.useCallback((values: CreateCourseBody) => {
    logService.info(values);
    openDialog();
  }, []);
  const onCoverChange = React.useCallback((value: string) => {
    methods.setValue('coverPicture', value);
  }, []);
  const createCourseHandler = React.useCallback(() => {
    const value = methods.getValues();
    logService.info(value);
    return courseService.create(value);
  }, []);
  const redirectToCoursesPage = React.useCallback(() => {
    router.push('/dashboard/courses');
  }, []);
  const onClickAddCallback = React.useCallback(
    (key: string, isLocked?: boolean) => {
      const currentTasks = methods.getValues('tasks') ?? [];
      if (!currentTasks.some((task) => task.key === key)) {
        const newTasks = [...currentTasks, { key, locked: isLocked ?? true }];
        methods.setValue('tasks', newTasks);
      }
    },
    [],
  );
  const onClickUndoCallback = React.useCallback((key: string) => {
    const currentTasks = methods.getValues('tasks') ?? [];
    const newTasks = currentTasks.filter((task) => task.key !== key);
    methods.setValue('tasks', newTasks);
  }, []);
  const onChangeAccessibilityCallback = React.useCallback(
    (key: string, isLocked: boolean) => {
      const currentTasks = methods.getValues('tasks') ?? [];
      const newTasks = currentTasks.map((task) => {
        if (task.key === key) {
          return { ...task, locked: isLocked };
        }
        return task;
      });
      methods.setValue('tasks', newTasks);
    },
    [],
  );
  const onRearrangeCallback = React.useCallback((afterRearrange: Task[]) => {
    const newTasks = afterRearrange.map(({ key, locked }) => ({
      key,
      locked: locked ?? true,
    }));
    methods.setValue('tasks', newTasks);
  }, []);
  const [{ data: createCourseResponse, loading }, executeCreateCourseAPI] =
    useLazyFetch(createCourseHandler);

  React.useEffect(() => {
    if (createCourseResponse?.courseId) {
      router.push('/dashboard/courses');
    }
  }, [createCourseResponse]);

  return (
    <FormProvider {...methods}>
      <Dialog inert onClose={closeDialog} open={confirmDialogOpen}>
        <DialogTitle>Confirm</DialogTitle>
        <DialogContent>
          <DialogContentText>Do you want to create course?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={closeDialog} color="error">
            <Cancel />
          </IconButton>
          <IconButton color="success" onClick={executeCreateCourseAPI}>
            <Check />
          </IconButton>
        </DialogActions>
      </Dialog>
      <Stack spacing={2}>
        <Typography variant="h4">New course</Typography>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={7} lg={7}>
                <Card sx={{ p: 3 }}>
                  <GeneralInfoForm />
                </Card>
              </Grid>
              <Grid item xs={12} sm={12} md={5} lg={5}>
                <Card sx={{ p: 3 }}>
                  <CourseCoverPicker
                    value={methods.watch('coverPicture')}
                    onChange={onCoverChange}
                    error={Boolean(methods.formState.errors.coverPicture)}
                    helperText={methods.formState.errors.coverPicture?.message}
                  />
                </Card>
              </Grid>
            </Grid>
            <CourseTaskSelection
              onClickAddCallback={onClickAddCallback}
              onClickUndoCallback={onClickUndoCallback}
              onChangeAccessibilityCallback={onChangeAccessibilityCallback}
              onRearrangeCallback={onRearrangeCallback}
              courseTasks={[]}
              enableConfirmDialog
            />
          </Stack>
          <Box display={'flex'} gap={2} mt={2} flexDirection={'row-reverse'}>
            <Button
              sx={{ fontWeight: 'bold' }}
              variant="contained"
              color="info"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Create'}
            </Button>
            <Button
              sx={{ fontWeight: 'bold' }}
              variant="outlined"
              color="error"
              disabled={loading}
              onClick={redirectToCoursesPage}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Stack>
    </FormProvider>
  );
});
