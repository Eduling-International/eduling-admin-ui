import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { SignOut as SignOutIcon } from '@phosphor-icons/react/dist/ssr/SignOut';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';
import { signOut } from 'next-auth/react';
import { useCurrentUser } from '@/core/hooks';
import { Gear } from '@phosphor-icons/react/dist/ssr';
import { usePopover } from '@/hooks/use-popover';

export interface UserPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
}

export function UserPopover({
  anchorEl,
  onClose,
  open,
}: UserPopoverProps): React.JSX.Element {
  const router = useRouter();
  const { userInfo } = useCurrentUser();
  const userPopover = usePopover<HTMLDivElement>();

  const handleSignOut = React.useCallback(async () => {
    await signOut();
    router.push('/auth/sign-in');
  }, []);

  const handleClickSettings = React.useCallback(() => {
    router.push(paths.dashboard.settings);
    onClose();
  }, []);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: '240px' } } }}
    >
      {userInfo && (
        <Box sx={{ p: '16px 20px ' }}>
          <Typography variant="subtitle1">{userInfo.username}</Typography>
          <Typography color="text.secondary" variant="body2">
            {userInfo.email}
          </Typography>
        </Box>
      )}
      <Divider />
      <MenuList
        disablePadding
        sx={{ p: '8px', '& .MuiMenuItem-root': { borderRadius: 1 } }}
      >
        <MenuItem disabled={!userInfo} onClick={handleClickSettings}>
          <ListItemIcon>
            <Gear fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <SignOutIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </MenuList>
    </Popover>
  );
}
