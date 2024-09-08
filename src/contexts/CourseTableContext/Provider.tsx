import { Course, SearchCourseParams } from '@/models';
import * as React from 'react';
import lodash from 'lodash';
import { pageDefault } from './config';
import { CourseService } from '@/api';
import useLazyFetch from '@/fetch/useLazyFetch';
import { usePopupStore } from '@/core/store';
import { DropResult } from 'react-beautiful-dnd';
import { useRouter } from 'next/navigation';

// コース一覧のコンテクストの定義
export interface CourseTableContextType {
  tableState: CourseTableState;
  params: SearchCourseParams;
  searchLoading: boolean;
  search: () => Promise<void>;
  onChangeInputName: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  rearrangeHandler: ({ source, destination }: DropResult) => Promise<void>;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  updateVisibility: (id: string, visible: boolean) => Promise<void>;
  redirectCourseDetails: (courseId: string) => void;
}

export interface CourseTableProviderProps {
  children: React.ReactNode;
}

// Reducerの定義
export interface CourseTableState {
  allCourses: Course[];
  currentPageCourse: Course[];
  page: number;
  itemsPerPage: number;
}

export interface ResetCourseTableAction {
  type: 'RESET';
  payload: Course[];
}

export interface ChangePageAction {
  type: 'CHANGE_PAGE';
  payload: number;
}

export interface ChangeLimitation {
  type: 'CHANGE_LIMITATION';
  payload: number;
}

export interface ChangeVisibilityCourseAction {
  type: 'CHANGE_VISIBILITY_COURSE';
  payload: {
    status: 0 | 1;
    id: string;
  };
}

export type CourseTableAction =
  | ResetCourseTableAction
  | ChangePageAction
  | ChangeLimitation
  | ChangeVisibilityCourseAction;

// ページに分ける
const paginate = (courses: Course[], page: number, itemsPerPage: number) => {
  const length = courses?.length ?? 0;
  if (length > 0) {
    const start = page * itemsPerPage;
    const end = (page + 1) * itemsPerPage;
    return courses!.slice(start, end);
  }
  return [];
};

const courseTableReducer = (
  prevState: CourseTableState,
  action: CourseTableAction,
): CourseTableState => {
  switch (action.type) {
    case 'RESET':
      return {
        ...prevState,
        allCourses: action.payload,
        currentPageCourse: paginate(
          action.payload,
          pageDefault,
          prevState.itemsPerPage,
        ),
      };
    case 'CHANGE_PAGE':
      return {
        ...prevState,
        page: action.payload,
        currentPageCourse: paginate(
          prevState.allCourses,
          action.payload,
          prevState.itemsPerPage,
        ),
      };
    case 'CHANGE_LIMITATION':
      return {
        ...prevState,
        page: pageDefault,
        itemsPerPage: action.payload,
        currentPageCourse: paginate(
          prevState.allCourses,
          pageDefault,
          action.payload,
        ),
      };
    case 'CHANGE_VISIBILITY_COURSE': {
      const allCoursesClone = lodash.cloneDeep(prevState.allCourses);
      const courseIndex = allCoursesClone.findIndex(
        (course) => course.id === action.payload.id,
      );
      if (courseIndex === -1) {
        return prevState;
      }
      allCoursesClone[courseIndex].status = action.payload.status;
      return {
        ...prevState,
        allCourses: allCoursesClone,
        currentPageCourse: paginate(
          allCoursesClone,
          prevState.page,
          prevState.itemsPerPage,
        ),
      };
    }
    default:
      return prevState;
  }
};

const courseService = new CourseService();

export const CourseTableContext = React.createContext(
  {} as CourseTableContextType,
);

export const useCourseTableContext = () => React.useContext(CourseTableContext);

