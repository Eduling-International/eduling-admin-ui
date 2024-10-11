import * as React from 'react';
import { Faders } from '@phosphor-icons/react';
import { Button } from '@mui/material';

const CategoryFilter: React.FC<{}> = () => {
  return (
    <Button
      sx={{ width: 'fit-content' }}
      color="primary"
      variant="outlined"
      endIcon={<Faders />}
    >
      Filter
    </Button>
  );
};

export default CategoryFilter;
