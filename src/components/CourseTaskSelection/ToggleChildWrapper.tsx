'use client';

import * as React from 'react';

const ToggleChildWrapper: React.FC<{
  isShowChild: boolean;
  children: React.ReactNode;
}> = ({ isShowChild, children }) => {
  return <React.Fragment>{isShowChild && children}</React.Fragment>;
};

export default ToggleChildWrapper;
