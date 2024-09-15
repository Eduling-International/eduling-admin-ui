'use client';

import * as React from 'react';
import {
  Stack,
  Divider,
  CardContent,
  Card,
  CardHeader,
  CardActions,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import { useCurrentUser } from '@/core/hooks';
import { Envelope, User } from '@phosphor-icons/react/dist/ssr';

export const UpdateInfoForm: React.FC = React.memo(() => {
  const { userInfo } = useCurrentUser();
  const handleClickUpdate = React.useCallback(() => {
    window.alert('This feature is coming soon!');
  }, []);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Card>
        <CardHeader subheader="Update user information" title="General" />
        <Divider />
        <CardContent>
          {userInfo && (
            <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
              <TextField
                name="name"
                label="Name"
                required
                type="text"
                fullWidth
                disabled
                value={userInfo.name}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <User fontSize="var(--icon-fontSize-md)" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                name="email"
                label="Email"
                required
                type="email"
                fullWidth
                disabled
                value={userInfo.email}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Envelope fontSize="var(--icon-fontSize-md)" />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          )}
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button onClick={handleClickUpdate} variant="contained">
            Save changes
          </Button>
        </CardActions>
      </Card>
    </form>
  );
});
