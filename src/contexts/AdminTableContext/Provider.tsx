import { AdminUserService } from '@/api';
import useLazyFetch from '@/fetch/useLazyFetch';
import { CurrentUserInfo, SearchAdminUserParam } from '@/models';
import * as React from 'react';

// 管理者テーブロのコンテクストの定義.
export interface AdminTableContextType {
  adminUsers: CurrentUserInfo[];
  searchLoading: boolean;
  searchParams: SearchAdminUserParam;
  onUsernameChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onPageChange: (page: number) => void;
  search: () => Promise<void>;
}

export interface AdminTableProviderProps {
  children: React.ReactNode;
}

// 管理者のAPIサービス.
const adminUserService = new AdminUserService();

// 管理者テーブロのコンテクストの初期値.
const AdminTableContext = React.createContext<AdminTableContextType>(
  {} as AdminTableContextType,
);

export const useAdminTableContext = () => React.useContext(AdminTableContext);

export const AdminTableProvider: React.FC<AdminTableProviderProps> = ({
  children,
}) => {
  const [searchParams, setSearchParams] = React.useState<SearchAdminUserParam>({
    username: '',
    currentPage: 1,
  });

  const [{ data: adminUsers, loading: searchLoading }, executeSearchAdminUser] =
    useLazyFetch(adminUserService.search);
  const onUsernameChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSearchParams((prev) => ({ ...prev, username: event.target.value }));
    },
    [],
  );
  const onPageChange = React.useCallback(
    (page: number) =>
      setSearchParams((prev) => ({ ...prev, currentPage: page })),
    [],
  );
  const search = React.useCallback(async () => {
    await executeSearchAdminUser(searchParams);
  }, [searchParams]);

  return (
    <AdminTableContext.Provider
      value={{
        adminUsers: adminUsers ?? [],
        searchLoading,
        searchParams,
        onUsernameChange,
        onPageChange,
        search,
      }}
    >
      {children}
    </AdminTableContext.Provider>
  );
};
