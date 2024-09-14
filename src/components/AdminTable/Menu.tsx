import {
  useAdminUserMenuContext,
} from '@/contexts/AdminUserMenuContext';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { DotsThreeVertical } from '@phosphor-icons/react/dist/ssr';
import * as React from 'react';
import ArchiveAdminUser from './Archive';
import UnarchiveAdminUser from './Unarchive';
import DeleteAdminUser from './Delete';

const AdminUserMenu: React.FC = React.memo(() => {
  const { userInfo, isMenuOpen, anchorEl, handleOpenMenu, handleCloseMenu } =
    useAdminUserMenuContext();
  return (
    <React.Fragment>
      <Box>
        <IconButton
          id="basic-button"
          aria-controls={isMenuOpen ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={isMenuOpen ? 'true' : undefined}
          onClick={handleOpenMenu}
        >
          <DotsThreeVertical fontSize="var(--icon-fontSize-lg)" />
        </IconButton>
      </Box>
      <Menu
        open={isMenuOpen}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <ArchiveAdminUser />
        <UnarchiveAdminUser />
        <DeleteAdminUser />
      </Menu>
    </React.Fragment>
  );
});

export default AdminUserMenu;
