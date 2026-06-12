import React, { useState } from "react";
import { Trophy, Clock, CheckCircle2, XCircle, Award, ArrowLeft, Edit3 } from "lucide-react";

// Tipe data untuk pengajuan lomba
interface KategoriLomba {
  id: string;
  judul: string;
  penyelenggara: string;
  tingkat: "Universitas" | "Regional" | "Nasional" | "Internasional";
  status: "Pending" | "Disetujui" | "Ditolak";
  catatanAdmin?: string;
  tanggalPengajuan: string;
}

interface DashboardPageProps {
  studentName: string;
  studentProdi: string;
  onBackToHome: () => void;
  onEditSubmission: (lombaId: string) => void;
}

// Fungsi pembantu untuk menghitung poin SKPI berdasarkan tingkat lomba
function hitungPoin(tingkat: KategoriLomba["tingkat"]): number {
  switch (tingkat) {
    case "Universitas": return 5;
    case "Regional": return 10;
    case "Nasional": return 20;
    case "Internasional": return 35;
    default: return 0;
  }
}

export function DashboardPage({ studentName, studentProdi, onBackToHome, onEditSubmission }: DashboardPageProps) {
  // Data dummy simulasi riwayat pengajuan lomba mahasiswa
  const [daftarLomba, setDaftarLomba] = useState<KategoriLomba[]>([
    {
      id: "LMB-001",
      judul: "Smart City Innovation Challenge 2026",
      penyelenggara: "Bappenas",
      tingkat: "Nasional",
      status: "Pending",
      tanggalPengajuan: "12 Juni 2026",
    },
    {
      id: "LMB-002",
      judul: "Hackathon IPB Invfest 2025",
      penyelenggara: "Institut Pertanian Bogor",
      tingkat: "Nasional",
      status: "Disetujui",
      tanggalPengajuan: "20 November 2025",
    },
    {
      id: "LMB-003",
      judul: "Lomba UI/UX Design Lokal Kampus",
      penyelenggara: "Senat Mahasiswa STT-NF",
      tingkat: "Universitas",
      status: "Ditolak",
      catatanAdmin: "File sertifikat blur / tidak terbaca. Silakan unggah ulang scan dokumen yang jelas.",
      tanggalPengajuan: "05 Mei 2026",
    },
  ]);

  // Menghitung total poin SKPI hanya dari lomba yang 'Disetujui'
  const totalPoinSKPI = daftarLomba
    .filter((lomba) => lomba.status === "Disetujui")
    .reduce((acc, curr) => acc + hitungPoin(curr.tingkat), 0);

  return (
    <div className="min-h-screen bg-secondary/20 p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Tombol Kembali ke Beranda */}
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog Lomba
        </button>

        {/* Header Profil & Poin SKPI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 bg-white border border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">Dashboard Mahasiswa</p>
              <h1 className="text-2xl font-bold text-foreground mt-1">{studentName || "Nama Mahasiswa"}</h1>
              <p className="text-sm text-muted-foreground">{studentProdi || "Program Studi STT-NF"}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex gap-4 text-xs text-muted-foreground">
              <div>Total Pengajuan: <span className="font-semibold text-foreground">{daftarLomba.length}</span></div>
              <div>•</div>
              <div>Perlu Perbaikan: <span className="font-semibold text-red-600">{daftarLomba.filter(l => l.status === "Ditolak").length}</span></div>
            </div>
          </div>

          {/* Kartu Skor Poin Prestasi Otomatis (SKPI) */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-md flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-blue-100 uppercase tracking-wider">Akomodasi Poin SKPI</p>
              <h3 className="text-4xl font-extrabold mt-2 font-mono">{totalPoinSKPI}</h3>
              <p className="text-xs text-blue-200 mt-2 font-light">
                *Otomatis bertambah saat status sertifikat divalidasi admin.
              </p>
            </div>
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Award className="w-10 h-10 text-amber-300" />
            </div>
          </div>
        </div>

        {/* Daftar Riwayat Validasi */}
        <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border bg-gray-50/50">
            <h2 className="font-bold text-foreground text-lg">Status Validasi & Riwayat Kompetensi</h2>
            <p className="text-xs text-muted-foreground">Pantau berkas pengajuan lomba fisik atau digital Anda di bawah ini.</p>
          </div>

          <div className="divide-y divide-border">
            {daftarLomba.map((lomba) => (
              <div key={lomba.id} className="p-5 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Info Utama Lomba */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded text-muted-foreground">
                        {lomba.id}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        Tingkat {lomba.tingkat} (+{hitungPoin(lomba.tingkat)} Poin)
                      </span>
                    </div>
                    <h4 className="font-semibold text-foreground text-base pt-1">
                      {lomba.judul}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Penyelenggara: <span className="text-foreground font-medium">{lomba.penyelenggara}</span> • Diajukan: {lomba.tanggalPengajuan}
                    </p>
                  </div>

                  {/* Status validasi yang Dinamis */}
                  <div className="flex items-center sm:justify-end">
                    {lomba.status === "Pending" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                        <Clock className="w-3.5 h-3.5" /> ⏳ Pending Admin
                      </span>
                    )}
                    {lomba.status === "Disetujui" && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> ✅ Disetujui
                      </span>
                    )}
                    {lomba.status === "Ditolak" && (
                      <div className="flex flex-col items-end gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                          <XCircle className="w-3.5 h-3.5" /> ❌ Ditolak
                        </span>
                        <button
                          onClick={() => onEditSubmission(lomba.id)}
                          className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline bg-primary/5 px-2.5 py-1 rounded-md border border-primary/20 transition-all"
                        >
                          <Edit3 className="w-3 h-3" /> Edit & Kirim Ulang
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tampilan Pesan Alasan Penolakan dari Admin */}
                {lomba.status === "Ditolak" && lomba.catatanAdmin && (
                  <div className="mt-3 p-3 bg-red-50/60 border border-red-100 rounded-lg text-xs text-red-800">
                    <strong>Catatan Penolakan Admin:</strong> {lomba.catatanAdmin}
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}