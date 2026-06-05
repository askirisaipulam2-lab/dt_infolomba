import { X, Clock, Trophy, AlertCircle, CheckCircle } from "lucide-react";

interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: Date;
  type: "info" | "success" | "warning";
  read: boolean;
}

interface NotificationPageProps {
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
}

export function NotificationPage({
  onClose,
  notifications,
  onMarkAsRead,
}: NotificationPageProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      default:
        return <Trophy className="w-5 h-5 text-primary" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Baru saja";
    if (minutes < 60) return `${minutes}m lalu`;
    if (hours < 24) return `${hours}h lalu`;
    if (days < 7) return `${days}d lalu`;
    return date.toLocaleDateString("id-ID");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-end sm:items-center sm:justify-center">
      <div className="w-full sm:max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4 sm:p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              Notifikasi
            </h2>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground">
                {unreadCount} notifikasi belum dibaca
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Trophy className="w-12 h-12 mb-3 opacity-30" />
              <p>Belum ada notifikasi</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => onMarkAsRead(notif.id)}
                  className={`w-full text-left p-4 sm:p-5 transition-colors ${
                    notif.read
                      ? "bg-background hover:bg-secondary/50"
                      : "bg-primary/5 hover:bg-primary/10"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">{getIcon(notif.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p
                            className={`text-sm sm:text-base font-semibold ${
                              notif.read
                                ? "text-foreground"
                                : "text-foreground font-bold"
                            }`}
                          >
                            {notif.title}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            {notif.message}
                          </p>
                        </div>
                        {!notif.read && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                        <Clock className="w-3 h-3" />
                        {formatTime(notif.timestamp)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-border p-4 sm:p-6 flex justify-between gap-2">
            <button className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">
              Tandai semua dibaca
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
