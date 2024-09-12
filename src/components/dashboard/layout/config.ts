import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  {
    key: 'overview',
    title: 'Overview',
    href: paths.dashboard.overview,
    icon: 'chart-pie',
  },
  {
    key: 'admin',
    title: 'Admin',
    href: paths.dashboard.admin,
    icon: 'admin',
    items: [
      {
        key: 'create-admin',
        title: 'New',
        href: paths.dashboard.createAdmin,
        icon: 'user-circle-plus',
      },
    ],
  },
  // {
  //   key: 'customers',
  //   title: 'Customers',
  //   href: paths.dashboard.customers,
  //   icon: 'users',
  // },
  // {
  //   key: 'integrations',
  //   title: 'Integrations',
  //   href: paths.dashboard.integrations,
  //   icon: 'plugs-connected',
  // },
  // {
  //   key: 'settings',
  //   title: 'Settings',
  //   href: paths.dashboard.settings,
  //   icon: 'gear-six',
  // },
  // {
  //   key: 'account',
  //   title: 'Account',
  //   href: paths.dashboard.account,
  //   icon: 'user',
  // },
  // {
  //   key: 'error',
  //   title: 'Error',
  //   href: paths.errors.notFound,
  //   icon: 'x-square',
  // },
  {
    key: 'tasks',
    title: 'Tasks',
    href: paths.dashboard.tasks,
    icon: 'tasks',
  },
  {
    key: 'courses',
    title: 'Courses',
    href: paths.dashboard.courses,
    icon: 'courses',
    items: [
      {
        key: 'create-course',
        title: 'New',
        href: paths.dashboard.createCourse,
        icon: 'createCourse',
      },
    ],
  },
] satisfies NavItemConfig[];
