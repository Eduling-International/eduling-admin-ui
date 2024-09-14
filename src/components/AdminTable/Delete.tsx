import { useAdminTableContext } from '@/contexts/AdminTableContext';
import { useAdminUserMenuContext } from '@/contexts/AdminUserMenuContext';
import {
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  DialogContentText,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';
import * as React from 'react';
import lodash from 'lodash';
import { AdminUserService } from '@/api';
import useLazyFetch from '@/fetch/useLazyFetch';
import { z as zod } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RequirePasswordBody } from '@/models';
import { usePopupStore } from '@/core/store';

// 管理者のAPIサービス
const adminUserService = new AdminUserService();

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

const DeleteAdminUser: React.FC = React.memo(() => {
  const { toastSuccess } = usePopupStore();
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
  const { setAdminUsers } = useAdminTableContext();
  const { userInfo, handleCloseMenu } = useAdminUserMenuContext();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const deleteAdminUser = React.useCallback(
    async (data: RequirePasswordBody) => {
      const res = await adminUserService._delete(userInfo.id, data);
      if (res.data?.affectedRows === 1) {
        setAdminUsers((adminUsers) => {
          return adminUsers.filter((user) => user.id !== userInfo.id);
        });
        handleCloseDialog();
        toastSuccess("The user has been deleted.");
      }
      return res;
    },
    [userInfo],
  );
  const [{ loading }, executeDeleteAdminUser] = useLazyFetch(deleteAdminUser);

  const onSubmit = React.useCallback(async (values: RequirePasswordBody) => {
    await executeDeleteAdminUser({
      password: btoa(values.password),
    });
  }, []);
  const handleOpenDialog = React.useCallback(() => {
    reset({ password: '' });
    setIsDialogOpen(true);
  }, []);
  const handleCloseDialog = React.useCallback(() => {
    setIsDialogOpen(false);
    handleCloseMenu();
  }, []);

  return (
    <React.Fragment>
      <MenuItem onClick={handleOpenDialog} disabled={userInfo.archived}>
        Delete
      </MenuItem>
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm delete?</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <DialogContent>
            <DialogContentText>
              The user{' '}
              <b>
                <i>{userInfo.username}</i>
              </b>{' '}
              will be deleted from system, you{' '}
              <b>
                <i style={{ color: 'red' }}>CANNOT</i>
              </b>{' '}
              undo this action.
            </DialogContentText>
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
          </DialogContent>
          <DialogActions>
            <Button size="small" variant="outlined" onClick={handleCloseDialog}>
              Disagree
            </Button>
            <Button
              disabled={loading}
              size="small"
              variant="contained"
              color="primary"
              type="submit"
              autoFocus
            >
              Agree
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
});

export default DeleteAdminUser;
