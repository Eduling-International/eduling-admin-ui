import { CSSProperties } from 'react';
import { DraggingStyle, NotDraggingStyle } from 'react-beautiful-dnd';

export const getDragStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined,
): CSSProperties => ({
  backgroundColor: isDragging ? 'lightgray' : 'white',
  width: '1000px !important',
  ...draggableStyle,
});
