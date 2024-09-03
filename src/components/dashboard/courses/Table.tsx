'use client';

import { CourseService } from '@/api';
import { DnDComponent, Droppable } from '@/core/components/DnD';
import { useLazyApi } from '@/core/hooks/useApi';
import {
  Box,
  Button,
  Card,
  Divider,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import {
  Draggable,
  DraggingStyle,
  DropResult,
  NotDraggingStyle,
} from 'react-beautiful-dnd';
import { DotsSix as DragIcon } from '@phosphor-icons/react/dist/ssr/DotsSix';
import { ArrowClockwise as RefreshIcon } from '@phosphor-icons/react/dist/ssr/ArrowClockwise';
import { PencilLine as EditIcon } from '@phosphor-icons/react/dist/ssr/PencilLine';
import { Course } from '@/models';
import lodash from 'lodash';
import LevelBadge from './LevelBadge';
import { CoursesFilter } from '.';
import { useRouter } from 'next/navigation';

const getDragStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined,
): CSSProperties => ({
  backgroundColor: isDragging ? 'lightgray' : 'white',
  width: '1000px !important',
  ...draggableStyle,
});

const getCurrentPageItems = (
  courses: Course[],
  page: number,
  itemsPerPage: number,
) => {
  const length = courses?.length ?? 0;
  if (length > 0) {
    const start = page * itemsPerPage;
    const end = (page + 1) * itemsPerPage;
    return courses!.slice(start, end);
  }
  return [];
};

type CourseTableValue = {
  allCourses: Course[];
  currentPageCourses: Course[];
};

type SetCoursesAction = {
  type: 'setCourses';
  payload: Course[];
};

type SetAllCoursesAction = {
  type: 'setAllCourses';
  payload: Course[];
};

type CourseTableAction = SetCoursesAction | SetAllCoursesAction;

const initializationValue: CourseTableValue = {
  allCourses: [],
  currentPageCourses: [],
};

const renderLevels = (level: string) => {
  const levels = level
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.trim() !== '');

  if (!levels || levels.length === 0) {
    return null;
  }
  return levels.map((level, index) => (
    <LevelBadge sx={index !== 0 ? { ml: 1 } : {}} key={index} label={level} />
  ));
};

const courseTableReducer = (
  state: CourseTableValue,
  action: CourseTableAction,
): CourseTableValue => {
  switch (action.type) {
    case 'setAllCourses':
      return {
        ...state,
        allCourses: action.payload,
        currentPageCourses: getCurrentPageItems(action.payload, 0, 10),
      };
    case 'setCourses':
      return {
        ...state,
        currentPageCourses: action.payload,
      };
    default:
      return {
        ...state,
      };
  }
};

const CoursesTable: React.FC<{}> = () => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const courseService = useMemo(() => new CourseService(), []);
  const searchCourses = useCallback(
    (name?: string) => courseService.search({ name: name }),
    [courseService],
  );
  const [{ data: apiCourses, loading }, execute] = useLazyApi(searchCourses);

  /**
   * Handle function when page change.
   */
  const onPageChange = useCallback(
    (_: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
      setPage(page);
    },
    [],
  );

  /**
   * Handle function when item per pages option change.
   */
  const onItemsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const value = Number(event.target.value);
      setItemsPerPage(value);
      // When items per pages change then reset page.
      setPage(0);
    },
    [],
  );

  /**
   * Manage courses state.
   */
  const [{ currentPageCourses, allCourses }, dispatch] = useReducer(
    courseTableReducer,
    initializationValue,
  );

  /**
   * Handle rearrange course.
   * @param result Drag drop result
   * @returns List of courses after rearrange or backup rearrange before.
   */
  const handleDragEnd = async (result: DropResult) => {
    if (!allCourses || allCourses.length === 0) return;
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    const sourceIndex = source.index + page * itemsPerPage;
    const destinationIndex = destination.index + page * itemsPerPage;
    if (sourceIndex === destinationIndex) {
      return;
    }
    const isMoveDown = destinationIndex > sourceIndex;
    const lastIndex = allCourses.length - 1;
    if (lastIndex < sourceIndex || lastIndex < destinationIndex) {
      return;
    }
    const allCoursesClone = lodash.cloneDeep(allCourses);
    const allCoursesCopy = lodash.cloneDeep(allCourses);
    const temp = lodash.cloneDeep(allCoursesCopy[sourceIndex]);
    const newDisplayOrder = allCoursesCopy[destinationIndex].displayOrder;
    temp.displayOrder = newDisplayOrder;
    if (isMoveDown) {
      for (let i = sourceIndex; i < destinationIndex; i++) {
        allCoursesCopy[i] = allCoursesCopy[i + 1];
        allCoursesCopy[i].displayOrder = allCoursesCopy[i].displayOrder - 1;
      }
    } else {
      for (let i = sourceIndex; i > destinationIndex; i--) {
        allCoursesCopy[i] = allCoursesCopy[i - 1];
        allCoursesCopy[i].displayOrder = allCoursesCopy[i].displayOrder + 1;
      }
    }
    allCoursesCopy[destinationIndex] = temp;
    dispatch({ type: 'setAllCourses', payload: allCoursesCopy });
    const res = await courseService.rearrange(temp.id, newDisplayOrder);
    if (res?.isError) {
      dispatch({ type: 'setAllCourses', payload: allCoursesClone });
    }
  };

  const redirectToDetails = useCallback((courseId: string) => {
    router.push(`/dashboard/courses/${courseId}/details`);
  }, [router])

  useEffect(() => {
    execute();
  }, [execute]);

  useEffect(() => {
    const payload = apiCourses ?? [];
    dispatch({ type: 'setAllCourses', payload: payload });
  }, [apiCourses]);

  useEffect(() => {
    const payload = getCurrentPageItems(allCourses, page, itemsPerPage);
    dispatch({ type: 'setCourses', payload: payload });
  }, [allCourses, itemsPerPage, page]);

  return (
    <>
      <CoursesFilter executeSearch={execute} />
      <Card>
        <Box display={'flex'} my={1} mr={2} flexDirection="row-reverse">
          <Box>
            <Button
              startIcon={<RefreshIcon fontSize="var(--icon-fontSize-md)" />}
              onClick={() => execute()}
              disabled={loading}
              variant='outlined'
              size='small'
              color='success'
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
            <DnDComponent onDragEnd={handleDragEnd}>
              <Droppable droppableId="list">
                {(provided) => (
                  <TableBody
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {currentPageCourses?.map((course, index) => (
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
                            <TableCell>{renderLevels(course.level)}</TableCell>
                            <TableCell>
                              <Switch
                                color="info"
                                checked={course.status !== 0}
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                color="info"
                                size="small"
                                startIcon={<EditIcon />}
                                onClick={redirectToDetails.bind(null, course.id)}
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
          onPageChange={onPageChange}
          onRowsPerPageChange={onItemsPerPageChange}
          showLastButton
          showFirstButton
        />
      </Card>
    </>
  );
};

export default React.memo(CoursesTable);
