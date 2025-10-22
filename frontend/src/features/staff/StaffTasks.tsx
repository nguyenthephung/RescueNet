'use client';

import { Card, Button } from '@/components';
import { useLanguage } from '@/hooks/useLanguage';

/**
 * Staff Tasks Page Component
 * Example of staff-specific feature module
 */
export function StaffTasks() {
  const { t } = useLanguage();

  const tasks = [
    { id: 1, title: 'Review customer feedback', status: 'pending', priority: 'high' },
    { id: 2, title: 'Update inventory', status: 'in-progress', priority: 'medium' },
    { id: 3, title: 'Process orders', status: 'completed', priority: 'high' },
    { id: 4, title: 'Team meeting preparation', status: 'pending', priority: 'low' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'pending': return 'primary';
      default: return 'primary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'primary';
      default: return 'primary';
    }
  };

  return (
    <div className="container section">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{t('nav.tasks')}</h1>
        <p className="text-muted-foreground">
          {t('nav.tasks')} - {t('role.staff')}
        </p>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card hoverable>
          <div className="text-sm text-muted-foreground mb-1">Total Tasks</div>
          <div className="text-2xl font-bold">{tasks.length}</div>
        </Card>
        <Card hoverable>
          <div className="text-sm text-muted-foreground mb-1">Pending</div>
          <div className="text-2xl font-bold text-primary-600">
            {tasks.filter(t => t.status === 'pending').length}
          </div>
        </Card>
        <Card hoverable>
          <div className="text-sm text-muted-foreground mb-1">In Progress</div>
          <div className="text-2xl font-bold text-warning-600">
            {tasks.filter(t => t.status === 'in-progress').length}
          </div>
        </Card>
        <Card hoverable>
          <div className="text-sm text-muted-foreground mb-1">Completed</div>
          <div className="text-2xl font-bold text-success-600">
            {tasks.filter(t => t.status === 'completed').length}
          </div>
        </Card>
      </div>

      {/* Task List */}
      <Card
        title="My Tasks"
        description="Tasks assigned to you"
        footer={
          <Button variant="primary" className="w-full">
            Add New Task
          </Button>
        }
      >
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-lg border border-border hover:border-primary-300 dark:hover:border-primary-700 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{task.title}</h3>
                <span className={`badge badge-${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge badge-${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
                <span className="text-xs text-muted-foreground">Task #{task.id}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
