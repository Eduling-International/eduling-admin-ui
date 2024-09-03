'use client';

import { LoginBody } from '@/models';
import { paths } from '@/paths';
import { useAuthStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { getSession, signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z as zod } from 'zod';
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';

// Form validation
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
}) satisfies zod.ZodType<LoginBody>;

// Initialization value
const defaultValues: LoginBody = {
  username: '',
  password: '',
};

const SignInForm: React.FC<{}> = () => {
  const [isBusy, setIsBusy] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const { setSession } = useAuthStore();
  const router = useRouter();
  const { status: authStatus } = useSession();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginBody>({ defaultValues, resolver: zodResolver(formSchema) });

  const toggleShowPassword = useCallback(() => {
    setIsShowPassword((currentState) => !currentState);
  }, []);

  const handleSignIn = useCallback(
    async (values: LoginBody) => {
      setIsBusy(true);
      const res = await signIn('credentials', {
        ...values,
        redirect: false,
      });
      if (!res?.ok) {
        setError('root', {
          type: 'server',
          message: res?.error ?? 'Username or password incorrect.',
        });
      } else {
        const session = await getSession();
        setSession(session?.user);
      }
      setIsBusy(false);
    },
    [setError, setSession],
  );

  const onSubmit = useCallback(
    async (values: LoginBody) => {
      await handleSignIn(values);
    },
    [handleSignIn],
  );

  useEffect(() => {
    if (authStatus === 'authenticated') {
      router.push(paths.dashboard.overview);
      router.refresh();
    }
  }, [authStatus, router]);

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4">Sign in Eduling Dashboard</Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="username"
            render={({ field }) => (
              <FormControl error={Boolean(errors.username)}>
                <InputLabel>Username</InputLabel>
                <OutlinedInput
                  {...field}
                  label="Username"
                  type="text"
                  required={true}
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
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  {...field}
                  endAdornment={
                    isShowPassword ? (
                      <EyeIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={toggleShowPassword}
                      />
                    ) : (
                      <EyeSlashIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={toggleShowPassword}
                      />
                    )
                  }
                  label="Password"
                  type={isShowPassword ? 'text' : 'password'}
                  required={true}
                />
                {errors.password ? (
                  <FormHelperText>{errors.password.message}</FormHelperText>
                ) : null}
              </FormControl>
            )}
          />
          {errors.root ? (
            <Alert color="error">{errors.root.message}</Alert>
          ) : null}
          <Button disabled={isBusy} type="submit" variant="contained">
            Sign in
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default React.memo(SignInForm);
