import React from 'react';
import { DragDropContext, DragDropContextProps } from 'react-beautiful-dnd';

const DnDComponent: React.FC<DragDropContextProps> = ({
  children,
  ...props
}) => {
  return <DragDropContext {...props}>{children}</DragDropContext>;
};

export default DnDComponent;
