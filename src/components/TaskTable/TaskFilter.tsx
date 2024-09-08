'use client';

import { useTaskTableContext } from '@/contexts/TaskTableContext/Provider';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  NativeSelect,
  Stack,
  TextField,
} from '@mui/material';
import { ArrowCounterClockwise, Faders } from '@phosphor-icons/react';
import * as React from 'react';
import lodash from 'lodash';

export const TaskFilter: React.FC = React.memo(() => {
  const {
    listCategory,
    params,
    resetSearchParams,
    changeCategorySearchParams,
    changeNameSearchParams,
  } = useTaskTableContext();
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
  const openFilterDialog = React.useCallback(() => {
    setFilterDialogOpen(true);
  }, [params]);
  const closeFilterDialog = React.useCallback(
    () => setFilterDialogOpen(false),
    [],
  );
  const handleClickReset = React.useCallback(() => {
    const isNoChange = lodash.isEqual(params, {
      name: '',
      categoryId: ` `,
      currentPage: 1,
    });
    if (isNoChange) return;
    resetSearchParams();
  }, [params]);
  const onCategoryChange = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      changeCategorySearchParams(event.target.value);
    },
    [],
  );
  const onInputNameChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      changeNameSearchParams(event.target.value);
    },
    [],
  );

  return (
    <React.Fragment>
      <Dialog fullWidth maxWidth="sm" open={filterDialogOpen}>
        <DialogTitle>Filter tasks</DialogTitle>
        <DialogContent>
          <Stack
            direction={{
              xs: 'column',
              sm: 'row',
            }}
            spacing={2}
          >
            <Box flexGrow={8}>
              <TextField
                name="name"
                type="text"
                label="Name"
                fullWidth
                margin="normal"
                variant="standard"
                onChange={onInputNameChange}
                value={params.name ?? ''}
              />
            </Box>
            <Box
              flexGrow={3}
              sx={{
                maxWidth: {
                  lg: 250,
                  md: 250,
                  sm: '100%',
                  xs: '100%',
                },
                width: {
                  lg: 250,
                  md: 250,
                  sm: '100%',
                  xs: '100%',
                },
              }}
            >
              <FormControl fullWidth margin="normal">
                <InputLabel variant="standard" htmlFor="category-selector">
                  Category
                </InputLabel>
                <NativeSelect
                  defaultValue={` `}
                  inputProps={{
                    name: 'category',
                    id: 'category-selector',
                  }}
                  value={params.categoryId}
                  onChange={onCategoryChange}
                >
                  <option value={` `}>All</option>
                  {listCategory.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </NativeSelect>
              </FormControl>
            </Box>
          </Stack>
          <Box mt={2}>
            <Button
              size="small"
              color="secondary"
              endIcon={<ArrowCounterClockwise />}
              variant="outlined"
              onClick={handleClickReset}
            >
              Reset
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeFilterDialog}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        sx={{ width: 'fit-content' }}
        color="primary"
        variant="outlined"
        endIcon={<Faders />}
        onClick={openFilterDialog}
      >
        Filter
      </Button>
    </React.Fragment>
  );
});
