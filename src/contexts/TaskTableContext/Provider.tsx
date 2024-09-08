import { Category, SearchTaskParams, Task } from '@/models';
import * as React from 'react';
import { CategoryService, TaskService } from '@/api';
import { useDebounce } from '@/core/hooks';
import useLazyFetch from '@/fetch/useLazyFetch';
import { useFetch } from '@/fetch/useFetch';

// タスクテーブルのコンテクスト定義
export interface TaskTableContextType {
  tasks: Task[];
  params: SearchTaskParams;
  totalItems: number;
  listCategory: Category[];
  changeNameSearchParams: (value: string) => void;
  changeCategorySearchParams: (value: string) => void;
  changePageSearchParams: (value: number) => void;
  resetSearchParams: () => void;
  executeSearchTask: (params: SearchTaskParams) => Promise<void>;
}

export interface TaskTableContextProps {
  children: React.ReactNode;
}

const TaskTableContext = React.createContext({} as TaskTableContextType);

export const useTaskTableContext = () => React.useContext(TaskTableContext);

const taskService = new TaskService();
const categoryService = new CategoryService();

export const TaskTableProvider: React.FC<TaskTableContextProps> = ({
  children,
}) => {
  const [searchParams, setSearchParams] = React.useState<SearchTaskParams>({
    name: '',
    categoryId: ` `,
    currentPage: 1,
  });
  const [currentPageTask, setCurrentPageTask] = React.useState<Task[]>([]);
  const [totalItems, setTotalItems] = React.useState(0);
  const changeNameSearchParams = React.useCallback((value: string) => {
    setSearchParams((prev) => ({ ...prev, name: value, currentPage: 1 }));
  }, []);
  const changeCategorySearchParams = React.useCallback((value: string) => {
    setSearchParams(prev => ({
      ...prev,
      categoryId: value,
      currentPage: 1,
    }));
  }, []);
  const changePageSearchParams = React.useCallback((value: number) => {
    setSearchParams((prev) => ({ ...prev, currentPage: value }));
  }, []);

  const resetSearchParams = React.useCallback(() => {
    setSearchParams({
      name: '',
      categoryId: ` `,
      currentPage: 1,
    });
  }, []);

  const [{ data: searchTaskResponse }, executeSearchTask] = useLazyFetch(
    taskService.search,
  );
  const { data: categories } = useFetch(categoryService.search);

  useDebounce(searchParams, 1000, executeSearchTask);

  React.useEffect(() => {
    if (searchTaskResponse) {
      setCurrentPageTask(searchTaskResponse.tasks);
      setTotalItems(searchTaskResponse.pagination.totalItems);
    }
  }, [searchTaskResponse]);

  return (
    <TaskTableContext.Provider
      value={{
        tasks: currentPageTask,
        params: searchParams,
        totalItems: totalItems,
        listCategory: categories ?? [],
        changeNameSearchParams,
        changeCategorySearchParams,
        changePageSearchParams,
        resetSearchParams,
        executeSearchTask,
      }}
    >
      {children}
    </TaskTableContext.Provider>
  );
};
