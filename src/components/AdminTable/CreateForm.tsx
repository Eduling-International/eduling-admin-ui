import { AdminUserService } from '@/api';
import { useAdminTableContext } from '@/contexts/AdminTableContext';
import { usePopupStore } from '@/core/store';
import { RoleEnum } from '@/enum';
import { CreateAdminAccountBody } from '@/models';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  TextField,
} from '@mui/material';
import {
  Envelope,
  Eye,
  EyeSlash,
  IdentificationBadge,
  Key,
  Plus,
  User,
} from '@phosphor-icons/react/dist/ssr';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

const adminUserService = new AdminUserService();

const formSchema = zod.object({
  username: zod
    .string()
    .min(6, { message: 'Username is invalid. Must be 6-20 characters long.' })
    .max(20, { message: 'Username is invalid. Must be 6-20 characters long.' }),
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
  name: zod.string().min(1, { message: 'Name is required' }),
  email: zod.string().email({ message: 'Email is not valid' }),
  role: zod.enum([RoleEnum.CREATOR, RoleEnum.VIEWER], {
    message: 'Invalid role. Role can be CREATOR or VIEWER only.',
  }),
}) satisfies zod.ZodType<CreateAdminAccountBody>;

const CreateAdminUserForm: React.FC = React.memo(() => {
  const { toastSuccess } = usePopupStore();
  const { search } = useAdminTableContext();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      username: '',
      password: '',
      role: RoleEnum.VIEWER,
    } satisfies CreateAdminAccountBody,
    resolver: zodResolver(formSchema),
  });
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
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
  const openDialog = React.useCallback(() => {
    setIsDialogOpen(true);
    reset({
      name: '',
      email: '',
      username: '',
      password: '',
      role: RoleEnum.VIEWER,
    });
  }, []);
  const closeDialog = React.useCallback(() => setIsDialogOpen(false), []);
  const onSubmit = React.useCallback(async (values: CreateAdminAccountBody) => {
    const res = await adminUserService.create(values);
    if (res.data?.userId) {
      toastSuccess('Add new user successfully.');
      await search();
      closeDialog();
    }
  }, []);

  return (
    <React.Fragment>
      <Dialog onClose={closeDialog} fullWidth maxWidth="sm" open={isDialogOpen}>
        <DialogTitle>Add new admin user</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <FormControl
                  required
                  fullWidth
                  margin="normal"
                  error={Boolean(errors.name)}
                >
                  <InputLabel>Full name</InputLabel>
                  <OutlinedInput
                    {...field}
                    label="Full name"
                    type="text"
                    placeholder="Enter the full name"
                    startAdornment={
                      <InputAdornment position="start">
                        <User fontSize="var(--icon-fontSize-md)" />
                      </InputAdornment>
                    }
                  />
                  {errors.name ? (
                    <FormHelperText>{errors.name.message}</FormHelperText>
                  ) : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <FormControl
                  required
                  fullWidth
                  margin="normal"
                  error={Boolean(errors.email)}
                >
                  <InputLabel>Email</InputLabel>
                  <OutlinedInput
                    {...field}
                    label="Email"
                    type="email"
                    placeholder="Enter email"
                    startAdornment={
                      <InputAdornment position="start">
                        <Envelope fontSize="var(--icon-fontSize-md)" />
                      </InputAdornment>
                    }
                  />
                  {errors.email ? (
                    <FormHelperText>{errors.email.message}</FormHelperText>
                  ) : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="username"
              render={({ field }) => (
                <FormControl
                  required
                  fullWidth
                  margin="normal"
                  error={Boolean(errors.username)}
                >
                  <InputLabel>Username</InputLabel>
                  <OutlinedInput
                    {...field}
                    label="Username"
                    type="text"
                    placeholder="Enter unique username"
                    startAdornment={
                      <InputAdornment position="start">
                        <IdentificationBadge fontSize="var(--icon-fontSize-md)" />
                      </InputAdornment>
                    }
                  />
                  {errors.username ? (
                    <FormHelperText>{errors.username.message}</FormHelperText>
                  ) : null}
                </FormControl>
              )}
            />
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
                  <InputLabel>Password</InputLabel>
                  <OutlinedInput
                    {...field}
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    startAdornment={
                      <InputAdornment position="start">
                        <Key fontSize="var(--icon-fontSize-md)" />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                          edge="end"
                        >
                          {showPassword ? (
                            <EyeSlash fontSize="var(--icon-fontSize-md)" />
                          ) : (
                            <Eye fontSize="var(--icon-fontSize-md)" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {errors.password ? (
                    <FormHelperText>{errors.password.message}</FormHelperText>
                  ) : null}
                </FormControl>
              )}
            />
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Select Role"
                  fullWidth
                  error={!!errors.role}
                  helperText={errors.role ? errors.role.message : ''}
                  margin="normal"
                >
                  <MenuItem value="CREATOR">Creator</MenuItem>
                  <MenuItem value="VIEWER">Viewer</MenuItem>
                </TextField>
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={closeDialog}
              size="small"
              color="error"
            >
              Cancel
            </Button>
            <Button type="submit" size="small" color="info" variant="contained">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Button
        startIcon={<Plus fontSize="var(--icon-fontSize-md)" />}
        variant="contained"
        onClick={openDialog}
      >
        Add
      </Button>
    </React.Fragment>
  );
});

export default CreateAdminUserForm;
