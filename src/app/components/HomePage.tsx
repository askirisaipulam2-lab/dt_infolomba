import { useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  Clock,
  Users,
  Trophy,
  Tag,
  Zap,
} from "lucide-react";
import { Competition, Category } from "./data";
import { getDaysUntil, formatDeadline, categoryColor } from "./utils";

type Props = {
  competitions: Competition[];
  onCompetitionClick: (c: Competition) => void;
};

const CATEGORIES: Category[] = ["IT", "Desain", "Bisnis", "Seni", "Akademik"];
const PRODI_OPTIONS = [
  "Semua Prodi",
  "Informatika",
  "DKV",
  "Manajemen",
  "Statistika",
  "Teknik Elektro",
  "Ilmu Komunikasi",
];
const SORT_OPTIONS = [
  { value: "deadline", label: "Deadline Terdekat" },
  { value: "popular", label: "Terpopuler" },
  { value: "newest", label: "Terbaru" },
];

export function HomePage({ competitions, onCompetitionClick }: Props) {
  const [query, setQuery] = useState("");
  const [selectedCats, setSelectedCats] = useState<Category[]>([]);
  const [freeOnly, setFreeOnly] = useState(false);
  const [selectedProdi, setSelectedProdi] = useState("Semua Prodi");
  const [sortBy, setSortBy] = useState("deadline");
  const [saved, setSaved] = useState<Set<number>>(
    new Set(competitions.filter((c) => c.savedByUser).map((c) => c.id)),
  );
  const [sliderIndex, setSliderIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
  });
  const [sliderRef, sliderApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const sliderPrev = useCallback(() => {
    if (sliderApi) {
      sliderApi.scrollPrev();
      setSliderIndex(Math.max(sliderIndex - 1, 0));
    }
  }, [sliderApi, sliderIndex]);

  const sliderNext = useCallback(() => {
    if (sliderApi) {
      sliderApi.scrollNext();
      setSliderIndex(Math.min(sliderIndex + 1, competitions.length - 1));
    }
  }, [sliderApi, sliderIndex, competitions.length]);

  const toggleCat = (cat: Category) =>
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );

  const toggleSave = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const freeComps = competitions.filter((c) => c.isFree && c.popular);

  const filtered = competitions
    .filter((c) => {
      const q = query.toLowerCase();
      const matchQuery =
        c.title.toLowerCase().includes(q) ||
        c.organizer.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q));
      const matchCat =
        selectedCats.length === 0 || selectedCats.includes(c.category);
      const matchFree = !freeOnly || c.isFree;
      const matchProdi =
        selectedProdi === "Semua Prodi" || c.prodi.includes(selectedProdi);
      return matchQuery && matchCat && matchFree && matchProdi;
    })
    .sort((a, b) => {
      if (sortBy === "deadline")
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      if (sortBy === "popular") return Number(b.popular) - Number(a.popular);
      return b.id - a.id;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Hero Slider */}
      <section>
        <div className="relative rounded-3xl overflow-hidden h-80 sm:h-96 lg:h-[28rem] bg-muted group">
          <div ref={sliderRef} className="overflow-hidden h-full">
            <div className="flex h-full">
              {competitions.map((comp) => (
                <div key={comp.id} className="flex-none w-full h-full relative">
                  <img
                    src={comp.poster}
                    alt={comp.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white max-w-2xl">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                        <p className="text-xs text-white/80">Deadline</p>
                        <p className="font-medium text-white">
                          {formatDeadline(competitions[sliderIndex].deadline)}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                        <p className="text-xs text-white/80">Peserta</p>
                        <p className="font-medium text-white">
                          {competitions[sliderIndex].participants}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm col-span-2 sm:col-span-2">
                        <p className="text-xs text-white/80 mb-1">Tags</p>
                        <div className="flex gap-1 flex-wrap">
                          {competitions[sliderIndex].tags
                            .slice(0, 3)
                            .map((tag) => (
                              <span
                                key={tag}
                                className="text-xs bg-white/15 text-white px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-6 top-6 sm:left-8 sm:top-8 max-w-2xl text-white">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-300" />
                <span className="text-sm opacity-90">
                  Platform Lomba Mahasiswa Indonesia
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
                Temukan Kompetisi Terbaikmu
              </h1>
              <p className="mt-3 max-w-xl text-sm sm:text-base text-white/85">
                Ratusan lomba aktif, filter gratis/berbayar, dan lacak deadline
                — semua dalam satu platform.
              </p>
            </div>
          </div>

          <div className="absolute right-6 bottom-6 z-20">
            <div className="relative w-full max-w-sm sm:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari lomba, penyelenggara, atau tag..."
                className="w-full pl-12 pr-4 py-3 rounded-full bg-white/15 text-white placeholder:text-white/70 border border-white/20 outline-none focus:bg-white/20"
              />
            </div>
          </div>

          {/* Slider Controls */}
          <button
            onClick={sliderPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center transition-colors backdrop-blur-sm"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={sliderNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center transition-colors backdrop-blur-sm"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          {/* Slider Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {competitions.slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSliderIndex(idx);
                  sliderApi?.scrollTo(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === sliderIndex ? "bg-white w-8" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Slider Info */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          {competitions[sliderIndex] && (
            <>
              <div className="p-3 rounded-lg bg-secondary">
                <p className="text-xs text-muted-foreground">Deadline</p>
                <p className="font-medium text-foreground">
                  {formatDeadline(competitions[sliderIndex].deadline)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-secondary">
                <p className="text-xs text-muted-foreground">Peserta</p>
                <p className="font-medium text-foreground">
                  {competitions[sliderIndex].participants}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-secondary col-span-2 sm:col-span-2">
                <p className="text-xs text-muted-foreground mb-1">Tags</p>
                <div className="flex gap-1 flex-wrap">
                  {competitions[sliderIndex].tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-primary/20 text-primary px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Filter Row */}
      <div className="bg-card rounded-xl border border-border p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-sm text-muted-foreground mr-1">
            <Filter className="w-4 h-4" /> Kategori:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCat(cat)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-all ${selectedCats.includes(cat) ? "bg-primary text-primary-foreground border-primary" : "bg-white text-foreground border-border hover:border-primary/50"}`}
            >
              {cat}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2 flex-wrap">
            <select
              value={selectedProdi}
              onChange={(e) => setSelectedProdi(e.target.value)}
              className="text-sm border border-border rounded-lg px-3 py-1.5 bg-white outline-none cursor-pointer"
            >
              {PRODI_OPTIONS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-border rounded-lg px-3 py-1.5 bg-white outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFreeOnly(!freeOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
              freeOnly
                ? "bg-emerald-500 text-white border-emerald-500 shadow-md"
                : "bg-white text-emerald-700 border-emerald-400 hover:bg-emerald-50"
            }`}
          >
            <Zap className="w-4 h-4" />⚡ Gratis / Rp 0 — Tampilkan Lomba Bebas
            Biaya
          </button>
          {(selectedCats.length > 0 ||
            freeOnly ||
            selectedProdi !== "Semua Prodi") && (
            <button
              onClick={() => {
                setSelectedCats([]);
                setFreeOnly(false);
                setSelectedProdi("Semua Prodi");
              }}
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              Reset filter
            </button>
          )}
        </div>
      </div>

      {/* Free Competitions Carousel */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="flex items-center gap-2 text-foreground">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              Kompetisi Tanpa Biaya — Lomba Gratis Terpopuler
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Daftar langsung tanpa biaya pendaftaran
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={scrollPrev}
              className="w-8 h-8 rounded-full border border-border bg-white flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollNext}
              className="w-8 h-8 rounded-full border border-border bg-white flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-4">
            {freeComps.map((c) => (
              <div key={c.id} className="flex-none w-72">
                <CompetitionCard
                  competition={c}
                  isSaved={saved.has(c.id)}
                  onSave={toggleSave}
                  onClick={() => onCompetitionClick(c)}
                  compact
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Competitions Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-foreground">
            Semua Kompetisi{" "}
            <span className="text-sm text-muted-foreground font-normal ml-1">
              ({filtered.length} ditemukan)
            </span>
          </h2>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Tidak ada lomba yang sesuai dengan filter.</p>
            <button
              onClick={() => {
                setQuery("");
                setSelectedCats([]);
                setFreeOnly(false);
                setSelectedProdi("Semua Prodi");
              }}
              className="mt-3 text-primary underline text-sm"
            >
              Reset semua filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((c) => (
              <CompetitionCard
                key={c.id}
                competition={c}
                isSaved={saved.has(c.id)}
                onSave={toggleSave}
                onClick={() => onCompetitionClick(c)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function CompetitionCard({
  competition: c,
  isSaved,
  onSave,
  onClick,
  compact = false,
}: {
  competition: Competition;
  isSaved: boolean;
  onSave: (e: React.MouseEvent, id: number) => void;
  onClick: () => void;
  compact?: boolean;
}) {
  const daysLeft = getDaysUntil(c.deadline);
  const isUrgent = daysLeft >= 0 && daysLeft <= 3;
  const isWarning = daysLeft > 3 && daysLeft <= 7;

  return (
    <div
      onClick={onClick}
      className="bg-card rounded-xl border border-border overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all group"
    >
      <div
        className="relative overflow-hidden"
        style={{ height: compact ? 140 : 160 }}
      >
        <img
          src={c.poster}
          alt={c.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {/* Free Badge */}
        {c.isFree && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
            <Zap className="w-3 h-3" />
            GRATIS · Rp 0
          </div>
        )}
        {!c.isFree && (
          <div className="absolute top-3 left-3 bg-white/90 text-foreground text-xs font-medium px-2.5 py-1 rounded-full">
            Rp {c.registrationFee.toLocaleString("id-ID")}
          </div>
        )}
        {/* Category */}
        <div
          className={`absolute top-3 right-3 text-xs font-medium px-2 py-0.5 rounded-full ${categoryColor(c.category)}`}
        >
          {c.category}
        </div>
        {/* Save button */}
        <button
          onClick={(e) => onSave(e, c.id)}
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow"
        >
          {isSaved ? (
            <BookmarkCheck className="w-4 h-4 text-primary" />
          ) : (
            <Bookmark className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>
      <div className="p-3 space-y-2">
        <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">
          {c.title}
        </p>
        <p className="text-xs text-muted-foreground truncate">{c.organizer}</p>
        <div className="flex flex-wrap gap-1">
          {c.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full"
            >
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-border">
          <div
            className={`flex items-center gap-1 text-xs ${isUrgent ? "text-red-600 font-semibold" : isWarning ? "text-amber-600" : "text-muted-foreground"}`}
          >
            <Clock className="w-3 h-3" />
            {isUrgent && "🔴 "}
            {isWarning && "🟡 "}
            {daysLeft < 0
              ? "Ditutup"
              : daysLeft === 0
                ? "Hari ini!"
                : `H-${daysLeft} · ${formatDeadline(c.deadline)}`}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="w-3 h-3" />
            <span className="truncate max-w-20">{c.participants}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
