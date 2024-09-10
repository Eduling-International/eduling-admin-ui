import { Chip, SxProps } from '@mui/material';
import * as React from 'react';

interface LevelBadgeProps {
  level: string;
  sx?: SxProps;
}

const CourseLevelWrapper: React.FC<{
  isDisplay: boolean;
  children: React.ReactNode;
}> = ({ isDisplay, children }) => {
  return <React.Fragment>{isDisplay && children}</React.Fragment>;
};

const CourseLevel: React.FC<LevelBadgeProps> = ({ level, sx }) => {
  const levels = React.useMemo(() => level.split(', '), [level]);
  const isDisplay = React.useMemo(() => levels.length > 0, [levels]);

  return (
    <CourseLevelWrapper isDisplay={isDisplay}>
      {levels?.map((level) => (
        <Chip
          sx={sx}
          color="success"
          variant="outlined"
          label={level}
          size="small"
          key={level}
        />
      ))}
    </CourseLevelWrapper>
  );
};

export default CourseLevel;
