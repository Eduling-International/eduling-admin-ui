import { UpdateCourseBody } from '@/models';
import { z as zod } from 'zod';

export const formSchema = zod.object({
  name: zod.string().min(1, 'Name is required'),
  description: zod.string().nullable(),
  levels: zod.array(zod.string()).min(1, 'Level is required'),
  visible: zod.boolean(),
  coverPicture: zod.string().min(1, 'Pick a cover'),
}) satisfies zod.ZodType<UpdateCourseBody>;
