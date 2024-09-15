'use client';

import * as React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
} from '@mui/material';
import { z as zod } from 'zod';
import { ChangePasswordBody } from '@/models';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeSlash, Key, Eye } from '@phosphor-icons/react/dist/ssr';
import { AuthenticationService } from '@/api';
import useLazyFetch from '@/fetch/useLazyFetch';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { usePopupStore } from '@/core/store';

const formSchema = zod
  .object({
    currentPassword: zod
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
    newPassword: zod
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
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from the current password.',
    path: ['newPassword'],
  }) satisfies zod.ZodType<ChangePasswordBody>;

const authService = new AuthenticationService();

export const UpdatePasswordForm: React.FC = React.memo(() => {
  const { toastSuccess } = usePopupStore();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const handleOpenDialog = React.useCallback(() => {
    setIsDialogOpen(true);
  }, []);
  const handleCloseDialog = React.useCallback(() => {
    setIsDialogOpen(false);
  }, []);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ChangePasswordBody>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
    resolver: zodResolver(formSchema),
  });
  const [{ data, loading }, executeChangePassword] = useLazyFetch(
    authService.changePassword,
  );

  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);

  const handleClickShowCurrentPassword = () =>
    setShowCurrentPassword((show) => !show);
  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };
  const handleConfirmUpdate = React.useCallback(async () => {
    const value = getValues();
    await executeChangePassword(value);
  }, [])

  const onSubmit = React.useCallback(() => {
    handleOpenDialog();
  }, []);

  React.useEffect(() => {
    (async () => {
      if (data) {
        await signOut();
        handleCloseDialog();
        router.push('/auth/sign-in');
      }
    })();
  }, [data]);

  return (
    <React.Fragment>
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm change password?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Password change will expire your session, requiring you to log in
            again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={handleCloseDialog}
          >
            Cancel
          </Button>
          <Button
            disabled={loading}
            size="small"
            variant="contained"
            color="primary"
            onClick={handleConfirmUpdate}
            autoFocus
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader subheader="Update password" title="Password" />
          <Divider />
          <CardContent>
            <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
              <Controller
                control={control}
                name="currentPassword"
                render={({ field }) => (
                  <FormControl
                    required
                    fullWidth
                    error={Boolean(errors.currentPassword)}
                  >
                    <InputLabel>Current password</InputLabel>
                    <OutlinedInput
                      {...field}
                      label="Current password"
                      name="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      startAdornment={
                        <InputAdornment position="start">
                          <Key fontSize={'var(--icon-fontsize-md'} />
                        </InputAdornment>
                      }
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowCurrentPassword}
                            onMouseDown={handleMouseDownPassword}
                            onMouseUp={handleMouseUpPassword}
                            edge="end"
                          >
                            {showCurrentPassword ? (
                              <EyeSlash fontSize="var(--icon-fontSize-md)" />
                            ) : (
                              <Eye fontSize="var(--icon-fontSize-md)" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    {errors.currentPassword ? (
                      <FormHelperText>
                        {errors.currentPassword.message}
                      </FormHelperText>
                    ) : null}
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="newPassword"
                render={({ field }) => (
                  <FormControl
                    required
                    fullWidth
                    error={Boolean(errors.newPassword)}
                  >
                    <InputLabel>New password</InputLabel>
                    <OutlinedInput
                      {...field}
                      label="New password"
                      name="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      startAdornment={
                        <InputAdornment position="start">
                          <Key fontSize={'var(--icon-fontsize-md'} />
                        </InputAdornment>
                      }
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowNewPassword}
                            onMouseDown={handleMouseDownPassword}
                            onMouseUp={handleMouseUpPassword}
                            edge="end"
                          >
                            {showNewPassword ? (
                              <EyeSlash fontSize="var(--icon-fontSize-md)" />
                            ) : (
                              <Eye fontSize="var(--icon-fontSize-md)" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    {errors.newPassword ? (
                      <FormHelperText>
                        {errors.newPassword.message}
                      </FormHelperText>
                    ) : null}
                  </FormControl>
                )}
              />
            </Stack>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained">
              Update
            </Button>
          </CardActions>
        </Card>
      </form>
    </React.Fragment>
  );
});
