import { useState } from "react";
import { X, AlertCircle, CheckCircle, Clock, Upload } from "lucide-react";
import { Competition } from "./data";

type Props = {
  competition: Competition;
  onClose: () => void;
  onSubmit: (formData: RegistrationData) => void;
};

// 1. MEMPERBARUI TIPE DATA UNTUK MENAMPUNG SELURUH BUKTI VALIDASI
export type RegistrationData = {
  competitionId: number;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  leaderProdi?: string;
  leaderNpm?: string;
  members: {
    name: string;
    email: string;
    prodi: string;
    npm?: string;
  }[];
  fileLink?: string;
  additionalInfo?: string;
  submittedAt?: string;

  // --- FIELD TAMBAHAN UNTUK BUKTI NYATA KEIKUTSERTAAN ---
  jurusan: string;
  angkatan: string;
  namaCabangLomba: string;
  namaPenyelenggaraLomba: string;
  tanggalLomba: string;
  urlKegiatanLomba: string;
  modelPelaksanaan: "Online" | "Offline" | "Hybrid" | "";
  jenisKepesertaan: "Individu" | "Tim" | "";
  tingkatLomba: "Universitas" | "Regional" | "Nasional" | "Internasional" | "";
  kategoriJuara: string;
  
  // Menggunakan tipe string untuk menyimpan nama file atau base64/url setelah diupload
  dokumentasiLombaName?: string;
  dokumentasiHadiahName?: string;
  scanSertifikatName?: string;
};

