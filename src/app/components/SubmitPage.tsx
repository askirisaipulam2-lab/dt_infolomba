import { useState, useRef } from "react";
import { Upload, CheckCircle2, X, ChevronDown, FileImage, ExternalLink, Info, Zap, Landmark } from "lucide-react";
import { Competition, Category } from "./data";

const CATEGORIES = ["IT", "Desain", "Bisnis", "Seni", "Akademik"];
const TINGKAT_LOMBA = ["Universitas", "Regional", "Nasional", "Internasional"];

type FeeType = "gratis" | "berbayar";

type SubmitPageProps = {
  userRole?: "mahasiswa" | "admin";
  onAddCompetition?: (comp: Omit<Competition, "id" | "savedByUser" | "popular">) => void;
  onAddStudentSubmission?: (submission: {
    judul: string;
    penyelenggara: string;
    tingkat: "Universitas" | "Regional" | "Nasional" | "Internasional";
    fileBukti: File | null;
  }) => void; // Tambahan properti jembatan ke data mahasiswa
};

export function SubmitPage({ userRole = "mahasiswa", onAddCompetition, onAddStudentSubmission }: SubmitPageProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    organizer: "",
    category: "",
    deadline: "",
    description: "",
    registerLink: "",
    feeType: "gratis" as FeeType,
    feeAmount: "",
    tingkat: "Universitas", // Default tingkat lomba mahasiswa
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type.startsWith("image/") || file.type === "application/pdf")) setUploadedFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.organizer) return;

    if (userRole === "admin" && onAddCompetition) {
      if (!form.category || !form.deadline) return;
      onAddCompetition({
        title: form.title,
        organizer: form.organizer,
        category: form.category as Category,
        deadline: form.deadline,
        description: form.description || "Deskripsi akan diperbarui.",
        registrationFee: form.feeType === "gratis" ? 0 : Number(form.feeAmount.replace(/\D/g, "")),
        isFree: form.feeType === "gratis",
        prodi: ["Semua Prodi"],
        poster: uploadedFile ? URL.createObjectURL(uploadedFile) : "https://images.unsplash.com/photo-1540612597331-53c67ea382fc?w=600&h=360&fit=crop&auto=format",
        prizes: "Menyesuaikan Penyelenggara",
        participants: "Individu / Tim",
        benefits: ["Menambah Portofolio", "Sertifikat"],
        requirements: ["Mahasiswa Aktif"],
        tags: [form.category],
      });
    } else if (userRole === "mahasiswa" && onAddStudentSubmission) {
      // Mengirimkan data formulir bukti validasi ke state di App.tsx
      onAddStudentSubmission({
        judul: form.title,
        penyelenggara: form.organizer,
        tingkat: form.tingkat as "Universitas" | "Regional" | "Nasional" | "Internasional",
        fileBukti: uploadedFile,
      });
    }

    setShowSuccess(true);
  };

  const resetForm = () => {
    setForm({
      title: "",
      organizer: "",
      category: "",
      deadline: "",
      description: "",
      registerLink: "",
      feeType: "gratis",
      feeAmount: "",
      tingkat: "Universitas",
    });
    setUploadedFile(null);
    setShowSuccess(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-foreground">{userRole === "admin" ? "Tambah Informasi Lomba" : "Form Validasi Bukti Lomba & SKPI"}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {userRole === "admin" 
            ? "Tambahkan kompetisi baru ke katalog agar dapat dilihat oleh mahasiswa." 
            : "Unggah berkas bukti keikutsertaan atau sertifikat juara Anda untuk divalidasi oleh Tim Admin STT-NF menjadi poin SKPI resmi."}
        </p>
      </div>

      {/* Info Banner */}
      {userRole === "mahasiswa" && (
        <div className="flex items-start gap-3 bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6">
          <Info className="w-5 h-5 text-primary flex-none mt-0.5" />
          <p className="text-sm text-foreground">
            Sertifikat fisik/digital yang lolos kurasi berkas akan secara otomatis dikonversi menjadi poin capaian prestasi mahasiswa di <strong>Dashboard Status SKPI</strong> Anda.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Section title="Detail Capaian Kompetensi">
          <Field label="Nama / Judul Lomba Resmi *" required>
            <input value={form.title} onChange={set("title")} placeholder="cth: Hackathon Smart City NF Innovation 2026" required className={inputCls} />
          </Field>
          
          <Field label="Instansi Penyelenggara Lomba *" required>
            <input value={form.organizer} onChange={set("organizer")} placeholder="cth: Kementerian Pendidikan dan Kebudayaan RI" required className={inputCls} />
          </Field>

          {/* Kondisi Input Berdasarkan Peran User */}
          {userRole === "mahasiswa" ? (
            <Field label="Tingkat / Skala Wilayah Kompetensi *" required>
              <div className="relative">
                <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select value={form.tingkat} onChange={set("tingkat")} required className={inputCls + " pl-10 appearance-none cursor-pointer"}>
                  {TINGKAT_LOMBA.map((t) => (
                    <option key={t} value={t}>
                      Skala {t}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </Field>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Kategori *" required>
                  <div className="relative">
                    <select value={form.category} onChange={set("category")} required className={inputCls + " appearance-none cursor-pointer"}>
                      <option value="">Pilih kategori...</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </Field>
                <Field label="Batas Pendaftaran *" required>
                  <input type="date" value={form.deadline} onChange={set("deadline")} required className={inputCls} />
                </Field>
              </div>
              <Field label="Tautan Pendaftaran Resmi">
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input value={form.registerLink} onChange={set("registerLink")} placeholder="https://situs-resmi-panitia.com/daftar" className={inputCls + " pl-10"} />
                </div>
              </Field>
            </>
          )}

          <Field label="Catatan Tambahan (Opsional)">
            <textarea value={form.description} onChange={set("description")} placeholder="Tulis rincian perolehan medali, juara keberapa, atau kendala berkas jika ada..." rows={3} className={inputCls + " resize-none"} />
          </Field>
        </Section>

        {/* Bagian Biaya Khusus Admin yang mengunggah info lomba publik */}
        {userRole === "admin" && (
          <Section title="Biaya Pendaftaran">
            <div className="grid grid-cols-2 gap-3">
              <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.feeType === "gratis" ? "border-emerald-400 bg-emerald-50" : "border-border bg-card hover:border-emerald-200"}`}>
                <input type="radio" name="feeType" value="gratis" checked={form.feeType === "gratis"} onChange={() => setForm((f) => ({ ...f, feeType: "gratis", feeAmount: "" }))} className="accent-emerald-500" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium text-emerald-700">Gratis</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Rp 0 / tanpa biaya</p>
                </div>
              </label>
              <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.feeType === "berbayar" ? "border-orange-400 bg-orange-50" : "border-border bg-card hover:border-orange-200"}`}>
                <input type="radio" name="feeType" value="berbayar" checked={form.feeType === "berbayar"} onChange={() => setForm((f) => ({ ...f, feeType: "berbayar" }))} className="accent-orange-500" />
                <div>
                  <p className="font-medium text-orange-700">Berbayar</p>
                  <p className="text-xs text-muted-foreground">Ada biaya pendaftaran</p>
                </div>
              </label>
            </div>

            {form.feeType === "gratis" && (
              <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
                <CheckCircle2 className="w-4 h-4 flex-none" />
                Lomba ini akan otomatis mendapat badge <strong>GRATIS · Rp 0</strong> di katalog.
              </div>
            )}

            {form.feeType === "berbayar" && (
              <Field label="Nominal Biaya Pendaftaran (Rp)">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
                  <input type="number" value={form.feeAmount} onChange={set("feeAmount")} placeholder="cth: 150000" className={inputCls + " pl-10"} />
                </div>
              </Field>
            )}
          </Section>
        )}

        {/* Upload Bukti Sertifikat Lomba */}
        <Section title={userRole === "admin" ? "Poster / Brosur Lomba" : "Unggah Lembar Bukti Fisik / Sertifikat Lomba *"}>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              dragOver ? "border-primary bg-primary/5 scale-[1.01]" : uploadedFile ? "border-emerald-400 bg-emerald-50" : "border-border hover:border-primary/50 hover:bg-secondary/50"
            }`}
          >
            <input ref={fileRef} type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="hidden" />
            {uploadedFile ? (
              <div className="flex items-center justify-center gap-3">
                <FileImage className="w-8 h-8 text-emerald-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-emerald-700">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024).toFixed(0)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadedFile(null);
                  }}
                  className="ml-2 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-500 hover:bg-red-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">
                  {userRole === "admin" ? "Drag & drop poster di sini" : "Tarik & taruh scan sertifikat di sini"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">atau klik untuk memilih dokumen berkas — Gambar JPG, PNG, atau PDF (maks 5MB)</p>
              </>
            )}
          </div>
        </Section>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-medium hover:opacity-90 transition-opacity shadow-md">
          {userRole === "admin" ? "Tayangkan Brosur Lomba" : "Ajukan Berkas Validasi SKPI"}
        </button>
      </form>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center animate-in fade-in-0 zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9 text-emerald-600" />
            </div>
            <h2 className="text-foreground mb-2">{userRole === "admin" ? "Lomba Berhasil Ditambah!" : "Dokumen Berhasil Diajukan!"}</h2>
            <p className="text-sm text-muted-foreground mb-6">
              {userRole === "admin"
                ? `Lomba ${form.title || "yang ditambahkan"} akan segera tampil di katalog lomba publik.`
                : `Berkas untuk "${form.title || "Lomba"}" berhasil terunggah ke sistem. Anda dapat memantau lembar penilaian dan grafik statusnya di halaman Status SKPI.`}
            </p>
            <div className="space-y-2">
              <button onClick={resetForm} className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity">
                {userRole === "admin" ? "Tambah Lomba Lainnya" : "Ajukan Validasi Lainnya"}
              </button>
              <button onClick={() => setShowSuccess(false)} className="w-full border border-border py-2.5 rounded-xl text-muted-foreground hover:bg-secondary transition-colors">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = "w-full bg-input-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
      <h2 className="text-foreground border-b border-border pb-3">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm text-foreground">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}