import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Edit3,
  Clock,
  ShieldCheck,
  Zap,
  Eye,
  ChevronDown,
} from "lucide-react";
import { submissionsData, Submission } from "./data";
import { formatDeadline } from "./utils";

type StatusFilter = "semua" | "pending" | "approved" | "rejected";

export function AdminPage() {
  const [subs, setSubs] = useState<Submission[]>(submissionsData);
  const [filter, setFilter] = useState<StatusFilter>("semua");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [previewId, setPreviewId] = useState<number | null>(null);

  const approve = (id: number) =>
    setSubs((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "approved" } : s)),
    );

  const reject = (id: number) =>
    setSubs((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "rejected" } : s)),
    );

  const startEdit = (sub: Submission) => {
    setEditingId(sub.id);
    setEditTitle(sub.title);
  };

  const saveEdit = (id: number) => {
    setSubs((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: editTitle } : s)),
    );
    setEditingId(null);
  };

  const filtered =
    filter === "semua" ? subs : subs.filter((s) => s.status === filter);
  const counts = {
    semua: subs.length,
    pending: subs.filter((s) => s.status === "pending").length,
    approved: subs.filter((s) => s.status === "approved").length,
    rejected: subs.filter((s) => s.status === "rejected").length,
  };

  const previewSub = subs.find((s) => s.id === previewId);

  const STATUS_FILTERS: { key: StatusFilter; label: string; color: string }[] =
    [
      { key: "semua", label: "Semua", color: "" },
      { key: "pending", label: "Menunggu", color: "text-amber-600" },
      { key: "approved", label: "Disetujui", color: "text-emerald-600" },
      { key: "rejected", label: "Ditolak", color: "text-red-600" },
    ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-foreground flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            Admin Panel — Persetujuan Konten
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review dan kurasi pengajuan lomba sebelum ditayangkan ke publik
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Pengajuan"
          value={counts.semua}
          color="text-foreground"
          bg="bg-card"
        />
        <StatCard
          label="Menunggu Review"
          value={counts.pending}
          color="text-amber-600"
          bg="bg-amber-50 border-amber-200"
        />
        <StatCard
          label="Disetujui"
          value={counts.approved}
          color="text-emerald-600"
          bg="bg-emerald-50 border-emerald-200"
        />
        <StatCard
          label="Ditolak"
          value={counts.rejected}
          color="text-red-600"
          bg="bg-red-50 border-red-200"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-card rounded-xl border border-border p-1 mb-6 overflow-x-auto w-full">
        {STATUS_FILTERS.map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm whitespace-nowrap transition-all ${
              filter === key
                ? "bg-primary text-primary-foreground shadow"
                : `text-muted-foreground hover:text-foreground ${color}`
            }`}
          >
            {label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                filter === key ? "bg-white/20" : "bg-muted"
              }`}
            >
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium">
                  Judul Lomba
                </th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">
                  Penyelenggara
                </th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">
                  Kategori
                </th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">
                  Biaya
                </th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">
                  Deadline
                </th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">
                  Pengaju
                </th>
                <th className="text-center px-4 py-3 text-xs text-muted-foreground font-medium">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub) => (
                <tr
                  key={sub.id}
                  className={`border-b border-border last:border-0 transition-colors hover:bg-muted/30 ${
                    sub.status === "pending" ? "" : "opacity-80"
                  }`}
                >
                  {/* Title */}
                  <td className="px-5 py-4 max-w-xs">
                    {editingId === sub.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="flex-1 border border-primary rounded-lg px-2 py-1 text-sm outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => saveEdit(sub.id)}
                          className="text-xs bg-primary text-white px-2 py-1 rounded"
                        >
                          Simpan
                        </button>
                      </div>
                    ) : (
                      <p className="font-medium text-foreground line-clamp-2">
                        {sub.title}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground text-xs max-w-32">
                    <span className="line-clamp-2">{sub.organizer}</span>
                  </td>
                  <td className="px-4 py-4">
                    <CategoryBadge cat={sub.category} />
                  </td>
                  {/* Fee */}
                  <td className="px-4 py-4">
                    {sub.isFree ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full whitespace-nowrap">
                        <Zap className="w-3 h-3" />
                        GRATIS
                      </span>
                    ) : (
                      <span className="text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded-full whitespace-nowrap">
                        Rp {sub.registrationFee.toLocaleString("id-ID")}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-xs text-muted-foreground whitespace-nowrap">
                    {formatDeadline(sub.deadline)}
                  </td>
                  {/* Status */}
                  <td className="px-4 py-4">
                    <StatusBadge status={sub.status} />
                  </td>
                  {/* Submitter */}
                  <td className="px-4 py-4 text-xs text-muted-foreground max-w-36">
                    <p className="truncate">{sub.submittedBy}</p>
                    <p className="text-xs opacity-60">{sub.submittedAt}</p>
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-1.5">
                      {sub.status === "pending" && (
                        <>
                          <ActionBtn
                            onClick={() => approve(sub.id)}
                            icon={<CheckCircle2 className="w-4 h-4" />}
                            label="Approve"
                            color="bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          />
                          <ActionBtn
                            onClick={() => reject(sub.id)}
                            icon={<XCircle className="w-4 h-4" />}
                            label="Reject"
                            color="bg-red-100 text-red-700 hover:bg-red-200"
                          />
                          <ActionBtn
                            onClick={() => startEdit(sub)}
                            icon={<Edit3 className="w-4 h-4" />}
                            label="Edit"
                            color="bg-blue-100 text-blue-700 hover:bg-blue-200"
                          />
                        </>
                      )}
                      {sub.status !== "pending" && (
                        <ActionBtn
                          onClick={() =>
                            setPreviewId(previewId === sub.id ? null : sub.id)
                          }
                          icon={<Eye className="w-4 h-4" />}
                          label="Lihat"
                          color="bg-muted text-muted-foreground hover:bg-secondary"
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden divide-y divide-border">
          {filtered.map((sub) => (
            <div key={sub.id} className="p-4 space-y-3">
              <div>
                <p className="font-semibold text-foreground text-sm line-clamp-2">
                  {sub.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {sub.organizer}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <CategoryBadge cat={sub.category} />
                <StatusBadge status={sub.status} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Biaya</p>
                  {sub.isFree ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                      <Zap className="w-3 h-3" />
                      GRATIS
                    </span>
                  ) : (
                    <span className="text-orange-700">
                      Rp {sub.registrationFee.toLocaleString("id-ID")}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground">Deadline</p>
                  <p className="text-foreground">
                    {formatDeadline(sub.deadline)}
                  </p>
                </div>
              </div>
              <div className="border-t border-border pt-3">
                <p className="text-xs text-muted-foreground mb-1">
                  Pengaju: {sub.submittedBy}
                </p>
                <p className="text-xs opacity-60">{sub.submittedAt}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {sub.status === "pending" && (
                  <>
                    <ActionBtn
                      onClick={() => approve(sub.id)}
                      icon={<CheckCircle2 className="w-4 h-4" />}
                      label="Approve"
                      color="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 flex-1"
                    />
                    <ActionBtn
                      onClick={() => reject(sub.id)}
                      icon={<XCircle className="w-4 h-4" />}
                      label="Reject"
                      color="bg-red-100 text-red-700 hover:bg-red-200 flex-1"
                    />
                    <ActionBtn
                      onClick={() => startEdit(sub)}
                      icon={<Edit3 className="w-4 h-4" />}
                      label="Edit"
                      color="bg-blue-100 text-blue-700 hover:bg-blue-200 flex-1"
                    />
                  </>
                )}
                {sub.status !== "pending" && (
                  <ActionBtn
                    onClick={() =>
                      setPreviewId(previewId === sub.id ? null : sub.id)
                    }
                    icon={<Eye className="w-4 h-4" />}
                    label="Lihat Detail"
                    color="bg-muted text-muted-foreground hover:bg-secondary flex-1"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            <Clock className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p>Tidak ada pengajuan dengan status ini.</p>
          </div>
        )}
      </div>

      {/* Preview Panel */}
      {previewSub && (
        <div className="mt-6 bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-foreground">Detail Pengajuan</h2>
            <button
              onClick={() => setPreviewId(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <Detail label="Judul" value={previewSub.title} />
            <Detail label="Penyelenggara" value={previewSub.organizer} />
            <Detail label="Kategori" value={previewSub.category} />
            <Detail
              label="Biaya"
              value={
                previewSub.isFree
                  ? "Gratis (Rp 0)"
                  : `Rp ${previewSub.registrationFee.toLocaleString("id-ID")}`
              }
            />
            <Detail
              label="Deadline"
              value={formatDeadline(previewSub.deadline)}
            />
            <Detail label="Pengaju" value={previewSub.submittedBy} />
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Submission["status"] }) {
  if (status === "pending")
    return (
      <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
        <Clock className="w-3 h-3" />
        Menunggu
      </span>
    );
  if (status === "approved")
    return (
      <span className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
        <CheckCircle2 className="w-3 h-3" />
        Disetujui
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
      <XCircle className="w-3 h-3" />
      Ditolak
    </span>
  );
}

function CategoryBadge({ cat }: { cat: string }) {
  const colors: Record<string, string> = {
    IT: "bg-blue-100 text-blue-700",
    Desain: "bg-purple-100 text-purple-700",
    Bisnis: "bg-orange-100 text-orange-700",
    Seni: "bg-pink-100 text-pink-700",
    Akademik: "bg-teal-100 text-teal-700",
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[cat] || "bg-gray-100 text-gray-700"}`}
    >
      {cat}
    </span>
  );
}

function ActionBtn({
  onClick,
  icon,
  label,
  color,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${color}`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function StatCard({
  label,
  value,
  color,
  bg,
}: {
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div className={`rounded-xl border p-4 ${bg}`}>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-foreground mt-0.5">{value}</p>
    </div>
  );
}
