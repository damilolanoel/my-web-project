import React, { useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { Notification } from '../types';
import {
  Bell,
  X,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Info,
  ExternalLink,
} from 'lucide-react';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
}

function NotificationItem({ notification, onMarkAsRead, onRemove }: NotificationItemProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'payment_success':
        return <CheckCircle2 size={16} className="text-primary-400" />;
      case 'payment_reminder':
        return <Clock size={16} className="text-accent-400" />;
      case 'payment_overdue':
        return <AlertTriangle size={16} className="text-red-400" />;
      case 'payout_scheduled':
        return <CheckCircle2 size={16} className="text-gold-400" />;
      case 'payout_received':
        return <CheckCircle2 size={16} className="text-gold-400" />;
      default:
        return <Info size={16} className="text-slate-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payment_success':
        return 'border-primary-500/20 bg-primary-500/5';
      case 'payment_reminder':
        return 'border-accent-500/20 bg-accent-500/5';
      case 'payment_overdue':
        return 'border-red-500/20 bg-red-500/5';
      case 'payout_scheduled':
      case 'payout_received':
        return 'border-gold-500/20 bg-gold-500/5';
      default:
        return 'border-slate-700/30 bg-slate-800/30';
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`p-4 rounded-xl border ${getTypeColor(notification.type)} ${!notification.read ? 'ring-1 ring-primary-500/30' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h4 className="text-sm font-semibold text-white">{notification.title}</h4>
            <div className="flex items-center gap-1 ml-2">
              {!notification.read && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="text-xs text-primary-400 hover:text-primary-300"
                >
                  Mark read
                </button>
              )}
              <button
                onClick={() => onRemove(notification.id)}
                className="text-slate-400 hover:text-slate-300"
              >
                <X size={14} />
              </button>
            </div>
          </div>
          <p className="text-sm text-slate-300 mt-1">{notification.message}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-500">{formatTime(notification.createdAt)}</span>
            {notification.actionUrl && (
              <a
                href={notification.actionUrl}
                className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"
              >
                View <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card rounded-2xl border border-slate-700/30 w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-slate-700/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-primary-400" />
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary-400 hover:text-primary-300"
              >
                Mark all read
              </button>
            )}
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="max-h-[calc(80vh-80px)] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell size={48} className="text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No notifications yet</p>
              <p className="text-sm text-slate-500 mt-1">You'll see payment reminders and updates here</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onRemove={removeNotification}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}