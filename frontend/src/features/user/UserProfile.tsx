'use client';

import { Card, Button, Input } from '@/components';
import { useLanguage } from '@/hooks/useLanguage';
import { useState } from 'react';

/**
 * User Profile Page Component
 * Example of user-specific feature module
 */
export function UserProfile() {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="container section">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{t('nav.profile')}</h1>
        <p className="text-muted-foreground">
          {t('nav.profile')} - {t('role.user')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-3xl font-bold text-primary-600 mb-4">
              JD
            </div>
            <h2 className="text-xl font-semibold mb-1">John Doe</h2>
            <p className="text-sm text-muted-foreground mb-4">john.doe@example.com</p>
            <span className="badge badge-primary">Active User</span>
          </div>
        </Card>

        {/* Profile Details Card */}
        <Card
          title="Profile Information"
          description={isEditing ? 'Edit your profile details' : 'Your personal information'}
          className="lg:col-span-2"
          footer={
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <Button variant="primary" className="flex-1">
                    {t('common.save')}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsEditing(false)}
                  >
                    {t('common.cancel')}
                  </Button>
                </>
              ) : (
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setIsEditing(true)}
                >
                  {t('common.edit')}
                </Button>
              )}
            </div>
          }
        >
          <div className="space-y-4">
            <Input
              label="Full Name"
              defaultValue="John Doe"
              disabled={!isEditing}
            />
            <Input
              label="Email"
              type="email"
              defaultValue="john.doe@example.com"
              disabled={!isEditing}
            />
            <Input
              label="Phone"
              type="tel"
              defaultValue="+1 234 567 8900"
              disabled={!isEditing}
            />
            <Input
              label="Location"
              defaultValue="New York, USA"
              disabled={!isEditing}
            />
          </div>
        </Card>
      </div>

      {/* Activity Card */}
      <div className="mt-6">
        <Card title="Recent Activity" description="Your latest actions">
          <div className="space-y-3">
            {[
              { action: 'Updated profile', time: '2 hours ago', type: 'success' },
              { action: 'Changed password', time: '1 day ago', type: 'warning' },
              { action: 'Logged in', time: '3 days ago', type: 'primary' },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted"
              >
                <div className="flex items-center gap-3">
                  <span className={`badge badge-${activity.type}`}>●</span>
                  <span className="text-sm">{activity.action}</span>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
