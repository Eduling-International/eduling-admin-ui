'use client';

import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Checkbox,
  Box,
  ListItemText,
} from '@mui/material';
import { Info } from '@phosphor-icons/react/dist/ssr';
import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { courseLevels } from './config';

export const GeneralInfoForm: React.FC<{}> = React.memo(() => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Stack spacing={3}>
      <Box display="flex" gap={1.5}>
        <Info size={25} weight="bold" />
        <Typography
          component="div"
          sx={{ opacity: 0.8 }}
          letterSpacing={0.5}
          fontWeight={500}
        >
          General
        </Typography>
      </Box>
      <TextField
        label="Name"
        {...register('name', { required: true })}
        required
        type="text"
        fullWidth
        error={!!errors.name}
        name="name"
        helperText={(errors?.name?.message as string) ?? ''}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <FormControl required>
        <InputLabel id="course-levels-input">Levels</InputLabel>
        <Controller
          name="levels"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <Select
              multiple
              labelId="course-levels-input"
              value={field.value}
              onChange={(event) => field.onChange(event.target.value)}
              label="Levels"
              renderValue={(selected) => selected.join(', ')}
            >
              {courseLevels.map((level) => (
                <MenuItem key={level} value={level}>
                  <Checkbox checked={field.value.includes(level)} />
                  <ListItemText primary={level} />
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>
      <TextField
        label="Description"
        type="text"
        fullWidth
        {...register('description')}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <FormControlLabel
        control={
          <Controller
            name="visible"
            control={control}
            render={({ field }) => (
              <Checkbox
                {...register('visible')}
                checked={field.value}
                size="small"
              />
            )}
          />
        }
        label="Visible to users"
      />
    </Stack>
  );
});
