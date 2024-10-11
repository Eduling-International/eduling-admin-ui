export const paths = {
  home: '/',
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    resetPassword: '/auth/reset-password',
  },
  dashboard: {
    overview: '/dashboard',
    admin: '/dashboard/admin',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    courses: '/dashboard/courses',
    tasks: '/dashboard/tasks',
    categories: '/dashboard/categories',
    createCourse: '/dashboard/courses/create',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
    plans: '/dashboard/plans',
    createPlan: '/dashboard/plans/create',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
