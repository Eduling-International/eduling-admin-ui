'use client';

import { CourseService, CourseTaskService } from '@/api';
import { Task, UpdateCourseBody } from '@/models';
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
  Tooltip,
} from '@mui/material';
import {
  Check,
  X as Cancel,
  ArrowClockwise,
  Info,
} from '@phosphor-icons/react';
import useLazyFetch from '@/fetch/useLazyFetch';
import { GeneralInfoForm } from '@/components/CourseCommon';
import { CourseCoverPicker, covers } from '@/components/CourseCoverPicker';
import CourseTaskSelection from '@/components/CourseTaskSelection';
import { usePopupStore } from '@/core/store';
import { DeleteCourseButton } from './DeleteCourseButton';

const courseService = new CourseService();
const logService = new Logger();

export interface CourseDetailsContainerProps {
  courseId: string;
}

export const CourseDetailsContainer: React.FC<CourseDetailsContainerProps> =
  React.memo(({ courseId }) => {
    const { toastSuccess } = usePopupStore();
    const router = useRouter();
    const methods = useForm<UpdateCourseBody>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: '',
        description: '',
        coverPicture: '',
        levels: [],
        visible: true,
      } satisfies UpdateCourseBody,
    });
    const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
    const courseTaskService = React.useMemo(
      () => new CourseTaskService(courseId),
      [courseId],
    );
    const openDialog = React.useCallback(() => setConfirmDialogOpen(true), []);
    const closeDialog = React.useCallback(
      () => setConfirmDialogOpen(false),
      [],
    );
    const onSubmit = React.useCallback((values: UpdateCourseBody) => {
      logService.info(values);
      openDialog();
    }, []);
    const onCoverChange = React.useCallback((value: string) => {
      methods.setValue('coverPicture', value);
    }, []);
    const updateCourseHandler = React.useCallback(async () => {
      const value = methods.getValues();
      logService.info(value);
      const res = await courseService.update(courseId, value);
      if (!res.isError) {
        toastSuccess('Course updated successfully!');
        closeDialog();
      }
      return res;
    }, [courseId]);
    const redirectToCoursesPage = React.useCallback(() => {
      router.push('/dashboard/courses');
    }, []);
    const onClickAddCallback = React.useCallback(
      async (key: string, isLocked?: boolean) => {
        const { isError } = await courseTaskService.addTask({
          key,
          locked: isLocked ?? true,
        });
        if (!isError) {
          toastSuccess('The task was added to course!');
        }
      },
      [],
    );
    const onClickUndoCallback = React.useCallback(async (key: string) => {
      const { isError } = await courseTaskService.removeTask(key);
      if (!isError) {
        toastSuccess('The task was added to course!');
      }
    }, []);
    const onChangeAccessibilityCallback = React.useCallback(
      async (key: string, isLocked: boolean) => {
        const { isError } = await courseTaskService.lockTask(
          key,
          isLocked ?? true,
        );
        if (!isError) {
          toastSuccess('The task was added to course!');
        }
      },
      [],
    );
    const onRearrangeCallback = React.useCallback(
      async (_: Task[], movingItem?: Task, newOrder?: number) => {
        if (movingItem && newOrder) {
          const { isError } = await courseTaskService.rearrange(
            movingItem.key,
            newOrder,
          );
          if (!isError) {
            toastSuccess('You changes was saved!');
          }
        }
      },
      [],
    );
    const [{ loading: updateLoading }, executeUpdateCourse] =
      useLazyFetch(updateCourseHandler);
    const [{ data: courseDetails, loading }, getCourseDetails] = useLazyFetch(
      courseService.getDetails,
    );

    React.useEffect(() => {
      getCourseDetails(courseId);
    }, [courseId]);

    React.useEffect(() => {
      if (courseDetails) {
        const cover = covers.find((item) =>
          courseDetails.coverPicture.includes(item),
        );
        methods.reset({
          name: courseDetails.name,
          levels: courseDetails.level.split(', '),
          description: courseDetails.description,
          visible: courseDetails.status === 1,
          coverPicture: cover,
        });
      }
    }, [courseDetails]);

    return (
      <FormProvider {...methods}>
        <Dialog inert onClose={closeDialog} open={confirmDialogOpen}>
          <DialogTitle>Confirm</DialogTitle>
          <DialogContent>
            <DialogContentText>Do you want to save changes?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <IconButton onClick={closeDialog} color="error">
              <Cancel />
            </IconButton>
            <IconButton
              disabled={updateLoading}
              color="success"
              onClick={executeUpdateCourse}
            >
              <Check />
            </IconButton>
          </DialogActions>
        </Dialog>
        <Stack spacing={2}>
          <Box display="flex">
            <Typography flex={1} component="div" variant="h4">
              Course details
            </Typography>
            <Box>
              <DeleteCourseButton courseId={courseDetails?.id} courseName={courseDetails?.name} />
              <Tooltip title="Refresh">
                <IconButton
                  disabled={loading}
                  onClick={getCourseDetails.bind(null, courseId)}
                  color="primary"
                  size="large"
                >
                  <ArrowClockwise />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
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
                      helperText={
                        methods.formState.errors.coverPicture?.message
                      }
                    />
                  </Card>
                </Grid>
              </Grid>
            </Stack>
            <Box display={'flex'} gap={2} mt={2} flexDirection={'row-reverse'}>
              <Button
                sx={{ fontWeight: 'bold' }}
                variant="contained"
                color="info"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Save'}
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
          <Stack gap={3}>
            <Stack direction="row" alignItems="center" gap={1}>
              <Typography component="div" variant="h5">
                Rearrange tasks
              </Typography>
              <div>
                <Tooltip title="Your changes will take effect immediately.">
                  <IconButton size="small">
                    <Info />
                  </IconButton>
                </Tooltip>
              </div>
            </Stack>
            <CourseTaskSelection
              onClickAddCallback={onClickAddCallback}
              onClickUndoCallback={onClickUndoCallback}
              onChangeAccessibilityCallback={onChangeAccessibilityCallback}
              onRearrangeCallback={onRearrangeCallback}
              courseTasks={courseDetails?.tasks || []}
              enableConfirmDialog
            />
          </Stack>
        </Stack>
      </FormProvider>
    );
  });
