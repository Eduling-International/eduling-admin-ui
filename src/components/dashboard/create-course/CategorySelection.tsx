'use client';

import { CategoryService } from '@/api';
import { useImmediateApi } from '@/core/hooks/useApi';
import {
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { Check } from '@phosphor-icons/react/dist/ssr';
import React, { useMemo } from 'react';

interface CategorySelectionProps {
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({
  onChange,
  value,
}) => {
  const categoryService = useMemo(() => {
    return new CategoryService();
  }, []);
  const { data: categories } = useImmediateApi(() => categoryService.search());

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel id="category-selection">Category</InputLabel>
      <Select
        value={value}
        fullWidth
        label="Category"
        renderValue={(value) => {
          let selectedItem = (
            categories?.find((item) => item.id === value)?.name ?? 'All'
          ).slice(0, 27);
          return <Typography>{selectedItem}</Typography>;
        }}
        onChange={onChange}
      >
        <MenuItem value={` `}>All</MenuItem>
        {categories?.map(({ id, name }) => (
          <MenuItem key={id} value={id}>
            <ListItemText>{name}</ListItemText>
            {value === id && (
              <Typography>
                <Check weight="bold" color="var(--mui-palette-success-main)" />
              </Typography>
            )}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default React.memo(CategorySelection);
