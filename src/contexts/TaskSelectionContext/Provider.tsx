'use client';

import { SearchTaskParams, SearchTaskResponse, Task } from '@/models';
import * as React from 'react';
import lodash from 'lodash';
import { TaskService } from '@/api';
import useLazyFetch from '@/fetch/useLazyFetch';
import { useDebounce } from '@/core/hooks';
import { usePopupStore } from '@/core/store';
import { DropResult } from 'react-beautiful-dnd';

export interface TaskSelectionContextType {
  taskList: Task[];
  totalTasks: number;
  isLoading: boolean;
  courseTasks: Task[];
  searchParams: SearchTaskParams;
  currentCourseId?: string;
  enableConfirmDialog?: boolean;
  enableRearrangeAll?: boolean;
  dispatchSearchParams: React.Dispatch<SearchParamsAction>;
  dispatchLazyLoader: (value: ListTaskLazyLoaderAction) => void;
  onScrollDown: () => void;
  clickAddHandler: (key: string, isLocked?: boolean) => void;
  clickUndoHandler: (key: string) => void;
  clickLockHandler: (key: string) => void;
  clickUnlockHandler: (key: string) => void;
  rearrangeHandler: (result: DropResult) => void;
}

export interface TaskSelectionProviderProps {
  courseTasks: Task[];
  onClickAddCallback?: (key: string, isLocked?: boolean) => void;
  onClickUndoCallback?: (key: string) => void;
  onChangeAccessibilityCallback?: (key: string, isLocked: boolean) => void;
  onRearrangeCallback?: (
    afterRearrange: Task[],
    targetItem?: Task,
    newOrder?: number,
  ) => void;
  children?: React.ReactNode;
  currentCourseId?: string;
  enableConfirmDialog?: boolean;
  enableRearrangeAll?: boolean;
}

// Define reducers

export interface ListTaskLazyLoaderType {
  loadedTasks: Task[];
  hasNextPage: boolean;
  itemCount: number;
}

export interface ResetDataLazyLoaderAction {
  type: 'RESET';
}

export interface AppendDataLazyLoaderAction {
  type: 'APPEND';
  payload: SearchTaskResponse;
}

export type ListTaskLazyLoaderAction =
  | ResetDataLazyLoaderAction
  | AppendDataLazyLoaderAction;

const lazyLoaderReducer = (
  prevState: ListTaskLazyLoaderType,
  action: ListTaskLazyLoaderAction,
): ListTaskLazyLoaderType => {
  switch (action.type) {
    case 'RESET':
      return {
        loadedTasks: [],
        hasNextPage: true,
        itemCount: 0,
      };
    case 'APPEND': {
      const newListTask = lodash.uniqBy(
        [...prevState.loadedTasks, ...action.payload.tasks],
        'id',
      );
      return {
        loadedTasks: newListTask,
        hasNextPage:
          action.payload.pagination.currentPage <
          action.payload.pagination.totalPages,
        itemCount: newListTask.length,
      };
    }
    default:
      // no change
      return prevState;
  }
};

export interface NextPageAction {
  type: 'NEXT_PAGE';
}

export interface ChangeCategoryAction {
  type: 'CHANGE_CATEGORY';
  payload: string;
}

export interface ChangeTaskNameAction {
  type: 'CHANGE_TASK_NAME';
  payload: string;
}

export type SearchParamsAction =
  | NextPageAction
  | ChangeCategoryAction
  | ChangeTaskNameAction;

const searchParamsReducer = (
  prevState: SearchTaskParams,
  action: SearchParamsAction,
): SearchTaskParams => {
  switch (action.type) {
    case 'NEXT_PAGE':
      return {
        ...prevState,
        currentPage: prevState.currentPage + 1,
      };
    case 'CHANGE_CATEGORY':
      return {
        ...prevState,
        categoryId: action.payload,
        currentPage: 1,
      };
    case 'CHANGE_TASK_NAME':
      return {
        ...prevState,
        name: action.payload,
        currentPage: 1,
      };
    default:
      // no change
      return prevState;
  }
};

export const TaskSelectionContext =
  React.createContext<TaskSelectionContextType>({} as TaskSelectionContextType);

export const useTaskSelectionContext = () =>
  React.useContext(TaskSelectionContext);

