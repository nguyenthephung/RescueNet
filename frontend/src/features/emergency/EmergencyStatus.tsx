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
      description: t('sos.statusPendingDesc') || 'Processing your emergency request...'
    },
    sending: { 
      color: 'warning', 
      label: t('sos.sending'),
      description: t('sos.sendingDesc') || 'Connecting to emergency services...'
    },
    sent: { 
      color: 'success', 
      label: t('sos.sent'),
      description: t('sos.sentDesc') || 'Emergency team has been notified'
    },
    assigned: { 
      color: 'success', 
      label: t('sos.statusAssigned'),
      description: t('sos.statusAssignedDesc') || 'Response team assigned to your location'
    },
    on_route: { 
      color: 'warning', 
      label: t('sos.statusOnRoute'),
      description: t('sos.statusOnRouteDesc') || 'Team is on the way to your location'
    },
    arrived: { 
      color: 'success', 
      label: t('sos.statusArrived'),
      description: t('sos.statusArrivedDesc') || 'Emergency team has arrived'
    },
    completed: { 
      color: 'success', 
      label: t('sos.statusCompleted'),
      description: t('sos.statusCompletedDesc') || 'Emergency situation resolved'
    },
    cancelled: { 
      color: 'default', 
      label: t('sos.statusCancelled'),
      description: t('sos.statusCancelledDesc') || 'Emergency request cancelled'
    },
    failed: { 
      color: 'critical', 
      label: t('sos.failed'),
      description: t('sos.failedDesc') || 'Failed to send emergency request'
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
      <Alert variant={config.color} className="border-2" style={{ backgroundColor: config.color === 'critical' ? 'rgb(254, 242, 242)' : config.color === 'success' ? 'rgb(240, 253, 244)' : config.color === 'warning' ? 'rgb(254, 252, 232)' : 'rgb(249, 250, 251)' }}>
        <AlertTitle className="text-xl font-bold mb-2" style={{ color: config.color === 'critical' ? 'rgb(153, 27, 27)' : config.color === 'success' ? 'rgb(22, 101, 52)' : config.color === 'warning' ? 'rgb(133, 77, 14)' : 'rgb(31, 41, 55)' }}>
          {config.label}
        </AlertTitle>
        <AlertDescription className="text-base" style={{ color: config.color === 'critical' ? 'rgb(185, 28, 28)' : config.color === 'success' ? 'rgb(21, 128, 61)' : config.color === 'warning' ? 'rgb(161, 98, 7)' : 'rgb(75, 85, 99)' }}>
          {config.description}
        </AlertDescription>
      </Alert>

      {/* ETA Card */}
      {request.eta && request.status !== 'completed' && request.status !== 'cancelled' && (
        <div style={{ backgroundColor: 'rgb(37, 99, 235)', border: 'none', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em', 
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '8px'
            }}>
              {t('sos.etaLabel')}
            </div>
            <div style={{ 
              fontSize: '3.75rem', 
              fontWeight: '900',
              color: 'rgb(255, 255, 255)',
              lineHeight: '1'
            }}>
              {request.eta}
            </div>
            <div style={{ 
              fontSize: '1.125rem', 
              fontWeight: '500',
              color: 'rgba(255, 255, 255, 0.9)',
              marginTop: '8px'
            }}>
              {t('common.minutes') || 'minutes'}
            </div>
          </div>
        </div>
      )}

      {/* Request Details Card */}
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid rgb(229, 231, 235)' }}>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'rgb(115, 115, 115)' }}>
              {t('incident.selectType')}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold capitalize" style={{ color: 'rgb(23, 23, 23)' }}>
                {t(`incident.${request.incidentType}`)}
              </span>
              <Badge 
                variant={request.priority === 'critical' || request.priority === 'high' ? 'critical' : 'warning'}
                className="text-sm font-semibold"
                style={{ 
                  backgroundColor: (request.priority === 'critical' || request.priority === 'high') ? 'rgb(220, 38, 38)' : 'rgb(234, 179, 8)',
                  color: 'white',
                  borderColor: (request.priority === 'critical' || request.priority === 'high') ? 'rgb(220, 38, 38)' : 'rgb(234, 179, 8)'
                }}
              >
                {t(`priority.${request.priority}`) || request.priority.toUpperCase()}
              </Badge>
            </div>
          </div>

          <Separator />

          {request.description && (
            <>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide mb-2" style={{ color: 'rgb(115, 115, 115)' }}>
                  {t('incident.description')}
                </h3>
                <p style={{ color: 'rgb(64, 64, 64)' }}>
                  {request.description}
                </p>
              </div>
              <Separator />
            </>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide mb-1" style={{ color: 'rgb(115, 115, 115)' }}>
                {t('verify.level') || 'Verification Level'}
              </h3>
              <span className="text-base font-medium" style={{ color: 'rgb(23, 23, 23)' }}>
                {t('verify.levelValue', { level: request.verificationLevel }) || `Level ${request.verificationLevel}`}
              </span>
            </div>
            <Badge 
              variant={
                request.verificationLevel === 2 ? 'success' : 
                request.verificationLevel === 1 ? 'warning' : 
                'default'
              }
              className="text-sm"
              style={{
                backgroundColor: request.verificationLevel === 2 ? 'rgb(34, 197, 94)' : request.verificationLevel === 1 ? 'rgb(234, 179, 8)' : 'rgb(212, 212, 212)',
                color: 'white',
                borderColor: request.verificationLevel === 2 ? 'rgb(34, 197, 94)' : request.verificationLevel === 1 ? 'rgb(234, 179, 8)' : 'rgb(212, 212, 212)'
              }}
            >
              {request.verificationLevel === 2 ? t('priority.high') || 'HIGH PRIORITY' : 
               request.verificationLevel === 1 ? t('priority.normal') || 'NORMAL PRIORITY' : 
               t('priority.low') || 'LOW PRIORITY'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {(request.status === 'sent' || request.status === 'assigned' || request.status === 'on_route') && (
        <div className="w-full">
          <Button
            variant="primary"
            onClick={onMarkOkay}
            className="w-full py-6 text-lg font-semibold"
            style={{ backgroundColor: 'rgb(34, 197, 94)', color: 'white', borderColor: 'rgb(34, 197, 94)' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgb(22, 163, 74)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgb(34, 197, 94)')}
          >
            ✓ {t('sos.imOkay')}
          </Button>
          <p className="text-xs text-center text-neutral-500 mt-2">
            {t('sos.okayPenaltyNote') || 'Clicking this will mark the emergency as resolved and deduct 1 SOS usage'}
          </p>
        </div>
      )}
    </motion.div>
  );
}
