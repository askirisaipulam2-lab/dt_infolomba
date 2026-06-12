import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

type Props = {
  onSwitchToLogin: () => void;
};

export function ForgotPasswordPage({ onSwitchToLogin }: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 1. Validasi Kolom Kosong
    if (!email.trim()) {
      setError("Harap masukkan email student Anda!");
      return;
    }

    // 2. Validasi Format Email NF
    if (!email.toLowerCase().endsWith("@student.nurulfikri.ac.id")) {
      setError("Gagal! Harap masukkan email resmi @student.nurulfikri.ac.id.");
      return;
    }

    setIsSubmitting(true);

    // 3. Simulasi Pengiriman Ulang Kata Sandi
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-xl border border-blue-100 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex justify-center">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse" />
              <div className="relative w-full h-full flex items-center justify-center bg-blue-500 rounded-full">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-foreground">Email Terkirim!</h3>
            <p className="text-sm text-muted-foreground">
              Sistem telah memperbarui kata sandi Anda dan mengirimkannya ke alamat email:
            </p>
            <p className="font-mono bg-blue-50 p-2 rounded border border-blue-200 text-sm text-blue-900 break-all">
              {email}
            </p>
          </div>

          <p className="text-xs text-muted-foreground italic">
            Silakan periksa kotak masuk atau spam folder pada email Anda untuk menyalin password baru tersebut.
          </p>

          <button
            onClick={onSwitchToLogin}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-lg border border-border space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Lupa Kata Sandi?</h2>
          <p className="text-sm text-muted-foreground">
            Masukkan email student NF Anda untuk mendapatkan kata sandi baru dari sistem.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-sm flex gap-2 items-start">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity mt-2"
          >
            {isSubmitting ? "Mengirim Sandi Baru..." : "Kirim Kata Sandi Baru"}
          </button>
        </form>

        <div className="pt-4 border-t border-border text-center">
          <button
            onClick={onSwitchToLogin}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Halaman Login
          </button>
        </div>
      </div>
    </div>
  );
}