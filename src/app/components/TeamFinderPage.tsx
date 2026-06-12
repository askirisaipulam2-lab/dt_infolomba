import { useState } from "react";
import { Users, Plus, MessageCircle, Tag, ChevronDown, ChevronUp, X } from "lucide-react";
import { teamPosts, TeamPost, Category } from "./data";
import { categoryColor } from "./utils";

const SKILL_SUGGESTIONS = [
  "#Butuh_Programmer",
  "#Butuh_UI/UX_Designer",
  "#Butuh_Data_Scientist",
  "#Butuh_Business_Analyst",
  "#Butuh_UX_Researcher",
  "#Machine_Learning",
  "#Figma",
  "#Python",
  "#Marketing",
  "#Financial_Model",
];

export function TeamFinderPage() {
  const [posts, setPosts] = useState<TeamPost[]>(teamPosts);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filterCat, setFilterCat] = useState<Category | "Semua">("Semua");
  const [joinedIds, setJoinedIds] = useState<Set<number>>(new Set());

  const [form, setForm] = useState({
    teamName: "",
    competition: "",
    description: "",
    contact: "",
    skillInput: "",
    skills: [] as string[],
  });

  const addSkill = (s: string) => {
    if (!form.skills.includes(s)) {
      setForm((f) => ({ ...f, skills: [...f.skills, s], skillInput: "" }));
    }
  };

  const removeSkill = (s: string) =>
    setForm((f) => ({ ...f, skills: f.skills.filter((sk) => sk !== s) }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.teamName || !form.competition || !form.description || !form.contact) return;
    const newPost: TeamPost = {
      id: posts.length + 1,
      teamName: form.teamName,
      competition: form.competition,
      category: "IT",
      description: form.description,
      contact: form.contact,
      skills: form.skills,
      postedBy: "Saya – Mahasiswa",
      postedAt: "2026-06-02",
      slots: 4,
      filledSlots: 1,
    };
    setPosts([newPost, ...posts]);
    setForm({ teamName: "", competition: "", description: "", contact: "", skillInput: "", skills: [] });
    setShowForm(false);
  };

  const filtered =
    filterCat === "Semua" ? posts : posts.filter((p) => p.category === filterCat);

  const CATEGORIES: (Category | "Semua")[] = ["Semua", "IT", "Desain", "Bisnis", "Seni", "Akademik"];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-foreground">Cari Teman Tim</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Temukan partner kompetisi lintas prodi dan bentuk tim impianmu
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          {showForm ? "Tutup Form" : "Buka Lowongan Tim"}
        </button>
      </div>

      {/* Post Form */}
      {showForm && (
        <div className="bg-card rounded-2xl border border-border p-6 mb-8 shadow-sm">
          <h2 className="text-foreground mb-5">Buka Lowongan Tim Baru</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Nama Tim *"
                placeholder="cth: Team InnovaHack"
                value={form.teamName}
                onChange={(v) => setForm((f) => ({ ...f, teamName: v }))}
              />
              <FormField
                label="Lomba yang Akan Diikuti *"
                placeholder="cth: GEMASTIK XVII – Aplikasi Mobile"
                value={form.competition}
                onChange={(v) => setForm((f) => ({ ...f, competition: v }))}
              />
            </div>
            <div>
              <label className="block text-sm text-foreground mb-1.5">Deskripsi & Keahlian yang Dicari *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Ceritakan timmu, lomba yang akan diikuti, dan keahlian apa yang kamu butuhkan dari anggota baru..."
                rows={3}
                className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            <FormField
              label="Kontak yang Bisa Dihubungi *"
              placeholder="cth: WA: 0812-3456-7890 | Instagram: @username"
              value={form.contact}
              onChange={(v) => setForm((f) => ({ ...f, contact: v }))}
            />
            {/* Skills / Tags */}
            <div>
              <label className="block text-sm text-foreground mb-1.5">
                Tag Keahlian yang Dicari
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.skills.map((s) => (
                  <span
                    key={s}
                    className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full"
                  >
                    {s}
                    <button type="button" onClick={() => removeSkill(s)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={form.skillInput}
                  onChange={(e) => setForm((f) => ({ ...f, skillInput: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && form.skillInput.trim()) {
                      e.preventDefault();
                      addSkill(form.skillInput.trim().startsWith("#") ? form.skillInput.trim() : `#${form.skillInput.trim()}`);
                    }
                  }}
                  placeholder="Ketik tag lalu Enter (cth: #Butuh_Programmer)"
                  className="flex-1 bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {SKILL_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => addSkill(s)}
                    className="text-xs border border-border bg-white px-2 py-1 rounded-full hover:border-primary/50 hover:text-primary transition-colors"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                Posting Lowongan
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border border-border px-6 py-2.5 rounded-xl text-muted-foreground hover:bg-secondary transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap mb-5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
              filterCat === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-white text-foreground border-border hover:border-primary/50"
            }`}
          >
            {cat}
          </button>
        ))}
        <span className="text-sm text-muted-foreground ml-auto">
          {filtered.length} lowongan aktif
        </span>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {filtered.map((post) => {
          const isExpanded = expandedId === post.id;
          const isJoined = joinedIds.has(post.id);
          const slotsLeft = post.slots - post.filledSlots;

          return (
            <div key={post.id} className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColor(post.category)}`}>
                        {post.category}
                      </span>
                      {slotsLeft <= 1 && (
                        <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium">
                          Sisa {slotsLeft} slot
                        </span>
                      )}
                    </div>
                    <h3 className="text-foreground mb-0.5">{post.teamName}</h3>
                    <p className="text-sm text-primary truncate">{post.competition}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-none">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Slot Tim</p>
                      <p className="text-sm font-semibold text-foreground">
                        {post.filledSlots}/{post.slots} orang
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </div>

                {/* Slot Bar */}
                <div className="mt-3 mb-3">
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(post.filledSlots / post.slots) * 100}%` }}
                    />
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{post.description}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {post.skills.map((s) => (
                    <span
                      key={s}
                      className="flex items-center gap-1 bg-secondary text-secondary-foreground text-xs px-2.5 py-1 rounded-full"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {s}
                    </span>
                  ))}
                </div>

                {/* Expand toggle */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Diposting oleh</p>
                      <p className="text-sm text-foreground">{post.postedBy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Kontak</p>
                      <p className="text-sm text-foreground">{post.contact}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => {
                      if (!isJoined) setJoinedIds((prev) => new Set([...prev, post.id]));
                    }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isJoined
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                        : slotsLeft === 0
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-primary text-primary-foreground hover:opacity-90"
                    }`}
                    disabled={slotsLeft === 0}
                  >
                    {isJoined ? "✓ Bergabung" : slotsLeft === 0 ? "Tim Penuh" : "Join Tim"}
                  </button>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : post.id)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-muted-foreground border border-border hover:bg-secondary transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Hubungi Ketua
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <span className="ml-auto text-xs text-muted-foreground">{post.postedAt}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FormField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm text-foreground mb-1.5">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
