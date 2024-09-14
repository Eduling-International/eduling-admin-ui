import { useAdminTableContext } from '@/contexts/AdminTableContext';
import { useAdminUserMenuContext } from '@/contexts/AdminUserMenuContext';
import { MenuItem } from '@mui/material';
import * as React from 'react';
import lodash from 'lodash';
import { AdminUserService } from '@/api';
import useLazyFetch from '@/fetch/useLazyFetch';
import { usePopupStore } from '@/core/store';

// 管理者のAPIサービス
const adminUserService = new AdminUserService();

const Unarchive: React.FC = React.memo(() => {
  const { toastSuccess } = usePopupStore();
  const { setAdminUsers } = useAdminTableContext();
  const { userInfo, handleCloseMenu } = useAdminUserMenuContext();

  const unarchiveAdminUser = React.useCallback(async () => {
    const res = await adminUserService.unArchive(userInfo.id);
    if (res.data?.affectedRows === 1) {
      setAdminUsers((adminUsers) => {
        const adminUsersClone = lodash.cloneDeep(adminUsers);
        const deleteUserIndex = adminUsersClone.findIndex(
          (user) => user.id === userInfo.id,
        );
        adminUsersClone[deleteUserIndex].archived = false;
        return adminUsersClone;
      });
      handleCloseMenu();
      toastSuccess('The user has been unarchived.');
    }
    return res;
  }, [userInfo]);
  const [{ loading }, executeUnarchiveAdminUser] =
    useLazyFetch(unarchiveAdminUser);

  return (
    <React.Fragment>
      <MenuItem
        onClick={executeUnarchiveAdminUser}
        disabled={!userInfo.archived || loading}
      >
        Unarchive
      </MenuItem>
    </React.Fragment>
  );
});

export default Unarchive;
