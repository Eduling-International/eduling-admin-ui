'use client';

import * as React from 'react';
import { TaskFilter } from './TaskFilter';
import {
  Box,
  Card,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { useTaskTableContext } from '@/contexts/TaskTableContext/Provider';
import Image from 'next/image';
import TaskLevelComponent from '@/components/CourseTaskSelection/TaskLevelComponent';
import { TaskAge } from './TaskAge';
import { CategoryMode } from './CategoryMode';

export const TaskTable: React.FC = React.memo(() => {
  const { tasks, totalItems, params, changePageSearchParams } =
    useTaskTableContext();
  const onPageChange = React.useCallback(
    (_: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
      changePageSearchParams(page + 1);
    },
    [],
  );

  return (
    <React.Fragment>
      <TaskFilter />
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
                  <TableCell>Unique ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Level</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Mode</TableCell>
                  <TableCell>Plays</TableCell>
                  <TableCell sx={{ maxWidth: 20 }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks?.map((task) => (
                  <TableRow key={task.key}>
                    <TableCell>
                      <Typography
                        fontSize={13}
                        fontWeight={'bold'}
                        letterSpacing={1}
                        sx={{
                          opacity: 0.5,
                        }}
                      >
                        {task.key}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack
                        sx={{ alignItems: 'center' }}
                        direction="row"
                        spacing={2}
                      >
                        <Image
                          style={{
                            borderRadius: 5,
                          }}
                          alt={task.name}
                          width={60}
                          height={60}
                          src={task.coverPicture}
                        />
                        <Typography variant="subtitle1">{task.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <TaskLevelComponent value={task.level} />
                    </TableCell>
                    <TableCell>
                      <TaskAge minAge={task.minAge} maxAge={task.maxAge} />
                    </TableCell>
                    <TableCell>{task.category.name}</TableCell>
                    <TableCell>
                      <CategoryMode mode={task.category.mode} />
                    </TableCell>
                    <TableCell>
                      <b>{task.numberOfPlays}</b> play
                      {task.numberOfPlays > 1 ? 's' : ''}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Divider />
        <TablePagination
          component={'div'}
          count={totalItems}
          page={params.currentPage - 1}
          rowsPerPage={100}
          onPageChange={onPageChange}
          showLastButton
          showFirstButton
          rowsPerPageOptions={[100]}
        />
      </Card>
    </React.Fragment>
  );
});
