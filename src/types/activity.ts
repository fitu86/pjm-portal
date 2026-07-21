export type ActivityItem = {
  id: string;
  type: 'session' | 'progress' | 'decision' | 'achievement' | 'milestone' | 'task';
  title: string;
  description?: string;
  occurredAt: string;
  project?: {
    id: string;
    name: string;
    code?: string | null;
  };
  sourceUrl?: string;
};
