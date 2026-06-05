import { Trophy, CalendarDays, Users, ShieldCheck } from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/20 flex items-center justify-center px-4 py-10">
      <div className="max-w-5xl w-full rounded-[2rem] border border-border bg-white/95 shadow-2xl backdrop-blur-xl overflow-hidden">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-10 lg:p-16">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-6">
              <Trophy className="w-4 h-4" />
              Platform Lomba Mahasiswa
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Temukan lomba, kelola deadline, dan gabung tim dengan mudah.
            </h1>
            <p className="text-base text-muted-foreground max-w-2xl leading-7 mb-8">
              LombaKu membantu mahasiswa mencari kompetisi terbaik, melihat
              kalender, dan mendaftar tanpa ribet. Mulai dari lomba IT, desain,
              bisnis, hingga akademik.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onStart}
                className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Masuk ke Login
              </button>
              <button className="inline-flex items-center justify-center rounded-full border border-border bg-background px-8 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary">
                Jelajahi Fitur
              </button>
            </div>
          </div>
          <div className="bg-slate-950/95 text-white p-10 lg:p-14">
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-2xl bg-primary/20 p-3 text-primary">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-white/70">
                      Kalender
                    </p>
                    <p className="font-semibold">Deadline terorganisir</p>
                  </div>
                </div>
                <p className="text-sm text-white/70">
                  Lihat semua tanggal penting lomba dalam satu tampilan.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-2xl bg-emerald-500/20 p-3 text-emerald-500">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-white/70">
                      Tim
                    </p>
                    <p className="font-semibold">Cari dan gabung tim</p>
                  </div>
                </div>
                <p className="text-sm text-white/70">
                  Temukan rekan lomba yang sesuai kemampuan dan minat Anda.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-2xl bg-red-500/20 p-3 text-red-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-white/70">
                      Admin
                    </p>
                    <p className="font-semibold">Kelola pengajuan</p>
                  </div>
                </div>
                <p className="text-sm text-white/70">
                  Admin dapat meninjau dan menambahkan lomba melalui dashboard
                  khusus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
