import * as React from 'react';
import { Category, SearchCategoryParams } from '@/models';
import { CategoryService } from '@/api';
import useLazyFetch from '@/fetch/useLazyFetch';
import { useDebounce } from '@/core/hooks';

const categoryService = new CategoryService();
const CategoryTableContext = React.createContext(
  {} as CategoryTableContextType,
);

export interface CategoryTableContextType {
  categories: Category[];
  params?: SearchCategoryParams;
  isLoading: boolean;
  changeSearchParamsName: (value: string) => void;
  changeSearchparamsMode: (value?: 'AI_DUO' | 'SOLO' | 'NORMAL') => void;
  resetSearchParams: () => void;
  executeSearchCategory: (params?: SearchCategoryParams) => Promise<void>
}

export interface CategoryTableContextProps {
  children: React.ReactNode;
}

export const useCategoryTableContext = () =>
  React.useContext(CategoryTableContext);

export const CategoryTableProvider: React.FC<CategoryTableContextProps> = ({
  children,
}) => {
  const [searchParams, setSearchParams] = React.useState<SearchCategoryParams>(
    {},
  );

  const changeSearchParamsName = React.useCallback((value: string) => {
    setSearchParams((prev) => ({ ...prev, name: value }));
  }, []);
  const changeSearchparamsMode = React.useCallback(
    (value?: 'AI_DUO' | 'SOLO' | 'NORMAL') => {
      setSearchParams((prev) => ({ ...prev, mode: value }));
    },
    [],
  );
  const resetSearchParams = React.useCallback(() => {
    setSearchParams({});
  }, []);

  const [{ data: categories, loading: isLoading }, executeSearchCategory] =
    useLazyFetch(categoryService.search);
  useDebounce(searchParams, 1000, executeSearchCategory);

  return (
    <CategoryTableContext.Provider
      value={{
        categories: categories ?? [],
        params: searchParams,
        isLoading: isLoading,
        changeSearchparamsMode,
        changeSearchParamsName,
        resetSearchParams,
        executeSearchCategory,
      }}
    >
      {children}
    </CategoryTableContext.Provider>
  );
};
