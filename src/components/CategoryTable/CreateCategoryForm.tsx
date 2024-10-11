'use client';

import { z as zod } from 'zod';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
} from '@mui/material';
import { Plus } from '@phosphor-icons/react/dist/ssr';
import * as React from 'react';
import { CreateCategoryBody } from '@/models';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useLazyFetch from '@/fetch/useLazyFetch';
import { CategoryService } from '@/api';
import { useCategoryTableContext } from '@/contexts/CategoryTableContext';
import { usePopupStore } from '@/core/store';

const categoryService = new CategoryService();

const formSchema = zod.object({
  name: zod.string().min(1, 'Name is required'),
  mode: zod.enum(['NORMAL', 'SOLO', 'AI_DUO'], {
    message: 'Invalid mode',
  }),
}) satisfies zod.ZodType<CreateCategoryBody>;

export const CreateCategoryForm: React.FC = () => {
  const { toastSuccess } = usePopupStore();
  const { executeSearchCategory, params } = useCategoryTableContext();
  const [isOpen, setIsOpen] = React.useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      mode: 'NORMAL',
    } satisfies CreateCategoryBody,
    resolver: zodResolver(formSchema),
  });
  const [{ data, loading }, executeCreateCategory] = useLazyFetch(
    categoryService.create,
  );

  const closeDialog = React.useCallback(() => {
    setIsOpen(false);
    reset({
      name: '',
      mode: 'NORMAL',
    });
  }, [reset]);
  const openDialog = React.useCallback(() => {
    setIsOpen(true);
  }, []);
  const onSubmit = React.useCallback(
    async (values: CreateCategoryBody) => {
      await executeCreateCategory(values);
    },
    [executeCreateCategory],
  );

  React.useEffect(() => {
    if (data) {
      closeDialog();
      executeSearchCategory(params);
      toastSuccess('Create category success');
    }
  }, [data]);

  return (
    <React.Fragment>
      <Button
        startIcon={<Plus fontSize="var(--icon-fontSize-md)" />}
        variant="contained"
        size="small"
        onClick={openDialog}
      >
        Add
      </Button>
      <Dialog fullWidth maxWidth="sm" open={isOpen}>
        <DialogTitle>Create new category</DialogTitle>
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
                  <InputLabel>Name</InputLabel>
                  <OutlinedInput
                    {...field}
                    label="Name"
                    type="text"
                    placeholder="Enter category name"
                  />
                  {errors.name ? (
                    <FormHelperText>{errors.name.message}</FormHelperText>
                  ) : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="mode"
              render={({ field }) => (
                <FormControl {...field} margin="normal">
                  <FormLabel>Mode</FormLabel>
                  <RadioGroup defaultValue="NORMAL" name="radio-buttons-group">
                    <FormControlLabel
                      value="NORMAL"
                      control={<Radio />}
                      label="Normal"
                    />
                    <FormControlLabel
                      value="SOLO"
                      control={<Radio />}
                      label="Solo"
                    />
                    <FormControlLabel
                      value="AI_DUO"
                      control={<Radio />}
                      label="AI Duo"
                    />
                  </RadioGroup>
                </FormControl>
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={closeDialog}
              color="error"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              disabled={loading}
              type="submit"
              color="info"
              variant="contained"
            >
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
};
