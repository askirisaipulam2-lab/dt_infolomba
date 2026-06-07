import { useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Bell,
  BellRing,
  ExternalLink,
  Download,
  Users,
  Trophy,
  Calendar,
  CheckCircle2,
  Tag,
  Zap,
  Building2,
  Clock,
} from "lucide-react";
import { Competition } from "./data";
import { getDaysUntil, formatDeadline, categoryColor } from "./utils";
import { RegistrationForm, RegistrationData } from "./RegistrationForm";

type Props = {
  competition: Competition;
  onBack: () => void;
};

export function DetailPage({ competition: c, onBack }: Props) {
  const [isSaved, setIsSaved] = useState(c.savedByUser);
  const [hasReminder, setHasReminder] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "deskripsi" | "syarat" | "benefit"
  >("deskripsi");
  const [showRegistration, setShowRegistration] = useState(false);

  const daysLeft = getDaysUntil(c.deadline);
  const isUrgent = daysLeft >= 0 && daysLeft <= 3;
  const isWarning = daysLeft > 3 && daysLeft <= 7;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Kembali ke Katalog</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Poster & Actions */}
        <div className="space-y-4">
          {/* Poster */}
          <div className="rounded-2xl overflow-hidden border border-border shadow-md">
            <img
              src={c.poster}
              alt={`Poster ${c.title}`}
              className="w-full object-cover"
              style={{ height: 280 }}
            />
          </div>

          {/* Fee Highlight */}
          <div
            className={`rounded-xl p-4 border-2 ${
              c.isFree
                ? "border-emerald-400 bg-emerald-50"
                : "border-orange-300 bg-orange-50"
            }`}
          >
            <p className="text-xs text-muted-foreground mb-1">
              Biaya Pendaftaran
            </p>
            {c.isFree ? (
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-600" />
                <span
                  className="text-emerald-700 font-bold"
                  style={{ fontSize: "1.2rem" }}
                >
                  GRATIS · Rp 0
                </span>
              </div>
            ) : (
              <span
                className="text-orange-700 font-bold"
                style={{ fontSize: "1.2rem" }}
              >
                Rp {c.registrationFee.toLocaleString("id-ID")}
              </span>
            )}
          </div>

          {/* Deadline */}
          <div
            className={`rounded-xl p-4 border ${
              isUrgent
                ? "border-red-400 bg-red-50"
                : isWarning
                  ? "border-amber-400 bg-amber-50"
                  : "border-border bg-card"
            }`}
          >
            <p className="text-xs text-muted-foreground mb-1">
              Batas Pendaftaran
            </p>
            <div className="flex items-center gap-2">
              <Clock
                className={`w-4 h-4 ${isUrgent ? "text-red-600" : isWarning ? "text-amber-600" : "text-muted-foreground"}`}
              />
              <span
                className={`font-semibold ${isUrgent ? "text-red-700" : isWarning ? "text-amber-700" : "text-foreground"}`}
              >
                {formatDeadline(c.deadline)}
              </span>
            </div>
            {isUrgent && (
              <div className="mt-2 flex items-center gap-1 text-xs text-red-600 font-medium">
                🔴 Peringatan! Hanya tersisa {daysLeft} hari lagi
              </div>
            )}
            {isWarning && (
              <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
                🟡 Segera daftar! {daysLeft} hari lagi
              </div>
            )}
            {!isUrgent && !isWarning && daysLeft >= 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                H-{daysLeft} hari lagi
              </p>
            )}
          </div>

          {/* Quick Info */}
          <div className="bg-card rounded-xl border border-border p-4 space-y-3">
            <InfoRow
              icon={<Building2 className="w-4 h-4" />}
              label="Penyelenggara"
              value={c.organizer}
            />
            <InfoRow
              icon={<Users className="w-4 h-4" />}
              label="Peserta"
              value={c.participants}
            />
            <InfoRow
              icon={<Trophy className="w-4 h-4" />}
              label="Total Hadiah"
              value={c.prizes}
            />
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">
                Prodi yang Relevan
              </p>
              <div className="flex flex-wrap gap-1">
                {c.prodi.map((p) => (
                  <span
                    key={p}
                    className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => setShowRegistration(true)}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              <ExternalLink className="w-4 h-4" />
              Daftar Sekarang
            </button>
            <button className="w-full flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-3 rounded-xl font-medium hover:bg-secondary/80 transition-colors border border-border">
              <Download className="w-4 h-4" />
              Unduh Buku Panduan
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm border transition-all ${
                  isSaved
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-white text-muted-foreground border-border hover:border-primary/30"
                }`}
              >
                {isSaved ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
                {isSaved ? "Tersimpan" : "Simpan"}
              </button>
              <button
                onClick={() => setHasReminder(!hasReminder)}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm border transition-all ${
                  hasReminder
                    ? "bg-amber-100 text-amber-700 border-amber-300"
                    : "bg-white text-muted-foreground border-border hover:border-amber-300"
                }`}
              >
                {hasReminder ? (
                  <BellRing className="w-4 h-4" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
                {hasReminder ? "Diingatkan" : "Ingatkan"}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColor(c.category)}`}
              >
                {c.category}
              </span>
              {c.isFree && (
                <span className="flex items-center gap-1 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  <Zap className="w-3 h-3" />
                  GRATIS
                </span>
              )}
              {c.popular && (
                <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  🔥 Populer
                </span>
              )}
            </div>
            <h1 className="text-foreground mb-2">{c.title}</h1>
            <div className="flex flex-wrap gap-2">
              {c.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="flex border-b border-border">
              {(["deskripsi", "syarat", "benefit"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? "border-b-2 border-primary text-primary font-medium bg-secondary/30"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "deskripsi"
                    ? "Deskripsi"
                    : tab === "syarat"
                      ? "Syarat & Ketentuan"
                      : "Benefit & Hadiah"}
                </button>
              ))}
            </div>
            <div className="p-5">
              {activeTab === "deskripsi" && (
                <p
                  className="text-muted-foreground leading-relaxed"
                  style={{ fontSize: "0.9rem" }}
                >
                  {c.description}
                </p>
              )}
              {activeTab === "syarat" && (
                <ul className="space-y-3">
                  {c.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-none mt-0.5">
                        <span className="text-primary text-xs font-bold">
                          {i + 1}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {req}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {activeTab === "benefit" && (
                <ul className="space-y-3">
                  {c.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-none mt-0.5" />
                      <span className="text-sm text-muted-foreground">{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Calendar reminder banner */}
          <div className="flex items-center gap-4 bg-indigo-50 border border-indigo-200 rounded-xl p-4">
            <Calendar className="w-8 h-8 text-primary flex-none" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Simpan ke Kalender Saya
              </p>
              <p className="text-xs text-muted-foreground">
                Tandai deadline {formatDeadline(c.deadline)} di kalender agar
                tidak terlewat
              </p>
            </div>
            <button
              onClick={() => setHasReminder(true)}
              className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <Bell className="w-3.5 h-3.5" />
              Tambah
            </button>
          </div>
        </div>
      </div>

      {/* Registration Form Modal */}
      {showRegistration && (
        <RegistrationForm
          competition={c}
          onClose={() => setShowRegistration(false)}
          onSubmit={(formData) => {
            console.log("Registration submitted:", formData);
            // Handle registration submission here
            alert(
              `Pendaftaran untuk "${c.title}" berhasil diajukan!\nData tim: ${formData.teamName}`,
            );
            setShowRegistration(false);
          }}
        />
      )}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <div className="flex items-center gap-1.5 text-sm text-foreground">
        <span className="text-muted-foreground">{icon}</span>
        {value}
      </div>
    </div>
  );
}
