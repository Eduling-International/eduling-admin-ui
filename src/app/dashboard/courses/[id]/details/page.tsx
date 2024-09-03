import { CourseDetailsContainer } from '@/components/dashboard/course-details';

export default function Page({ params }: { params: { id: string } }) {
  return <CourseDetailsContainer courseId={params.id} />;
}
