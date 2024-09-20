'use client';

import { TaskService } from '@/api';
import useLazyFetch from '@/fetch/useLazyFetch';
import { ImportTaskBody } from '@/models';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@mui/material';
import {
  Bug,
  Check,
  Eraser,
  GearFine,
  UploadSimple,
} from '@phosphor-icons/react';
import { HttpStatusCode } from 'axios';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

const taskService = new TaskService();
const formSchema = zod.object({
  name: zod.string().min(1, { message: 'Sheet name is required' }),
  range: zod.string().nullable(),
  excludeHeader: zod.boolean(),
}) satisfies zod.ZodType<ImportTaskBody>;

export const ImportTaskDialog: React.FC = React.memo(() => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      range: null,
      excludeHeader: true,
    },
    resolver: zodResolver(formSchema),
  });
  const [importDialogOpen, setImportDialogOpen] = React.useState(false);
  const openImportDialog = React.useCallback(
    () => setImportDialogOpen(true),
    [],
  );
  const closeImportDialog = React.useCallback(
    () => setImportDialogOpen(false),
    [],
  );
  const [{ loading, error, data }, executeImportTask] = useLazyFetch(
    taskService.import,
  );
  const onSubmit = React.useCallback(async (values: ImportTaskBody) => {
    executeImportTask(values);
  }, []);

  return (
    <React.Fragment>
      <Dialog fullWidth maxWidth="sm" open={importDialogOpen}>
        <DialogTitle>Import tasks from Google Sheets</DialogTitle>
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
                  disabled={loading}
                >
                  <InputLabel>Sheet name</InputLabel>
                  <OutlinedInput
                    {...field}
                    label="Sheet name"
                    type="text"
                    placeholder="Enter the name of the sheet"
                  />
                  {errors.name ? (
                    <FormHelperText>{errors.name.message}</FormHelperText>
                  ) : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="range"
              render={({ field }) => (
                <TextField
                  {...field}
                  name="rage"
                  type="text"
                  label="Rage"
                  placeholder="Enter range of the sheet. Example: A2:L8"
                  fullWidth
                  disabled={loading}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">!</InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Controller
              control={control}
              name="excludeHeader"
              render={({ field }) => (
                <FormControlLabel
                  {...field}
                  label="Exclude header"
                  control={<Checkbox defaultChecked name="excludeHeader" />}
                  disabled={loading}
                />
              )}
            />
            <Box mb={2}>
              <Button
                onClick={() =>
                  reset({
                    name: '',
                    range: null,
                    excludeHeader: true,
                  })
                }
                size="small"
                endIcon={<Eraser />}
                color="secondary"
                variant="outlined"
                disabled={loading}
              >
                Reset
              </Button>
            </Box>
            {(data && !data.statusCode) ? (
              <Alert icon={<Check />} severity="success">
                Import task was succeed. Close and check !
              </Alert>
            ) : null}
            {(data?.statusCode && data?.statusCode !== HttpStatusCode.Ok) ? (
              <Alert icon={<Bug />} severity="error">
                {data?.message}
              </Alert>
            ) : null}
            {error && (
              <Alert icon={<Bug />} severity="error">
                {error}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button disabled={loading} onClick={closeImportDialog} size="small" color="error">
              Cancel
            </Button>
            <Button
              type="submit"
              size="small"
              endIcon={<GearFine />}
              color="info"
              variant="contained"
              disabled={loading}
            >
              Execute
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Button
        startIcon={<UploadSimple fontSize="var(--icon-fontSize-md)" />}
        variant="contained"
        onClick={openImportDialog}
      >
        Import Google Sheet
      </Button>
    </React.Fragment>
  );
});
