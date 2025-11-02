'use client';

import { Card, Button } from '@/components';
import { useLanguage } from '@/hooks/useLanguage';

/**
 * Admin Dashboard Page Component
 * Example of admin-specific feature module
 */
export function AdminDashboard() {
  const { t } = useLanguage();

  return (
    <div className="container section">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          {t('nav.dashboard')} - {t('role.admin')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          title="Total Users"
          description="Active users in the system"
          hoverable
        >
          <div className="text-3xl font-bold text-primary-600">1,234</div>
          <p className="text-sm text-success-600 mt-2">↑ 12% from last month</p>
        </Card>

        <Card
          title="Revenue"
          description="Total revenue this month"
          hoverable
        >
          <div className="text-3xl font-bold text-primary-600">$45,678</div>
          <p className="text-sm text-success-600 mt-2">↑ 8% from last month</p>
        </Card>

        <Card
          title="Active Sessions"
          description="Currently active sessions"
          hoverable
        >
          <div className="text-3xl font-bold text-primary-600">567</div>
          <p className="text-sm text-warning-600 mt-2">↓ 3% from last hour</p>
        </Card>
      </div>

      <div className="mt-8">
        <Card
          title="Quick Actions"
          description="Common administrative tasks"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="primary" className="w-full">
              {t('nav.users')}
            </Button>
            <Button variant="secondary" className="w-full">
              {t('nav.settings')}
            </Button>
            <Button variant="outline" className="w-full">
              {t('nav.reports')}
            </Button>
            <Button variant="outline" className="w-full">
              View Logs
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
