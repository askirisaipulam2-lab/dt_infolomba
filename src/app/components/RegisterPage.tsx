import { useState } from "react";
import { User, Mail, CreditCard, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

type Props = {
  onSwitchToLogin: () => void;
};

export function RegisterPage({ onSwitchToLogin }: Props) {
  const [namaLengkap, setNamaLengkap] = useState("");
  const [nim, setNim] = useState("");
  const [email, setEmail] = useState("");
  
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 1. Validasi Kolom Kosong
    if (!namaLengkap.trim() || !nim.trim() || !email.trim()) {
      setError("Semua kolom data wajib diisi!");
      return;
    }

    // 2. Validasi Eksklusif Email Mahasiswa STT-NF
    if (!email.toLowerCase().endsWith("@student.nurulfikri.ac.id")) {
      setError("Akses ditolak! Registrasi hanya diperbolehkan menggunakan email resmi mahasiswa NF (@student.nurulfikri.ac.id).");
      return;
    }

    setIsSubmitting(true);

    // 3. Simulasi Pengiriman Password Otomatis ke Email
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  // Tampilan ketika Registrasi Berhasil dan Password Otomatis Terkirim
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-xl border border-emerald-100 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex justify-center">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 bg-emerald-100 rounded-full animate-pulse" />
              <div className="relative w-full h-full flex items-center justify-center bg-emerald-500 rounded-full">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-foreground">Registrasi Berhasil!</h3>
            <p className="text-sm text-muted-foreground">
              Halo <span className="font-semibold text-foreground">{namaLengkap}</span>, akun akademis Anda telah terdaftar di sistem LombaKu.
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-4 rounded-xl text-xs text-left space-y-2 font-medium">
            <p className="font-bold text-sm text-emerald-900">🔐 Akses Login Anda:</p>
            <p>Sistem telah membuat kata sandi acak yang aman dan mengirimkannya langsung ke email Anda:</p>
            <p className="font-mono bg-white p-2 rounded border border-emerald-300 text-center text-emerald-800 break-all select-all">
              {email}
            </p>
            <p className="text-[11px] text-emerald-700 italic">
              *Silakan cek kotak masuk (inbox) atau folder spam email student Anda untuk menyalin password tersebut.
            </p>
          </div>

          <button
            onClick={onSwitchToLogin}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors shadow-md flex items-center justify-center gap-2"
          >
            Lanjut ke Halaman Login <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Tampilan Form Utama Registrasi Halaman
  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-lg border border-border space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Daftar Akun LombaKu</h2>
          <p className="text-sm text-muted-foreground">Khusus Mahasiswa STT Terpadu Nurul Fikri</p>
        </div>

        {/* Box Pesan Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-sm flex gap-2 items-start">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Nama Lengkap */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Nama Lengkap sesuai KRS</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Masukkan nama lengkap Anda"
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-foreground"
              />
            </div>
          </div>

          {/* Input NIM */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">NIM (Nomor Induk Mahasiswa)</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Contoh: 0110224001"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-foreground"
              />
            </div>
          </div>

          {/* Input Email NF */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Email Resmi Student NF</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="username@student.nurulfikri.ac.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-foreground"
              />
            </div>
          </div>

          {/* Tombol Aksi */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity mt-2"
          >
            {isSubmitting ? "Memproses Akun & Email..." : "Daftar & Dapatkan Password"}
          </button>
        </form>

        {/* Garis Pembatas / Menu Pindah Halaman */}
        <div className="pt-4 border-t border-border text-center text-sm text-muted-foreground">
          Sudah terdaftar?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-primary font-semibold hover:underline"
          >
            Masuk di sini
          </button>
        </div>
      </div>
    </div>
  );
}