/**
 * @file GeneralInfoForm.tsx
 * @description UI component responsible of course general information.
 *
 * @author manhhnv
 */

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
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

const COURSE_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const GeneralInfoForm: React.FC<{}> = () => {
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
      />
      <TextField
        label="Description"
        type="text"
        fullWidth
        {...register('description')}
      />
      <FormControl>
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
              {COURSE_LEVELS.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={field.value.includes(name)} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          )}
        ></Controller>
      </FormControl>
      <FormControlLabel
        control={<Checkbox {...register('visible')} defaultChecked size="small" />}
        label="Visible to users"
      />
    </Stack>
  );
};

export default React.memo(GeneralInfoForm);
