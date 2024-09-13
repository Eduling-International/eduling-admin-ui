'use client';

import * as React from 'react';
import AdminTableFilter from './Filter';
import {
  Box,
  Card,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
} from '@mui/material';

const AdminTable = React.memo(() => {
  return (
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
                <TableCell>Verified</TableCell>
                <TableCell>Created by</TableCell>
                <TableCell>Last update</TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
      </Box>
    </Card>
  );
});

export default AdminTable;
