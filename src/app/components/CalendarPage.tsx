import { useState } from "react";
import { ChevronLeft, ChevronRight, Bell, BellOff, Clock, Bookmark } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, parseISO, addMonths, subMonths } from "date-fns";
import { id } from "date-fns/locale/id";
import { Competition } from "./data";
import { getDaysUntil, formatDeadline, categoryColor } from "./utils";

type Props = {
  competitions: Competition[];
  onCompetitionClick: (c: Competition) => void;
};

// Selalu gunakan tanggal hari ini secara dinamis
const TODAY = new Date();

export function CalendarPage({ competitions, onCompetitionClick }: Props) {
  const [currentMonth, setCurrentMonth] = useState(TODAY);
  const [reminders, setReminders] = useState<Set<number>>(new Set([1, 4]));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const savedComps = competitions.filter((c) => c.savedByUser);
  const allTracked = competitions.filter((c) => c.savedByUser || reminders.has(c.id));

  const toggleReminder = (id: number) =>
    setReminders((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = getDay(monthStart); // 0=Sun

  const getDeadlinesOnDay = (day: Date) =>
    allTracked.filter((c) => {
      try {
        return isSameDay(parseISO(c.deadline), day);
      } catch {
        return false;
      }
    });

  const selectedDayComps = selectedDay ? getDeadlinesOnDay(selectedDay) : [];

  const upcomingDeadlines = allTracked
    .map((c) => ({ ...c, daysLeft: getDaysUntil(c.deadline) }))
    .filter((c) => c.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const WEEKDAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-foreground">Kalender & Deadline Tracker</h1>
        <p className="text-muted-foreground text-sm mt-1">Pantau batas waktu pendaftaran lomba yang kamu ikuti atau simpan</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="w-9 h-9 rounded-full border border-border hover:bg-secondary flex items-center justify-center transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h2 className="text-foreground capitalize">{format(currentMonth, "MMMM yyyy", { locale: id })}</h2>
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="w-9 h-9 rounded-full border border-border hover:bg-secondary flex items-center justify-center transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 mb-2">
              {WEEKDAYS.map((d) => (
                <div key={d} className="text-center text-xs text-muted-foreground py-2 font-medium">
                  {d}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Padding for first day */}
              {Array.from({ length: startPadding }).map((_, i) => (
                <div key={`pad-${i}`} />
              ))}
              {days.map((day) => {
                const deadlines = getDeadlinesOnDay(day);
                const isToday = isSameDay(day, TODAY);
                const isSelected = selectedDay && isSameDay(day, selectedDay);
                const hasUrgent = deadlines.some((c) => {
                  const d = getDaysUntil(c.deadline);
                  return d >= 0 && d <= 3;
                });
                const hasDeadline = deadlines.length > 0;

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDay(selectedDay && isSameDay(day, selectedDay) ? null : day)}
                    className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all ${
                      isSelected ? "bg-primary text-primary-foreground shadow" : isToday ? "bg-secondary text-primary font-bold ring-2 ring-primary" : hasDeadline ? "hover:bg-secondary cursor-pointer" : "hover:bg-muted cursor-default"
                    }`}
                  >
                    <span>{format(day, "d")}</span>
                    {hasDeadline && (
                      <div className="flex gap-0.5 mt-0.5">
                        {deadlines.slice(0, 3).map((_, i) => (
                          <span key={i} className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : hasUrgent ? "bg-red-500" : "bg-primary"}`} />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-3 h-3 rounded-full bg-primary" />
                Deadline lomba
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                H-3 Penutupan
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-3 h-3 rounded-full bg-secondary border-2 border-primary" />
                Hari ini
              </div>
            </div>
          </div>

          {/* Selected Day Detail */}
          {selectedDay && (
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="text-foreground mb-3">{format(selectedDay, "EEEE, d MMMM yyyy", { locale: id })}</h3>
              {selectedDayComps.length === 0 ? (
                <p className="text-sm text-muted-foreground">Tidak ada deadline lomba pada hari ini.</p>
              ) : (
                <div className="space-y-3">
                  {selectedDayComps.map((c) => {
                    const d = getDaysUntil(c.deadline);
                    return (
                      <div
                        key={c.id}
                        onClick={() => onCompetitionClick(c)}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-secondary transition-colors border ${d <= 3 ? "border-red-200 bg-red-50" : "border-border"}`}
                      >
                        <img src={c.poster} alt={c.title} className="w-12 h-12 rounded-lg object-cover flex-none" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                          <p className="text-xs text-muted-foreground">{c.organizer}</p>
                        </div>
                        {d <= 3 && <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full whitespace-nowrap">🔴 H-{d}</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Deadline Mendatang
            </h3>
            <div className="space-y-3">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada lomba yang dilacak.</p>
              ) : (
                upcomingDeadlines.map((c) => {
                  const isUrgent = c.daysLeft <= 3;
                  const isWarning = c.daysLeft > 3 && c.daysLeft <= 7;
                  return (
                    <div
                      key={c.id}
                      onClick={() => onCompetitionClick(c)}
                      className={`p-3 rounded-xl cursor-pointer transition-colors border ${
                        isUrgent ? "bg-red-50 border-red-200 hover:bg-red-100" : isWarning ? "bg-amber-50 border-amber-200 hover:bg-amber-100" : "bg-secondary/50 border-border hover:bg-secondary"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-medium text-foreground leading-snug line-clamp-2 flex-1">{c.title}</p>
                        <span className={`text-xs font-bold whitespace-nowrap px-2 py-0.5 rounded-full ${isUrgent ? "bg-red-500 text-white" : isWarning ? "bg-amber-500 text-white" : "bg-primary/10 text-primary"}`}>H-{c.daysLeft}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{formatDeadline(c.deadline)}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Saved Competitions */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="text-foreground mb-4 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-muted-foreground" />
              Lomba Tersimpan
            </h3>
            <div className="space-y-3">
              {savedComps.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada lomba yang disimpan.</p>
              ) : (
                savedComps.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary transition-colors group">
                    <img src={c.poster} alt={c.title} className="w-10 h-10 rounded-lg object-cover flex-none cursor-pointer" onClick={() => onCompetitionClick(c)} />
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onCompetitionClick(c)}>
                      <p className="text-xs font-medium text-foreground truncate">{c.title}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${categoryColor(c.category)}`}>{c.category}</span>
                    </div>
                    <button
                      onClick={() => toggleReminder(c.id)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${reminders.has(c.id) ? "bg-amber-100 text-amber-600" : "text-muted-foreground hover:bg-secondary"}`}
                    >
                      {reminders.has(c.id) ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Lomba Dilacak" value={allTracked.length} color="text-primary" bg="bg-indigo-50 border-indigo-200" />
            <StatCard label="Deadline < 7 Hari" value={upcomingDeadlines.filter((c) => c.daysLeft <= 7).length} color="text-red-600" bg="bg-red-50 border-red-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  return (
    <div className={`rounded-xl border p-4 ${bg}`}>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}