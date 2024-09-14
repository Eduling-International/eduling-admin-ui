import * as React from 'react';
import { Chip } from '@mui/material';

interface VerifiedBadgeProps {
  isVerified: boolean;
}

const VerifiedBadge: React.FC<VerifiedBadgeProps> = React.memo(
  ({ isVerified }) => {
    return (
      <React.Fragment>
        {isVerified ? (
          <Chip
            variant="outlined"
            label={'VERIFIED'}
            color={'success'}
            size="small"
            sx={{
              borderRadius: 0.5,
            }}
          />
        ) : (
          <Chip
            variant="outlined"
            label={'UNVERIFIED'}
            color={'warning'}
            size="small"
            sx={{
              borderRadius: 0.5,
            }}
          />
        )}
      </React.Fragment>
    );
  },
);

export default VerifiedBadge;
