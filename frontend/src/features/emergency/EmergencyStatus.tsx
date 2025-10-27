/**
 * Emergency Status Component
 * Professional status display with ShadCN components
 * Follows CODING_RULES.md - No childish icons
 */

'use client';

import { motion } from 'framer-motion';
import { useLanguageRedux } from '@/hooks/useLanguageRedux';
import { Button, Card, Badge, Alert, AlertTitle, AlertDescription, Separator } from '@/components';
import type { EmergencyRequest, EmergencyStatus } from '@/types';

interface EmergencyStatusProps {
  request: EmergencyRequest;
  onMarkOkay: () => void;
  onCancel: () => void;
}

export function EmergencyStatusComponent({ request, onMarkOkay, onCancel }: EmergencyStatusProps) {
  const { t } = useLanguageRedux();

  const statusConfig: Record<EmergencyStatus, { 
    color: 'critical' | 'warning' | 'success' | 'default'; 
    label: string;
    description: string;
  }> = {
    pending: { 
      color: 'warning', 
      label: t('sos.statusPending'),
      description: 'Processing your emergency request...'
    },
    sending: { 
      color: 'warning', 
      label: t('sos.sending'),
      description: 'Connecting to emergency services...'
    },
    sent: { 
      color: 'success', 
      label: t('sos.sent'),
      description: 'Emergency team has been notified'
    },
    assigned: { 
      color: 'success', 
      label: t('sos.statusAssigned'),
      description: 'Response team assigned to your location'
    },
    on_route: { 
      color: 'warning', 
      label: t('sos.statusOnRoute'),
      description: 'Team is on the way to your location'
    },
    arrived: { 
      color: 'success', 
      label: t('sos.statusArrived'),
      description: 'Emergency team has arrived'
    },
    completed: { 
      color: 'success', 
      label: t('sos.statusCompleted'),
      description: 'Emergency situation resolved'
    },
    cancelled: { 
      color: 'default', 
      label: t('sos.statusCancelled'),
      description: 'Emergency request cancelled'
    },
    failed: { 
      color: 'critical', 
      label: t('sos.failed'),
      description: 'Failed to send emergency request'
    },
  };

  const config = statusConfig[request.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      {/* Status Alert */}
      <Alert variant={config.color} className="border-2">
        <AlertTitle className="text-xl font-bold mb-2">
          {config.label}
        </AlertTitle>
        <AlertDescription className="text-base">
          {config.description}
        </AlertDescription>
      </Alert>

      {/* ETA Card */}
      {request.eta && request.status !== 'completed' && request.status !== 'cancelled' && (
        <Card className="bg-secondary-600 text-white border-0">
          <div className="text-center py-8">
            <div className="text-sm font-medium uppercase tracking-wider opacity-90 mb-2">
              {t('sos.etaLabel')}
            </div>
            <div className="text-6xl font-black">
              {request.eta}
            </div>
            <div className="text-lg font-medium mt-2 opacity-90">
              {t('common.urgent').toLowerCase()}
            </div>
          </div>
        </Card>
      )}

      {/* Request Details Card */}
      <Card>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
              {t('incident.selectType')}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold capitalize">
                {t(`incident.${request.incidentType}`)}
              </span>
              <Badge 
                variant={request.priority === 'critical' || request.priority === 'high' ? 'critical' : 'warning'}
                className="text-sm font-semibold"
              >
                {request.priority.toUpperCase()}
              </Badge>
            </div>
          </div>

          <Separator />

          {request.description && (
            <>
              <div>
                <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                  {t('incident.description')}
                </h3>
                <p className="text-neutral-700">
                  {request.description}
                </p>
              </div>
              <Separator />
            </>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-1">
                Verification Level
              </h3>
              <span className="text-base font-medium">
                Level {request.verificationLevel}
              </span>
            </div>
            <Badge 
              variant={
                request.verificationLevel === 2 ? 'success' : 
                request.verificationLevel === 1 ? 'warning' : 
                'default'
              }
              className="text-sm"
            >
              {request.verificationLevel === 2 ? 'HIGH PRIORITY' : 
               request.verificationLevel === 1 ? 'NORMAL PRIORITY' : 
               'LOW PRIORITY'}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      {(request.status === 'sent' || request.status === 'assigned' || request.status === 'on_route') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="primary"
            onClick={onMarkOkay}
            className="py-6 text-lg font-semibold"
          >
            {t('sos.imOkay')}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            className="py-6 text-lg font-semibold border-2"
          >
            {t('common.cancel')}
          </Button>
        </div>
      )}
    </motion.div>
  );
}
