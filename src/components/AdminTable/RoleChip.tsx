import * as React from 'react';
import { RoleEnum } from '@/enum';
import { Chip } from '@mui/material';

interface RoleChipProps {
  role: RoleEnum;
}

const colorMap = {
  [RoleEnum.ROOT]: 'primary',
  [RoleEnum.CREATOR]: 'success',
  [RoleEnum.VIEWER]: 'secondary',
};

const RoleChip: React.FC<RoleChipProps> = React.memo(({ role }) => {
  return (
    <Chip
      label={role}
      color={(colorMap[role] ?? 'default') as any}
      size="small"
      sx={{
        borderRadius: 0.5,
      }}
    />
  );
});

export default RoleChip;
