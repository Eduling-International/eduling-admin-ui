import { CurrentUserInfo } from '@/models';
import * as React from 'react';

// 管理者自体のメニューコンテクストの定義
export interface AdminUserMenuContextType {
  userInfo: CurrentUserInfo;
  anchorEl: HTMLElement | null;
  isMenuOpen: boolean;
  handleOpenMenu: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleCloseMenu: () => void;
}

export interface AdminUserMenuProviderProps {
  userInfo: CurrentUserInfo;
  children: React.ReactNode;
}

const AdminUserMenuContext = React.createContext(
  {} as AdminUserMenuContextType,
);

export const useAdminUserMenuContext = () =>
  React.useContext(AdminUserMenuContext);

export const AdminUserMenuProvider: React.FC<AdminUserMenuProviderProps> =
  React.memo(({ userInfo, children }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const isMenuOpen = React.useMemo(() => Boolean(anchorEl), [anchorEl]);

    const handleOpenMenu = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) =>
        setAnchorEl(event.currentTarget),
      [],
    );
    const handleCloseMenu = React.useCallback(() => setAnchorEl(null), []);

    return (
      <AdminUserMenuContext.Provider
        value={{
          userInfo,
          anchorEl,
          isMenuOpen,
          handleOpenMenu,
          handleCloseMenu,
        }}
      >
        {children}
      </AdminUserMenuContext.Provider>
    );
  });
