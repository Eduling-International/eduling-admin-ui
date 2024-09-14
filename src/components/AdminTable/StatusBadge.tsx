import { Chip } from '@mui/material';
import * as React from 'react';

interface StatusProps {
  isArchived: boolean;
}

const StatusBadge: React.FC<StatusProps> = React.memo(({ isArchived }) => {
  return (
    <React.Fragment>
      {isArchived ? (
        <Chip
          variant="outlined"
          label={'ARCHIVED'}
          size="small"
          sx={{
            borderRadius: 0.5,
            color: 'gray',
            borderColor: 'gray',
          }}
        />
      ) : (
        <Chip
          variant="outlined"
          label={'ACTIVE'}
          color={'success'}
          size="small"
          sx={{
            borderRadius: 0.5,
          }}
        />
      )}
    </React.Fragment>
  );
});

export default StatusBadge;
