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
    createAdmin: '/dashboard/admin/create',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    courses: '/dashboard/courses',
    tasks: '/dashboard/tasks',
    createCourse: '/dashboard/courses/create',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
