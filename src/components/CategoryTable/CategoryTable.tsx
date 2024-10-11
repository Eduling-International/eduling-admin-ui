'use client';

import { useCategoryTableContext } from '@/contexts/CategoryTableContext';
import {
  Box,
  Button,
  Card,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { ArrowClockwise, Pencil } from '@phosphor-icons/react/dist/ssr';
import * as React from 'react';
import { CategoryMode } from './CategoryMode';
import { CreateCategoryForm } from './CreateCategoryForm';

export const CategoryTable: React.FC = React.memo(() => {
  const {
    categories,
    params,
    changeSearchParamsName,
    changeSearchparamsMode,
    resetSearchParams,
    isLoading,
    executeSearchCategory,
  } = useCategoryTableContext();

  const copyCategoryKeyHandler = React.useCallback((categoryKey: string) => {
    navigator.clipboard.writeText(categoryKey);
    window.alert('Copied!');
  }, []);

  const search = React.useCallback(() => {
    executeSearchCategory(params);
  }, [executeSearchCategory, params]);

  return (
    <React.Fragment>
      <Box display={'flex'} gap={1} my={1} mr={2} flexDirection="row-reverse">
        <Box>
          <Button
            startIcon={<ArrowClockwise fontSize="var(--icon-fontSize-md)" />}
            onClick={search}
            variant="outlined"
            size="small"
            color="success"
            disabled={isLoading}
          >
            Refresh
          </Button>
        </Box>
        <Box>
          <CreateCategoryForm />
        </Box>
      </Box>
      <Card>
        <Box
          sx={{
            maxWidth: '100%',
            overflow: 'auto',
          }}
        >
          <TableContainer component={Paper} sx={{ maxHeight: 550 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Unique Key</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Mode</TableCell>
                  <TableCell sx={{ maxWidth: 20 }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories?.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <Typography
                        fontSize={13}
                        fontWeight={'bold'}
                        letterSpacing={1}
                        sx={{
                          opacity: 0.5,
                          cursor: 'pointer',
                        }}
                        onClick={copyCategoryKeyHandler.bind(
                          null,
                          category.key,
                        )}
                      >
                        {category.key}
                      </Typography>
                    </TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>
                      <CategoryMode mode={category.mode} />
                    </TableCell>
                    <TableCell>
                      <Button size="small" startIcon={<Pencil />}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Card>
    </React.Fragment>
  );
});
