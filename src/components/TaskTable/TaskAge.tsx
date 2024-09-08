import * as React from 'react';

export interface TaskAgeProps {
  minAge: number;
  maxAge: number;
}

export const TaskAge: React.FC<TaskAgeProps> = ({ minAge, maxAge }) => {
  if (minAge === 0 && maxAge !== 0) {
    return <span>Up to {maxAge} years old</span>;
  }
  if (minAge !== 0 && maxAge === 0) {
    return <span>From {minAge} years old</span>;
  }
  if (minAge === 0 && maxAge === 0) {
    return <span>Any age</span>;
  }
  if (minAge === maxAge) {
    return <span>{minAge} years old</span>;
  }
  return (
    <span>
      {minAge} to {maxAge} years old
    </span>
  );
}

