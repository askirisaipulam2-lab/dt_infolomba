import React, { useState } from "react";
import { Trophy, User, ShieldCheck } from "lucide-react";

type Role = "mahasiswa" | "admin";

interface LoginPayload {
  role: Role;
  name?: string;
  email?: string;
  prodi?: string;
  phone?: string;
}

interface LoginPageProps {
  onLogin: (payload: LoginPayload) => void;
  onSwitchToRegister: () => void;
  onSwitchToForgot: () => void;
}

function initialsFromName(name?: string) {
  if (!name) return "--";
  return name
    .split(" ")
    .map((p) => p[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function LoginPage({ onLogin, onSwitchToRegister, onSwitchToForgot }: LoginPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [prodi, setProdi] = useState("");
  const [phone, setPhone] = useState("");
  const isValid = name.trim() !== "" && email.trim() !== "";

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 border border-border">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Masuk ke LombaKu
          </h1>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Masukkan data singkat Anda sebelum memilih peran.
          </p>
        </div>

        <div className="space-y-4 mb-4">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Nama</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap"
              className="w-full px-3 py-2 border border-border rounded-lg bg-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-foreground">Email</label>
              <button 
                type="button"
                onClick={onSwitchToForgot}
                className="text-xs text-primary font-medium hover:underline"
              >
                Lupa Password?
              </button>
            </div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@contoh.com"
              className="w-full px-3 py-2 border border-border rounded-lg bg-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Prodi</label>
            <input
              value={prodi}
              onChange={(e) => setProdi(e.target.value)}
              placeholder="Contoh: Informatika"
              className="w-full px-3 py-2 border border-border rounded-lg bg-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Kontak / Telepon
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+62 8xx-xxxx-xxxx"
              className="w-full px-3 py-2 border border-border rounded-lg bg-white outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="space-y-3">
          <button
            disabled={!isValid}
            onClick={() =>
              onLogin({
                role: "mahasiswa",
                name: name || undefined,
                email: email || undefined,
                prodi: prodi || undefined,
                phone: phone || undefined,
              })
            }
            className={`w-full flex items-center gap-4 p-4 border border-border rounded-xl transition-all ${isValid ? "hover:border-primary hover:bg-secondary cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-foreground text-sm sm:text-base">
                Login sebagai Mahasiswa
              </div>
              <div className="text-xs text-muted-foreground">
                Cari tim, kalender lomba, & ajukan lomba
              </div>
            </div>
            <div className="ml-auto text-sm text-muted-foreground font-mono">
              {initialsFromName(name)}
            </div>
          </button>

          <button
            disabled={!isValid}
            onClick={() =>
              onLogin({
                role: "admin",
                name: name || undefined,
                email: email || undefined,
                prodi: prodi || undefined,
                phone: phone || undefined,
              })
            }
            className={`w-full flex items-center gap-4 p-4 border border-border rounded-xl transition-all ${isValid ? "hover:border-primary hover:bg-secondary cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
          >
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-foreground text-sm sm:text-base">
                Login sebagai Admin
              </div>
              <div className="text-xs text-muted-foreground">
                Kelola pengajuan lomba & operasional
              </div>
            </div>
            <div className="ml-auto text-sm text-muted-foreground font-mono">
              {initialsFromName(name)}
            </div>
          </button>
        </div>

        {!isValid && (
          <p className="mt-3 text-xs text-amber-600 text-center font-medium">
            ⚠️ Isi Nama dan Email terlebih dahulu untuk mengaktifkan pilihan login.
          </p>
        )}

        <div className="mt-6 pt-4 border-t border-border text-center text-sm text-muted-foreground">
          Mahasiswa STT-NF baru?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-primary font-semibold hover:underline"
          >
            Daftar Akun Baru
          </button>
        </div>
      </div>
    </div>
  );
}