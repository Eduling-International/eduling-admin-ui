/**
 * @file TasksSelection.tsx
 * @description UI component responsible of lazy load tasks in system and select add to course.
 *
 * @author manhhnv
 */

'use client';

import { CourseTaskService, TaskService } from '@/api';
import { useDebounce } from '@/core/hooks';
import { useLazyApi } from '@/core/hooks/useApi';
import { usePopupStore } from '@/core/store';
import { SearchTaskParams, SearchTaskResponse, Task } from '@/models';
import {
  Box,
  Card,
  CircularProgress,
  Grid,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import CategorySelection from './CategorySelection';
import TaskComponent from './TaskComponent';
import ListSelectedTask from './ListSelectedTask';
import { HardDrive } from '@phosphor-icons/react/dist/ssr';
import { DropResult } from 'react-beautiful-dnd';
import lodash from 'lodash';
import { useFormContext } from 'react-hook-form';

interface TasksSelectionProps {
  tasks: Task[];
  courseId: string;
}

interface TasksSelectionState {
  data: Task[];
  hasNextPage: boolean;
  itemCount: number;
  selectedTasks: Task[];
}

interface BaseAction<P> {
  type: string;
  payload: P;
}

interface ResetTaskAction extends BaseAction<null> {
  type: 'reset';
}

interface AppendSearchResultAction extends BaseAction<SearchTaskResponse> {
  type: 'append';
}

type TasksSelectionAction = ResetTaskAction | AppendSearchResultAction;

interface NextPageAction extends BaseAction<number> {
  type: 'nextPage';
}

interface ChangeCategoryAction extends BaseAction<string> {
  type: 'changeCategory';
}

interface ChangeTaskName extends BaseAction<string> {
  type: 'changeTaskName';
}

type SearchParamsAction =
  | NextPageAction
  | ChangeCategoryAction
  | ChangeTaskName;

const initialValue: TasksSelectionState = {
  data: [],
  hasNextPage: false,
  itemCount: 0,
  selectedTasks: [],
};

const searchParams: SearchTaskParams = {
  name: '',
  categoryId: '',
  currentPage: 1,
};

const reducer = (
  state: TasksSelectionState,
  action: TasksSelectionAction,
): TasksSelectionState => {
  switch (action.type) {
    case 'reset':
      return initialValue;
    case 'append': {
      const { tasks, pagination } = action.payload;
      const tasksLength = tasks.length;
      if (tasksLength) {
        const hasNextPage = pagination.currentPage < pagination.totalPages;
        const itemCount =
          tasksLength + state.data.length + (hasNextPage ? 2 : 0);
        return {
          ...state,
          data: state.data.concat(tasks),
          hasNextPage: hasNextPage,
          itemCount: itemCount,
        };
      } else {
        return {
          ...state,
          hasNextPage: false,
        };
      }
    }
    default:
      return state;
  }
};

const searchPramsReducer = (
  state: SearchTaskParams,
  action: SearchParamsAction,
): SearchTaskParams => {
  switch (action.type) {
    case 'changeTaskName':
      return {
        ...state,
        name: action.payload,
        currentPage: 1,
      };
    case 'changeCategory':
      return {
        ...state,
        categoryId: action.payload,
        currentPage: 1,
      };
    case 'nextPage':
      return {
        ...state,
        currentPage: action.payload,
      };
    default:
      return {
        ...state,
      };
  }
};

const TasksSelection: React.FC<TasksSelectionProps> = ({ tasks, courseId }) => {
  const { toast } = usePopupStore();
  const taskService = useMemo(() => new TaskService(), []);
  const courseTaskService = useMemo(
    () => new CourseTaskService(courseId),
    [courseId],
  );
  const [result, dispatchResult] = useReducer(reducer, initialValue);
  const [params, dispatchParams] = useReducer(searchPramsReducer, searchParams);
  const [selectedTasks, setSelectedTasks] = useState(tasks);
  const { setValue } = useFormContext();

  const fetchTasks = useCallback(
    (params: SearchTaskParams) => {
      return taskService.search(params);
    },
    [taskService],
  );
  const onTaskNameChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      dispatchParams({ type: 'changeTaskName', payload: event.target.value });
      dispatchResult({ type: 'reset', payload: null });
    },
    [dispatchParams, dispatchResult],
  );
  const onCategoryChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      dispatchParams({ type: 'changeCategory', payload: event.target.value });
      dispatchResult({ type: 'reset', payload: null });
    },
    [dispatchParams, dispatchResult],
  );
  const onSelectTask = useCallback(
    (taskId: string, locked: boolean) => {
      const task = result.data.find((item) => item.id === taskId);
      if (task && !selectedTasks.some((item) => item.id === taskId)) {
        task.locked = locked;
        setSelectedTasks((prevItems) => [...prevItems, task]);
      } else {
        toast(`'${task?.name}' already in course.`, 'warning');
      }
    },
    [result.data, selectedTasks, courseTaskService],
  );

  const handleDrag = useCallback(
    (result: DropResult) => {
      const selectedTasksCopy = lodash.cloneDeep(selectedTasks);
      if (selectedTasksCopy.length === 0) return;
      const { source, destination } = result;
      if (!destination) return;
      const sourceIndex = source.index;
      const destinationIndex = destination.index;
      if (sourceIndex === destinationIndex) return;
      const isMoveDown = destinationIndex > sourceIndex;
      const lastIndex = selectedTasksCopy.length - 1;
      if (lastIndex < sourceIndex || lastIndex < destinationIndex) return;
      const movingItemCopy = lodash.cloneDeep(selectedTasks[sourceIndex]);
      if (isMoveDown) {
        for (let i = sourceIndex; i < destinationIndex; i++) {
          selectedTasksCopy[i] = selectedTasksCopy[i + 1];
        }
      } else {
        for (let i = sourceIndex; i > destinationIndex; i--) {
          selectedTasksCopy[i] = selectedTasksCopy[i - 1];
        }
      }
      selectedTasksCopy[destinationIndex] = movingItemCopy;
      setSelectedTasks(selectedTasksCopy);
    },
    [selectedTasks, setSelectedTasks],
  );

  const onUnselectTask = useCallback(
    (id: string) => {
      setSelectedTasks((prevItems) =>
        prevItems.filter((item) => item.id !== id),
      );
    },
    [setSelectedTasks],
  );

  const lockTaskPremium = useCallback((id: string) => {
    setSelectedTasks((prevItems) => {
      const index = prevItems.findIndex((item) => item.id === id);
      if (index !== -1) {
        prevItems[index].locked = true;
      }
      return [...prevItems];
    });
  }, []);

  const unlockTaskOpen = useCallback((id: string) => {
    setSelectedTasks((prevItems) => {
      const index = prevItems.findIndex((item) => item.id === id);
      if (index !== -1) {
        prevItems[index].locked = false;
      }
      return [...prevItems];
    });
  }, []);

  const [response, executeApi] = useLazyApi(fetchTasks);
  useDebounce(params, 1000, executeApi);

  const loadMoreItems = () => {
    if (result.hasNextPage) {
      dispatchParams({ type: 'nextPage', payload: params.currentPage + 1 });
    }
  };

  useEffect(() => {
    if (response?.data) {
      dispatchResult({ type: 'append', payload: response.data });
    }
  }, [response?.data]);

  useEffect(() => {
    const taskArray = selectedTasks.map((task) => ({
      key: task.key,
      locked: task.locked ?? false,
    }));
    setValue('tasks', taskArray);
  }, [selectedTasks]);

  useEffect(() => {
    setSelectedTasks(tasks);
  }, [tasks]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={7} lg={7}>
        <Card sx={{ p: 3 }}>
          <Stack>
            <Box display={'flex'} gap={1.5}>
              <HardDrive size={25} weight="bold" />
              <Typography
                sx={{ opacity: 0.8, letterSpacing: 0.5 }}
                fontWeight={'bold'}
                component="div"
              >
                Available tasks ({response?.data?.pagination?.totalItems})
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
                    value={params.name}
                    onChange={onTaskNameChange}
                  />
                </Stack>
              </Box>
              <Box flexGrow={3} sx={{ maxWidth: 250, width: 250 }}>
                <CategorySelection
                  value={params.categoryId || ` `}
                  onChange={onCategoryChange}
                />
              </Box>
            </Stack>
            <Stack>
              {response.loading && (
                <Box m={'auto'}>
                  <CircularProgress />
                </Box>
              )}
              <Box mt={2}>
                {result.data && (
                  <InfiniteLoader
                    isItemLoaded={(index) => index < result.data.length}
                    itemCount={result.itemCount}
                    loadMoreItems={loadMoreItems}
                  >
                    {({ onItemsRendered, ref }) => {
                      return (
                        <React.Fragment>
                          {result.data.length > 0 && (
                            <FixedSizeList
                              height={400}
                              width={'100%'}
                              itemCount={result.itemCount}
                              itemSize={120}
                              onItemsRendered={onItemsRendered}
                              ref={ref}
                            >
                              {(props) => (
                                <TaskComponent
                                  {...props}
                                  key={result.data[props.index]?.id}
                                  data={result.data[props.index]}
                                  onSelectTask={onSelectTask}
                                  courseId={courseId}
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
        </Card>
      </Grid>
      <Grid item xs={12} sm={12} md={5} lg={5}>
        <Card sx={{ p: 3 }}>
          <ListSelectedTask
            handleDrag={handleDrag}
            tasks={selectedTasks}
            courseId={courseId}
            undo={onUnselectTask}
            lock={lockTaskPremium}
            unlock={unlockTaskOpen}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default React.memo(TasksSelection);
