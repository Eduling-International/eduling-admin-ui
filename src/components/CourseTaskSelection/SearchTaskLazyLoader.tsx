'use client';

import { useTaskSelectionContext } from '@/contexts/TaskSelectionContext';
import {
  Box,
  Stack,
  Typography,
  TextField,
  CircularProgress,
} from '@mui/material';
import { HardDrive } from '@phosphor-icons/react';
import * as React from 'react';
import CategorySelector from './CategorySelector';
import InfiniteLoader from 'react-window-infinite-loader';
import { FixedSizeList } from 'react-window';
import TaskUIComponent from './TaskUIComponent';

const SearchTaskLazyLoader: React.FC = () => {
  const {
    onScrollDown,
    dispatchSearchParams,
    dispatchLazyLoader,
    totalTasks,
    isLoading,
    taskList,
    searchParams,
  } = useTaskSelectionContext();

  const onInputNameChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      dispatchSearchParams({
        type: 'CHANGE_TASK_NAME',
        payload: event.target.value,
      });
      dispatchLazyLoader({
        type: 'RESET',
      });
    },
    [],
  );

  return (
    <Stack>
      <Box display={'flex'} gap={1.5}>
        <HardDrive size={25} weight="bold" />
        <Typography
          sx={{ opacity: 0.8, letterSpacing: 0.5 }}
          fontWeight={'bold'}
          component="div"
        >
          Available tasks ({totalTasks})
        </Typography>
      </Box>
      <Stack
        direction={{
          xs: 'column',
          sm: 'row',
        }}
        spacing={2}
      >
        <Box flexGrow={8}>
          <Stack>
            <TextField
              placeholder="Search by name"
              fullWidth
              label="Task"
              margin="normal"
              name="TaskName"
              id="search-task-name"
              value={searchParams.name}
              onChange={onInputNameChange}
            />
          </Stack>
        </Box>
        <Box flexGrow={3} sx={{ maxWidth: 250, width: 250 }}>
          <CategorySelector />
        </Box>
      </Stack>
      <Stack>
        {isLoading && (
          <Box m={'auto'}>
            <CircularProgress />
          </Box>
        )}
        <Box mt={2}>
          {taskList.length > 0 && (
            <InfiniteLoader
              isItemLoaded={(index) => index < taskList.length}
              itemCount={taskList.length + 2}
              loadMoreItems={onScrollDown}
            >
              {({ onItemsRendered, ref }) => {
                return (
                  <React.Fragment>
                    {taskList.length > 0 && (
                      <FixedSizeList
                        height={400}
                        width={'100%'}
                        itemCount={taskList.length}
                        itemSize={120}
                        onItemsRendered={onItemsRendered}
                        ref={ref}
                      >
                        {(props) => (
                          <TaskUIComponent
                            {...props}
                            key={taskList[props.index]?.id}
                            data={taskList[props.index]}
                          />
                        )}
                      </FixedSizeList>
                    )}
                  </React.Fragment>
                );
              }}
            </InfiniteLoader>
          )}
        </Box>
      </Stack>
    </Stack>
  );
};

export default SearchTaskLazyLoader;
