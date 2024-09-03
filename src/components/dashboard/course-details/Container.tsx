'use client';

import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import GeneralInfoForm from './GeneralInfoForm';
import CoverPicker from './CoverPicker';
import TasksSelection from './TasksSelection';
import { z as zod } from 'zod';
import { CreateCourseBody, UpdateCourseBody } from '@/models';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Check,
  X as Cancel,
  ArrowClockwise,
  Info,
} from '@phosphor-icons/react';
import { CourseService } from '@/api';
import { useLazyAPI } from '@/core/hooks/useApi';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import { COURSE_COVERS } from '@/core/constants';
import { usePopupStore } from '@/core/store';

const updateForm = zod.object({
  name: zod.string().min(1, 'Name is required'),
  description: zod.string().nullable(),
  levels: zod.array(zod.string()).min(1, 'Level is required'),
  visible: zod.boolean(),
  coverPicture: zod.string().min(1, 'Pick up a cover'),
}) satisfies zod.ZodType<UpdateCourseBody>;

const defaultValues: CreateCourseBody = {
  name: '',
  description: '',
  coverPicture: '',
  levels: [],
  visible: true,
  tasks: [],
};

interface ContainerProps {
  courseId: string;
}

const Container: React.FC<ContainerProps> = ({ courseId }) => {
  const { toast } = usePopupStore();
  const router = useRouter();
  const courseService = useMemo(() => new CourseService(), []);
  const methods = useForm<CreateCourseBody>({
    resolver: zodResolver(updateForm),
    defaultValues,
  });
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = useCallback(() => setIsOpen(true), []);
  const closeDialog = useCallback(() => setIsOpen(false), []);

  const onSubmit = (values: CreateCourseBody) => {
    openDialog();
  };

  const [{ data, loading }, fetchCourseDetails] = useLazyAPI(() =>
    courseService.getDetails(courseId),
  );
  const handleUpdateCourse = useCallback(() => {
    const data = methods.getValues();
    closeDialog();
    return courseService.update(courseId, data);
  }, [courseId]);
  const [
    { loading: updateCourseLoading, data: updateResponse },
    executeUpdateCourse,
  ] = useLazyAPI(handleUpdateCourse);

  const redirectToCourse = useCallback(() => {
    router.push(paths.dashboard.courses);
  }, []);

  useEffect(() => {
    if (data) {
      const currentCover = COURSE_COVERS.find((cover) =>
        data.coverPicture.includes(cover),
      );
      methods.reset({
        name: data.name,
        levels: data.level.split(', '),
        description: data.description,
        visible: data.status === 1,
        coverPicture: currentCover,
      });
    }
  }, [data, methods]);

  useEffect(() => {
    const _eval = async () => {
      await fetchCourseDetails();
    };
    _eval();
  }, []);

  useEffect(() => {
    if (updateResponse) {
      toast('Your changes was saved!', 'success');
    }
  }, [updateResponse]);

  return (
    <FormProvider {...methods}>
      <Dialog inert onClose={closeDialog} open={isOpen}>
        <DialogTitle>Confirm</DialogTitle>
        <DialogContent>
          <DialogContentText>Do you want to create course ?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={closeDialog} color="error">
            <Cancel />
          </IconButton>
          <IconButton onClick={executeUpdateCourse} color="success">
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
            <Tooltip title="Refresh">
              <IconButton
                disabled={loading}
                onClick={fetchCourseDetails}
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
                  <CoverPicker />
                </Card>
              </Grid>
            </Grid>
          </Stack>
          <Box display={'flex'} gap={2} mt={2} flexDirection={'row-reverse'}>
            <Button
              variant="contained"
              color="info"
              type="submit"
              disabled={updateCourseLoading || loading}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="error"
              disabled={updateCourseLoading || loading}
              onClick={redirectToCourse}
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
          <TasksSelection courseId={courseId} tasks={data?.tasks ?? []} />
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default React.memo(Container);
