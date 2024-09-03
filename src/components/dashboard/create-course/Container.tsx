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
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import GeneralInfoForm from './GeneralInfoForm';
import CoverPicker from './CoverPicker';
import TasksSelection from './TasksSelection';
import { z as zod } from 'zod';
import { CreateCourseBody } from '@/models';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, X as Cancel } from '@phosphor-icons/react';
import { CourseService } from '@/api';
import { useLazyApi } from '@/core/hooks/useApi';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';

const createForm = zod.object({
  name: zod.string().min(1, 'Name is required'),
  description: zod.string().nullable(),
  levels: zod.array(zod.string()).min(1, 'Level is required'),
  visible: zod.boolean(),
  coverPicture: zod.string().min(1, 'Pick up a cover'),
  tasks: zod
    .array(
      zod.object({
        key: zod.string(),
        locked: zod.boolean(),
      }),
    )
    .nullable()
    .default([]),
});

const defaultValues: CreateCourseBody = {
  name: '',
  description: '',
  coverPicture: '',
  levels: [],
  visible: true,
  tasks: [],
};

const Container: React.FC<{}> = () => {
  const router = useRouter();
  const courseService = useMemo(() => new CourseService(), []);
  const methods = useForm<CreateCourseBody>({
    resolver: zodResolver(createForm),
    defaultValues,
  });
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = useCallback(() => setIsOpen(true), []);
  const closeDialog = useCallback(() => setIsOpen(false), []);

  const onSubmit = (values: CreateCourseBody) => {
    openDialog();
    console.log(values);
  };

  const createCourse = useCallback(() => {
    const data = methods.getValues();
    closeDialog();
    return courseService.create(data);
  }, []);
  const [{ loading, data }, execute] = useLazyApi(createCourse);

  const redirectToCourse = useCallback(() => {
    router.push(paths.dashboard.courses);
  }, []);

  useEffect(() => {
    if (data?.courseId) {
      redirectToCourse();
    }
  }, [data, redirectToCourse]);

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
          <IconButton color="success" onClick={execute}>
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
                  <CoverPicker />
                </Card>
              </Grid>
            </Grid>
            <TasksSelection />
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
              onClick={redirectToCourse}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Stack>
    </FormProvider>
  );
};

export default React.memo(Container);
