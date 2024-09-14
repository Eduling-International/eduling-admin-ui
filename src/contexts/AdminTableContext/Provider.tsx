import { AdminUserService } from '@/api';
import useLazyFetch from '@/fetch/useLazyFetch';
import { CurrentUserInfo, SearchAdminUserParam } from '@/models';
import * as React from 'react';

// 管理者テーブロのコンテクストの定義.
export interface AdminTableContextType {
  adminUsers: CurrentUserInfo[];
  totalItems: number;
  searchLoading: boolean;
  searchParams: SearchAdminUserParam;
  onUsernameChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onPageChange: (page: number) => void;
  search: () => Promise<void>;
  setAdminUsers: React.Dispatch<React.SetStateAction<CurrentUserInfo[]>>
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
  const [adminUsers, setAdminUsers] = React.useState<CurrentUserInfo[]>([]);
  const [totalItems, setTotalItems] = React.useState<number>(0);

  const [{ data: response, loading: searchLoading }, executeSearchAdminUser] =
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

  React.useEffect(() => {
    if (response) {
      setAdminUsers(response.users);
      setTotalItems(response.pagination.totalItems);
    } else {
      setAdminUsers([]);
      setTotalItems(0);
    }
  }, [response]);

  return (
    <AdminTableContext.Provider
      value={{
        adminUsers: adminUsers,
        totalItems,
        searchLoading,
        searchParams,
        onUsernameChange,
        onPageChange,
        search,
        setAdminUsers,
      }}
    >
      {children}
    </AdminTableContext.Provider>
  );
};
