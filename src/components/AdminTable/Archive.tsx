import { useAdminTableContext } from '@/contexts/AdminTableContext';
import { useAdminUserMenuContext } from '@/contexts/AdminUserMenuContext';
import {
  MenuItem,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  DialogContentText,
} from '@mui/material';
import * as React from 'react';
import lodash from 'lodash';
import { AdminUserService } from '@/api';
import useLazyFetch from '@/fetch/useLazyFetch';
import { usePopupStore } from '@/core/store';

// 管理者のAPIサービス
const adminUserService = new AdminUserService();

const Archive: React.FC = React.memo(() => {
  const { toastSuccess } = usePopupStore();
  const { setAdminUsers } = useAdminTableContext();
  const { userInfo, handleCloseMenu } = useAdminUserMenuContext();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const archiveAdminUser = React.useCallback(async () => {
    const res = await adminUserService.archive(userInfo.id);
    if (res.data?.affectedRows === 1) {
      setAdminUsers((adminUsers) => {
        const adminUsersClone = lodash.cloneDeep(adminUsers);
        const deleteUserIndex = adminUsersClone.findIndex(
          (user) => user.id === userInfo.id,
        );
        adminUsersClone[deleteUserIndex].archived = true;
        return adminUsersClone;
      });
      handleCloseDialog();
      toastSuccess('The user has been archived.');
    }
    return res;
  }, [userInfo]);
  const [{ loading }, executeArchiveAdminUser] = useLazyFetch(archiveAdminUser);

  const handleOpenDialog = React.useCallback(() => setIsDialogOpen(true), []);
  const handleCloseDialog = React.useCallback(() => {
    setIsDialogOpen(false);
    handleCloseMenu();
  }, []);

  return (
    <React.Fragment>
      <MenuItem onClick={handleOpenDialog} disabled={userInfo.archived}>
        Archive
      </MenuItem>
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirm archive?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The user{' '}
            <b>
              <i>{userInfo.username}</i>
            </b>{' '}
            will lose login access and action privileges, but you can unarchive
            them anytime.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button size="small" variant="outlined" onClick={handleCloseDialog}>
            Disagree
          </Button>
          <Button
            disabled={loading}
            size="small"
            variant="contained"
            color="primary"
            onClick={executeArchiveAdminUser}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
});

export default Archive;