export function RegistrationForm({ competition, onClose, onSubmit }: Props) {
  const isIndividual = competition.participants === "Individu";

  const maxMembers = isIndividual
    ? 1
    : competition.participants.includes("5")
      ? 5
      : competition.participants.includes("4")
        ? 4
        : competition.participants.includes("3")
          ? 3
          : competition.participants.includes("2")
            ? 2
            : 1;

  // State Formulir Pendaftaran Awal
  const [teamName, setTeamName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [leaderPhone, setLeaderPhone] = useState("");
  const [leaderProdi, setLeaderProdi] = useState("");
  const [leaderNpm, setLeaderNpm] = useState("");
  const [members, setMembers] = useState<
    { name: string; email: string; prodi: string; npm?: string }[]
  >([]);
  const [fileLink, setFileLink] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<RegistrationData | null>(null);

  // --- STATE BARU UNTUK FORM VALIDASI BUKTI FISIK (SETELAH SUBMIT) ---
  const [isClaimingProof, setIsClaimingProof] = useState(false);
  const [proofSubmitted, setProofSubmitted] = useState(false);
  
  const [jurusan, setJurusan] = useState("");
  const [angkatan, setAngkatan] = useState("");
  const [namaCabangLomba, setNamaCabangLomba] = useState("");
  const [namaPenyelenggaraLomba, setNamaPenyelenggaraLomba] = useState(competition.organizer || "");
  const [tanggalLomba, setTanggalLomba] = useState("");
  const [urlKegiatanLomba, setUrlKegiatanLomba] = useState("");
  const [modelPelaksanaan, setModelPelaksanaan] = useState<"Online" | "Offline" | "Hybrid" | "">("");
  const [jenisKepesertaan, setJenisKepesertaan] = useState<"Individu" | "Tim" | "">(isIndividual ? "Individu" : "Tim");
  const [tingkatLomba, setTingkatLomba] = useState<"Universitas" | "Regional" | "Nasional" | "Internasional" | "">("");
  const [kategoriJuara, setKategoriJuara] = useState("");

  // State untuk menyimpan data file fisik
  const [fileDokLomba, setFileDokLomba] = useState<File | null>(null);
  const [fileDokHadiah, setFileDokHadiah] = useState<File | null>(null);
  const [fileSertifikat, setFileSertifikat] = useState<File | null>(null);

  const getRequiredFields = () => {
    if (isIndividual) {
      return [
        { key: "leaderName", label: "Nama Lengkap", value: leaderName },
        { key: "leaderEmail", label: "Email", value: leaderEmail },
        { key: "leaderPhone", label: "No. HP", value: leaderPhone },
        { key: "leaderProdi", label: "Program Studi", value: leaderProdi },
      ];
    } else {
      return [
        { key: "teamName", label: "Nama Tim", value: teamName },
        { key: "leaderName", label: "Nama Ketua", value: leaderName },
        { key: "leaderEmail", label: "Email Ketua", value: leaderEmail },
        { key: "leaderPhone", label: "No. HP Ketua", value: leaderPhone },
      ];
    }
  };

  const handleAddMember = () => {
    if (members.length < maxMembers - 1) {
      setMembers([...members, { name: "", email: "", prodi: "", npm: "" }]);
    }
  };

  const handleRemoveMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleMemberChange = (index: number, field: string, value: string) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields = getRequiredFields();

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        newErrors[field.key] = `${field.label} wajib diisi`;
      }
    });

    if (leaderEmail && !leaderEmail.includes("@")) {
      newErrors.leaderEmail = "Email tidak valid";
    }

    if (!isIndividual) {
      const totalMembers = 1 + members.filter((m) => m.name.trim()).length;
      const minMembers = maxMembers > 1 ? 2 : 1;
      if (totalMembers < minMembers) {
        newErrors.members = `Minimal ${minMembers} anggota tim (termasuk ketua)`;
      }

      members.forEach((member, idx) => {
        if (member.name.trim()) {
          if (!member.email.includes("@")) {
            newErrors[`member${idx}Email`] = "Email tidak valid";
          }
          if (!member.prodi.trim()) {
            newErrors[`member${idx}Prodi`] = "Prodi wajib diisi";
          }
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Tahap 1: Form Registrasi Awal Selesai
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);

      setTimeout(() => {
        const registrationData: RegistrationData = {
          competitionId: competition.id,
          teamName: isIndividual ? leaderName : teamName,
          leaderName,
          leaderEmail,
          leaderPhone,
          leaderProdi: leaderProdi || undefined,
          leaderNpm: leaderNpm || undefined,
          members: members.filter((m) => m.name.trim()),
          fileLink: fileLink || undefined,
          additionalInfo: additionalInfo || undefined,
          submittedAt: new Date().toLocaleString("id-ID"),
          
          // Nilai default awal sebelum form bukti diisi
          jurusan: leaderProdi,
          angkatan: "",
          namaCabangLomba: competition.title,
          namaPenyelenggaraLomba: competition.organizer || "",
          tanggalLomba: "",
          urlKegiatanLomba: "",
          modelPelaksanaan: "",
          jenisKepesertaan: isIndividual ? "Individu" : "Tim",
          tingkatLomba: "",
          kategoriJuara: "",
        };

        setSubmittedData(registrationData);
        setSubmitSuccess(true);
        setIsSubmitting(false);
      }, 1500);
    }
  };

  // Submit Tahap 2: Validasi Pengisian Seluruh Bukti Fisik Ikut Lomba
  const handleProofSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jurusan || !angkatan || !namaCabangLomba || !tanggalLomba || !urlKegiatanLomba || !modelPelaksanaan || !jenisKepesertaan || !tingkatLomba || !kategoriJuara || !fileDokLomba || !fileDokHadiah || !fileSertifikat) {
      alert("Mohon lengkapi seluruh data identitas, detail kompetisi, beserta ke-3 berkas dokumen bukti fisik lomba!");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      if (submittedData) {
        const finalData: RegistrationData = {
          ...submittedData,
          jurusan,
          angkatan,
          namaCabangLomba,
          namaPenyelenggaraLomba,
          tanggalLomba,
          urlKegiatanLomba,
          modelPelaksanaan,
          jenisKepesertaan,
          tingkatLomba,
          kategoriJuara,
          dokumentasiLombaName: fileDokLomba.name,
          dokumentasiHadiahName: fileDokHadiah.name,
          scanSertifikatName: fileSertifikat.name,
        };

        setSubmittedData(finalData);
        setProofSubmitted(true);
        setIsSubmitting(false);
        
        // Memicu submit final ke komponen utama/parent
        onSubmit(finalData);
      }
    }, 1500);
  };

  // SCREEN TAHAP 3: TAMPILAN BUKTI KLAIM DAN VERIFIKASI VALIDASI BERHASIL
  if (proofSubmitted && submittedData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-emerald-100">
          <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-emerald-700 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-emerald-500" /> Bukti Keikutsertaan Terverifikasi
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="text-center space-y-2 bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
              <h3 className="text-xl font-bold text-emerald-900">Validasi Data Sukses!</h3>
              <p className="text-sm text-emerald-700">
                Sistem telah menyimpan identitas beserta bukti dokumen fisik keikutsertaan lomba Anda secara permanen.
              </p>
            </div>

            {/* TABEL RINGKASAN DATA BUKTI */}
            <div className="border border-border rounded-xl overflow-hidden text-sm">
              <div className="bg-secondary/40 px-4 py-2 font-semibold border-b border-border text-foreground">
                DATA IDENTITAS & CAPAIAN MAHASISWA
              </div>
              <div className="p-4 space-y-2 divide-y divide-border/50">
                <div className="grid grid-cols-3 pt-1"><span className="text-muted-foreground">Nama / NIM</span> <span className="col-span-2 font-medium text-foreground">{submittedData.leaderName} ({submittedData.leaderNpm || "-"})</span></div>
                <div className="grid grid-cols-3 pt-2"><span className="text-muted-foreground">Email / No.HP</span> <span className="col-span-2 text-foreground">{submittedData.leaderEmail} / {submittedData.leaderPhone}</span></div>
                <div className="grid grid-cols-3 pt-2"><span className="text-muted-foreground">Jurusan / Angkatan</span> <span className="col-span-2 text-foreground">{submittedData.jurusan} ({submittedData.angkatan})</span></div>
                <div className="grid grid-cols-3 pt-2"><span className="text-muted-foreground">Cabang Lomba</span> <span className="col-span-2 text-foreground font-medium">{submittedData.namaCabangLomba}</span></div>
                <div className="grid grid-cols-3 pt-2"><span className="text-muted-foreground">Penyelenggara</span> <span className="col-span-2 text-foreground">{submittedData.namaPenyelenggaraLomba}</span></div>
                <div className="grid grid-cols-3 pt-2"><span className="text-muted-foreground">Tanggal Pelaksanaan</span> <span className="col-span-2 text-foreground">{submittedData.tanggalLomba}</span></div>
                <div className="grid grid-cols-3 pt-2"><span className="text-muted-foreground">URL Informasi Lomba</span> <span className="col-span-2 text-blue-600 underline truncate">{submittedData.urlKegiatanLomba}</span></div>
                <div className="grid grid-cols-3 pt-2"><span className="text-muted-foreground">Kategori Pelaksanaan</span> <span className="col-span-2 text-foreground">{submittedData.modelPelaksanaan} | {submittedData.jenisKepesertaan} | {submittedData.tingkatLomba}</span></div>
                <div className="grid grid-cols-3 pt-2"><span className="text-muted-foreground">Kategori Juara</span> <span className="col-span-2 font-bold text-amber-600">{submittedData.kategoriJuara}</span></div>
              </div>
            </div>

            {/* STATUS FILE DOKUMEN */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2 text-xs font-mono text-blue-900">
              <p className="font-bold mb-1 text-sm text-blue-950">📦 FILE BUKTI FISIK YANG DIUNGGAH:</p>
              <p>1. Dok. Saat Lomba :  ✅ {submittedData.dokumentasiLombaName}</p>
              <p>2. Dok. Terima Hadiah: ✅ {submittedData.dokumentasiHadiahName}</p>
              <p>3. Scan Sertifikat Juara: ✅ {submittedData.scanSertifikatName}</p>
            </div>

            <button onClick={onClose} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors">
              Selesai & Keluar Halaman
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SCREEN TAHAP 2: FORM INPUT VALIDASI DAN BUKTI FISIK KEIKUTSERTAAN (SETELAH SUBMIT REGISTRASI)
  if (submitSuccess && isClaimingProof && submittedData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
          <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">Lengkapi Bukti Nyata Keikutsertaan</h2>
              <p className="text-xs text-muted-foreground">Isi data pelaksanaan dan upload dokumen pendukung orisinal</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg transition-colors"><X className="w-5 h-5" /></button>
          </div>

          <form onSubmit={handleProofSubmit} className="p-6 space-y-5">
            {/* ALERT BOX */}
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 text-sm flex gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <p>Anda diwajibkan mengisi seluruh detail kompetisi serta mengunggah dokumen fisik asli sebagai bukti valid keikutsertaan Anda.</p>
            </div>

            {/* BARIS DATA IDENTITAS KAMPUS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Jurusan / Program Studi *</label>
                <input type="text" required value={jurusan} onChange={(e) => setJurusan(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/50" placeholder="Contoh: Informatika" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Angkatan *</label>
                <input type="number" required value={angkatan} onChange={(e) => setAngkatan(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/50" placeholder="Contoh: 2024" />
              </div>
            </div>

            {/* BARIS DETAIL PERLOMBAAN */}
            <div className="space-y-4 border-t border-border/60 pt-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Nama Cabang Lomba *</label>
                <input type="text" required value={namaCabangLomba} onChange={(e) => setNamaCabangLomba(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/50" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Nama Penyelenggara Lomba *</label>
                <input type="text" required value={namaPenyelenggaraLomba} onChange={(e) => setNamaPenyelenggaraLomba(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/50" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Tanggal Lomba *</label>
                  <input type="date" required value={tanggalLomba} onChange={(e) => setTanggalLomba(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">URL / Link Kegiatan Lomba *</label>
                  <input type="url" required value={urlKegiatanLomba} onChange={(e) => setUrlKegiatanLomba(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/50" placeholder="https://..." />
                </div>
              </div>

              {/* DROPDOWN KATEGORI */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Model Pelaksanaan *</label>
                  <select required value={modelPelaksanaan} onChange={(e) => setModelPelaksanaan(e.target.value as any)} className="w-full px-2 py-2 border border-border rounded-lg text-xs outline-none bg-white">
                    <option value="">-- Pilih --</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Jenis Kepesertaan *</label>
                  <select required value={jenisKepesertaan} onChange={(e) => setJenisKepesertaan(e.target.value as any)} className="w-full px-2 py-2 border border-border rounded-lg text-xs outline-none bg-white">
                    <option value="">-- Pilih --</option>
                    <option value="Individu">Individu</option>
                    <option value="Tim">Tim</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Tingkat Lomba *</label>
                  <select required value={tingkatLomba} onChange={(e) => setTingkatLomba(e.target.value as any)} className="w-full px-2 py-2 border border-border rounded-lg text-xs outline-none bg-white">
                    <option value="">-- Pilih --</option>
                    <option value="Universitas">Universitas</option>
                    <option value="Regional">Regional</option>
                    <option value="Nasional">Nasional</option>
                    <option value="Internasional">Internasional</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Kategori Juara *</label>
                <input type="text" required value={kategoriJuara} onChange={(e) => setKategoriJuara(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/50" placeholder="Contoh: Juara 1 / Juara Harapan 3 / Peserta Terbaik" />
              </div>
            </div>

            {/* UNGHAH BERKAS DOKUMEN FISIK */}
            <div className="space-y-4 border-t border-border/60 pt-4 bg-secondary/10 p-3 rounded-xl">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-1"><Upload className="w-4 h-4" /> Unggah Dokumen Bukti Fisik</h4>
              
              <div className="space-y-2 text-xs">
                <div>
                  <label className="block font-medium text-muted-foreground mb-1">1. Dokumentasi Pada Saat Lomba *</label>
                  <input type="file" required accept="image/*,application/pdf" onChange={(e) => e.target.files && setFileDokLomba(e.target.files[0])} className="text-foreground block w-full border border-dashed border-border rounded-md p-1 bg-white" />
                </div>
                <div>
                  <label className="block font-medium text-muted-foreground mb-1">2. Dokumentasi Pada Saat Pemberian Hadiah *</label>
                  <input type="file" required accept="image/*,application/pdf" onChange={(e) => e.target.files && setFileDokHadiah(e.target.files[0])} className="text-foreground block w-full border border-dashed border-border rounded-md p-1 bg-white" />
                </div>
                <div>
                  <label className="block font-medium text-muted-foreground mb-1">3. Scan Sertifikat Bukti Juara *</label>
                  <input type="file" required accept="image/*,application/pdf" onChange={(e) => e.target.files && setFileSertifikat(e.target.files[0])} className="text-foreground block w-full border border-dashed border-border rounded-md p-1 bg-white" />
                </div>
              </div>
            </div>

            {/* BUTTON VALIDASI */}
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                {isSubmitting ? "Memproses Bukti Validasi..." : "Kirim Dokumen Bukti & Validasi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // SCREEN TAHAP 1: SUKSES SUBMIT DATA PENDAFTARAN AWAL (KITA INJEKSI TOMBOL MENUJU VALIDASI BUKTI)
  if (submitSuccess && submittedData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
          <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Pendaftaran Berhasil</h2>
            <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg transition-colors"><X className="w-5 h-5" /></button>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex justify-center">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 bg-emerald-100 rounded-full animate-pulse" />
                <div className="relative w-full h-full flex items-center justify-center bg-emerald-500 rounded-full">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-foreground">Data Anda Berhasil Didaftar</h3>
              <p className="text-muted-foreground">Pendaftaran untuk kompetisi {competition.title} telah dikirimkan ke penyelenggara</p>
            </div>

            {/* SEKSI NOTIFIKASI ALUR KHUSUS DARI ANDA */}
            <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl p-4 space-y-2 text-sm">
              <p className="font-bold text-indigo-950 flex items-center gap-1">📢 Validasi Keikutsertaan Lomba:</p>
              <p>Lomba telah selesai dilaksanakan? Silakan langsung klik tombol **"Lanjut Validasi Bukti Lomba"** di bawah untuk melampirkan file sertifikat dan dokumentasi sebagai bukti nyata keikutsertaan Anda.</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">Nomor Pendaftaran</p>
                  <p className="text-xs text-blue-700 font-mono">REG-{competition.id}-{Date.now()}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">{isIndividual ? "Nama Peserta" : "Nama Tim"}</p>
                  <p className="text-xs text-blue-700">{submittedData.teamName}</p>
                </div>
              </div>
            </div>

            {/* DUA TOMBOL PILIHAN */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <button onClick={onClose} className="flex-1 px-4 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-secondary transition-colors">
                Nanti Saja
              </button>
              <button onClick={() => setIsClaimingProof(true)} className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md">
                Lanjut Validasi Bukti Lomba →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SCREEN TAHAP 1: INPUT UTAMA PENDAFTARAN AWAL (TETAP SAMA SEPERTI BAWAAN KODE ANDA)
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Daftar: {competition.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Batas pendaftaran: {new Date(competition.deadline).toLocaleDateString("id-ID")}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">{isIndividual ? "Pendaftaran Individu" : "Informasi Tim"}</p>
              <p>{isIndividual ? "Isi data diri Anda dengan akurat." : `Pendaftaran untuk tim ${maxMembers} orang.`}</p>
            </div>
          </div>

          {/* Team Name */}
          {!isIndividual && (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Data Tim</h3>
              <input type="text" placeholder="Nama Tim" value={teamName} onChange={(e) => setTeamName(e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50" />
              {errors.teamName && <p className="text-xs text-red-600">{errors.teamName}</p>}
            </div>
          )}

          {/* Leader Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{isIndividual ? "Data Diri" : "Data Ketua Tim"}</h3>
            <input type="text" placeholder={isIndividual ? "Nama Lengkap" : "Nama Ketua Tim"} value={leaderName} onChange={(e) => setLeaderName(e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50" />
            {errors.leaderName && <p className="text-xs text-red-600">{errors.leaderName}</p>}

            <input type="email" placeholder="Email" value={leaderEmail} onChange={(e) => setLeaderEmail(e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50" />
            {errors.leaderEmail && <p className="text-xs text-red-600">{errors.leaderEmail}</p>}

            <input type="tel" placeholder="Nomor HP (Contoh: 08123456789)" value={leaderPhone} onChange={(e) => setLeaderPhone(e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50" />
            {errors.leaderPhone && <p className="text-xs text-red-600">{errors.leaderPhone}</p>}

            <input type="text" placeholder="Program Studi" value={leaderProdi} onChange={(e) => setLeaderProdi(e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50" />
            {errors.leaderProdi && <p className="text-xs text-red-600">{errors.leaderProdi}</p>}

            <input type="text" placeholder="NPM / Nomor Induk Mahasiswa (Opsional)" value={leaderNpm} onChange={(e) => setLeaderNpm(e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50" />
          </div>

          {/* Members */}
          {!isIndividual && maxMembers > 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Anggota Tim</h3>
                {members.filter((m) => m.name.trim()).length < maxMembers - 1 && (
                  <button type="button" onClick={handleAddMember} className="text-sm text-primary hover:underline">+ Tambah Anggota</button>
                )}
              </div>
              {errors.members && <p className="text-xs text-red-600">{errors.members}</p>}
              {members.map((member, idx) => (
                <div key={idx} className="space-y-3 p-4 bg-secondary/30 rounded-lg border border-border/50 relative">
                  <button type="button" onClick={() => handleRemoveMember(idx)} className="absolute top-3 right-3 p-1 hover:bg-red-100 rounded"><X className="w-4 h-4 text-red-600" /></button>
                  <p className="text-sm font-medium text-muted-foreground">Anggota {idx + 2}</p>
                  <input type="text" placeholder="Nama Lengkap" value={member.name} onChange={(e) => handleMemberChange(idx, "name", e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg outline-none" />
                  <input type="email" placeholder="Email" value={member.email} onChange={(e) => handleMemberChange(idx, "email", e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg outline-none" />
                  <input type="text" placeholder="Program Studi" value={member.prodi} onChange={(e) => handleMemberChange(idx, "prodi", e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg outline-none" />
                </div>
              ))}
            </div>
          )}

          {/* File Link */}
          {["Mobile", "UI/UX", "Desain", "Karya"].some((tag) => competition.tags.includes(tag)) && (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">File Karya (Opsional)</h3>
              <input type="url" placeholder="Link karya atau portfolio" value={fileLink} onChange={(e) => setFileLink(e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg outline-none" />
            </div>
          )}

          {/* Additional Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Informasi Tambahan (Opsional)</h3>
            <textarea placeholder="Catatan atau pertanyaan khusus..." value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} rows={3} className="w-full px-4 py-2 border border-border rounded-lg outline-none resize-none" />
          </div>

          {/* Submit Action */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="flex-1 px-4 py-3 border rounded-lg font-medium text-foreground hover:bg-secondary disabled:opacity-50">Batal</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
              {isSubmitting ? "Mengirim..." : "Kirim Pendaftaran"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}