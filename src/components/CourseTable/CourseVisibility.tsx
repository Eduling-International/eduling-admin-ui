`use client`;

import { useCourseTableContext } from '@/contexts/CourseTableContext';
import { Switch } from '@mui/material';
import * as React from 'react';

export interface CourseVisibilityProps {
  visible: boolean;
  courseId: string;
}

const CourseVisibility: React.FC<CourseVisibilityProps> = (props) => {
  const { updateVisibility } = useCourseTableContext();
  const [visible, setVisible] = React.useState(false);

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.checked;
      setVisible(value);
      updateVisibility(props.courseId, value);
    },
    [props.courseId],
  );

  React.useEffect(() => {
    setVisible(props.visible);
  }, [props.visible]);

  return <Switch color="info" checked={visible} onChange={handleChange} />;
};

export default CourseVisibility;
