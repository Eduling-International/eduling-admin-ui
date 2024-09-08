import { CourseDetailsContainer } from '@/components/CourseDetails';

export default function Page({ params }: { params: { id: string } }) {
  return <CourseDetailsContainer courseId={params.id} />;
}
