import { Chip, SxProps } from '@mui/material';
import React from 'react';

interface LevelBadgeProps {
    label: string;
    sx?: SxProps;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ label, sx }) => {
    return <Chip sx={sx} color="success" variant='outlined' label={label} size="small" />;
};

export default LevelBadge;
