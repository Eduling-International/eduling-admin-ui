'use client';

import { CourseService } from '@/api';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Alert,
} from '@mui/material';
import { Trash, Bug } from '@phosphor-icons/react';
import { z as zod } from 'zod';
import * as React from 'react';
import { RequirePasswordBody } from '@/models';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useLazyFetch from '@/fetch/useLazyFetch';
import { useRouter } from 'next/navigation';
import { usePopupStore } from '@/core/store';

const courseService = new CourseService();

const formSchema = zod.object({
  password: zod
    .string()
    .min(10, {
      message: 'Password is invalid. Must be at least 10 characters long.',
    })
    .max(20, { message: 'Password must be at most 20 characters long.' })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])(?=\S+$).{10,20}$/,
      {
        message:
          'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
      },
    ),
}) satisfies zod.ZodType<RequirePasswordBody>;

export interface DeleteCourseButtonProps {
  courseId?: string;
  courseName?: string;
}

export const DeleteCourseButton: React.FC<DeleteCourseButtonProps> = React.memo(
  ({ courseId, courseName }) => {
    const { toastSuccess, toastError } = usePopupStore();
    const router = useRouter();
    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<RequirePasswordBody>({
      defaultValues: {
        password: '',
      },
      resolver: zodResolver(formSchema),
    });
    const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
    const openConfirmDialog = React.useCallback(() => {
      setConfirmDialogOpen(true);
      reset();
    }, []);
    const closeConfirmDialog = React.useCallback(
      () => setConfirmDialogOpen(false),
      [],
    );
    const [
      { loading: deleteLoading, error, data: deleteResponse },
      executeDeleteCourseAPI,
    ] = useLazyFetch(courseService.deleteCourse);

    const onSubmit = React.useCallback(
      async (values: RequirePasswordBody) => {
        try {
          if (courseId) {
            await executeDeleteCourseAPI(courseId, {
              password: btoa(values.password),
            });
          }
        } catch (error) {
          console.error(error);
          toastError('An unexpected error was occurred. Reload and try again.');
        }
      },
      [courseId],
    );

    React.useEffect(() => {
      if (deleteResponse?.affectedRows === 1) {
        closeConfirmDialog();
        toastSuccess('The course was deleted. Redirecting....');
        router.push('/dashboard/courses');
      }
    }, [deleteResponse]);

    return (
      <React.Fragment>
        <Button
          size="small"
          disabled={!courseId || !courseName || deleteLoading}
          color="error"
          variant="outlined"
          endIcon={<Trash />}
          onClick={openConfirmDialog}
        >
          Delete
        </Button>
        <Dialog fullWidth maxWidth="sm" open={confirmDialogOpen}>
          <DialogTitle>
            Do you want to delete course <b>{courseName}</b>?
            <br />
            <i style={{ color: 'red' }}>You cannot undo this action!</i>
          </DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <DialogContent>
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <FormControl
                    required
                    fullWidth
                    margin="normal"
                    error={Boolean(errors.password)}
                  >
                    <InputLabel>Login password</InputLabel>
                    <OutlinedInput
                      {...field}
                      label="Login password"
                      type="password"
                      placeholder="Enter your password"
                      autoComplete="off"
                    />
                    {errors.password ? (
                      <FormHelperText>{errors.password.message}</FormHelperText>
                    ) : null}
                  </FormControl>
                )}
              />
              {error && (
                <Alert icon={<Bug />} severity="error">
                  {error}
                </Alert>
              )}
            </DialogContent>
            <DialogActions>
              <Button color="error" size="small" onClick={closeConfirmDialog}>
                Cancel
              </Button>
              <Button
                variant="outlined"
                type="submit"
                color="info"
                size="small"
              >
                Delete
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </React.Fragment>
    );
  },
);