export const TaskSelectionProvider: React.FC<TaskSelectionProviderProps> = React.memo(({
  children,
  enableConfirmDialog,
  currentCourseId,
  enableRearrangeAll,
  ...props
}) => {
  const { toastError } = usePopupStore();
  const [courseTasks, setCourseTasks] = React.useState<Task[]>(props.courseTasks);
  const [lazyLoaderValue, dispatchLazyLoader] = React.useReducer(
    lazyLoaderReducer,
    {
      loadedTasks: [],
      hasNextPage: true,
      itemCount: 0,
    } satisfies ListTaskLazyLoaderType,
  );
  const [searchParamsValue, dispatchSearchParams] = React.useReducer(
    searchParamsReducer,
    {
      currentPage: 1,
      categoryId: ` `,
      name: '',
    } satisfies SearchTaskParams,
  );
  const taskService = React.useMemo(() => new TaskService(), []);
  const [{ data: receiveTasks, loading: isLoading }, loadTasksFromAPI] =
    useLazyFetch(taskService.search);
  // Execute loadTasksFromAPI when searchParamsValue changes after 1000ms
  useDebounce(searchParamsValue, 1000, loadTasksFromAPI);

  const onScrollDown = React.useCallback(() => {
    // 次のページあるか判定する、ある場合は `NEXT_PAGE`アクション実行する
    if (lazyLoaderValue.hasNextPage) {
      dispatchSearchParams({ type: 'NEXT_PAGE' });
    }
  }, [lazyLoaderValue.hasNextPage]);

  // コースにタスク追加の際の処理
  const clickAddHandler = React.useCallback(
    (key: string, isLocked?: boolean) => {
      const task = lazyLoaderValue.loadedTasks.find((task) => task.key === key);
      if (!task) {
        return;
      }
      const isAdded = courseTasks.some((task) => task.key === key);
      if (isAdded) {
        toastError('The task already added before.');
        return;
      }
      task.locked = isLocked ? true : false;
      setCourseTasks((prev) => [...prev, task]);
      if (props.onClickAddCallback) {
        props.onClickAddCallback(key, isLocked);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [courseTasks, lazyLoaderValue.loadedTasks, props],
  );

  // コースからタスクを削除する時の処理
  const clickUndoHandler = React.useCallback(
    (key: string) => {
      const isAdded = courseTasks.some((task) => task.key === key);
      if (isAdded) {
        setCourseTasks((prev) => prev.filter((task) => task.key !== key));
        if (props.onClickUndoCallback) {
          props.onClickUndoCallback(key);
        }
      }
    },
    [courseTasks, props],
  );

  // タスクの状態を更新する (locked -> true)
  const clickLockHandler = React.useCallback(
    (key: string) => {
      const cloneCourseTasks = lodash.cloneDeep(courseTasks);
      const taskIndex = cloneCourseTasks.findIndex((task) => task.key === key);
      if (taskIndex !== -1 && !cloneCourseTasks[taskIndex].locked) {
        cloneCourseTasks[taskIndex].locked = true;
        setCourseTasks(cloneCourseTasks);
        if (props.onChangeAccessibilityCallback) {
          props.onChangeAccessibilityCallback(key, true);
        }
      }
    },
    [courseTasks, props],
  );

  // タスクの状態を更新する (locked -> false)
  const clickUnlockHandler = React.useCallback(
    (key: string) => {
      const cloneCourseTasks = lodash.cloneDeep(courseTasks);
      const taskIndex = cloneCourseTasks.findIndex((task) => task.key === key);
      if (taskIndex !== -1 && cloneCourseTasks[taskIndex].locked !== false) {
        cloneCourseTasks[taskIndex].locked = false;
        setCourseTasks(cloneCourseTasks);
        if (props.onChangeAccessibilityCallback) {
          props.onChangeAccessibilityCallback(key, false);
        }
      }
    },
    [courseTasks, props],
  );

  const rearrangeHandler = React.useCallback(
    ({ source, destination }: DropResult) => {
      const courseTasksClone = lodash.cloneDeep(courseTasks);
      const courseTasksSize = courseTasksClone.length;
      if (courseTasksSize === 0) return;
      if (!destination) return;
      const sourceIndex = source.index;
      const desIndex = destination.index;
      // 元位置と先位置は同じであれば、変更しない
      if (sourceIndex === desIndex) return;
      // 移動方向の判定（下？上？）
      const isMoveDown = desIndex > sourceIndex;
      // 詐欺がどうか判定
      if (courseTasksSize - 1 < sourceIndex || courseTasksSize - 1 < desIndex)
        return;
      const targetItem = lodash.cloneDeep(courseTasksClone[sourceIndex]);
      // 並べ替えアルゴリズム
      if (isMoveDown) {
        for (let i = sourceIndex; i < desIndex; i++) {
          courseTasksClone[i] = courseTasksClone[i + 1];
        }
      } else {
        for (let i = sourceIndex; i > desIndex; i--) {
          courseTasksClone[i] = courseTasksClone[i - 1];
        }
      }
      courseTasksClone[desIndex] = targetItem;
      setCourseTasks(courseTasksClone);
      if (props.onRearrangeCallback) {
        props.onRearrangeCallback(courseTasksClone, targetItem, desIndex + 1);
      }
    },
    [courseTasks, props.onRearrangeCallback],
  );

  React.useEffect(() => {
    // APIからの結果を現レイジーローダーのデータに追加する
    if (receiveTasks && receiveTasks.tasks.length > 0) {
      dispatchLazyLoader({ type: 'APPEND', payload: receiveTasks });
    }
  }, [receiveTasks]);

  return (
    <TaskSelectionContext.Provider
      value={{
        taskList: lazyLoaderValue.loadedTasks,
        totalTasks: receiveTasks?.pagination.totalItems ?? 0,
        isLoading,
        courseTasks,
        searchParams: searchParamsValue,
        currentCourseId: currentCourseId,
        enableConfirmDialog,
        enableRearrangeAll,
        dispatchSearchParams,
        dispatchLazyLoader,
        clickAddHandler,
        onScrollDown,
        clickLockHandler,
        clickUndoHandler,
        clickUnlockHandler,
        rearrangeHandler,
      }}
    >
      {children}
    </TaskSelectionContext.Provider>
  );
});