export const CourseTableProvider: React.FC<CourseTableProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const { toastError, toastSuccess } = usePopupStore();
  const [state, dispatch] = React.useReducer(courseTableReducer, {
    allCourses: [],
    currentPageCourse: [],
    page: pageDefault,
    itemsPerPage: 10,
  } satisfies CourseTableState);
  const [{ data: courses, loading }, searchCourses] = useLazyFetch(
    courseService.search,
  );
  const [searchParams, setSearchParams] = React.useState<SearchCourseParams>({
    name: '',
    levels: [],
  });
  const onChangeInputName = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setSearchParams((prev) => ({ ...prev, name: event.target.value })),
    [],
  );
  const search = React.useCallback(() => {
    return searchCourses(searchParams);
  }, [searchParams]);
  const updateVisibility = React.useCallback(
    async (id: string, visible: boolean) => {
      const courseIndex = state.allCourses.findIndex(
        (course) => course.id === id,
      );
      if (courseIndex === -1) {
        toastError(
          'Course not exists or deleted. Refresh to view last updated.',
        );
        return;
      }
      const allCoursesClone = lodash.cloneDeep(state.allCourses);
      const res = await courseService.updateStatus(id, visible);
      if (!res.isError) {
        allCoursesClone[courseIndex].status = visible ? 1 : 0;
        toastSuccess('Your changes was saved!');
      }
      dispatch({ type: 'RESET', payload: allCoursesClone });
    },
    [state.allCourses],
  );

  const rearrangeHandler = React.useCallback(
    async ({ source, destination }: DropResult) => {
      const listCourseClone = lodash.cloneDeep(state.allCourses);
      const listCourseBackupOnFailure = lodash.cloneDeep(state.allCourses);
      const listCourseSize = listCourseClone.length;
      if (listCourseSize === 0) return;
      if (!destination) return;
      const sourceIndex = source.index;
      const desIndex = destination.index;
      // 元位置と先位置は同じであれば、変更しない
      if (sourceIndex === desIndex) return;
      // 移動方向の判定（下？上？）
      const isMoveDown = desIndex > sourceIndex;
      // 詐欺がどうか判定
      if (listCourseSize - 1 < sourceIndex || listCourseSize - 1 < desIndex)
        return;
      const targetItem = lodash.cloneDeep(listCourseClone[sourceIndex]);
      // 並べ替えアルゴリズム
      if (isMoveDown) {
        for (let i = sourceIndex; i < desIndex; i++) {
          listCourseClone[i] = listCourseClone[i + 1];
        }
      } else {
        for (let i = sourceIndex; i > desIndex; i--) {
          listCourseClone[i] = listCourseClone[i - 1];
        }
      }
      listCourseClone[desIndex] = targetItem;
      dispatch({ type: 'RESET', payload: listCourseClone });
      const res = await courseService.rearrange(targetItem.id, desIndex + 1);
      if (res.isError) {
        dispatch({ type: 'RESET', payload: listCourseBackupOnFailure });
      }
    },
    [state],
  );
  const onPageChange = React.useCallback(
    (page: number) => dispatch({ type: 'CHANGE_PAGE', payload: page }),
    [],
  );
  const onItemsPerPageChange = React.useCallback(
    (itemsPerPage: number) =>
      dispatch({ type: 'CHANGE_LIMITATION', payload: itemsPerPage }),
    [],
  );
  const redirectCourseDetails = React.useCallback(
    (courseId: string) => router.push(`/dashboard/courses/${courseId}/details`),
    [],
  );

  React.useEffect(() => {
    dispatch({ type: 'RESET', payload: courses ?? [] });
  }, [courses]);

  return (
    <CourseTableContext.Provider
      value={{
        tableState: state,
        params: searchParams,
        searchLoading: loading,
        search,
        onChangeInputName,
        rearrangeHandler,
        onPageChange,
        onItemsPerPageChange,
        updateVisibility,
        redirectCourseDetails,
      }}
    >
      {children}
    </CourseTableContext.Provider>
  );
};
