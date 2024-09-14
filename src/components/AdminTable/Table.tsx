'use client';

import * as React from 'react';
import {
  Box,
  Card,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Stack,
  Avatar,
  Link,
  Chip,
  Divider,
  TablePagination,
} from '@mui/material';
import { useAdminTableContext } from '@/contexts/AdminTableContext';
import RoleChip from './RoleChip';
import StatusBadge from './StatusBadge';
import dayjs from 'dayjs';
import AdminUserMenu from './Menu';
import { AdminUserMenuProvider } from '@/contexts/AdminUserMenuContext';
import { RoleEnum } from '@/enum';
import AdminTableFilter from './Filter';

const AdminTable = React.memo(() => {
  const { adminUsers, totalItems, searchParams, onPageChange } =
    useAdminTableContext();
  const handlePageChange = React.useCallback(
    (_: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
      onPageChange(page + 1);
    },
    [],
  );

  return (
    <React.Fragment>
      <AdminTableFilter />
      <Card>
        <Box
          sx={{
            maxWidth: '100%',
            overflow: 'auto',
          }}
        >
          <TableContainer component={Paper} sx={{ maxHeight: 550 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created by</TableCell>
                  <TableCell>Last update</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {adminUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                          sx={{
                            backgroundColor: user.bgColor,
                          }}
                        >
                          {user.username.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {user.username}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Link href={`mailto:${user.email}`} underline="none">
                        {user.email}
                      </Link>
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>
                      <RoleChip role={user.role.name} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge isArchived={user.archived} />
                    </TableCell>
                    <TableCell>
                      {user.createdUser ? (
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar
                            sx={{
                              backgroundColor: user.createdUser.bgColor,
                            }}
                          >
                            {user.createdUser.username.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">
                              {user.createdUser.username}
                            </Typography>
                          </Box>
                        </Stack>
                      ) : (
                        <Chip
                          label="N/A"
                          color="warning"
                          variant="outlined"
                          size="small"
                          sx={{
                            borderRadius: 0.5,
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {dayjs(user.updatedAt).format('MMM D, YYYY HH:mm:ss')}
                    </TableCell>
                    <TableCell>
                      {user.role.name !== RoleEnum.ROOT && (
                        <AdminUserMenuProvider userInfo={user}>
                          <AdminUserMenu />
                        </AdminUserMenuProvider>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Divider />
        <TablePagination
          component={'div'}
          count={totalItems}
          page={searchParams.currentPage - 1}
          rowsPerPage={100}
          onPageChange={handlePageChange}
          showLastButton
          showFirstButton
          rowsPerPageOptions={[100]}
        />
      </Card>
    </React.Fragment>
  );
});

export default AdminTable;
