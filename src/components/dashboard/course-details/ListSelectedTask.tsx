'use client';

import { Task } from '@/models';
import React, { useCallback, CSSProperties } from 'react';
import SelectedTask from './SelectedTask';
import { Box, Stack, Typography } from '@mui/material';
import { DnDComponent, Droppable } from '@/core/components/DnD';
import {
  Draggable,
  DraggingStyle,
  DropResult,
  NotDraggingStyle,
} from 'react-beautiful-dnd';
import { StackPlus } from '@phosphor-icons/react/dist/ssr';

interface ListSelectedTasksProps {
  tasks: Task[];
  courseId: string;
  undo: (id: string) => void;
  handleDrag: (result: DropResult) => void;
  lock: (id: string) => void;
  unlock: (id: string) => void;
}

const getDragStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined,
): CSSProperties => ({
  backgroundColor: isDragging ? 'lightblue' : 'white',
  borderRadius: '6px',
  ...draggableStyle,
});

const ListSelectedTasks: React.FC<ListSelectedTasksProps> = ({
  tasks,
  courseId,
  undo,
  handleDrag,
  lock,
  unlock,
}) => {
  const handleUndo = useCallback(
    (id: string) => {
      undo(id);
    },
    [undo],
  );
  return (
    <>
      {tasks.length === 0 ? (
        <Box
          gap={1.5}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography
            sx={{ opacity: 0.8, letterSpacing: 0.5 }}
            textAlign={'center'}
            component={'div'}
            fontWeight={'bold'}
          >
            Add some tasks
          </Typography>
          <Box>
            <StackPlus size={25} weight="bold" />
          </Box>
        </Box>
      ) : (
        <Stack spacing={2.5}>
          <Box display={'flex'} gap={1.5}>
            <StackPlus size={25} weight="bold" />
            <Typography
              sx={{ opacity: 0.8, letterSpacing: 0.5 }}
              fontWeight={'bold'}
            >
              Tasks in course ({tasks.length})
            </Typography>
          </Box>
          <Box
            sx={{
              height: 476.5,
              overflowY: 'scroll',
            }}
          >
              <Box sx={{ overflowY: 'scroll', height: '100%' }}>
              <DnDComponent onDragEnd={handleDrag}>
                <Droppable droppableId="list">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              {...snapshot}
                              key={task.id}
                              sx={getDragStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style,
                              )}
                            >
                              <SelectedTask
                                key={task.id}
                                data={task}
                                courseId={courseId}
                                undo={handleUndo}
                                lock={lock}
                                unlock={unlock}
                              />
                            </Box>
                          )}
                        </Draggable>
                      ))}
                    </div>
                  )}
                </Droppable>
              </DnDComponent>
            </Box>
          </Box>
        </Stack>
      )}
    </>
  );
};

export default ListSelectedTasks;
