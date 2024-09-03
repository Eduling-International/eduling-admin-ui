'use client';

import React, { useCallback, useEffect, useMemo, useReducer } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material';
import { CategorySelection } from '../categories';
import { useState } from 'react';
import { useLazyApi } from '@/core/hooks/useApi';
import { TaskService } from '@/api';
import { SearchTaskParams, Task } from '@/models';
import { useDebounce } from '@/core/hooks';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import TaskLazyLoaderItem from './TaskLazyLoaderItem';

interface IncreasePageAction {
  type: 'increasePage';
  payload: number;
}

interface ChooseCategoryAction {
  type: 'chooseCategory';
  payload: string;
}

interface InputTaskNameChangeAction {
  type: 'changeInputTaskName';
  payload: string;
}

type Action =
  | InputTaskNameChangeAction
  | ChooseCategoryAction
  | IncreasePageAction;

const reducer = (state: SearchTaskParams, action: Action): SearchTaskParams => {
  switch (action.type) {
    case 'changeInputTaskName':
      return {
        ...state,
        name: action.payload,
        currentPage: 1,
      };
    case 'chooseCategory':
      return {
        ...state,
        categoryId: action.payload,
        currentPage: 1,
      };
    case 'increasePage':
      return {
        ...state,
        currentPage: action.payload,
      };
    default:
      return { ...state };
  }
};

const TaskLazyLoader = () => {
  const [params, dispatch] = useReducer(reducer, {
    name: '',
    categoryId: ' ',
    currentPage: 1,
  } satisfies SearchTaskParams);
  const [displayTasks, setDisplayTasks] = useState<Task[]>([]);
  const taskService = useMemo(() => new TaskService(), []);
  const fetchTasks = useCallback((params: SearchTaskParams) => {
    return taskService.search(params);
  }, []);
  const [{ loading, data }, execute] = useLazyApi(fetchTasks);
  useDebounce(params, 1000, execute);

  const onCategoryChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      dispatch({ type: 'chooseCategory', payload: event.target.value });
      setDisplayTasks([]);
    },
    [dispatch, setDisplayTasks],
  );

  const onInputTaskNameChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      dispatch({ type: 'changeInputTaskName', payload: event.target.value });
      setDisplayTasks([]);
    },
    [dispatch, setDisplayTasks],
  );

  const loadMore = () => {
    if (loading || !data?.pagination) {
      return;
    }
    const pagination = data.pagination;
    if (pagination.currentPage >= pagination.totalPages) {
      return;
    }
    dispatch({ type: 'increasePage', payload: params.currentPage + 1 });
  };

  useEffect(() => { 
    const tasks = data?.tasks;
    const newDisplayTasks = [...displayTasks];
    if (tasks && tasks.length > 0) {
      tasks.forEach((task) => {
        if (!newDisplayTasks.find((item) => item.id === task.id)) {
          newDisplayTasks.push(task);
        }
      });
      setDisplayTasks(newDisplayTasks);
    }
  }, [data]);

  return (
    <Stack>
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
              value={params.name}
              onChange={onInputTaskNameChange}
            />
          </Stack>
        </Box>
        <Box flexGrow={3} sx={{ maxWidth: 250, width: 250 }}>
          <CategorySelection
            value={params.categoryId ?? ''}
            onChange={onCategoryChange}
          />
        </Box>
      </Stack>
      <Stack>
        <Box>
                  {displayTasks && (
            <InfiniteLoader
              isItemLoaded={(index) => index < displayTasks.length}
              itemCount={displayTasks.length + 1}
              loadMoreItems={loadMore}
            >
              {({ onItemsRendered, ref }) => {
                return (
                  <React.Fragment>
                    {displayTasks.length > 0 && (
                      <FixedSizeList
                        height={400}
                        width={'100%'}
                        itemCount={displayTasks.length + 1}
                        itemSize={120}
                        onItemsRendered={onItemsRendered}
                        ref={ref}
                      >
                        {(props) => (
                          <TaskLazyLoaderItem
                            {...props}
                            key={displayTasks[props.index]?.id}
                            data={displayTasks[props.index]}
                            rightComponent={
                              <Button size="small" variant="contained">
                                Add
                              </Button>
                            }
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
        {loading && (
          <Box m={'auto'}>
            <CircularProgress size="small" color="info" />
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

export default React.memo(TaskLazyLoader);
