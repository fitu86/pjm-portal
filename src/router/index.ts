import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { useAuthStore } from '@/stores/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/features/dashboard/views/DashboardHome.vue'),
      },
      {
        path: 'today',
        name: 'today',
        component: () => import('@/features/dashboard/views/TodayView.vue'),
      },
      {
        path: 'projects',
        name: 'projects',
        component: () => import('@/features/projects/views/ProjectsList.vue'),
      },
      {
        path: 'projects/:projectId',
        name: 'project-detail',
        component: () => import('@/features/projects/views/ProjectDetail.vue'),
      },
      {
        path: 'tasks',
        name: 'tasks',
        component: () => import('@/features/tasks/views/TasksView.vue'),
      },
      {
        path: 'activity',
        name: 'activity',
        component: () => import('@/features/activity/views/ActivityView.vue'),
      },
      {
        path: 'time',
        name: 'time',
        component: () => import('@/features/time/views/TimeView.vue'),
      },
      {
        path: 'risks',
        name: 'risks',
        component: () => import('@/features/risks/views/RisksView.vue'),
      },
      {
        path: 'decisions',
        name: 'decisions',
        component: () => import('@/features/decisions/views/DecisionsView.vue'),
      },
      {
        path: 'achievements',
        name: 'achievements',
        component: () => import('@/features/achievements/views/AchievementsView.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchUser();
    } catch {
      // Token invalid
    }
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' };
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return { name: 'home' };
  }
});

export default router;
