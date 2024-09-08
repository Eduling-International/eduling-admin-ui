'use client';

import { CategoryService } from '@/api';
import { useTaskSelectionContext } from '@/contexts/TaskSelectionContext';
import { useFetch } from '@/fetch/useFetch';
import {
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { Check } from '@phosphor-icons/react';
import * as React from 'react';

const categoryService = new CategoryService();
const maxLengthDisplay = 27;

const CategorySelector: React.FC = React.memo(() => {
  const {
    searchParams: { categoryId },
    dispatchSearchParams,
    dispatchLazyLoader,
  } = useTaskSelectionContext();
  const { data: listCategory } = useFetch(categoryService.search);

  const renderSelectedValue = React.useCallback(
    (selectedValue: string) =>
      listCategory
        ?.find((category) => category.id === selectedValue)
        ?.name.slice(0, maxLengthDisplay) ?? 'All',
    [listCategory],
  );
  const checkSelected = React.useCallback(
    (selectedValue: string) => selectedValue === categoryId,
    [categoryId],
  );
  const onSelectCategory = React.useCallback(
    (event: SelectChangeEvent<string>) => {
      dispatchSearchParams({
        type: 'CHANGE_CATEGORY',
        payload: event.target.value,
      });
      dispatchLazyLoader({ type: 'RESET' });
    },
    [],
  );

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel id="category-selector">Category</InputLabel>
      <Select
        value={categoryId ?? ` `}
        fullWidth
        labelId="category-selector"
        label="Category"
        renderValue={renderSelectedValue}
        onChange={onSelectCategory}
      >
        <MenuItem value={` `}>All</MenuItem>
        {listCategory?.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            <ListItemText>{category.name}</ListItemText>
            {checkSelected(category.id) && (
              <Typography variant="body2">
                <Check weight="bold" color="var(--mui-palette-success-main)" />
              </Typography>
            )}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});

export default CategorySelector;
