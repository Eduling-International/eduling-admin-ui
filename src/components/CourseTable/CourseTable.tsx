'use client';

import { DnDComponent, Droppable } from '@/core/components/DnD';
import {
  Box,
  Button,
  Card,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import * as React from 'react';
import {
  Draggable,
  DraggingStyle,
  NotDraggingStyle,
} from 'react-beautiful-dnd';
import { DotsSix as DragIcon } from '@phosphor-icons/react/dist/ssr/DotsSix';
import { ArrowClockwise as RefreshIcon } from '@phosphor-icons/react/dist/ssr/ArrowClockwise';
import { PencilLine as EditIcon } from '@phosphor-icons/react/dist/ssr/PencilLine';
import CourseLevel from './CourseLevel';
import CoursesFilter from './CourseFilter';
import { useCourseTableContext } from '@/contexts/CourseTableContext';
import CourseVisibility from './CourseVisibility';

const getDragStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined,
): React.CSSProperties => ({
  backgroundColor: isDragging ? 'lightgray' : 'white',
  width: '1000px !important',
  ...draggableStyle,
});

const CoursesTable: React.FC<{}> = () => {
  const {
    search,
    rearrangeHandler,
    onPageChange,
    onItemsPerPageChange,
    redirectCourseDetails,
    searchLoading,
    tableState: { allCourses, currentPageCourse, page, itemsPerPage },
  } = useCourseTableContext();

  // ページ変わりの処理
  const handlePageChange = React.useCallback(
    (_: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
      onPageChange(page);
    },
    [],
  );

  // 1ページあたりのアイテム数変更の処理
  const handleItemsPerPageChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const value = Number(event.target.value);
      onItemsPerPageChange(value);
    },
    [],
  );
  return (
    <React.Fragment>
      <CoursesFilter />
      <Card>
        <Box display={'flex'} my={1} mr={2} flexDirection="row-reverse">
          <Box>
            <Button
              startIcon={<RefreshIcon fontSize="var(--icon-fontSize-md)" />}
              onClick={search}
              variant="outlined"
              size="small"
              color="success"
              disabled={searchLoading}
            >
              Refresh
            </Button>
          </Box>
        </Box>
        <Box>
          <Table sx={{ minWidth: '800px' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ maxWidth: 20 }}></TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Visibility</TableCell>
                <TableCell sx={{ maxWidth: 20 }}></TableCell>
              </TableRow>
            </TableHead>
            <DnDComponent onDragEnd={rearrangeHandler}>
              <Droppable droppableId="list">
                {(provided) => (
                  <TableBody
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {currentPageCourse?.map((course, index) => (
                      <Draggable
                        key={course.id}
                        draggableId={course.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <TableRow
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            {...snapshot}
                            key={course.id}
                            sx={getDragStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style,
                            )}
                            hover
                          >
                            <TableCell sx={{ maxWidth: 20 }}>
                              <DragIcon weight="bold" size={25} />
                            </TableCell>
                            <TableCell>
                              <Stack
                                sx={{ alignItems: 'center' }}
                                direction="row"
                                spacing={2}
                              >
                                <Image
                                  style={{
                                    borderRadius: 5,
                                  }}
                                  alt={course.name}
                                  width={60}
                                  height={60}
                                  src={course.coverPicture}
                                />
                                <Typography
                                  color={
                                    snapshot.isDragging ? 'white' : 'black'
                                  }
                                  variant="subtitle1"
                                >
                                  {course.name}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <CourseLevel sx={{ml: 1}} level={course.level} />
                            </TableCell>
                            <TableCell>
                              <CourseVisibility
                                visible={course.status === 1}
                                courseId={course.id}
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                color="info"
                                size="small"
                                startIcon={<EditIcon />}
                                onClick={redirectCourseDetails.bind(
                                  null,
                                  course.id,
                                )}
                              >
                                EDIT
                              </Button>
                            </TableCell>
                          </TableRow>
                        )}
                      </Draggable>
                    ))}
                  </TableBody>
                )}
              </Droppable>
            </DnDComponent>
          </Table>
        </Box>
        <Divider />
        <TablePagination
          component={'div'}
          count={allCourses?.length ?? 0}
          page={page}
          rowsPerPage={itemsPerPage}
          rowsPerPageOptions={[5, 10, 15, 20]}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleItemsPerPageChange}
          showLastButton
          showFirstButton
        />
      </Card>
    </React.Fragment>
  );
};

export default React.memo(CoursesTable);
