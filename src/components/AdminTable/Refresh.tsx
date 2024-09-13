import { Button } from '@mui/material';
import { ArrowClockwise } from '@phosphor-icons/react/dist/ssr';
import * as React from 'react';

const AdminTableRefresh: React.FC = React.memo(() => {
  return (
    <div>
      <Button
        variant="outlined"
        size="small"
        color="success"
        endIcon={<ArrowClockwise />}
      >
        Refresh
      </Button>
    </div>
  );
});

export default AdminTableRefresh;
