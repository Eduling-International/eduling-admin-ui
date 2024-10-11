import { Chip } from '@mui/material';
import * as React from 'react';

export interface CategoryModeProps {
  mode: 'AI_DUO' | 'SOLO' | 'NORMAL';
}

const colorMap = {
  AI_DUO: 'success',
  SOLO: 'primary',
  NORMAL: 'secondary',
};

export const CategoryMode: React.FC<CategoryModeProps> = React.memo(({ mode }) => {
  return (
    <Chip
      label={mode}
      variant="outlined"
      color={(colorMap[mode] ?? 'default') as any}
      size="small"
    />
  );
});
