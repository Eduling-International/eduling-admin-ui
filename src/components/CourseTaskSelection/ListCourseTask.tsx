'use client';

import { useTaskSelectionContext } from '@/contexts/TaskSelectionContext';
import { DnDComponent, Droppable } from '@/core/components/DnD';
import { Box, Typography, Stack, Grid } from '@mui/material';
import { StackPlus } from '@phosphor-icons/react';
import * as React from 'react';
import {
  Draggable,
  DraggingStyle,
  NotDraggingStyle,
} from 'react-beautiful-dnd';
import CourseTaskUIComponent from './CourseTaskUIComponent';
import ToggleChildWrapper from './ToggleChildWrapper';

const getDragStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined,
): React.CSSProperties => ({
  backgroundColor: isDragging ? 'lightblue' : 'white',
  borderRadius: '6px',
  ...draggableStyle,
});

const ListCourseTask: React.FC = React.memo(() => {
  const { courseTasks, rearrangeHandler } = useTaskSelectionContext();

  return (
    <React.Fragment>
      {courseTasks.length === 0 ? (
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
              Tasks in course ({courseTasks.length})
            </Typography>
          </Box>
          <Box
            sx={{
              height: 476.5,
              overflowY: 'scroll',
            }}
          >
            <Box sx={{ overflowY: 'scroll', height: '100%' }}>
              <DnDComponent onDragEnd={rearrangeHandler}>
                <Droppable droppableId="list">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {courseTasks.map((task, index) => (
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
                              <ToggleChildWrapper isShowChild={!!task}>
                                <CourseTaskUIComponent
                                  key={task.id}
                                  data={task}
                                />
                              </ToggleChildWrapper>
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
    </React.Fragment>
  );
});

export default ListCourseTask;
